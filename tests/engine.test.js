'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

// The implementation is being written separately. Keep this import limited to
// the agreed CommonJS contract so these tests do not depend on UI internals.
const exported = require('../game-engine.js');
const Game = exported.Game || exported;

const BASE_SEED = 0x1a2b3c4d;

function idOf(value) {
  if (value == null) return value;
  if (typeof value !== 'object') return value;
  return value.id ?? value.key ?? value.value ?? value.name;
}

function step(state, action) {
  const next = Game.step(state, action);
  assert.ok(next && typeof next === 'object', `step(${action.type}) must return state`);
  return next;
}

function snapshot(state) {
  return JSON.parse(JSON.stringify({
    stage: state.stage,
    seed: state.seed,
    rng: state.rng,
    term: state.term,
    academicTerms: state.academicTerms,
    gpa: state.gpa,
    cash: state.cash,
    stats: state.stats,
    integrity: state.integrity,
    program: idOf(state.program),
    target: idOf(state.target),
    applications: (state.applications || []).map(idOf),
    admissions: state.admissions,
    admissionIndex: state.admissionIndex,
    clubs: (state.clubs || []).map(idOf),
    interviews: state.interviews,
    totalInterviews: state.totalInterviews,
    attemptedEmployers: (state.attemptedEmployers || []).map(idOf),
    offers: (state.offers || []).map(idOf),
    jobs: state.jobs,
    returnOffers: state.returnOffers,
    result: state.result,
    finished: state.finished,
    ending: state.ending,
    log: state.log,
  }));
}

function resultItem(state) {
  const result = state.result;
  assert.ok(result, 'spin must create a result');
  assert.ok(Array.isArray(result.items) && result.items.length > 0, 'result must contain items');
  assert.ok(Number.isInteger(result.index), 'result must contain an integer index');
  assert.ok(result.index >= 0 && result.index < result.items.length, 'result index must be in bounds');
  return result.items[result.index];
}

function assertResultCoherent(state, options) {
  const item = resultItem(state);
  if (Array.isArray(options) && options.length) {
    assert.equal(options.length, state.result.items.length, 'spin result must preserve option count');
  }

  // These checks intentionally only compare fields when the engine exposes
  // the field on both objects, allowing strings or richer option objects.
  for (const key of ['title', 'detail', 'tone', 'id']) {
    if (item && typeof item === 'object' && key in item && key in state.result) {
      assert.deepEqual(state.result[key], item[key], `result.${key} must match the sampled item`);
    }
  }
}

function hasConcreteJob(entry) {
  if (entry == null) return false;
  if (typeof entry === 'string') return entry.length > 0;
  if (typeof entry !== 'object') return Boolean(entry);
  if ('job' in entry) return hasConcreteJob(entry.job);
  return Boolean(entry.id || entry.employerId || entry.companyId || entry.name || entry.employer);
}

function findRun(predicate, limit = 2048) {
  for (let seed = 1; seed <= limit; seed += 1) {
    const state = Game.autoPlay(seed);
    if (predicate(state)) return { seed, state };
  }
  return null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function autoplayAction(state) {
  if (state.result) return { type: 'continue' };
  if (Game.spinOptions(state).length) return { type: 'spin' };
  switch (state.stage) {
    case 'applications':
      return { type: 'submit-applications' };
    case 'program':
      return { type: 'choose-program', id: state.admissions.find(a => a.offered).id };
    case 'focus':
      return { type: 'choose-focus', id: 'product' };
    case 'club':
      return { type: 'skip-club' };
    case 'offer':
      return { type: 'accept-job', id: state.offers[0] };
    case 'graduation':
      return { type: 'choose-ending', id: state.returnOffers.length ? 'return' : 'grad' };
    default:
      throw new Error(`No test policy for stage ${state.stage}`);
  }
}

function traceRun(seed) {
  const trace = [];
  let state = Game.create(seed);
  state = step(state, { type: 'begin' });
  for (let guard = 0; !state.finished && guard < 240; guard += 1) {
    trace.push(state);
    if (state.stage === 'applications' && state.applications.length === 0) {
      for (const id of ['cs', 'ece', 'math']) state = step(state, { type: 'toggle-application', id });
    }
    state = step(state, autoplayAction(state));
  }
  trace.push(state);
  assert.equal(state.finished, true, `seed ${seed} did not finish during trace`);
  return trace;
}

test('Game.create exposes the documented state contract', () => {
  const state = Game.create(BASE_SEED);
  for (const key of [
    'stage', 'seed', 'rng', 'term', 'academicTerms', 'gpa', 'cash', 'stats',
    'integrity', 'program', 'applications', 'admissions', 'admissionIndex',
    'clubs', 'interviews', 'offers', 'jobs', 'returnOffers', 'result',
    'finished', 'ending', 'log',
  ]) {
    assert.ok(Object.prototype.hasOwnProperty.call(state, key), `state is missing ${key}`);
  }
  assert.equal(state.seed, BASE_SEED);
  assert.equal(state.finished, false);
  assert.equal(state.result, null);
});

test('engine data exposes the expected academic/work timeline', () => {
  assert.ok(Array.isArray(Game.data.programs) && Game.data.programs.length > 0);
  assert.ok(Array.isArray(Game.data.terms) && Game.data.terms.length > 0);
  assert.equal(Game.data.terms.filter(term => term.kind === 'study').length, 8);
  assert.equal(Game.data.terms.filter(term => term.kind === 'work').length, 3);
});

test('employer data exposes all 250 unique roles', () => {
  const employers = Game.data.employers;
  assert.equal(employers.length, 250);
  assert.equal(new Set(employers.map(e => e.id)).size, 250);
  assert.ok(employers.every(e =>
    e.id && e.name && e.role && e.city &&
    Number.isFinite(e.prestige) && Number.isFinite(e.difficulty) &&
    Array.isArray(e.axes) && e.axes.length > 0 && Array.isArray(e.boost)
  ));
});

test('created and progressed states pass full schema validation', () => {
  assert.equal(Game.isValidState(Game.create(BASE_SEED)), true);
  for (const seed of [1, 17, 101, BASE_SEED]) {
    for (const state of traceRun(seed)) {
      assert.equal(Game.isValidState(state), true, `invalid state at stage ${state.stage} for seed ${seed}`);
      assert.equal(state.finished && state.stage !== 'ending', false, 'finished state must be ending');
      assert.equal(state.stage === 'ending' && !state.finished, false, 'ending stage must be finished');
    }
  }
});

test('malformed saved states are rejected', () => {
  const base = Game.create(BASE_SEED);
  const malformed = [
    ['invalid stage', {...base, stage:'not-a-stage'}],
    ['invalid stats', {...base, stats:[1, 2]}],
    ['invalid application id', {...base, applications:['not-a-program']}],
    ['invalid job id', {...base, jobs:[{id:'not-an-employer',summer:1,pay:1,earnings:480}]}],
    ['invalid log entry', {...base, log:[{title:1,detail:'x',term:'Intro'}]}],
    ['invalid result', {...base, result:{items:[],index:0,title:'x',detail:'x',tone:'bad',next:'profile',after:{}}}],
    ['active ending', {...base, stage:'ending', finished:false}],
    ['finished non-ending', {...base, stage:'profile', finished:true, ending:'open'}],
  ];
  for (const [label, state] of malformed) assert.equal(Game.isValidState(state), false, label);
});

test('interview chance has bounded off/on behavior', () => {
  const employer = Game.data.employers[0];
  const low = Game.create(1);
  low.gpa = 3;
  const high = clone(low);
  high.gpa = 4;
  high.stats[employer.axis] = 100;
  high.jobs = [{id:employer.id,summer:1,pay:employer.pay,earnings:employer.pay*480,evaluation:'Good'}];
  const lowChance = Game.interviewChance(low, employer);
  const highChance = Game.interviewChance(high, employer);
  assert.ok(lowChance >= .04 && lowChance <= .93);
  assert.ok(highChance >= .04 && highChance <= .93);
  assert.ok(highChance > lowChance);
});

test('employer wheel uses mild stat weighting without manual targeting', () => {
  const employer = Game.data.employers.find(e => e.axes.includes(0));
  assert.ok(employer, 'expected an employer with a first-axis role fit');
  const low = Game.create(1);
  const high = clone(low);
  high.stats[employer.axes[0]] = 100;
  const lowWeight = Game.employerWeight(low, employer);
  const highWeight = Game.employerWeight(high, employer);
  assert.ok(lowWeight > 0 && highWeight > 0);
  assert.ok(highWeight > lowWeight, 'matching stats should improve employer weight');
  assert.ok(highWeight / lowWeight < 2, 'role matching should remain a mild weighting');

  const state = Game.create(17);
  Object.assign(state, {
    stage: 'recruit-employer',
    program: 'cs',
    focus: 'product',
    term: 2,
    summer: 1,
    academicTerms: 2,
    gpa: 3,
    stats: [...Game.data.programs.find(p => p.id === 'cs').stats],
    interviews: 2,
    totalInterviews: 2,
  });
  const options = Game.spinOptions(state);
  assert.equal(options.length, 250);
  const manuallyTargeted = step(state, {type:'choose-employer', id:options[0].id});
  assert.deepEqual(manuallyTargeted, state, 'deprecated employer targeting must be a no-op');
  const spun = step(state, {type:'spin'});
  const selected = resultItem(spun);
  assert.ok(selected.id);
  assert.equal(spun.target, selected.id);
  assert.ok(spun.attemptedEmployers.includes(selected.id));
  assert.equal(spun.result.next, 'interview');
});

test('accepting one of multiple offers pays exactly 480 hours and accepts once', () => {
  const state = Game.create(BASE_SEED);
  const [first, second] = Game.data.employers.slice(0, 2);
  Object.assign(state, {stage:'offer',program:'cs',summer:1,offers:[first.id,second.id],cash:0});
  const accepted = step(state, {type:'accept-job',id:second.id});
  assert.equal(accepted.stage, 'work-event');
  assert.deepEqual(accepted.offers, []);
  assert.equal(accepted.jobs.length, 1);
  assert.equal(accepted.jobs[0].id, second.id);
  assert.equal(accepted.cash, second.pay * 480);
  const duplicate = step(accepted, {type:'accept-job',id:first.id});
  assert.deepEqual(duplicate, accepted);
});

test('all interviews are rolled before offers can be selected', () => {
  let state = null;
  let initialInterviews = 0;
  for (let seed = 1; seed <= 128 && !state; seed += 1) {
    const candidate = Game.create(seed);
    Object.assign(candidate, {
      stage: 'recruit-count',
      program: 'cs',
      focus: 'product',
      term: 2,
      summer: 1,
      academicTerms: 2,
      gpa: 3,
      stats: [...Game.data.programs.find(p => p.id === 'cs').stats],
    });
    const spun = step(candidate, {type:'spin'});
    const count = resultItem(spun).value;
    if (count >= 2) {
      state = step(spun, {type:'continue'});
      initialInterviews = count;
    }
  }
  assert.ok(state, 'expected a seed with at least two interviews');
  assert.equal(state.stage, 'recruit-employer');
  assert.equal(state.interviews, initialInterviews);

  let employerRolls = 0;
  while (state.stage === 'recruit-employer' || state.stage === 'interview') {
    if (state.stage === 'recruit-employer') {
      const before = state.interviews;
      const spun = step(state, {type:'spin'});
      assert.equal(spun.result.next, 'interview');
      assert.equal(spun.interviews, before, 'employer selection must not consume an interview');
      state = step(spun, {type:'continue'});
      employerRolls += 1;
      assert.equal(state.stage, 'interview');
    } else {
      const before = state.interviews;
      const spun = step(state, {type:'spin'});
      assert.equal(spun.interviews, before - 1, 'interview count decrements on interview spin');
      const next = spun.result.next;
      state = step(spun, {type:'continue'});
      if (before - 1 > 0) {
        assert.equal(next, 'recruit-employer');
        assert.equal(state.stage, 'recruit-employer');
        assert.ok(state.offers.length >= 0, 'offers remain collected while interviews remain');
      } else {
        assert.equal(state.interviews, 0);
        assert.ok(next === 'offer' || next === 'summer-alt');
      }
    }
  }

  assert.equal(employerRolls, initialInterviews);
  assert.equal(state.interviews, 0);
  assert.equal(state.stage, state.offers.length ? 'offer' : 'summer-alt');
});

test('rejected clubs are recorded and cannot be retried', () => {
  let rejected = null;
  for (let seed = 1; seed <= 4096 && !rejected; seed += 1) {
    const state = Game.create(seed);
    Object.assign(state, {stage:'club',program:'cs',stats:[35,27,34,25,12,12,18]});
    const chosen = step(state, {type:'choose-club',id:'fri'});
    const spun = step(chosen, {type:'spin'});
    if (spun.result?.title?.includes('Not selected')) rejected = step(spun, {type:'continue'});
  }
  assert.ok(rejected, 'expected to sample a rejected club application');
  assert.deepEqual(step(rejected, {type:'choose-club',id:'fri'}), rejected);
  assert.ok(rejected.attemptedClubs.includes('fri'));
});

test('integrity reaching zero produces a terminal academic ending', () => {
  let terminal = null;
  for (let seed = 1; seed <= 4096 && !terminal; seed += 1) {
    const state = Game.create(seed);
    Object.assign(state, {stage:'study-event',program:'cs',focus:'grades',term:0,academicTerms:1,gpa:3,integrity:1,stats:[35,27,34,25,12,12,18]});
    const spun = step(state, {type:'spin'});
    if (spun.result?.title === 'Integrity violation') terminal = step(spun, {type:'continue'});
  }
  assert.ok(terminal, 'expected to sample an integrity violation');
  assert.equal(terminal.finished, true);
  assert.equal(terminal.stage, 'ending');
  assert.equal(terminal.ending, 'academic');
  assert.deepEqual(step(terminal, {type:'spin'}), terminal);
});

test('seeded spins sample a valid item and duplicate spin is a no-op', () => {
  let first = step(Game.create(BASE_SEED), { type: 'begin' });
  let second = step(Game.create(BASE_SEED), { type: 'begin' });
  const firstOptions = Game.spinOptions(first);
  const secondOptions = Game.spinOptions(second);
  assert.ok(Array.isArray(firstOptions) && firstOptions.length > 0, 'begin must expose a spin');

  first = step(first, { type: 'spin' });
  second = step(second, { type: 'spin' });
  assertResultCoherent(first, firstOptions);
  assertResultCoherent(second, secondOptions);
  assert.deepEqual(snapshot(first), snapshot(second), 'same seed and action must match');

  const duplicate = step(first, { type: 'spin' });
  assert.deepEqual(snapshot(duplicate), snapshot(first), 'spinning with a pending result must not reroll');
});

test('same seed produces the same complete autoplay run', () => {
  const left = Game.autoPlay(BASE_SEED);
  const right = Game.autoPlay(BASE_SEED);
  assert.deepEqual(snapshot(left), snapshot(right));
});

test('autoplay reaches eight study terms and three summers; jobs count placements only', () => {
  const found = findRun(state => state.finished && state.academicTerms === 8);
  assert.ok(found, 'expected at least one seed to reach graduation or a terminal ending after eight study terms');
  assert.equal(found.state.academicTerms, 8);
  assert.equal(found.state.summer, 3, 'a full timeline must reach Summer 3');
  assert.ok(found.state.jobs.length <= 3, 'jobs must count placements, not summers');
  assert.ok(found.state.jobs.every(job => job.summer >= 1 && job.summer <= 3));
  assert.ok(found.state.ending, 'completed run must have an ending');
});

test('a no-job summer does not invent a placement or return offer', () => {
  const found = findRun(state => {
    if (!state.finished || state.academicTerms !== 8) return false;
    const concreteJobs = state.jobs.filter(hasConcreteJob).length;
    return concreteJobs < 3;
  });
  assert.ok(found, 'expected a full run with at least one no-job summer');

  const concreteJobs = found.state.jobs.filter(hasConcreteJob);
  assert.ok(concreteJobs.length < 3);
  for (const entry of found.state.jobs) {
    if (!hasConcreteJob(entry) && entry && typeof entry === 'object') {
      assert.equal(entry.returnOffer || entry.offer, undefined, 'no-job record must not contain an offer');
    }
  }
});

test('return-offer stages preserve unique offers through the ending', () => {
  const found = findRun(state => state.finished && state.returnOffers.length > 0);
  assert.ok(found, 'expected a seed with at least one return offer');
  const ids = found.state.returnOffers.map(idOf);
  assert.equal(new Set(ids).size, ids.length, 'return offers must not be duplicated');
  assert.ok(found.state.ending, 'a run with a return offer must still resolve an ending');
});
