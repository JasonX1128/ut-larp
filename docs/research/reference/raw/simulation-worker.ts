import { admissionProbability, ADMISSION_MEDIANS } from "./admissions-data";
import {
  COMPANIES,
  isOutsideGtaAndLoo,
  type CompanyJob,
} from "./company-data";
import {
  AXES,
  MATH_MAJORS,
  PROGRAMS,
  SEQUENCES,
  TEAMS,
  type Axis,
  type Program,
  type Rizz,
} from "./game-data";
import {
  BANK_DEBT_LIMIT,
  OFF_TERM_EVENT_SAVINGS,
  STUDY_EVENT_SAVINGS,
  TUITION_PER_STUDY_TERM,
  UNEMPLOYED_TERM_SAVINGS,
  YC_SEED_FUNDING,
  savingsAfterBadBreakup,
  workTermSavings,
} from "./finance-model";
import {
  interviewPoolWeights,
  offerProbability,
  SPECIALTY_COOP_GAIN,
  specialtyCoopAxes,
  traitFit,
  type RecruitingProfile,
} from "./recruiting-model";
import {
  DESIGN_TEAM_COOP_RIZZ_GAIN,
} from "./work-term-model";
import {
  SCHOLARSHIP_OUTCOMES,
  scholarshipOutcome,
  type ScholarshipOutcome,
} from "./scholarship-model";
import {
  EXCHANGE_EVENTS,
  EXCHANGE_UNIVERSITIES,
  EXCHANGE_TERM_BASELINE_RIZZ,
  exchangeAcceptanceChance,
  isExchangeEligibleStudyTerm,
  savingsAfterRobbery,
} from "./exchange-model";
import {
  GRAD_SCHOOLS,
  MAX_GRAD_APPLICATIONS,
  gradAdmissionProbability,
  returnOfferChance,
} from "./grad-school-model";

export type SimulationReport = {
  runs: number;
  savings: {
    average: number;
    median: number;
    maximum: number;
    minimum: number;
  };
  designTeamPoints: {
    average: number;
    median: number;
    maximum: number;
  };
  programDistribution: {
    id: string;
    label: string;
    count: number;
    percentage: number;
  }[];
  scholarshipDistribution: {
    id: ScholarshipOutcome["id"];
    label: string;
    count: number;
    percentage: number;
  }[];
  coopWages: {
    coop: number;
    averageHourlyPay: number;
    placementRate: number;
    reachedRuns: number;
    locations: {
      location: string;
      count: number;
      percentage: number;
    }[];
  }[];
  outcomes: {
    academicExpulsion: number;
    integrityExpulsion: number;
    yc: number;
    gradSchool: number;
    returnFullTime: number;
    openToWork: number;
    madeItOuttaTheGta: number;
    madeItToNyc: number;
    madeItIntoCali: number;
    graduated: number;
    runOver: number;
    fullTimeDropout: number;
    exchangeEligible: number;
    wentOnExchange: number;
    lostForever: number;
  };
};

type TeamState = {
  name: string;
  axes: Axis[];
  rank: number;
};

type ReturnOffer = {
  job: CompanyJob;
};

type SimState = {
  program: Program;
  timeline: { label: string; kind: "study" | "coop" | "off" }[];
  rizz: Rizz;
  average: number;
  studyTerms: number;
  consecutiveLowTerms: number;
  integrity: number;
  momentum: number;
  savings: number;
  scholarshipId: ScholarshipOutcome["id"];
  exchangeApplicationRolled: boolean;
  exchangeUniversityId: string | null;
  exchangePending: boolean;
  guaranteedAmazonOffer: boolean;
  professorReference: boolean;
  teams: TeamState[];
  jobs: CompanyJob[];
  coopPlacements: ({ pay: number; location: string } | null)[];
  returnOffers: ReturnOffer[];
  usedWeAccelerate: boolean;
  endingCode: string | null;
  status:
    | "active"
    | "graduated"
    | "expelled"
    | "withdrawn"
    | "dropout"
    | "dead";
};

const RUN_OVER_CHANCE = 5 / 360;
const MULTI_TASK_CHANCE = 25 / 360;

const random = () => Math.random();

const weightedChoice = <T,>(values: T[], weights: number[]): T => {
  const total = weights.reduce((sum, weight) => sum + Math.max(0, weight), 0);
  let cursor = random() * total;
  for (let index = 0; index < values.length; index += 1) {
    cursor -= Math.max(0, weights[index] ?? 0);
    if (cursor <= 0) return values[index];
  }
  return values[values.length - 1];
};

const cloneRizz = (rizz: Rizz): Rizz =>
  Object.fromEntries(AXES.map((axis) => [axis, rizz[axis]])) as Rizz;

const addRizz = (
  state: SimState,
  axes: readonly Axis[] | Partial<Rizz>,
  amount = 0,
) => {
  if (Array.isArray(axes)) {
    axes.forEach((axis) => {
      const key = axis as Axis;
      state.rizz[key] = Math.max(0, state.rizz[key] + amount);
    });
    return;
  }
  AXES.forEach((axis) => {
    state.rizz[axis] = Math.max(
      0,
      state.rizz[axis] + ((axes as Partial<Rizz>)[axis] ?? 0),
    );
  });
};

const marketRizz = (state: SimState) => {
  const values = AXES.map((axis) => state.rizz[axis]).sort((a, b) => b - a);
  return values[0] * 0.55 + values[1] * 0.25 + values[2] * 0.2;
};

const programMarketRizz = (program: Program) => {
  const values = AXES.map((axis) => program.rizz[axis]).sort((a, b) => b - a);
  return values[0] * 0.55 + values[1] * 0.25 + values[2] * 0.2;
};

const profileFor = (state: SimState, workTerm: number): RecruitingProfile => ({
  rizz: state.rizz,
  completedCoops: state.jobs.length,
  leadership: state.teams.reduce((sum, team) => sum + team.rank, 0),
  average: state.average,
  integrityIncidents: 2 - state.integrity,
  workTerm,
});

const chooseSequence = (program: Program) => {
  if (program.sequence === "math") {
    return weightedChoice(
      ["SEQ 1", "SEQ 2", "SEQ 3", "SEQ 4"],
      [35, 30, 15, 20],
    );
  }
  if (program.sequence === "eng4") return "STREAM 4";
  if (program.sequence === "eng8") return "STREAM 8";
  const stream4 =
    program.sequence === "dual-double" ? "STREAM 4D" : "STREAM 4";
  const stream8 =
    program.sequence === "dual-double" ? "STREAM 8" : "STREAM 8S";
  return weightedChoice([stream4, stream8], [50, 50]);
};

const chooseDistinct = <T,>(
  values: T[],
  weights: number[],
  count: number,
) => {
  const pool = values.map((value, index) => ({
    value,
    weight: weights[index],
  }));
  const selected: T[] = [];
  while (pool.length > 0 && selected.length < count) {
    const choice = weightedChoice(
      pool,
      pool.map((item) => item.weight),
    );
    selected.push(choice.value);
    pool.splice(pool.indexOf(choice), 1);
  }
  return selected;
};

const freshState = (): SimState => {
  const averages = Array.from({ length: 11 }, (_, index) => 90 + index);
  const highSchoolAverage = weightedChoice(
    averages,
    averages.map((average) => {
      const distance = (average - 96) / 1.8;
      return Math.exp(-0.5 * distance * distance) * 100;
    }),
  );
  const engineering = PROGRAMS.filter((program) => program.faculty === "ENG");
  const primary = weightedChoice(
    engineering,
    engineering.map((program) => program.weight),
  );
  const backupPool = engineering.filter((program) => program.id !== primary.id);
  const backup = weightedChoice(
    backupPool,
    backupPool.map((program) => program.weight),
  );
  const mathPool = ["mathbba", "csbba", "cfm", "farm", "cs", "math"]
    .map((id) => PROGRAMS.find((program) => program.id === id))
    .filter((program): program is Program => Boolean(program));
  const selectedMath = chooseDistinct(
    mathPool,
    mathPool.map((program) => program.weight),
    2,
  );
  const offers: Program[] = [];
  const primaryMedian =
    ADMISSION_MEDIANS[primary.id as keyof typeof ADMISSION_MEDIANS] ?? 95;
  if (random() < admissionProbability(highSchoolAverage, primaryMedian)) {
    offers.push(primary);
  } else {
    const backupMedian =
      ADMISSION_MEDIANS[backup.id as keyof typeof ADMISSION_MEDIANS] ?? 95;
    if (
      random() <
      admissionProbability(highSchoolAverage, backupMedian, true)
    ) {
      offers.push(backup);
    }
  }
  selectedMath.forEach((program) => {
    const median =
      ADMISSION_MEDIANS[program.id as keyof typeof ADMISSION_MEDIANS] ?? 95;
    if (random() < admissionProbability(highSchoolAverage, median)) {
      offers.push(program);
    }
  });
  if (!offers.some((program) => program.faculty === "MATH")) {
    const geomatics = PROGRAMS.find((program) => program.id === "geomatics");
    if (geomatics) offers.push(geomatics);
  }
  const program = [...offers].sort(
    (a, b) => programMarketRizz(b) - programMarketRizz(a),
  )[0];
  const timeline = SEQUENCES[chooseSequence(program)].map((term) => ({
    label: term.label,
    kind: term.kind,
  }));
  const state: SimState = {
    program,
    timeline,
    rizz: cloneRizz(program.rizz),
    average: 78,
    studyTerms: 0,
    consecutiveLowTerms: 0,
    integrity: 2,
    momentum: 0,
    savings: 0,
    scholarshipId: "none",
    exchangeApplicationRolled: false,
    exchangeUniversityId: null,
    exchangePending: false,
    guaranteedAmazonOffer: false,
    professorReference: false,
    teams: [],
    jobs: [],
    coopPlacements: [],
    returnOffers: [],
    usedWeAccelerate: false,
    endingCode: null,
    status: "active",
  };
  const scholarship = weightedChoice(
    SCHOLARSHIP_OUTCOMES.map((outcome) => outcome.id),
    SCHOLARSHIP_OUTCOMES.map((outcome) => outcome.weight),
  );
  const outcome = scholarshipOutcome(scholarship);
  state.scholarshipId = outcome.id;
  state.savings += outcome.savings;
  if (outcome.allAxisRizz) addRizz(state, AXES, outcome.allAxisRizz);
  return state;
};

const tryYc = (state: SimState, academicExpulsion = false) => {
  const chance = Math.min(
    0.06,
    0.003 + Math.pow(marketRizz(state) / 100, 2) * 0.055,
  );
  if (random() < chance) {
    state.savings += YC_SEED_FUNDING;
    state.endingCode = "yc";
    state.status = "dropout";
    return true;
  }
  if (academicExpulsion) {
    state.endingCode = "academic-expulsion";
    state.status = "expelled";
    return true;
  }
  return false;
};

const afterTerm = (state: SimState) =>
  state.jobs.some((job) => job.location.endsWith(", CA")) && tryYc(state);

const amazonJob = () =>
  COMPANIES.find(
    (job) =>
      job.company === "Amazon" &&
      job.role === "Software Development Engineer Intern",
  ) ?? COMPANIES.find((job) => job.company === "Amazon") ?? null;

const rollExchangeEvent = (state: SimState) => {
  const event = weightedChoice(
    [...EXCHANGE_EVENTS],
    EXCHANGE_EVENTS.map((item) => item.weight),
  );
  state.savings += event.savings ?? 0;
  state.momentum += event.momentum ?? 0;
  if (event.robbed) state.savings = savingsAfterRobbery(state.savings);
  addRizz(state, AXES, EXCHANGE_TERM_BASELINE_RIZZ);
  if (event.allAxisRizz) addRizz(state, AXES, event.allAxisRizz);
  if (event.axes && event.axisRizz) {
    addRizz(state, event.axes, event.axisRizz);
  }
  if (event.guaranteesAmazon) state.guaranteedAmazonOffer = true;
  if (event.endsRun) {
    state.endingCode = "lost-forever";
    state.status = "withdrawn";
    return true;
  }
  return false;
};

const rollGrade = (state: SimState) => {
  const values = Array.from({ length: 101 }, (_, average) => average);
  const grade = weightedChoice(
    values,
    values.map((average) => {
      const distance = (average - 76) / 12;
      return Math.max(0.02, Math.exp(-0.5 * distance * distance) * 100);
    }),
  );
  return Math.max(0, Math.min(100, grade + state.momentum));
};

const rollStudyEvent = (
  state: SimState,
  allowMultiTask = true,
) => {
  const options: { id: string; weight: number }[] = [
    { id: "clean", weight: 36 },
    { id: "bad-breakup", weight: 14 },
    { id: "roommate", weight: 7 },
    { id: "recommendation", weight: 8 },
    { id: "scholarship", weight: Math.max(2, state.average - 76) },
    { id: "collab", weight: 5 },
    { id: "exam", weight: 2 },
    { id: "concussion", weight: 4 },
    { id: "failed-course", weight: 4 },
    { id: "resume-lie", weight: 2 },
    { id: "contest", weight: 5 },
    { id: "hack-win", weight: 5 },
    { id: "burnout", weight: 8 },
    { id: "goose", weight: 9 },
    { id: "hackathon", weight: 15 },
    { id: "side-project", weight: 16 },
    { id: "leetcode", weight: 12 },
    { id: "nothing", weight: 13 },
  ];
  const remainingTeams = TEAMS.filter(
    (team) => !state.teams.some((membership) => membership.name === team.name),
  );
  if (remainingTeams.length) {
    options.push({ id: "join-design-team", weight: 30 });
  }
  state.teams
    .filter((team) => team.rank < 3)
    .forEach((team) => {
      options.push({ id: `promote:${team.name}`, weight: 12 });
    });
  const baseWeight = options.reduce((sum, option) => sum + option.weight, 0);
  const multiTaskChance = allowMultiTask ? MULTI_TASK_CHANCE : 0;
  const ordinaryChance =
    1 - RUN_OVER_CHANCE - multiTaskChance;
  if (allowMultiTask) {
    options.push({
      id: "multi-task",
      weight: (baseWeight * multiTaskChance) / ordinaryChance,
    });
  }
  options.push({
    id: "run-over",
    weight: (baseWeight * RUN_OVER_CHANCE) / ordinaryChance,
  });
  const event = weightedChoice(
    options,
    options.map((option) => option.weight),
  ).id;
  if (event === "run-over") {
    state.endingCode = "run-over";
    state.status = "dead";
    return true;
  }
  if (event === "multi-task") {
    if (rollStudyEvent(state, false)) return true;
    return rollStudyEvent(state, false);
  }
  state.savings += STUDY_EVENT_SAVINGS[event] ?? 0;
  if (event === "bad-breakup" && random() < 0.4) {
    state.savings = savingsAfterBadBreakup(state.savings);
    state.integrity = Math.max(0, state.integrity - 1);
    AXES.forEach((axis) => {
      state.rizz[axis] = Math.max(
        0,
        state.rizz[axis] * 0.7,
      );
    });
  }
  if (event === "roommate") state.momentum -= 3;
  if (event === "burnout") {
    state.momentum -= 5;
    addRizz(state, AXES, -2);
  }
  if (event === "concussion") {
    state.momentum -= 8;
    addRizz(state, AXES, -5);
  }
  if (event === "failed-course") {
    state.average = Math.max(0, state.average - 4);
    addRizz(state, AXES, -4);
  }
  if (event === "resume-lie") {
    state.integrity = Math.max(0, state.integrity - 1);
    addRizz(state, AXES, -9);
  }
  if (event === "recommendation") {
    state.professorReference = true;
    addRizz(state, ["systems", "aiData"], 2);
  }
  if (event === "scholarship") {
    state.savings +=
      state.average >= 90 ? 2_500 : state.average >= 85 ? 1_500 : 750;
    addRizz(state, AXES, 0.4);
  }
  if (event === "collab" || event === "exam") {
    state.integrity = Math.max(
      0,
      state.integrity - (event === "exam" ? 2 : 1),
    );
    state.average = Math.max(
      0,
      state.average - (event === "exam" ? 6 : 2),
    );
    addRizz(state, AXES, event === "exam" ? -7 : -3);
  }
  if (event === "contest") addRizz(state, ["quant", "aiData"], 3);
  if (event === "hack-win") {
    addRizz(state, ["product", "systems", "aiData"], 5);
  }
  if (event === "join-design-team") {
    const team = remainingTeams[Math.floor(random() * remainingTeams.length)];
    state.teams.push({ name: team.name, axes: [...team.axes], rank: 0 });
    addRizz(state, team.axes, 3);
    if (state.teams.length > 1) state.momentum -= 2;
  }
  if (event.startsWith("promote:")) {
    const team = state.teams.find(
      (membership) => membership.name === event.slice(8),
    );
    if (team) {
      team.rank = Math.min(3, team.rank + 1);
      addRizz(state, team.axes, 3 + team.rank);
      state.momentum -= 1;
    }
  }
  if (event === "hackathon") {
    const result = random();
    addRizz(
      state,
      ["product", "systems", "aiData"],
      result > 0.94 ? 8 : result > 0.7 ? 4 : 2,
    );
    if (result > 0.94) state.savings += 1_000;
    state.momentum -= 1;
  }
  if (event === "side-project") addRizz(state, ["product", "systems"], 4);
  if (event === "leetcode") {
    addRizz(state, ["systems", "quant"], 3);
    state.momentum -= 1;
  }
  if (event === "nothing") addRizz(state, AXES, -1);
  if (state.integrity <= 0) {
    state.endingCode = "integrity-expulsion";
    state.status = "expelled";
    return true;
  }
  return false;
};

const studyTerm = (state: SimState, label: string) => {
  const grade = rollGrade(state);
  state.average =
    (state.average * state.studyTerms + grade) / (state.studyTerms + 1);
  state.studyTerms += 1;
  state.consecutiveLowTerms =
    grade < 60 ? state.consecutiveLowTerms + 1 : 0;
  state.momentum = Math.round(state.momentum * 0.25);
  addRizz(
    state,
    AXES,
    grade >= 90
      ? 2
      : grade >= 85
        ? 1.5
        : grade >= 75
          ? 1
          : grade >= 65
            ? 0.5
            : 0.2,
  );
  state.savings -= TUITION_PER_STUDY_TERM;
  if (state.consecutiveLowTerms >= 2) return tryYc(state, true);
  if (state.exchangePending) {
    state.exchangePending = false;
    if (rollExchangeEvent(state)) return true;
  } else if (state.savings < BANK_DEBT_LIMIT) {
    const job = weightedChoice(
      [
        { wage: 17.6, weight: 42 },
        { wage: 17.6, weight: 42 },
        { wage: 17.6, weight: 16 },
      ],
      [42, 42, 16],
    );
    state.savings += workTermSavings(job.wage);
    addRizz(state, AXES, -2);
  } else if (rollStudyEvent(state)) {
    return true;
  }
  if (
    ["math", "mathbba"].includes(state.program.id) &&
    label === "1B"
  ) {
    const major = weightedChoice(
      MATH_MAJORS,
      MATH_MAJORS.map((item) => item.weight),
    );
    addRizz(state, major.delta);
  }
  if (
    isExchangeEligibleStudyTerm(label) &&
    state.average >= 80 &&
    !state.exchangeApplicationRolled
  ) {
    state.exchangeApplicationRolled = true;
    if (random() < exchangeAcceptanceChance(state.average)) {
      const university =
        EXCHANGE_UNIVERSITIES[
          Math.floor(random() * EXCHANGE_UNIVERSITIES.length)
        ];
      state.exchangeUniversityId = university.id;
      state.exchangePending = true;
    }
  }
  return afterTerm(state);
};

const offTerm = (state: SimState) => {
  if (random() < RUN_OVER_CHANCE) {
    state.endingCode = "run-over";
    state.status = "dead";
    return true;
  }
  const event = weightedChoice(
    ["sleep", "project", "hack", "travel", "doom"],
    [25, 25, 8, 18, 24],
  );
  state.savings += OFF_TERM_EVENT_SAVINGS[event] ?? 0;
  if (event === "sleep") state.momentum = 4;
  if (event === "project") addRizz(state, ["product", "systems"], 5);
  if (event === "hack") addRizz(state, ["product", "systems", "aiData"], 7);
  if (event === "travel") state.momentum = 3;
  if (event === "doom") state.momentum = -2;
  return afterTerm(state);
};

const interviewCount = (state: SimState, workTerm: number) => {
  const lambda = 0.25 + 0.5 * workTerm + 0.06 * marketRizz(state);
  const values = Array.from({ length: 9 }, (_, value) => value);
  const factorial = (value: number) =>
    Array.from({ length: value }, (_, index) => index + 1).reduce(
      (product, item) => product * item,
      1,
    );
  return Math.min(
    7,
    weightedChoice(
      values,
      values.map((value) =>
        Math.max(
          0.15,
          (Math.exp(-lambda) * Math.pow(lambda, value) * 100) /
            factorial(value),
        ),
      ),
    ),
  );
};

const bestOffer = (state: SimState, jobs: CompanyJob[]) =>
  [...jobs].sort(
    (a, b) =>
      b.prestige - a.prestige ||
      traitFit(state.rizz, b) - traitFit(state.rizz, a) ||
      b.pay - a.pay,
  )[0];

const recruit = (state: SimState, workTerm: number) => {
  const target = interviewCount(state, workTerm);
  const interviews: CompanyJob[] = [];
  const offers: CompanyJob[] = [];
  for (let index = 0; index < target; index += 1) {
    const available = COMPANIES.filter((job) => !interviews.includes(job));
    const pool = interviewPoolWeights(
      profileFor(state, workTerm),
      available,
    );
    const job = weightedChoice(
      available,
      available.map((item) => pool.get(item.id) ?? 0),
    );
    interviews.push(job);
    if (random() < offerProbability(profileFor(state, workTerm), job)) {
      offers.push(job);
      addRizz(state, job.axes, 0.75);
    } else {
      addRizz(state, job.axes, 0.2);
    }
  }
  state.returnOffers.forEach((offer) => offers.push(offer.job));
  if (state.guaranteedAmazonOffer) {
    const amazon = amazonJob();
    if (amazon) offers.push(amazon);
  }
  const uniqueOffers = [
    ...new Map(offers.map((job) => [job.id, job])).values(),
  ];
  if (!uniqueOffers.length) return null;
  const selected = bestOffer(state, uniqueOffers);
  state.guaranteedAmazonOffer = false;
  addRizz(state, selected.axes, 0.5);
  state.returnOffers = state.returnOffers.filter(
    (offer) => offer.job.id !== selected.id,
  );
  return selected;
};

const unemployedTerm = (state: SimState, workNumber: number) => {
  const options = [
    { id: "wea", weight: 28 },
    { id: "design-team-coop", weight: 20 },
    { id: "ra", weight: 22 },
    { id: "unrelated", weight: 25 },
    { id: "startup", weight: 15 },
    { id: "nothing", weight: 10 },
  ].filter(
    (option) =>
      option.id !== "wea" ||
      (workNumber === 1 && !state.usedWeAccelerate),
  );
  const event = weightedChoice(
    options,
    options.map((option) => option.weight),
  ).id;
  state.savings += UNEMPLOYED_TERM_SAVINGS[event] ?? 0;
  state.coopPlacements.push(
    event === "design-team-coop"
      ? { pay: 0, location: "Waterloo, ON" }
      : null,
  );
  if (event === "wea") {
    state.usedWeAccelerate = true;
    addRizz(state, AXES, 0.5);
  }
  if (event === "design-team-coop") {
    let team =
      state.teams[Math.floor(random() * state.teams.length)];
    if (!team) {
      const joined = TEAMS[Math.floor(random() * TEAMS.length)];
      team = {
        name: joined.name,
        axes: [...joined.axes],
        rank: 0,
      };
      state.teams.push(team);
    }
    addRizz(state, AXES, 1);
    addRizz(
      state,
      team.axes,
      DESIGN_TEAM_COOP_RIZZ_GAIN - 1,
    );
  }
  if (event === "ra") addRizz(state, ["aiData", "systems"], 2);
  if (event === "unrelated") addRizz(state, ["product", "systems"], 0.5);
  if (event === "startup") addRizz(state, ["product"], 1);
  if (event === "nothing") addRizz(state, ["product"], 0.1);
  return afterTerm(state);
};

const applyWorkEventRizz = (
  state: SimState,
  job: CompanyJob,
  eventId: string,
) => {
  if (eventId === "ship") addRizz(state, job.axes, 3);
  if (eventId === "mentor") addRizz(state, job.axes, 2);
  if (eventId === "tests") addRizz(state, ["systems"], 1);
  if (eventId === "patent") addRizz(state, job.axes, 6);
  if (eventId === "workaholic") addRizz(state, job.axes, 2);
};

const workEventSignal = (eventId: string) =>
  (
    {
      ship: 2.75,
      mentor: 1,
      tests: 0.5,
      forgotten: -2.5,
      incident: -5,
      patent: 4.5,
      workaholic: 0,
      cancelled: -0.5,
      layoff: -0.25,
      fired: -8,
      dropout: 4,
    } as Record<string, number>
  )[eventId] ?? 0;

const workTermSavingsFromEvents = (pay: number, events: readonly string[]) => {
  const fraction = events.includes("fired")
    ? 0.35
    : events.includes("layoff")
      ? 0.55
      : 1;
  const base = workTermSavings(pay, fraction);
  let total = base;
  if (events.includes("workaholic")) total += base * 1.5;
  if (events.includes("patent")) total += base;
  return total;
};

const workTerm = (state: SimState, workNumber: number) => {
  const job = recruit(state, workNumber);
  if (!job) {
    return unemployedTerm(state, workNumber);
  }
  const canDrop = state.jobs.length >= 3 && job.prestige >= 6;
  const goodEvents = [
    { id: "ship", weight: 23 },
    { id: "mentor", weight: 12 },
    { id: "tests", weight: 14 },
    { id: "patent", weight: 5 },
    { id: "workaholic", weight: 10 },
  ];
  if (canDrop) goodEvents.push({ id: "dropout", weight: 2.5 });
  const events = [
    ...goodEvents,
    { id: "forgotten", weight: 11 },
    { id: "incident", weight: 9 },
    { id: "performative-multitask", weight: 7 },
    { id: "cancelled", weight: 9 },
    { id: "layoff", weight: Math.max(2, job.volatility) },
    { id: "fired", weight: Math.max(1, job.volatility / 2) },
  ];
  const baseWeight = events.reduce((sum, event) => sum + event.weight, 0);
  events.push({
    id: "run-over",
    weight: (baseWeight * RUN_OVER_CHANCE) / (1 - RUN_OVER_CHANCE),
  });
  const event = weightedChoice(
    events,
    events.map((item) => item.weight),
  );
  if (event.id === "run-over") {
    state.coopPlacements.push(null);
    state.endingCode = "run-over";
    state.status = "dead";
    return true;
  }
  const rolledEvents =
    event.id === "performative-multitask"
      ? [
          weightedChoice(
            goodEvents,
            goodEvents.map((item) => item.weight),
          ).id,
          weightedChoice(
            goodEvents,
            goodEvents.map((item) => item.weight),
          ).id,
        ]
      : [event.id];
  for (const rolled of rolledEvents) {
    applyWorkEventRizz(state, job, rolled);
  }
  const fitSignal = Math.max(
    -1.25,
    Math.min(1.5, (traitFit(state.rizz, job) - 20) / 15),
  );
  const eventSignal = rolledEvents.reduce(
    (sum, rolled) => sum + workEventSignal(rolled),
    0,
  );
  const signal = Math.max(-8, Math.min(6, eventSignal + fitSignal));
  const evaluations = [
    "Outstanding",
    "Excellent",
    "Very Good",
    "Good",
    "Satisfactory",
    "Marginal",
    "Unsatisfactory",
  ];
  const evaluation = weightedChoice(evaluations, [
    Math.max(0.4, 3 * Math.exp(signal * 0.22)),
    Math.max(1.5, 11 * Math.exp(signal * 0.16)),
    Math.max(4, 26 * Math.exp(signal * 0.08)),
    Math.max(8, 28 - Math.abs(signal) * 1.2),
    Math.max(1, 14 * Math.exp(signal * -0.15)),
    Math.max(0.4, 5 * Math.exp(signal * -0.23)),
    Math.max(0.15, 1.5 * Math.exp(signal * -0.32)),
  ]);
  addRizz(state, specialtyCoopAxes(job), SPECIALTY_COOP_GAIN);
  const roleBoost =
    evaluation === "Outstanding"
      ? 6
      : evaluation === "Excellent"
        ? 4
        : evaluation === "Very Good"
          ? 3
          : evaluation === "Good"
            ? 1
            : 0;
  addRizz(state, job.axes, roleBoost);
  const penalty =
    evaluation === "Satisfactory"
      ? -2
      : evaluation === "Marginal"
        ? -7
        : evaluation === "Unsatisfactory"
          ? -12
          : 0;
  if (penalty) addRizz(state, AXES, penalty);
  state.savings += workTermSavingsFromEvents(job.pay, rolledEvents);
  state.jobs.push(job);
  state.coopPlacements.push({ pay: job.pay, location: job.location });
  if (!rolledEvents.includes("dropout")) {
    const chance = returnOfferChance(evaluation);
    if (chance > 0 && random() < chance) {
      state.returnOffers = [
        ...state.returnOffers.filter((offer) => offer.job.id !== job.id),
        { job },
      ];
    }
  }
  if (rolledEvents.includes("dropout")) {
    state.endingCode = "full-time";
    state.status = "dropout";
    return true;
  }
  return afterTerm(state);
};

const graduate = (state: SimState) => {
  if (state.savings < 0 && state.returnOffers.length === 0) {
    state.endingCode = "survival-job";
    state.status = "graduated";
    return;
  }
  const reachable = [...GRAD_SCHOOLS].sort(
    (a, b) =>
      Math.abs(a.median - state.average) - Math.abs(b.median - state.average),
  );
  const selected = reachable.slice(0, MAX_GRAD_APPLICATIONS);
  const admits = selected.filter(
    (school) =>
      random() <
      gradAdmissionProbability(
        state.average,
        school.median,
        state.professorReference,
      ),
  );
  const choices: { code: string; weight: number }[] = [
    ...admits.map((school) => ({
      code: `grad:${school.id}`,
      weight: 1,
    })),
    ...state.returnOffers.map((offer) => ({
      code: `return:${offer.job.id}`,
      weight: 1,
    })),
  ];
  if (choices.length === 0) {
    state.endingCode = "unemployed";
    state.status = "graduated";
    return;
  }
  choices.push({ code: "yc-roll", weight: 1 });
  const pick = weightedChoice(
    choices.map((choice) => choice.code),
    choices.map((choice) => choice.weight),
  );
  if (pick === "yc-roll") {
    const chance = Math.min(
      0.06,
      0.003 + Math.pow(marketRizz(state) / 100, 2) * 0.055,
    );
    if (random() < chance) {
      state.savings += YC_SEED_FUNDING;
      state.endingCode = "yc";
      state.status = "dropout";
      return;
    }
    state.endingCode = "unemployed";
    state.status = "graduated";
    return;
  }
  state.endingCode = pick;
  state.status = "graduated";
};

const runOnce = () => {
  const state = freshState();
  let workNumber = 0;
  for (const term of state.timeline) {
    if (state.endingCode) break;
    if (term.kind === "coop") {
      workNumber += 1;
      workTerm(state, workNumber);
    } else if (term.kind === "off") {
      offTerm(state);
    } else {
      studyTerm(state, term.label);
    }
  }
  if (!state.endingCode) graduate(state);
  return state;
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

const reportFor = (states: SimState[]): SimulationReport => {
  const savings = states.map((state) => state.savings);
  const teamPoints = states.map(
    (state) =>
      state.teams.length +
      state.teams.reduce((sum, team) => sum + team.rank, 0),
  );
  const percentage = (predicate: (state: SimState) => boolean) =>
    (states.filter(predicate).length / states.length) * 100;
  const programCounts = new Map<string, { label: string; count: number }>();
  states.forEach((state) => {
    const current = programCounts.get(state.program.id);
    programCounts.set(state.program.id, {
      label: state.program.short,
      count: (current?.count ?? 0) + 1,
    });
  });
  const programDistribution = [...programCounts.entries()]
    .map(([id, value]) => ({
      id,
      label: value.label,
      count: value.count,
      percentage: (value.count / states.length) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);
  const scholarshipDistribution = SCHOLARSHIP_OUTCOMES.map((outcome) => {
    const count = states.filter(
      (state) => state.scholarshipId === outcome.id,
    ).length;
    return {
      id: outcome.id,
      label: outcome.label,
      count,
      percentage: (count / states.length) * 100,
    };
  });
  const coopWages = Array.from({ length: 6 }, (_, index) => {
    const reached = states.filter(
      (state) => state.coopPlacements.length > index,
    );
    const placements = reached
      .map((state) => state.coopPlacements[index])
      .filter(
        (
          placement,
        ): placement is { pay: number; location: string } =>
          placement !== null,
      );
    const locationCounts = new Map<string, number>();
    placements.forEach(({ location }) => {
      locationCounts.set(location, (locationCounts.get(location) ?? 0) + 1);
    });
    return {
      coop: index + 1,
      averageHourlyPay: placements.length
        ? placements.reduce((sum, placement) => sum + placement.pay, 0) /
          placements.length
        : 0,
      placementRate: reached.length
        ? (placements.length / reached.length) * 100
        : 0,
      reachedRuns: reached.length,
      locations: [...locationCounts.entries()]
        .map(([location, count]) => ({
          location,
          count,
          percentage: placements.length
            ? (count / placements.length) * 100
            : 0,
        }))
        .sort(
          (a, b) =>
            b.percentage - a.percentage ||
            a.location.localeCompare(b.location),
        ),
    };
  });
  return {
    runs: states.length,
    savings: {
      average:
        savings.reduce((sum, value) => sum + value, 0) / savings.length,
      median: median(savings),
      maximum: Math.max(...savings),
      minimum: Math.min(...savings),
    },
    designTeamPoints: {
      average:
        teamPoints.reduce((sum, value) => sum + value, 0) /
        teamPoints.length,
      median: median(teamPoints),
      maximum: Math.max(...teamPoints),
    },
    programDistribution,
    scholarshipDistribution,
    coopWages,
    outcomes: {
      academicExpulsion: percentage(
        (state) => state.endingCode === "academic-expulsion",
      ),
      integrityExpulsion: percentage(
        (state) => state.endingCode === "integrity-expulsion",
      ),
      yc: percentage((state) => state.endingCode === "yc"),
      gradSchool: percentage((state) =>
        Boolean(state.endingCode?.startsWith("grad:")),
      ),
      returnFullTime: percentage((state) =>
        Boolean(state.endingCode?.startsWith("return:")),
      ),
      openToWork: percentage(
        (state) =>
          state.endingCode === "unemployed" ||
          state.endingCode === "survival-job",
      ),
      madeItOuttaTheGta: percentage(
        (state) =>
          state.endingCode === "yc" ||
          Boolean(state.exchangeUniversityId) ||
          state.jobs.some((job) => isOutsideGtaAndLoo(job.location)),
      ),
      madeItToNyc: percentage((state) =>
        state.jobs.some((job) => job.location === "New York, NY"),
      ),
      madeItIntoCali: percentage(
        (state) =>
          state.endingCode === "yc" ||
          state.jobs.some((job) => job.location.endsWith(", CA")),
      ),
      graduated: percentage((state) => state.status === "graduated"),
      runOver: percentage((state) => state.endingCode === "run-over"),
      fullTimeDropout: percentage(
        (state) => state.endingCode === "full-time",
      ),
      exchangeEligible: percentage(
        (state) => state.exchangeApplicationRolled,
      ),
      wentOnExchange: percentage(
        (state) => Boolean(state.exchangeUniversityId),
      ),
      lostForever: percentage(
        (state) => state.endingCode === "lost-forever",
      ),
    },
  };
};

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<{ runs?: number }>) => void) | null;
  postMessage: (
    message:
      | SimulationReport
      | { error: string }
      | { type: "progress"; completed: number; total: number },
  ) => void;
};

workerScope.onmessage = (event) => {
  const run = async () => {
    const runs = Math.max(1, Math.min(10_000, event.data.runs ?? 2_000));
    const reportProgress = runs > 1_000;
    const progressStep = reportProgress
      ? Math.max(25, Math.round(runs / 40))
      : runs;
    const states: SimState[] = [];
    for (let index = 0; index < runs; index += 1) {
      states.push(runOnce());
      const completed = index + 1;
      if (
        reportProgress &&
        (completed === runs || completed % progressStep === 0)
      ) {
        workerScope.postMessage({
          type: "progress",
          completed,
          total: runs,
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 0);
        });
      }
    }
    workerScope.postMessage(reportFor(states));
  };

  run().catch((error) => {
    workerScope.postMessage({
      error: error instanceof Error ? error.message : "Simulation failed",
    });
  });
};
