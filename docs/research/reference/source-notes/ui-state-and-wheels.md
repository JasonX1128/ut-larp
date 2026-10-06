# waterloo.careers — `pretty/ui.js` state, RNG, persistence, network, helpers, stages and wheels

Scope: `pretty/ui.js` lines 560–1006 and 2536–3870, read in full. I also read 1007–1270, 1308–1553, 1961–2130, 2334–2535, 3871–4130, 4150–4800 and 4798–5226 where needed to explain what state variables, refs and helpers do (those ranges belong to other notes; anything I cite from them is a cross-check, not the primary write-up). References resolved in `pretty/data.js` and `chunks/simulation-worker.*.ts`.

Legend used throughout:

- **[read]** = stated directly by the code at the cited lines.
- **[inferred]** = my deduction; not literally in the source.
- **[name]** = a descriptive name I am giving a minified identifier. Where the worker TypeScript has an identical formula I say so ("= worker `marketRizz`"); otherwise the name is mine.

---

## 0. Identifier map and a shadowing warning

Module aliases (lines 657–661, 677, 719–722), confirmed against the export lists in `data.js`:

| Alias | Module id | What it is | Exports used in my ranges |
|---|---|---|---|
| `et` | 71645 | React | `useState`, `useRef`, `useEffect`, `useMemo`, `useCallback` |
| `n` | (jsx runtime) | `jsx` / `jsxs` / `Fragment` | |
| `en` | 66737 | admissions-data | `ADMISSION_MEDIANS`, `admissionProbability`, `nextAdmissionProgramId`, `SELECTABLE_MATH_APPLICATION_IDS`, `applicationCount`, `MAX_WATERLOO_APPLICATIONS` (3), `isValidApplicationSelection` |
| `er` | 70510 | company-data | `COMPANIES` (245 entries), `isOutsideGtaAndLoo`, `prestigeBandFor` |
| `ea` | 14353 | game-data | `AXES`, `PROGRAMS`, `MATH_MAJORS`, `MATH_MAJOR_PROGRAM_IDS`, `SEQUENCES`, `TEAMS` (69), `RANKS`, `DESIGN_TEAM_ROLL_SIZE` (20) |
| `ei` | 85572 | recruiting-model | `resumeScore`, `traitFit`, `interviewPoolWeights`, `companyInterviewWeight`, `offerProbability`, `specialtyCoopAxes`, `SPECIALTY_COOP_GAIN` (10) |
| `ed` | 95503 | work-term-model | `DESIGN_TEAM_COOP_EVALUATION` ("Design team co-op"), `DESIGN_TEAM_COOP_RIZZ_GAIN` (8), `WE_ACCELERATE_EVALUATION` ("WE Accelerate"), `canUseWeAccelerate` |
| `ep` | 77204 | finance-model | `FORCED_DEBT_JOBS`, `BANK_DEBT_LIMIT` (-10000), `TUITION_PER_STUDY_TERM` (3000), `STUDY_EVENT_SAVINGS`, `OFF_TERM_EVENT_SAVINGS`, `UNEMPLOYED_TERM_SAVINGS`, `YC_SEED_FUNDING` (500000), `savingsAfterBadBreakup`, `workTermSavings` |
| `eb` | 30995 | scholarship-model | `SCHOLARSHIP_OUTCOMES`, `scholarshipOutcome` |
| `ef` | 95659 | exchange-model | `EXCHANGE_EVENTS`, `EXCHANGE_UNIVERSITIES` (40), `EXCHANGE_TERM_BASELINE_RIZZ` (2), `exchangeAcceptanceChance`, `isExchangeEligibleStudyTerm`, `savingsAfterRobbery` |
| `ey` | 18272 | grad-school-model | `GRAD_SCHOOLS` (15), `MAX_GRAD_APPLICATIONS` (4), `gradAdmissionProbability`, `gradSchoolById`, `isValidGradApplicationSelection`, `returnOfferChance` |
| `ex` | — | `er.COMPANIES` (line 723) | |

**Shadowing trap.** The main component (2540+) re-declares many names that also exist at module scope. Module-scope helpers keep using the module-scope versions because they are defined outside the component. Do not confuse them:

| Name | Module scope (560–1006) | Inside the component (2540+) |
|---|---|---|
| `eE` | `1e3 / 12` tick throttle (727) | `playIntro()` callback (2576) |
| `eA`, `eR` | Bezier control points (730–731) | `ensureAudioContext()` (2603), `loadBuffer(ctx, url)` (2613) |
| `eO` | `getVisitorId()` (804) | `loadSoundBuffers()` (2618) |
| `eD` | `round2()` (848) | `playBuffer(buffer)` (2635) |
| `e2` | `amazonJob()` (951) | the current stage's wheel options (memo, 2830) |
| `e7` | cubic-Bezier coordinate (1003) | options in display order (memo, 3734) |
| `ev`, `ew` | zero-rizz object (724), tone colour map (725) | leaderboard `loading` flag and its setter (2575) |
| `ee`, `Q`, `K`, `Z`, `q`, `Y`, `X`, `J`, `V`, `B`, `H`, `W`, `_`, `U`, `G`, `F`, `D`, `L` | html-to-image internals | React state / setters (2566–2575) |

---

## 1. Narration scenes

A scene is `{ id, title, lines: string[], continueLabel }`. They are rendered by `th` (1961–1985) as a modal dialog (`.narration-backdrop` > `section.narration-window[role=dialog][aria-modal=true]`). **Every scene shows the same hard-coded speaker tag `ME`** (`<span class="narration-speaker">ME</span>`, line 1970); there is no per-scene speaker field. Each line is a separate `<p>`. The button text is `` `${continueLabel} →` `` and has `autoFocus`.

Scenes are held in a queue (component state `p`, section 8). `p[0]` is displayed; the button does `p.slice(1)` (5164). While the queue is non-empty, spinning is blocked (3898) and so is multi-task auto-spin (4739).

`ec` (678) is the game title, also used as the `<h1>` in the top bar (4807):

> `Isekai Waterloo: The Roulette Table that Decides my Jobless Fate!`

### 1.1 `opening` — `eu` (679–688)

- id: `opening`
- title: `Isekai Waterloo: The Roulette Table that Decides my Jobless Fate!` (the `ec` constant)
- lines:
  1. `I was a jobless bum on a Leetcode sabbatical when Truck-kun flattened me before I could update LinkedIn.`
  2. `Then Goddess Aqua decided I was hot enough for one more chance and dropped me into Waterloo.`
  3. `With this roulette table, let me not become unemployed in another world!!`
- continueLabel: `BEGIN`
- Shown: on **every page load** once hydration finishes — the queue is reset to `[eu]` at line 2768, regardless of whether a saved run was resumed — and on every RESTART (`b([eu])`, line 4771).

### 1.2 `program` — built inline (5010–5020)

- id: `program`
- title: `THE ACCEPTANCE ARC`
- lines (`${n}` = accepted program's full `name`, e.g. "Computer Science"):
  1. `` `Against all logic, Waterloo actually let me into ${n}.` ``
  2. `I can already feel my personality collapsing into a co-op sequence and a radar chart.`
  3. `If this degree cannot save me from joblessness, nothing in this world can.`
- continueLabel: `CONTINUE`
- Shown: appended to the queue when the player clicks ACCEPT on a program in the `program-select` stage (5006–5022).

### 1.3 `graduation` — `em` (689–698)

- id: `graduation`
- title: `THE GRADUATION ARC`
- lines:
  1. `Somehow, I survived Waterloo and walked across the stage with a degree in my hands.`
  2. `Every terrible roll, rejected interview, and sleepless term has become lore for my character arc.`
  3. `Now I only need the labour market to believe any of this was worth it.`
- continueLabel: `SEE MY FATE`

### 1.4 `death` — `eh` (699–708)

- id: `death`
- title: `TRUCK-KUN RETURNS`
- lines:
  1. `Truck-kun found me again, which feels less like fate and more like targeted harassment.`
  2. `My second life at Waterloo ends before I can optimize the résumé bullet.`
  3. `Sometimes life happens... to me, apparently.`
- continueLabel: `SEE MY FATE`

### 1.5 `yc` — `eg` (709–718)

- id: `yc`
- title: `THE FOUNDER ARC`
- lines:
  1. `I got into YC, so apparently dropping out is visionary when investors approve it.`
  2. `Aqua is already calling this my genius founder arc instead of academic withdrawal.`
  3. `I am moving to California to become someone else's LinkedIn post.`
- continueLabel: `SEE MY FATE`

### 1.6 When the ending scenes fire (2800–2814)

Effect on `[hydrated, endingCode, seed, stage, status]`. Only when `stage === "done"`:

```js
scene = endingCode === "yc" ? eg
      : (status === "dead" || endingCode === "run-over") ? eh
      : status === "graduated" ? em
      : null;
key = `${seed}:${status}:${endingCode ?? "none"}`;
if (scene && z.current !== key) { z.current = key; queue.push(scene); }
```

- YC wins over everything (including the "graduation" YC moonshot).
- **No scene** for the other endings: integrity expulsion, academic expulsion, "lost forever" (status `withdrawn`), full-time dropout.
- The dedupe ref `z` is in memory only, so reloading a finished run queues `[opening, ending scene]` again. RESTART clears `z` (4770).

### 1.7 Other modal copy (not scenes, but narration-adjacent)

- Bank notice `tg` (1986–2002), shown while `state.bankNoticePending` (5165): `I’m below the bank’s borrowing limit, so they won’t lend me any more money and I have to work this term.` (curly apostrophes), button `OK`, aria-label `Bank borrowing limit`.
- Locked-feature notice `tp` (2004–2020), shown while state `w` is true: `Complete a run first to see the leaderboard and simulate outcome statistics with Monte Carlo.`, button `OK`, aria-label `Complete a run first`.
- Loading screen before hydration (5220): `ENTERING ANOTHER WORLD…`.
- Result strip default (5157): `Click above to spin`.
- Integrity-expulsion ending text, `el` (662–663), used as `state.ending` at 4286 and 4374: `maybe spend more time locking in, and less time cheating. You're pretty bad at the latter anyways`.

---

## 2. Game state shape and constants

### 2.1 Initial state — `ek(seed)` (755–802)

Field meanings marked **[read]** come from how the field is used in code I read; types are inferred from usage.

| Field | Initial | Type / meaning |
|---|---|---|
| `contentVersion` | `"2026.8"` | Save-compatibility tag checked on load (2700). |
| `seed` | arg | String. PRNG seed and leaderboard `runId`. |
| `rngCounter` | `0` | Int. Number of resolved spins; second PRNG input. Also used as log-entry id. |
| `stage` | `"highschool-average"` | Current screen (section 7). |
| `status` | `"active"` | `"active" \| "graduated" \| "expelled" \| "withdrawn" \| "dropout" \| "dead"` (all six appear as literals; same union as worker `SimState.status`). |
| `highSchoolAverage` | `null` | Number 85–100 once rolled. |
| `program` | `null` | Full `PROGRAMS` entry `{id, short, name, faculty, weight, sequence, rizz}`. |
| `major` | `null` | String label of the math major (only `math` / `mathbba` programs). |
| `sequenceName` | `null` | `"SEQ 1".."SEQ 4"`, `"STREAM 4"`, `"STREAM 8"`, `"STREAM 8S"` (the `"STREAM 4D"` id is stored as `"STREAM 4"`, line 4005). |
| `timeline` | `[]` | `[{id: "${index}-${label}", label, kind: "study"\|"coop"\|"off"}]` from `SEQUENCES` (data.js 239–270). |
| `termIndex` | `0` | Index into `timeline`. |
| `studyTerms` | `0` | Count of completed term-average rolls (denominator of the running average). |
| `consecutiveLowTerms` | `0` | Consecutive study terms with an effective grade < 60; reaching 2 triggers academic expulsion (4104, 4134). |
| `rizz` | all seven axes `0` (`eI(ev)`) | `{systems, product, aiData, quant, hardware, mechanical, bioNano}`. Replaced with `program.rizz` on program accept (5000). |
| `average` | `78` | Cumulative average ("CAV"). The initial 78 is discarded by the first term (`(avg*0 + grade)/1`, line 4103). |
| `integrity` | `2` | Integrity points; `<= 0` ends the run. |
| `momentum` | `0` | Added to the next term-average roll; decays to `round(0.25 * momentum)` each study term (4102, 4116). |
| `savings` | `0` | CAD, may go negative. |
| `moneyEvents` | `[]` | Ledger `[{term, label, amount, balance}]`, last 64 entries (see `eF`). Sent to the leaderboard. |
| `scholarshipId` | `null` | Entrance scholarship id. |
| `exchange` | `{applicationRolled:false, accepted:false, universityId:null, pending:false, active:false}` | Exchange sub-state. `applicationRolled`: the one-time application has been spun. `universityId`: host university once matched (also counts as "escaped" and is shown on the end card). `pending`: matched, so the next study term becomes the exchange term (4107, 4124). `accepted` and `active` are written but never read. |
| `guaranteedAmazonOffer` | `false` | Set by the Bezos exchange event; injects an Amazon offer into the next offer selection. |
| `professorReference` | `false` | Doubles masters admit odds. |
| `teams` | `[]` | `[{name, axes, rank, active}]`; `rank` indexes `RANKS = ["MEMBER","LEAD","DIRECTOR","CAPTAIN"]`. |
| `jobs` | `[]` | Work-term history `[{term, job: CompanyJob \| null, evaluation: string}]`. |
| `returnOffers` | `[]` | `[{job}]`. |
| `pendingJob` | `null` | Accepted job for the upcoming co-op term. |
| `currentJob` | `null` | Job during the current co-op term. |
| `currentWorkEvents` | `[]` | Event ids rolled during the current work term (feeds the evaluation wheel). |
| `ycContinuation` | `null` | Where to go after a failed YC roll: `"study" \| "non-study" \| "academic-expulsion" \| "graduation"`. |
| `bankNoticeShown` | `false` | One-time flag for the bank notice. |
| `bankNoticePending` | `false` | Bank notice currently on screen (blocks spinning). |
| `multiTaskRollsRemaining` | `0` | Remaining chained term-event rolls. |
| `admissions` | `{mainEngineeringId:null, backupEngineeringId:null, selectedMathProgramIds:[], currentProgramId:null, results:[]}` | `results: [{programId, outcome: "offer"\|"no-offer", probability, source: "main"\|"backup"\|"selected"\|"fallback"}]`. |
| `gradSchool` | `{selectedIds:[], currentId:null, results:[]}` | `results: [{schoolId, outcome, probability}]`. |
| `recruiting` | `{target:0, completed:0, interviews:[], selectedJob:null}` | `interviews: [{job, outcome: "offer"\|"no-offer"}]`. |
| `log` | `[]` | `[{id, term, title, detail, tone}]`, newest first, max 80. **Never rendered** (section 10). |
| `lastResult` | `null` | `{title, detail, tone}`; only `title` and `tone` are displayed (5153–5157). |
| `ending` | `null` | Display string of the ending. |
| `endingCode` | `null` | `"yc"`, `"run-over"`, `"integrity-expulsion"`, `"academic-expulsion"`, `"lost-forever"`, `"full-time"`, `"unemployed"`, `"survival-job"`, `` `grad:${schoolId}` ``, `` `return:${jobId}` ``. |

### 2.2 Constants (723–731)

| Name | Value | Meaning |
|---|---|---|
| `ev` | all seven axes = 0 | Zero rizz template. |
| `ew` | `{ gold: "#f7c948", red: "#d94a38", green: "#1f8a60", ink: "#262622", cream: "#c9bfa9" }` | **Tone colour map.** Used for the wheel's `conic-gradient` (1140). A segment with no tone falls back to `ink` on odd indexes and `gold` on even. Tones are also used as CSS class names (`result-strip <tone>`, `slot-row <tone>`). |
| `ej` | `Set(["highschool-average","scholarship","study-grade","recruit-count","work-eval"])` | Stages rendered as a **slot-machine reel** (`tn`) instead of a wheel (5130), with a 520 ms spin (3872) and the slot sound (3907). |
| `eE` | `1e3 / 12` ≈ 83.3 ms | Minimum gap between wheel tick sounds, i.e. max 12 ticks/s (1122). |
| `eS` | `["/audio/click3.mp3", "/audio/click4.mp3"]` | Tick samples; one chosen at random per tick. |
| `eN` | `"waterloo-roulette:meta-unlocked"` | sessionStorage key. |
| `eA` | `{ x1: 0.12, y1: 0.68, x2: 0.11, y2: 1 }` | Bezier of the normal wheel's easing. Matches CSS `cubic-bezier(0.12, 0.68, 0.11, 1)` (1132). Used in JS only to time tick sounds. |
| `eR` | `{ x1: 0.55, y1: 0, x2: 0.45, y2: 1 }` | Same for the "company" wheel: `cubic-bezier(0.55, 0, 0.45, 1)`. |
| `el` | (string, 662) | Integrity-expulsion ending text (section 1.7). |
| `ec` | (string, 678) | Game title. |

Other audio paths, declared inside the component: `/audio/loo-intro.mp3` (2651), `/audio/slot.mp3` (2653), `/audio/button.mp3` (2629). **Full audio file list: `loo-intro.mp3`, `slot.mp3`, `button.mp3`, `click3.mp3`, `click4.mp3`.**

### 2.3 Small pure helpers defined before 755

- `es(integrity, loss)` (664) = `Math.max(0, Math.min(2, integrity) - Math.max(0, loss))` — **[name]** `loseIntegrity`. Used at 4199, 4222, 4229, 4362.
- `eo(options, equal = false)` (665–676) — **[name]** `segmentAngles`. Returns per-option `{start, end, centre, size}` in degrees. Weights are `max(0, weight)`, or all `1` when `equal` is true; if every weight is 0 it falls back to equal slices.
- `eI(rizz)` (732) — normalise to all seven axes, missing → 0 (= worker `cloneRizz` plus defaulting).
- `eT(rizz, axesOrDelta, amount = 0)` (733–745) — = worker `addRizz`, but pure. If the second argument is an array, add `amount` to each listed axis; otherwise treat it as a partial per-axis delta. Every axis is floored at 0.

---

## 3. RNG

### 3.1 The generator — `eC(seed, counter, label = "spin")` (746–754)

```js
eC = (e, t, n = "spin") => {
  let r = ((e) => {
      let t = 0x811c9dc5;
      for (let n = 0; n < e.length; n += 1) ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 0x1000193)));
      return t >>> 0;
    })(`${e}:${t}:${n}`) || 1;
  return ((r ^= r << 13), (r ^= r >>> 17), ((r ^= r << 5) >>> 0) / 0x100000000);
};
```

- FNV-1a 32-bit over the UTF-16 code units of `` `${seed}:${counter}:${label}` `` (offset basis `0x811c9dc5`, prime `0x01000193`), with `|| 1` to avoid a zero state.
- One round of xorshift32 (13, 17, 5), then divide by 2^32 → float in `[0, 1)`.
- It is a **stateless hash**, not a stream: every draw is a pure function of `(seed, counter, label)`.

Test vectors I computed by running the function verbatim in Node (useful for a rebuild):

| Call | Result |
|---|---|
| `eC("campus-preview", 0)` | 0.766552 |
| `eC("campus-preview", 1)` | 0.883829 |
| `eC("campus-preview", 2)` | 0.672832 |
| `eC("campus-preview", 3)` | 0.172338 |
| `eC("abc", 0)` | 0.4141034581698477 |
| `eC("abc", 0, "hack-result")` | 0.7703487365506589 |

### 3.2 Every label in use

| Label | Where | Purpose |
|---|---|---|
| `"spin"` (default) | 3903 | **The outcome** of each spin: `eC(seed, rngCounter)` → weighted pick. |
| `` `wheel-landing:${stage}:${index}` `` | 3918 | Cosmetic: where inside the winning slice the pointer stops. |
| `` `employer-order:${i}` `` | 3740 | Cosmetic: Fisher–Yates shuffle of the employer wheel's display order. |
| `` `team:${team.name}` `` | 977–978 (`e6`) | Which 20 design teams are on offer (affects outcomes: it decides the shortlist). |
| `"hack-result"` | 4254 | Hidden sub-roll for the "Hackathon run" study event (prize tiers). Uses the already-incremented counter. |

`Math.random()` appears exactly once after line 560 — line 3880, choosing which tick sample to play. **No game logic uses `Math.random`.** (The Monte-Carlo worker is the opposite: `const random = () => Math.random()`.)

### 3.3 The weighted pick (3899–3903)

```js
index = ((opts, u) => {
  let n = u * opts.reduce((s, o) => s + Math.max(0, o.weight), 0);
  for (let t = 0; t < opts.length; t += 1) if ((n -= Math.max(0, opts[t].weight)) <= 0) return t;
  return opts.length - 1;
})(e2, eC(r.seed, r.rngCounter));
```

Identical in shape to worker `weightedChoice`. Note it walks `e2` (the canonical option order from the builder), not the shuffled display order.

### 3.4 Seed generation

- New run (2762–2766 on first load, 4757–4759 on RESTART): `Array.from(crypto.getRandomValues(new Uint32Array(2))).map(e => e.toString(36)).join("-")` — two base-36 uint32s, e.g. `v8wvhq-1wq2wrb`.
- `?seed=<anything>` in the URL overrides it (2695, 2762). See section 4.4.
- Placeholder seed `"campus-preview"` for the pre-hydration state (2542). See section 4.5.

### 3.5 How `rngCounter` advances

- `+1` exactly once per resolved spin: the resolver begins with `n = { ...e, rngCounter: e.rngCounter + 1, lastResult: null }` (3933).
- Choice screens (`applications`, `program-select`, `offer-select`, `grad-applications`, `ending-select`) do **not** advance it (handlers at 4884–5128 never touch it).
- It only changes when the result is applied, `tw + tj` ms after the click (4732). During the animation the saved state still holds the old counter.

### 3.6 Implications

- **Deterministic and replayable [read + inferred].** Wheel weights are pure functions of state, and state changes only through spins and player choices, so a run is fully determined by `(seed, the player's choices)`. Opening `/?seed=X` and making the same choices reproduces the run exactly.
- **Save-scumming a spin does nothing [inferred].** Reloading mid-spin or before a spin re-derives the same `u` from the unchanged `(seed, counter)`.
- **Choices can re-map a draw [inferred].** Because choice screens do not consume the counter, a player who knows the seed can compute `eC(seed, counter)` in advance and pick the choice whose next wheel maps that `u` to a good slice (e.g. which programs to apply to, which offer to accept).
- **No anti-cheat in the client [read].** The whole state — seed, counter, savings, rizz — sits in `localStorage` as plain JSON and is re-loaded with only a version-string check. The leaderboard POST sends client-computed aggregates. There is no signature, no choice transcript and no spin log in the payload, so the server cannot re-simulate a run from what it receives **[inferred]**; at most it could sanity-check `moneyEvents` against `savings` (unknown — server code not available).
- The "cheating" joke string `el` is in-fiction (academic integrity), not a tamper detector **[read]**: it is only assigned when `integrity <= 0`.

---

## 4. Persistence and identity

### 4.1 Storage keys

| Key | Store | Written | Read | Content |
|---|---|---|---|---|
| `waterloo-roulette:v8` | localStorage | On every state change once hydrated (2772–2774) | On load, unless `?seed=` is present (2696) | `JSON.stringify(state)` — the entire game state including `seed`, `rngCounter`, `log`, `moneyEvents`. |
| `waterloo-roulette:visitor` | localStorage | First time `eO()` runs (809) | Every leaderboard/playtime POST | `crypto.randomUUID()`. Anonymous, permanent player identity. |
| `waterloo-roulette:meta-unlocked` | **sessionStorage** | Set to `"1"` whenever `stage === "done"` (2819) | On hydration (2816) | Unlocks the Leaderboard and Outcomes buttons for this tab session. |
| `wr_visitor` | localStorage | Layout chunk `chunks/0ky20duhfj85k.js` (outside ui.js) | Same | A second, separate UUID used only by the page-view beacon to `/api/analytics`. |

Not persisted: mute state, simulation run count, wheel rotation, scene queue, the leaderboard-submitted ref.

### 4.2 Load sequence (2693–2771)

Runs once, inside `setTimeout(…, 0)` after mount:

1. `seedParam = new URLSearchParams(location.search).get("seed")`.
2. `saved = seedParam ? null : localStorage.getItem("waterloo-roulette:v8")`.
3. If `saved` is truthy → `JSON.parse` inside `try`:
   - If `parsed.contentVersion === "2026.8"` → build a normalised state (4.3) and `setState` it.
   - If the version differs → **nothing is set** (see 4.5).
   - If anything throws → `localStorage.removeItem("waterloo-roulette:v8")`, and again nothing is set.
4. Else (no save, or `?seed=` given) → `setState(ek(seedParam ?? randomSeed))`.
5. Always: scene queue = `[opening]`, `hydrated = true` (2768).

### 4.3 Normalisation / migration of a saved state (2701–2754)

Spread the saved object, then override:

| Field | Rule |
|---|---|
| `program` | Re-resolve from current `PROGRAMS` by id; if the id no longer exists keep the saved object with `rizz` normalised by `eI`. |
| `rizz` | `eI(saved.rizz)` (fills missing axes with 0). |
| `consecutiveLowTerms`, `multiTaskRollsRemaining` | `?? 0` |
| `bankNoticeShown`, `bankNoticePending`, `guaranteedAmazonOffer`, `professorReference` | `?? false` |
| `currentWorkEvents` | Keep if present; else migrate legacy singular `currentWorkEvent` → `[it]`, or `[]`. |
| `scholarshipId`, `endingCode` | `?? null` |
| `exchange` | `??` the default object. |
| `moneyEvents` | `?? []` |
| `admissions.selectedMathProgramIds` | `?? []` |
| `gradSchool` | `?? {selectedIds:[], currentId:null, results:[]}` |
| `teams[].axes` | Each axis not in `AXES` is replaced by `["systems","mechanical"]`; de-duplicated with a `Set`. |
| `jobs[].job`, `pendingJob`, `currentJob`, `recruiting.selectedJob` | `eM(job)`: re-resolve by id from current `COMPANIES`, falling back to the saved object; `null` stays `null`. |
| `returnOffers[]`, `recruiting.interviews[].job` | Same, as `eM(job) ?? job`. |
| legacy stage `"study-extra"` | Converted via `e3({ ...t, stage: "term-event" })`, i.e. treated as "study event finished" (2754). |

So the save format has clearly evolved (singular work event, a removed `study-extra` stage, renamed axes) while the key stayed `v8` **[inferred]**.

### 4.4 `?seed=` behaviour [read]

- Ignores any saved run and starts a fresh game with that literal string as the seed.
- The new state is then persisted, **overwriting the saved run**.
- The parameter stays in the URL, so every reload restarts the same seeded run from scratch.
- RESTART strips it: `history.replaceState({}, "", location.pathname)` (4760).
- The COPY button copies `origin + pathname` with no seed (4775) and reports `Game link copied` / `The generic game link is ready to share. Each visitor gets a fresh run.` (4780–4781). There is no UI that produces a seeded link; the parameter is an undocumented feature.

### 4.5 The `"campus-preview"` seed

`useState(() => ek("campus-preview"))` (2542) is the placeholder state for the first render, before the load effect runs. While `hydrated` is false the component renders only `ENTERING ANOTHER WORLD…` (5220), so normally nobody plays it.

**Quirk [inferred from 2697–2768]:** if a `waterloo-roulette:v8` entry exists but its `contentVersion` is not `"2026.8"`, or it fails to parse/normalise, no `setState` happens, hydration completes, and the player is silently put into the `"campus-preview"` run — a fixed seed shared by everyone who hits this path. It is then saved over their old entry and submitted to the leaderboard with `runId: "campus-preview"`. First spin on that seed: `eC("campus-preview", 0) = 0.766552` → 97% high-school average (my calculation). Pressing RESTART gives a normal random seed.

### 4.6 "meta-unlocked"

- State `x` (2550). True if sessionStorage has the flag at hydration (2815–2817), or as soon as any run reaches `done` (2818–2820).
- Locked: the two top-bar buttons get class `locked`, a padlock SVG (`e9`, 1007–1031) and titles `Complete a run to unlock Leaderboard` / `Complete a run to unlock Outcomes`; clicking opens the locked notice (4820, 4829).
- Unlocked: `Leaderboard` calls `tT()` (POST + modal), `Outcomes` opens the Monte-Carlo modal.
- Because the flag is in sessionStorage it is per tab; but a saved run that is already `done` re-sets it on load. It is trivially bypassed with `sessionStorage.setItem("waterloo-roulette:meta-unlocked", "1")` **[inferred]**. The end screen always has its own buttons for both (`onViewStatistics`, `onViewLeaderboard`, 4861–4862).

### 4.7 RESTART — `tR` (4755–4773)

Replays the intro music, generates a new seed, strips the query string, clears both spin timers and the pending result, resets `busy`, `spinning`, `rotation = 0`, slot state, the ending-scene dedupe ref, sets the queue to `[opening]`, and `setState(ek(newSeed))`. Mute, unlock state and leaderboard data survive.

---

## 5. Network

All game network calls go to **`POST /api/leaderboard`**. There is **no GET** anywhere in `ui.js`. (The locally captured `api_leaderboard.txt` is 0 bytes, consistent with the endpoint being POST-only **[inferred]**.)

### 5.1 Run submission / leaderboard fetch — `e$(state)` (823–845)

One request does both jobs: it submits the run and returns the leaderboard report.

```js
fetch("/api/leaderboard", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    visitorId: eO(),                       // localStorage UUID
    runId: e.seed,
    savings: e.savings,
    totalRizz: ea.AXES.reduce((t, n) => t + e.rizz[n], 0),
    escaped:
      "yc" === e.endingCode ||
      !!e.exchange.universityId ||
      e.jobs.some((e) => e.job && (0, er.isOutsideGtaAndLoo)(e.job.location)),
    coopJobs: e.jobs.filter((e) => e.job || e.evaluation.startsWith(ed.DESIGN_TEAM_COOP_EVALUATION)).length,
    moneyEvents: e.moneyEvents,
  }),
});
```

Field derivation:

| Field | Derivation |
|---|---|
| `visitorId` | `waterloo-roulette:visitor` UUID. |
| `runId` | The seed. |
| `savings` | Raw `state.savings` (the "score" for the HIGHEST SAVINGS board). |
| `totalRizz` | Sum of all seven axes (the score for HIGHEST TOTAL JOB RIZZ). |
| `escaped` | Got into YC, **or** was matched to an exchange university, **or** held any job whose city (text before the first comma of `location`) is not in the GTA/Waterloo set: Ajax, Aurora, Brampton, Burlington, Cambridge, Kitchener, Markham, Milton, Mississauga, Newmarket, Oakville, Oshawa, Pickering, Richmond Hill, Toronto, Vaughan, Waterloo, Whitby (data.js 442–461). Shown as "escaped the Loo". |
| `coopJobs` | Job-history entries with a real company job, plus design-team co-ops (`evaluation` starts with `"Design team co-op"`). WE Accelerate, research, "Credit" and startup terms are excluded. |
| `moneyEvents` | The ledger (max 64 entries). |

Not sent: name, ending, status, program, choices, log, counter.

Failure: throws `Leaderboard is waiting for its Redis connection.` unless the response is OK and `configured` is truthy (842–843) — so the backend is Redis **[inferred from the message]**.

**When it fires:**

1. Automatically when a run reaches `done`, once per seed per page load (2821–2829): guarded by ref `$` (`$.current !== r.seed`). Result goes to leaderboard state `K`; errors are swallowed. Because the ref is in memory, **reloading a finished run re-POSTs it**; server-side dedupe by `runId` is assumed **[inferred]**.
2. Every time the Leaderboard modal is opened — `tT` (4786–4797): sets modal open, `loading = true`, clears the error, calls `e$(r)` with the **current** state. If the top-bar button is used mid-run (possible once unlocked), the in-progress run's savings/rizz are POSTed under its seed **[read; what the server does with it is unknown]**. On failure the modal shows the error message, or `Leaderboard unavailable.`

**Response shape** (reconstructed from how `tf`, 2334–2506, reads it):

```ts
{
  configured: true,
  city: string,                                   // header label; falls back to "GLOBAL" when no report
  user: { runs: number, bestSavings: number, bestRizz: number,
          bestRun?: { runId: string, savings: number,
                      items: { term, label, amount, balance }[] } },   // = the submitted moneyEvents
  cityStats: { users: number, runs: number },
  cities: { city: string, runs: number }[],
  topSavings: { player: string, city: string, score: number }[],
  topRizz:    { player: string, city: string, score: number }[],
  totals: { playtimeSeconds, users, runs, escapedPlayers, coopJobs },
}
```

`city` and `player` never originate in the client, so they are assigned server-side (IP geolocation and a generated handle **[inferred]**). Each list shows at most 8 rows (2513).

Leaderboard modal copy (for reference): header eyebrow = city or `GLOBAL`, title `Leaderboard`; tiles `YOUR RUNS`, `YOUR BEST SAVINGS`, `YOUR BEST JOB RIZZ`, `<CITY>` with `N players` / `N runs`; ledger heading `YOUR HIGHEST-SAVINGS RUN` + `SEED <runId>`, rows `Balance $X`; columns `CITIES BY RUNS`, `HIGHEST SAVINGS`, `HIGHEST TOTAL JOB RIZZ`; footer `` `${h} hour(s) ${m} minute(s)` `` + ` that could've been spent applying to real jobs`, then `N players · N runs · N escaped the Loo · N co-op jobs`; statuses `LOADING` or the error text.

### 5.2 Playtime heartbeat — `ez()` (811–822) and effect (2775–2786)

```js
body: JSON.stringify({ action: "playtime", visitorId: eO() }), keepalive: true
```

- Every 180 000 ms (`18e4`) while hydrated, and only when `document.visibilityState === "visible"`.
- Expects `{ configured: true, playtimeSeconds: finite number }`, otherwise throws `Playtime unavailable` (swallowed).
- The result patches `K.totals.playtimeSeconds` if a leaderboard report is already loaded.
- The server presumably credits ~180 s per ping to a global counter **[inferred]**.

### 5.3 Other `fetch` calls

- `eR` (2613–2617): `fetch(url)` → `arrayBuffer()` → `decodeAudioData` for `/audio/click3.mp3`, `/audio/click4.mp3`, `/audio/button.mp3`.
- `new Audio("/audio/loo-intro.mp3")` and `new Audio("/audio/slot.mp3")` (media element loads, not fetch).
- Simulation worker: `new Worker(…, { type: "module" })` (5183). Message protocol in section 8.5. It makes no network calls.
- Outside ui.js, in the layout chunk `chunks/0ky20duhfj85k.js`: a page-view beacon `navigator.sendBeacon("/api/analytics", blob)` (fallback `fetch POST keepalive`) with `{ path, query: location.search, referrer, visitor: localStorage["wr_visitor"] }`, skipped on the `/analytics` route; plus Vercel Analytics and Speed Insights. Note `query` would include any `?seed=`.

---

## 6. Helper functions 803–1006 and the stage machine

### 6.1 Helper reference

| Id | Lines | **[name]** | What it does |
|---|---|---|---|
| `eM(job)` | 803 | `rehydrateJob` | `job ? (COMPANIES.find(c => c.id === job.id) ?? job) : null`. |
| `eO()` | 804–810 | `getVisitorId` | Read or create the visitor UUID. |
| `ez()` | 811–822 | `pingPlaytime` | Section 5.2. |
| `e$(state)` | 823–845 | `submitRun` | Section 5.1. |
| `eP(state)` | 846 | `currentTerm` | `timeline[termIndex] ?? null`. |
| `eL(state)` | 847 | `nextTerm` | `timeline[termIndex + 1] ?? null`. |
| `eD(x)` | 848 | `round2` | `Math.round(100 * x) / 100`. |
| `eF(before, after, label, term = currentTerm(before)?.label ?? "PRE-REG")` | 849–859 | `withMoneyEvent` | If `round2(after.savings - before.savings) !== 0`, append `{term, label, amount, balance: round2(after.savings)}` to `after.moneyEvents` and keep the last 64. Otherwise return `after` unchanged. |
| `eG(state)` | 860 | `returnOffers` | `state.returnOffers ?? []`. |
| `eU(state)` | 861 | `isBroke` | `savings < 0 && returnOffers.length === 0`. Forces the "Survival job" ending. |
| `e_(offers, jobId)` | 862 | `withoutOffer` | Filter out one return offer. |
| `eW(state)` | 863 | `workTermNumber` | `timeline.slice(0, termIndex + 2).filter(t => t.kind === "coop").length` — co-op terms up to **and including the next term**. Used as the recruiting model's `workTerm`. |
| `eH(state)` | 864–867 | `marketRizz` (= worker `marketRizz`) | Sort the seven axes descending; `0.55*top1 + 0.25*top2 + 0.2*top3`. |
| `eB(state)` | 868–875 | `profileFor` (= worker `profileFor`) | `{ rizz, completedCoops: jobs.filter(j => j.job).length, leadership: Σ team.rank, average, integrityIncidents: 2 - integrity, workTerm: max(1, eW(state)) }`. |
| `eV` | 876–888 | `workEventSignal` (= worker table) | `{ ship: 2.75, mentor: 1, tests: 0.5, forgotten: -2.5, incident: -5, patent: 4.5, workaholic: 0, cancelled: -0.5, layoff: -0.25, fired: -8, dropout: 4 }`. |
| `eJ(state, job)` | 889 | `resumeScoreFor` | `resumeScore(profileFor(state), job)`; displayed as "job rizz". |
| `eX(n)` | 890–895 | `formatCad` | `Intl.NumberFormat("en-CA", {style:"currency", currency:"CAD", maximumFractionDigits:0})` → `$12,345`. |
| `eY(n)` | 896 | `formatHourly` | `` `${eX(n)} (CAD)/HR` `` → `$45 (CAD)/HR`. |
| `eq(selectivity)` | 897–906 | `interviewDifficulty` | ≤2 `easy interview`, ≤4 `doable interview`, ≤6 `hard interview`, ≤8 `very hard interview`, else `insane interview`. |
| `eK(state, title, detail, tone = "ink")` | 907–911 | `withLog` | Prepend `{id: state.rngCounter, term: currentTerm?.label ?? "PRE-REG", title, detail, tone}` to `log` (max 80) and set `lastResult = {title, detail, tone}`. |
| `eQ` | 912–929 | `enterTerm` | Section 6.2. |
| `eZ` | 930 | `advanceTerm` | `enterTerm({ ...s, termIndex: s.termIndex + 1 })`. |
| `e0` | 931–938 | `afterNonStudyTerm` | Section 6.2. |
| `e1` | 939–950 | `afterStudyTerm` | Section 6.2. |
| `e2()` | 951–954 | `amazonJob` (= worker `amazonJob`) | The `Amazon` / `Software Development Engineer Intern` company entry, else any Amazon entry, else `null`. |
| `e5(state, continuation)` | 955–960 | `afterTermWithYcCheck` | Section 6.2. |
| `e3` | 961–964 | `afterStudyEvent` | Section 6.2. |
| `e6(state)` | 965–982 | `teamShortlist` | Teams not yet joined, sorted by `eC(seed, rngCounter, "team:" + name)` **descending**, first `DESIGN_TEAM_ROLL_SIZE` (20). `TEAMS` entries have no `id`, so the `r.id ?? r.name` fallback always uses the name. |
| `e4(options)` | 983–996 | `withRunOver` | Appends the Truck-kun slice (below). |
| `e8(state)` | 997–1002 | `availableOffers` | Jobs from this round's interviews with outcome `offer`, then return-offer jobs, then the Amazon job if `guaranteedAmazonOffer`; de-duplicated by `job.id` (first occurrence wins). |
| `e7(t, p1, p2)` | 1003–1006 | `bezierCoord` | `3(1-t)²·t·p1 + 3(1-t)·t²·p2 + t³`. Used by the wheel to invert the CSS easing for tick timing (1107–1116, 12 bisection steps). |

Run-over slice, exact code (983–996):

```js
e4 = (e) => {
  let t = e.reduce((e, t) => e + Math.max(0, t.weight), 0);
  return [...e, { id: "run-over", label: "Got run over", short: "GOT RUN OVER",
                  detail: "The run ends immediately.",
                  weight: ((5 / 360) * t) / (1 - 5 / 360), tone: "red" }];
};
```

The weight is solved so the slice is **exactly 5° of the wheel = 1.389%**, whatever the other weights are (= worker `RUN_OVER_CHANCE = 5 / 360`).

### 6.2 Stage-advance functions — exact rules

**`eQ` enterTerm (912–929).** Looks at `timeline[termIndex]`:

| Current term | Result |
|---|---|
| none (past the last term) | `stage = isBroke(state) ? "ending-select" : "grad-applications"` |
| `study` | `stage = "study-grade"` |
| `off` | `stage = "term-event"` |
| `coop`, `pendingJob` set | `stage = "term-event"`, `currentJob = pendingJob`, `pendingJob = null`, `currentWorkEvents = []` |
| `coop`, no `pendingJob` | `stage = "unemployed"`, `currentJob = null` |

**`e0` afterNonStudyTerm (931–938).** If the next term is `coop` → `stage = "recruit-count"` with `recruiting` reset to `{target:0, completed:0, interviews:[], selectedJob:null}`; else `advanceTerm`.

**`e1` afterStudyTerm (939–950).** In order:

1. If `program.id` is in `MATH_MAJOR_PROGRAM_IDS` (`["math","mathbba"]`) **and** `major` is unset **and** the current term label is `"1B"` → `stage = "major"`.
2. Else if the next term is `coop` → `recruit-count` (recruiting reset).
3. Else `advanceTerm`.

**`e5` afterTermWithYcCheck (955–960).**

```js
e.jobs.some((e) => e.job?.location.endsWith(", CA"))
  ? { ...e, stage: "yc-roll", ycContinuation: t }
  : "study" === t ? e1(e) : e0(e)
```

`", CA"` is California (Canadian locations end in province codes such as `", ON"`). Once you have worked one California job, **every subsequent term ends with a YC roll**.

**`e3` afterStudyEvent (961–964).** If `isExchangeEligibleStudyTerm(currentTerm.label)` (labels `2B`, `3A`, `3B`) **and** `average >= 80` **and** `!exchange.applicationRolled` → `stage = "exchange-application"`; else `e5(state, "study")`. The application is rolled at most once per run.

### 6.3 The full state machine

Spin stages resolve in the resolver (3932–4727, other notes); choice stages in the render handlers (4879–5129). Transitions below are **[read]** from those lines.

```
highschool-average ─spin→ applications ─submit→ admission ─spin (repeats per program)→ program-select
  ─accept (+ACCEPTANCE ARC scene)→ sequence ─spin→ scholarship ─spin→ enterTerm (term 0 = 1A)

STUDY TERM
  study-grade ─spin→ 2 consecutive <60 terms ? yc-roll[academic-expulsion]
                   : exchange.pending       ? exchange-event
                   : savings-after-tuition < -10000 ? debt-job   (bank notice the first time)
                   : term-event
  term-event(study) ─→ run-over → done
                     ─→ multi-task → term-event (2 more rolls, auto-spun)
                     ─→ bad-breakup → breakup ─spin→ [X]
                     ─→ join-design-team → design-team ─spin→ [X]
                     ─→ anything else → [X]
       [X] = integrity <= 0 ? done(integrity-expulsion)
           : multiTaskRollsRemaining > 0 ? term-event
           : afterStudyEvent
  debt-job ─spin→ afterStudyEvent
  exchange-event ─spin→ lost-forever ? done : afterStudyEvent
  afterStudyEvent → exchange-application (once; 2B/3A/3B; avg >= 80)
                       ─spin→ matched ? exchange-university ─spin→ afterTermWithYcCheck("study")
                                      : afterTermWithYcCheck("study")
                  → otherwise afterTermWithYcCheck("study")
  afterTermWithYcCheck("study") → yc-roll[study] (if any California job) | afterStudyTerm
  afterStudyTerm → major (math/mathbba at 1B) ─spin→ recruit-count | advanceTerm
                 → recruit-count (next term is co-op) | advanceTerm

RECRUITING (runs at the end of the term before a co-op term)
  recruit-count ─spin→ N > 0 → recruit-job ─spin→ interview ─spin→ (repeat until completed >= target)
                     → then, or if N = 0: any offer / return offer / Amazon guarantee ? offer-select
                                          : advanceTerm → unemployed
  offer-select ─accept→ advanceTerm (pendingJob set) → term-event(coop)

CO-OP TERM
  term-event(coop) ─→ run-over → done
                    ─→ performative-multitask → term-event (2 good-only rolls, auto-spun)
                    ─→ other → multiTaskRollsRemaining > 0 ? term-event : work-eval
  work-eval ─spin→ "dropout" event rolled ? done(full-time)
                 : returnOfferChance(eval) > 0 ? return-offer ─spin→ afterTermWithYcCheck("non-study")
                 : afterTermWithYcCheck("non-study")
  unemployed ─spin→ design-team-coop → design-team-coop ─spin→ afterTermWithYcCheck("non-study")
                  → other → afterTermWithYcCheck("non-study")

OFF TERM
  term-event(off) ─→ run-over → done | afterTermWithYcCheck("non-study")

  afterTermWithYcCheck("non-study") → yc-roll[non-study] | afterNonStudyTerm → recruit-count | advanceTerm

yc-roll ─spin→ yc → done(yc)
             → no-yc → by ycContinuation: academic-expulsion → done
                                          graduation → done("Open to work")
                                          study → afterStudyTerm ; non-study/null → afterNonStudyTerm

GRADUATION (enterTerm past the last term)
  broke (savings < 0, no return offers) → ending-select with only "Survival job"
  otherwise → grad-applications ─submit (1–4 schools)→ grad-admission ─spin per school→ ending-select
  ending-select ─choose→ done | yc-roll[graduation]
```

Details worth preserving:

- In `study-grade` (4105–4141) tuition is charged first (`savings - 3000`, ledger label `Tuition - OSAP`). The bank notice is raised the first time the post-tuition balance is below -10000, even when the stage chosen is `exchange-event` (exchange takes priority over `debt-job`), so its "I have to work this term" text can appear on a term where no debt job follows. Academic expulsion overrides everything and cancels the pending notice.
- The `major` resolver (4459) jumps to `recruit-count` without resetting `recruiting` and without the YC check; harmless because nothing has been recruited before 1B in math sequences.
- `recruit-count` with 0 interviews, and the final `interview`, both advance the term themselves (`eZ({ ...n, pendingJob: null })`, 4475, 4513) when there is nothing to choose from, so the `unemployed` wheel is spun with `termIndex` already on the co-op term.
- `offer-select` has no decline option. Accepting adds +0.5 rizz on the job's axes, removes that job from `returnOffers`, and clears `guaranteedAmazonOffer` **whichever job was picked** (5036–5042). Unaccepted interview offers vanish; other return offers persist to graduation.
- Admission order (`nextAdmissionProgramId`, data.js 58–69): main engineering → (if rejected and a backup exists) backup → selected math programs in click order. When the list is exhausted, a guaranteed `geomatics` offer with `source: "fallback"` is appended **unless a math-faculty program made an offer** — so an engineering admit with no math offer also sees Geomatics (3967–3981).

### 6.4 Timelines (data.js 245–270), for reference

`C*` = co-op, `OFF` = off, otherwise study.

| Id | Terms |
|---|---|
| `SEQ 1` | 1A 1B C1 2A C2 2B C3 3A C4 3B C5 4A C6 4B |
| `SEQ 2` | 1A 1B C1 2A 2B C2 3A C3 3B C4 4A C5 C6 4B |
| `SEQ 3` | 1A 1B OFF 2A C1 2B C2 3A C3 3B C4 4A C5 C6 4B |
| `SEQ 4` | 1A 1B 2A C1 2B C2 3A C3 3B C4 4A C5 C6 4B |
| `STREAM 4` | 1A C1 1B C2 2A C3 2B C4 3A 3B C5 4A C6 4B |
| `STREAM 4D` | 1A C1 1B C2 2A C3 2B C4 3A 3B C5 C6 4A 4B |
| `STREAM 8` | 1A 1B C1 2A C2 2B C3 3A C4 3B C5 C6 4A 4B |
| `STREAM 8S` | 1A 1B C1 2A C2 2B C3 3A C4 3B C5 4A C6 4B |

---

## 7. Stages

### 7.1 Master list

Every `stage` value in the bundle: the 28 keys of the header map (3805–3870) plus one legacy value, `"study-extra"`, that exists only in the save migration (2754).

Mechanic key — **Slot**: reel `tn`, 520 ms, plays `slot.mp3`, rows show `label`. **Wheel**: `tt`, 2200 ms, slices proportional to weight, labels show `short`. **Company wheel**: `tt` with `companyMode`, slices drawn equal regardless of weight. **Choice**: no spin, no RNG.

| # | Stage | Mechanic | Header eyebrow (3805–3870) | Header title |
|---|---|---|---|---|
| 1 | `highschool-average` | Slot | `START` | `High-school average` |
| 2 | `applications` | Choice | `` `${highSchoolAverage ?? "—"}%` `` | `Applications` |
| 3 | `admission` | Wheel | `` `${highSchoolAverage ?? "—"}% · ${program.short ?? "UW"}` `` | `Admission result` |
| 4 | `program-select` | Choice | `OFFERS` | `Choose a program` |
| 5 | `sequence` | Wheel | `program.short ?? "PROGRAM"` | `Co-op sequence` |
| 6 | `scholarship` | Slot | `ADMISSION` | `Entrance scholarship` |
| 7 | `study-grade` | Slot | term label `?? "STUDY"` | `Term average` |
| 8 | `term-event` | Wheel | co-op: `` `${label ?? "CO-OP"} · ${currentJob.company ?? "WORK"}` ``; else label `?? "TERM"` | `Term event` |
| 9 | `breakup` | Wheel | label `?? "STUDY"` | `Bad breakup` |
| 10 | `debt-job` | Wheel | label `?? "STUDY"` | `Minimum-wage job` |
| 11 | `design-team` | Wheel | label `?? "STUDY"` | `Design team` |
| 12 | `design-team-coop` | Wheel | label `?? "CO-OP"` | `Design team co-op` |
| 13 | `major` | Wheel | `MATH` | `Major` |
| 14 | `exchange-application` | Wheel | `` `2B · ${average.toFixed(1)}% CAV` `` (the "2B" is hard-coded even in 3A/3B) | `Exchange match` |
| 15 | `exchange-university` | Company wheel (2200 ms) | `EXCHANGE` | `Host university` |
| 16 | `exchange-event` | Wheel | university `short` `?? "EXCHANGE"` | `Exchange event` |
| 17 | `recruit-count` | Slot | `WATERLOOWORKS` | `Interview count` |
| 18 | `recruit-job` | Company wheel (1800 ms) | `` `${completed + 1} / ${target}` `` | `Employer` |
| 19 | `interview` | Wheel | `selectedJob.company ?? "INTERVIEW"` | `Interview result` |
| 20 | `offer-select` | Choice | `` `${availableOffers.length} OFFERS` `` | `Choose an offer` |
| 21 | `work-eval` | Slot | `CO-OP` | `Evaluation` |
| 22 | `return-offer` | Wheel | `currentJob.company ?? "CO-OP"` | `Return offer` |
| 23 | `yc-roll` | Wheel | `KICKED OUT` (academic-expulsion) / `GRADUATION` (graduation) / `AFTER TERM` | `Y Combinator` |
| 24 | `unemployed` | Wheel | label `?? "CO-OP"` | `Work-term outcome` |
| 25 | `grad-applications` | Choice | `GRADUATION` | `Masters applications` |
| 26 | `grad-admission` | Wheel | school `short` `?? "MASTERS"` | `Admission result` |
| 27 | `ending-select` | Choice | `GRADUATION` | `Choose your next step` |
| 28 | `done` | End screen (`tm`) | `COMPLETE` | `state.ending ?? "Run complete"` |
| — | `study-extra` | legacy, migration only | — | — |

Segment object shape: `{ id, label, short, detail, weight, tone, payload? }`. The option builder is the `useMemo` at 2830–3733 (`e2`); it returns `[]` for the choice stages and `done` (2848–2854).

**Important: `detail` is not displayed anywhere for wheel segments in this build** (section 10.3). It is still listed below verbatim because it is copy.

### 7.2 `highschool-average` — slot (2834–2847)

16 rows, `n = 85..100`:

- id `` `highschool-${n}` ``, label and short `` `${n}%` ``, detail `Final admission average.`, payload `n`
- weight `100 * Math.exp(-0.5 * ((n - 96) / 1.8) ** 2)` (Gaussian, mean 96, sd 1.8)
- tone: `green` if n ≥ 98, `gold` if n ≥ 95, else `cream`

| n | weight | P | tone | | n | weight | P | tone |
|---|---|---|---|---|---|---|---|---|
| 85–88 | ≈0 | ≈0% | cream | | 95 | 85.70 | 19.10% | gold |
| 89 | 0.05 | 0.01% | cream | | 96 | 100.00 | 22.29% | gold |
| 90 | 0.39 | 0.09% | cream | | 97 | 85.70 | 19.10% | gold |
| 91 | 2.11 | 0.47% | cream | | 98 | 53.94 | 12.02% | green |
| 92 | 8.47 | 1.89% | cream | | 99 | 24.94 | 5.56% | green |
| 93 | 24.94 | 5.56% | cream | | 100 | 8.47 | 1.89% | green |
| 94 | 53.94 | 12.02% | cream | | | | | |

(Probabilities are my arithmetic.) No state dependence. → `applications`.

### 7.3 `applications` — choice (UI `tl` 1393–1512; handlers 4884–4953)

Copy: rules `You can only apply to 3 Waterloo programs` / `If you apply to engineering, you can select one backup`; group headings `ENGINEERING`, `BACKUP ENGINEERING`, `MATHEMATICS`; button `SUBMIT APPLICATIONS`. Each option shows `short` in bold plus the name (engineering names have a trailing " Engineering" stripped).

- Engineering options = `PROGRAMS` with `faculty === "ENG"`: SE, CE, EE, TRON, MECH, SYDE, MGMT, NANO, BME.
- Math options = `SELECTABLE_MATH_APPLICATION_IDS` in this order: `mathbba`, `csbba`, `cfm`, `farm`, `cs`, `math`.
- `applicationCount = (main ? 1 : 0) + math.length`, max 3. **The backup does not count** toward the 3.
- Main: click toggles; a new main is accepted if `count < 3` or a main already exists (it replaces it). Clearing main clears the backup. The handler also clears the backup if the same program is chosen as main, but the UI disables that button (1435), so that branch is defensive.
- Backup: only when a main exists; cannot equal main; toggles.
- Valid when `count > 0 && count <= 3 && (!backup || main) && main !== backup`.
- Submit → `stage = "admission"`, `currentProgramId = main ?? math[0]`, `results = []`.

### 7.4 `admission` — wheel (2855–2878)

`a = admissionProbability(highSchoolAverage ?? 96, ADMISSION_MEDIANS[id] ?? 95, isBackup)` where (data.js 43–46)

```js
(avg, median, backup = false) => {
  let a = 1 / (1 + Math.exp(-(avg - median) / 1.25));
  return Math.max(0.01, Math.min(0.99, backup ? 0.4 * a : a));
}
```

Medians: math 95, mathbba 96, farm 95, cfm 95, cs 97, csbba 97, se 99, ce 96, bme 97, tron 97, mech 96, syde 96, ee 97, mgmt 94, nano 94.

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `offer` | `Offer` | `OFFER` | `` `${Math.round(100 * a)}% admission chance.` `` | `100 * a` | green |
| `no-offer` | `No offer` | `NO OFFER` | `` `${Math.round(100 * a)}% admission chance.` `` (same text) | `(1 - a) * 100` | red |

Example (mine): average 96 → 69% at median 95, 31% at 97, 8% at 99 (SE); a backup at its own median is 20%.

### 7.5 `program-select` — choice (UI `ts` 1513–1554; handler 4989–5024)

Chips for each non-fallback result: `` `${short} · OFFER` `` or `` `${short} · NO OFFER` ``. One card per offered program: name, faculty (`MATH` / `ENG` / `ENV`), button `ACCEPT`. Accept → `program` set, `rizz = program.rizz`, `stage = "sequence"`, log `` `Accepted ${name}` `` / `Program selected.` (green), and the ACCEPTANCE ARC scene.

### 7.6 `sequence` — wheel (2879–2957)

Depends on `program.sequence`:

**`"math"`** (cs, math, mathbba, csbba, cfm, farm, geomatics):

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `SEQ 1` | `Sequence 1` | `SEQ 1` | `The classic alternate-every-term conveyor belt.` | 35 | gold |
| `SEQ 2` | `Sequence 2` | `SEQ 2` | `Two study terms together, then the calendar gets weird.` | 30 | cream |
| `SEQ 3` | `Sequence 3` | `SEQ 3` | `An early off term to contemplate the consequences.` | 15 | ink |
| `SEQ 4` | `Sequence 4` | `SEQ 4` | `2A before your first co-op. More courses, same panic.` | 20 | green |

**`"eng4"`** (ee, syde) — a single-slice wheel, forced result:

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `STREAM 4` | `Stream 4` | `S4` | `First co-op in January. Good luck with that résumé.` | 1 | red |

**`"eng8"`** (se, mgmt, nano, bme) — single slice:

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `STREAM 8` | `Stream 8` | `S8` | `Two study terms before your first co-op.` | 1 | green |

**Otherwise** — `"dual-standard"` (ce) and `"dual-double"` (tron, mech):

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `STREAM 4D` if dual-double, else `STREAM 4` | `Stream 4` | `S4` | `You apply for co-op almost immediately.` | 50 | red |
| `STREAM 8` if dual-double, else `STREAM 8S` | `Stream 8` | `S8` | `You get 1B before WaterlooWorks discovers you.` | 50 | green |

→ `scholarship`.

### 7.7 `scholarship` — slot (2958–2966; data.js 1210–1271)

| id | label | short | detail | weight | tone | (effect: savings / all-axis rizz) |
|---|---|---|---|---|---|---|
| `none` | `No scholarship` | `NO $` | `No entrance award.` | 56.9 | cream | 0 / 0 |
| `merit` | `$1,000 Merit` | `$1K` | `Entrance scholarship.` | 22 | gold | +1000 / +0.5 |
| `president` | `President's Scholarship` | `$2K` | `Entrance scholarship.` | 13 | green | +2000 / +1 |
| `faculty` | `Faculty entrance award` | `$10K` | `Faculty entrance award.` | 7 | green | +10000 / +2 |
| `olympiad` | `Olympiad jackpot` | `$50K` | `Olympiad scholarship.` | 1 | gold | +50000 / +4 |
| `schulich` | `Schulich Leader Scholarship` | `$100K` | `+15 job rizz in every category.` | 0.1 | gold | +100000 / +15 |

Weights sum to 100. No state dependence (the high-school average does **not** influence it). → `enterTerm` (1A). Result detail becomes `` `${detail} ${eX(amount)} added to savings.` `` when the amount is non-zero; ledger term is `BEGIN`.

### 7.8 `study-grade` — slot (3015–3057)

101 rows, `t = 0..100`:

- id `` `average-${t}` ``, label and short `` `${t}% · ${tagline}` ``, payload `t`
- weight `Math.max(0.02, 100 * Math.exp(-0.5 * ((t - 76) / 12) ** 2))` (Gaussian, mean 76, sd 12, floor 0.02)

| Range | tagline | detail | tone | P (mine) |
|---|---|---|---|---|
| t < 60 | `Cooked` | `The curve was not a rescue operation.` | red | 8.64% |
| 60–69 | `Barely survived` | `Credit acquired. Knowledge unclear.` | cream | 21.38% |
| 70–79 | `Respectable` | `Perfectly employable academic camouflage.` | ink | 32.75% |
| 80–89 | `Academic weapon` | `You corrected the TA once and survived.` | green | 26.03% |
| 90–100 | `Touch grass, bro` | `Office hours now come to you.` | gold | 11.19% |

Wheel weights do not depend on state; `momentum` is added afterwards in the resolver (`clamp(0, 100, payload + momentum)`, 4102), so the displayed row and the recorded grade can differ.

### 7.9 `term-event` — wheel (3058–3415), three variants by current term kind

#### 7.9.1 Study term (3060–3260)

Base list, in order:

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `clean` | `Nothing reportable` | `NO INCIDENT` | `An ordinary four months.` | 36 | cream |
| `bad-breakup` | `Bad breakup` | `BAD BREAKUP` | `Roll for the fallout.` | 14 | red |
| `roommate` | `Roommate starts DJing` | `3AM SET` | `Sleep quality collapses.` | 7 | red |
| `recommendation` | `Professor offers a reference` | `REFERENCE` | `Doubles masters admit odds. +2 systems/aiData rizz.` | 8 | green |
| `scholarship` | `Upper-year scholarship` | `SCHOLARSHIP` | `Academic performance pays out.` | `Math.max(2, average - 76)` | gold |
| `collab` | `Caught over-collaborating` | `POLICY 71` | `Lose one integrity point.` | 5 | red |
| `exam` | `Caught with unauthorized aid` | `EXAM INCIDENT` | `Lose both integrity points. Expelled.` | 2 | red |
| `concussion` | `Had a concussion` | `CONCUSSION` | `Recovery costs momentum and job rizz across every category.` | 4 | red |
| `failed-course` | `Failed a required course` | `FAILED COURSE` | `The average and every job-rizz category take a hit.` | 4 | red |
| `resume-lie` | `Résumé exaggeration exposed` | `RESUME EXPOSED` | `Every job-rizz category drops sharply.` | 2 | red |
| `contest` | `Won a math contest` | `CONTEST WIN` | `Quant and data rizz increase.` | 5 | green |
| `hack-win` | `Won a hackathon` | `HACKATHON WIN` | `A strong project lands on the résumé.` | 5 | green |
| `burnout` | `Burned out before finals` | `BURNOUT` | `Momentum and every job-rizz category drop.` | 8 | red |
| `goose` | `Attacked by a goose` | `GOOSE` | `No stat change.` | 9 | gold |
| `hackathon` | `Hackathon run` | `HACKATHON` | `Sleep is exchanged for a dubious demo.` | 15 | gold |
| `side-project` | `Ship a side project` | `SHIP IT` | `Twelve users, including your roommates.` | 16 | green |
| `leetcode` | `LeetCode sabbatical` | `200 MEDIUMS` | `Systems rizz rises. Social life delists.` | 12 | ink |
| `nothing` | `Did absolutely nothing` | `BEDROTTING` | `Every job-rizz category drops slightly.` | 13 | cream |
| `join-design-team` | `Join a design team` | `JOIN DESIGN TEAM` | `Roll for which team takes your free time.` | 30 | gold |
| `` `promote:${team.name}` `` | `` `Promoted in ${team.name}` `` | `` `PROMOTED · ${team.name.replace("Waterloo", "W").slice(0, 11)}` `` | `` `${RANKS[rank]} → ${RANKS[rank + 1]}.` `` | 12 each | gold |

State dependence:

- `scholarship` weight grows with the cumulative average: 2 up to 78%, then `average - 76` (e.g. 14 at 90%).
- `join-design-team` is present only if `teamShortlist(state).length > 0` (some team not yet joined — effectively always, with 69 teams).
- One `promote:` slice per **active** team whose rank is below `CAPTAIN`.
- Base total with no teams and average ≤ 78: 109 + 2 + 56 + 30 = **197**.

Then two computed slices are appended (3236–3258):

```js
n = 0 === e.multiTaskRollsRemaining;                 // not already in a multi-task chain
l = sum of base weights;
s = 5 / 360;  o = n ? 25 / 360 : 0;  d = 1 - 5 / 360 - o;
if (n) push({ id: "multi-task", label: "Multi-task", short: "MULTI-TASK",
              detail: "Roll two more term events.", weight: (l * o) / d, tone: "gold" });
push({ id: "run-over", label: "Got run over", short: "GOT RUN OVER",
       detail: "The run ends immediately.", weight: (l * s) / d, tone: "red" });
```

- `multi-task`: exactly 25° = **6.944%** (= worker `MULTI_TASK_CHANCE`); absent during a chain, so chains cannot nest.
- `run-over`: exactly 5° = **1.389%**, present on every study roll including chained ones.

#### 7.9.2 Co-op term (3261–3370)

`t = currentJob?.volatility ?? 3`; `n = jobs.length >= 3 && (currentJob?.prestige ?? 0) >= 6`; `r = multiTaskRollsRemaining > 0`.

Always present ("good" outcomes):

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `ship` | `Shipped a production feature` | `SHIPPED` | `Role rizz rises. Evaluation odds improve.` | 23 | green |
| `mentor` | `Found a great mentor` | `GOOD MANAGER` | `Role rizz rises. Evaluation odds improve slightly.` | 12 | green |
| `tests` | `Wrote tests for four months` | `98% COVERAGE` | `Small systems and evaluation boost.` | 14 | ink |
| `patent` | `Named on a patent or paper` | `BIG IMPACT` | `+6 role rizz, +1× co-op pay, and a large evaluation boost.` | 5 | gold |
| `workaholic` | `Did a lot of overtime` | `WORKAHOLIC` | `Role rizz rises slightly. Overtime adds 1.5× co-op pay on top.` | 10 | green |

Only when **not** in a performative-multitask chain (`!r`):

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `forgotten` | `Manager forgot the intern` | `NO TICKETS` | `Evaluation odds drop.` | 11 | cream |
| `incident` | `Pushed to prod on Friday` | `SEV-1` | `Evaluation odds drop sharply.` | 9 | red |
| `performative-multitask` | `Performative multi-tasking` | `MULTI-TASK` | `Roll twice on only the good work outcomes.` | 7 | gold |
| `cancelled` | `Project cancelled in reorg` | `PROJECT CUT` | `Small evaluation penalty.` | 9 | cream |
| `layoff` | `Laid off mid-term` | `LAID OFF` | `Pay is cut. Evaluation is barely affected.` | `Math.max(2, volatility)` | red |
| `fired` | `Got fired` | `FIRED` | `Evaluation odds collapse.` | `Math.max(1, volatility / 2)` | red |

Only when `n` (third-or-later job-history entry **and** employer prestige ≥ 6) — added in or out of a chain:

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `dropout` | `Full-time conversion` | `DROP OUT` | `Strong evaluation boost. Accept full-time and leave Waterloo.` | 2.5 | gold |

Finally `r ? a : e4(a)`: the 5° `run-over` slice is added **only outside a chain**. `jobs.length` counts every history entry, including WE Accelerate / research / design-team terms.

#### 7.9.3 Off term (3371–3413), wrapped in `e4` (+5° run-over)

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `sleep` | `Slept for four months` | `HIBERNATED` | `Momentum restored.` | 25 | cream |
| `project` | `Built a serious side project` | `SHIP SEASON` | `Product and systems rizz increase.` | 25 | green |
| `hack` | `Won a hackathon` | `HACKATHON WIN` | `Technical rizz increases sharply.` | 8 | gold |
| `travel` | `Travelled` | `OFFLINE` | `Momentum restored.` | 18 | green |
| `doom` | `Doomscrolled the job market` | `DOOMSCROLL` | `Momentum falls.` | 24 | red |

Any other term kind → `[]`.

### 7.10 `breakup` — wheel (3416–3435)

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `ruined-life` | `She ruins your life` | `LIFE RUINED` | `Lose 30% job rizz, one integrity point, and whichever leaves less: half your savings or another $2,000.` | 40 | red |
| `walk-it-off` | `Walk it off` | `WALK IT OFF` | `No lasting damage.` | 60 | green |

### 7.11 `debt-job` — wheel (3436–3444; data.js 1161–1171)

detail for all: `` `${eY(hourlyWage)}. Every job-rizz category drops.` `` → `$18 (CAD)/HR. Every job-rizz category drops.` (17.6 rounds to $18). Tone `red` for all.

| id | label | short | hourlyWage | weight |
|---|---|---|---|---|
| `mcdonalds` | `McDonald's` | `MCDONALD'S` | 17.6 | 42 |
| `wendys` | `Wendy's` | `WENDY'S` | 17.6 | 42 |
| `meat-processing` | `Meat processing plant` | `MEAT PLANT` | 17.6 | 16 |

Purely cosmetic choice: all three pay the same.

### 7.12 `design-team` — wheel (3445–3453)

Up to 20 slices from `teamShortlist(state)` (re-derived with the current counter, so it is a different shortlist from the one used to decide whether `join-design-team` appears): id `` `team:${name}` ``, label `name`, short `name.replace("Waterloo", "W").slice(0, 16)`, detail `Join as a member.`, weight 1, tone gold.

### 7.13 `design-team-coop` — wheel (3454–3467)

Options = the player's active teams if any, otherwise `teamShortlist(state)`. Same id/label/short as above, weight 1.

| Case | detail | tone |
|---|---|---|
| Has active teams | `$0 co-op with your design team.` | green |
| No teams | `Join this team and work a $0 co-op.` | gold |

### 7.14 `major` — wheel (2967–2975; data.js 229–238)

short = `label.replace("Mathematical", "Math").slice(0, 13)`; detail `Plan declaration approved by the wheel.` for all; tone `green` for `datasci`, otherwise `gold`.

| id | label | short (computed) | weight |
|---|---|---|---|
| `stats` | `Statistics` | `Statistics` | 18 |
| `actsci` | `Actuarial Science` | `Actuarial Sci` | 15 |
| `compmath` | `Computational Mathematics` | `Computational` | 15 |
| `pure` | `Pure Mathematics` | `Pure Mathemat` | 13 |
| `co` | `Combinatorics & Optimization` | `Combinatorics` | 12 |
| `amath` | `Applied Math / Scientific ML` | `Applied Math ` | 12 |
| `mathfin` | `Mathematical Finance` | `Math Finance` | 10 |
| `datasci` | `Data Science transfer` | `Data Science ` | 5 |

### 7.15 `exchange-application` — wheel (2976–2996)

`t = exchangeAcceptanceChance(average)` = `avg < 80 ? 0 : avg <= 90 ? 0.25 + (avg - 80) * 0.025 : Math.min(1, 0.5 + (avg - 90) * 0.05)` (25% at 80, 50% at 90, 75% at 95, 100% at 100).

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `exchange` | `Matched for exchange` | `MATCHED` | `` `${(100 * t).toFixed(1)}% chance from CAV.` `` | `100 * t` | green |
| `no-exchange` | `No exchange match` | `NO MATCH` | `` `${(100 * t).toFixed(1)}% chance was not enough.` `` | `(1 - t) * 100` | red |

### 7.16 `exchange-university` — company wheel (2997–3005; data.js 1402–1483)

40 slices: id, label = `name`, short, detail = `country`, weight 1, tone gold. In data order (short — name — country):

TU DELFT — Delft University of Technology — Netherlands; TUM — Technical University of Munich — Germany; KIT — Karlsruhe Institute of Technology — Germany; DTU — Technical University of Denmark — Denmark; SDU — University of Southern Denmark — Denmark; TRINITY — Trinity College Dublin — Ireland; POLIMI — Politecnico di Milano — Italy; NTU — National Taiwan University — Taiwan; NTHU — National Tsing Hua University — Taiwan; SHEFFIELD — University of Sheffield — United Kingdom; UCL — University College London — United Kingdom; KCL — King's College London — United Kingdom; BRISTOL — University of Bristol — United Kingdom; LEEDS — University of Leeds — United Kingdom; SUSSEX — University of Sussex — United Kingdom; MONASH — Monash University — Australia; UNSW — University of New South Wales — Australia; UQ — University of Queensland — Australia; UTS — University of Technology Sydney — Australia; UWA — University of Western Australia — Australia; MACQUARIE — Macquarie University — Australia; NUS — National University of Singapore — Singapore; NTU — Nanyang Technological University — Singapore; SUTD — Singapore University of Technology and Design — Singapore; KAIST — Korea Advanced Institute of Science and Technology — South Korea; POSTECH — Pohang University of Science and Technology — South Korea; SNU — Seoul National University — South Korea; YONSEI — Yonsei University — South Korea; KYOTO — Kyoto University — Japan; SCIENCE TOKYO — Institute of Science Tokyo — Japan; HKU — University of Hong Kong — Hong Kong; CUHK — Chinese University of Hong Kong — Hong Kong; HKUST — Hong Kong University of Science and Technology — Hong Kong; EPFL — École Polytechnique Fédérale de Lausanne — Switzerland; ETH ZURICH — ETH Zurich — Switzerland; LUND — Lund University — Sweden; CHALMERS — Chalmers University of Technology — Sweden; UC3M — Carlos III University of Madrid — Spain; TSINGHUA — Tsinghua University — China; IIT DELHI — Indian Institute of Technology Delhi — India.

### 7.17 `exchange-event` — wheel (3006–3014; data.js 1281–1396)

Weights sum to 105.

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `true-love` | `Found true love` | `TRUE LOVE` | `+4 job rizz in every category.` | 10 | green |
| `lost-forever` | `Got lost forever` | `LOST FOREVER` | `The exchange never ends. Neither does the search party.` | 5 | red |
| `bezos` | `Bumped into Jeff Bezos` | `BEZOS` | `+$30,000 and a guaranteed Amazon offer at the next offer selection.` | 7 | gold |
| `food-poisoning` | `Got food poisoning` | `FOOD POISONING` | `-6 job rizz in every category.` | 10 | red |
| `robbed` | `Got robbed` | `ROBBED` | `Lose 40% of positive savings or $4,000, whichever leaves less.` | 10 | red |
| `missed-flight` | `Missed the flight` | `MISSED FLIGHT` | `-$1,500.` | 8 | red |
| `language` | `Learned the local language` | `LOCAL LANGUAGE` | `Product and systems rizz increase.` | 10 | green |
| `research` | `Joined a research lab` | `RESEARCH LAB` | `AI/data and technical rizz increase.` | 8 | green |
| `backpacking` | `Backpacked across the region` | `BACKPACKING` | `Momentum restored.` | 10 | green |
| `club-night` | `Went out on a Tuesday` | `TUESDAY CLUB` | `Momentum drops.` | 10 | ink |
| `viral` | `Travel post went viral` | `WENT VIRAL` | `+$10,000 and product rizz.` | 7 | gold |
| `ordinary` | `Actually attended class` | `WENT TO CLASS` | `Nothing unusual happened.` | 10 | cream |

No run-over slice on this wheel; `lost-forever` (4.76%) is its own run-ender.

### 7.18 `recruit-count` — slot (3468–3489)

```js
t = 0.25 + 0.5 * Math.max(1, eW(e)) + 0.06 * eH(e);            // Poisson lambda
n = Array.from({ length: 9 }, (_, k) => Math.max(0.15, (Math.exp(-t) * t ** k / k!) * 100));
weight(k) = k < 7 ? n[k] : n[7] + n[8];                          // rows 0..7
```

(= worker `interviewCount`, which draws 0–8 and clamps to 7.) Eight rows, `k = 0..7`:

- id `` `${k}` ``, payload `k`
- label `` `${k} interview${k === 1 ? "" : "s"}` ``, short `` `${k} INTERVIEW${k === 1 ? "" : "S"}` ``
- detail: k = 0 → `WaterlooWorks has reviewed your vibes.`; otherwise `Calendar conflicts are about to multiply.`
- tone: k = 0 `red`; k ≥ 6 `green`; else `gold`

State dependence: more interviews for later work terms and higher market rizz. Samples (mine):

| λ (example) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| 1.95 (1st term, market rizz 20) | 14.2% | 27.7% | 27.0% | 17.6% | 8.6% | 3.3% | 1.1% | 0.5% |
| 2.55 (1st term, 30) | 7.8% | 19.9% | 25.4% | 21.6% | 13.8% | 7.0% | 3.0% | 1.4% |
| 4.15 (3rd term, 40) | 1.6% | 6.7% | 13.9% | 19.3% | 20.0% | 16.6% | 11.5% | 10.3% |
| 6.85 (6th term, 60) | 0.2% | 1.0% | 3.3% | 7.6% | 13.0% | 17.8% | 20.3% | 36.9% |

### 7.19 `recruit-job` — company wheel (3490–3509, display order 3734–3747)

Pool = all 245 `COMPANIES` minus those already interviewed this round. Per company `t`:

- id `t.id`; label `` `${t.company} — ${t.role}` `` (em dash); short `t.company.slice(0, 18)`
- detail `` `${t.location} · ${prestigeBandFor(t.prestige)} company · ${eq(t.selectivity)} · ${Math.round(eJ(e, t))} job rizz` ``
- weight `interviewPoolWeights(profile, pool).get(t.id) ?? companyInterviewWeight(profile, t)`
- tone: prestige ≥ 9 `green`; ≤ 3 `red`; ≥ 7 `gold`; else `ink`

`prestigeBandFor` (data.js 440–441): ≤2 `Trash`, ≤4 `mid`, ≤6 `ok i guess`, ≤8 `ballin'`, else `cracked af`.

Weight model (data.js 1063–1109):

```js
traitFit(rizz, job)   = Σ rizz[a] * job.modifiers[a] / max(1, Σ job.modifiers[a])
resumeScore(p, job)   = traitFit + 3*p.completedCoops + 1.5*p.leadership + 0.2*(p.average - 70) - 2*p.integrityIncidents
companyInterviewWeight = (0.025 + (10 - selectivity)*0.015
                          + 30 / (1 + exp(-(resume + 4*max(1, workTerm) - (18 + 6.5*selectivity)) / 7.5)))
                         * payRarityMultiplier(pay)          // 1 - smoothstep((pay-25)/175) * 0.3
```

`interviewPoolWeights` then rescales the `survivalJob` companies so they hold a fixed share `c` of the wheel: 0.25 for the first work term; `0.16 - l/2` for the second (`l = clamp(±0.04, (mean rizz - 20) * 0.002)`); `max(0.06, 0.16 - (workTerm - 3) * 0.025)` afterwards.

Presentation: the wheel is drawn with **equal slices** and the order is a seeded Fisher–Yates shuffle (`eC(seed, rngCounter, "employer-order:" + i)`), so the real odds are invisible. With more than 24 slices only the 24 labels nearest the pointer are rendered, and separators are drawn every 8th slice when there are more than 32 (1068–1087).

### 7.20 `interview` — wheel (3510–3532)

`n = offerProbability(profile, selectedJob)` = `clamp(0.02, 0.82, 1 / (1 + exp(-(resumeScore + 1.5*max(1, workTerm) - (18 + 3.8*selectivity)) / 7.5)))`.

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `offer` | `Offer` | `OFFER` | `` `${Math.round(100 * n)}% offer chance from role fit, experience, grades, and interview difficulty.` `` | `100 * n` | green |
| `no-offer` | `No offer` | `NO OFFER` | `` `${Math.round(100 * n)}% offer chance was not enough.` `` | `(1 - n) * 100` | red |

Returns `[]` if there is no `selectedJob`.

### 7.21 `offer-select` — choice (UI `tr` 1272–1307; handler 5025–5050)

One card per `availableOffers(state)`: company, role, meta `` `${isReturnOffer ? "RETURN OFFER · " : ""}${location} · ${prestigeBand} · ${interviewDifficulty} · ${eY(pay)}` ``, button `ACCEPT`. Log on accept: `` `Accepted ${company}` `` / `` `${role} · ${location} · ${eY(pay)}.` `` (green).

### 7.22 `work-eval` — slot (3533–3607)

```js
n = clamp(-8, 6,
      Σ eV[event] over currentWorkEvents
      + clamp(-1.25, 1.5, (traitFit(rizz, currentJob ?? COMPANIES[0]) - 20) / 15));
```

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `Outstanding` | `Outstanding` | `OUTSTANDING` | `Reserved for only those few students. Somehow, you.` | `Math.max(0.4, 3 * Math.exp(0.22 * n))` | green |
| `Excellent` | `Excellent` | `EXCELLENT` | `Your supervisor is delighted. Officially.` | `Math.max(1.5, 11 * Math.exp(0.16 * n))` | green |
| `Very Good` | `Very Good` | `VERY GOOD` | `Met all and exceeded some expectations.` | `Math.max(4, 26 * Math.exp(0.08 * n))` | gold |
| `Good` | `Good` | `GOOD` | `Expectations met. Corporate equilibrium achieved.` | `Math.max(8, 28 - 1.2 * Math.abs(n))` | ink |
| `Satisfactory` | `Satisfactory` | `SATISFACTORY` | `Credit granted. Every job-rizz category drops slightly.` | `Math.max(1, 14 * Math.exp(-0.15 * n))` | cream |
| `Marginal` | `Marginal` | `MARGINAL` | `The transcript warning cuts every job-rizz category hard.` | `Math.max(0.4, 5 * Math.exp(-0.23 * n))` | red |
| `Unsatisfactory` | `Unsatisfactory` | `NCR` | `No credit. Every job-rizz category collapses.` | `Math.max(0.15, 1.5 * Math.exp(-0.32 * n))` | red |

Sample distributions (mine), Outstanding → Unsatisfactory:

| n | O | E | VG | G | S | M | U |
|---|---|---|---|---|---|---|---|
| -8 (fired) | 0.4% | 2.3% | 10.3% | 13.8% | 34.9% | 23.7% | 14.6% |
| 0 | 3.4% | 12.4% | 29.4% | 31.6% | 15.8% | 5.6% | 1.7% |
| 2.75 (shipped) | 6.0% | 18.5% | 35.1% | 26.8% | 10.1% | 2.9% | 0.7% |
| 6 (cap) | 10.2% | 26.1% | 38.2% | 18.9% | 5.2% | 1.1% | 0.2% |

### 7.23 `return-offer` — wheel (3629–3650)

`t` = evaluation of the last job (`?? "Good"`); `n = returnOfferChance(t)` = Outstanding 1, Excellent 0.75, Very Good 0.5, Good 0.25, else 0.

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `return` | `Return offer` | `RETURN OFFER` | `` `${Math.round(100 * n)}% chance from ${t}.` `` | `100 * n` | green |
| `no-return` | `No return offer` | `NO RETURN` | `` `${Math.round(100 * n)}% was not enough.` `` | `(1 - n) * 100` | cream |

Only entered when `n > 0` (4574). After an Outstanding evaluation it is a one-slice certainty.

### 7.24 `yc-roll` — wheel (3608–3628)

`t = Math.min(0.06, 0.003 + 0.055 * Math.pow(eH(e) / 100, 2))` (= worker `tryYc`). Market rizz 20 → 0.52%, 40 → 1.18%, 60 → 2.28%, 80 → 3.82%, 100 → 5.80%, cap 6%.

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `yc` | `Got into YC` | `GOT INTO YC` | `` `${(100 * t).toFixed(1)}% chance.` `` | `100 * t` | gold |
| `no-yc` | `Rejected by YC` | `NO YC` | `` `${(100 * t).toFixed(1)}% chance.` `` (same text) | `(1 - t) * 100` | red |

### 7.25 `unemployed` — wheel (3677–3729)

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `wea` | `WE Accelerate` | `WE ACCELERATE` | `A work-integrated learning experience appears.` | 28 | gold |
| `design-team-coop` | `Design team co-op` | `DESIGN TEAM` | `$0 pay. Four months of building useful things.` | 20 | green |
| `ra` | `University research assistant` | `CAMPUS RA` | `A professor has funding and low expectations.` | 22 | green |
| `unrelated` | `Unrelated approved job` | `SURVIVAL JOB` | `Co-op credit, minimal role fit, actual money.` | 25 | cream |
| `startup` | `Friend's startup` | `FOUNDING INTERN` | `Compensation arrives in narrative form.` | 15 | red |
| `nothing` | `Fully unemployed` | `NO CREDIT` | `Four months of refreshing job boards.` | 10 | red |

`wea` is removed unless `canUseWeAccelerate(jobs, eW(state))` = `eW === 1 && no job entry has evaluation "WE Accelerate"` — i.e. first work term only, once. No run-over slice.

### 7.26 `grad-applications` — choice (UI `ta` 1308–1368; handlers 4955–4987)

Copy: rules `` `Apply to up to ${4} masters programs` `` / `A professor reference improves admit odds`; heading `` `MASTERS (${selected}/${4})` ``; button `SUBMIT APPLICATIONS`. Options (short — name — median): MIT — Massachusetts Institute of Technology — 95; STANFORD — Stanford University — 93; CALTECH — California Institute of Technology — 94; BERKELEY — UC Berkeley — 92; HARVARD — Harvard University — 92; CMU — Carnegie Mellon University — 91; CORNELL — Cornell University — 88; COLUMBIA — Columbia University — 87; U OF T — University of Toronto — 85; WATERLOO — University of Waterloo — 84; UBC — University of British Columbia — 82; MCGILL — McGill University — 80; NORTHEASTERN — Northeastern University — 78; ASU — Arizona State University — 76; STATE U — Regional state university — 75.

Must pick 1–4 (no skip). Submit → `grad-admission` for `selectedIds[0]`, in selection order.

### 7.27 `grad-admission` — wheel (3651–3676)

`n = gradAdmissionProbability(average, school.median, professorReference)` = `clamp(0.01, 0.99, clamp(0.01, 0.99, 1 / (1 + exp(-(avg - median) / 3.5))) * (reference ? 2 : 1))`; `0.01` if the school is unknown.

| id | label | short | detail | weight | tone |
|---|---|---|---|---|---|
| `offer` | `Offer` | `OFFER` | `Reference letter on file.` if `professorReference`, else `Admit chance from your CAV.` | `100 * n` | green |
| `no-offer` | `No offer` | `NO OFFER` | `Not this cycle.` | `(1 - n) * 100` | red |

Unlike the other probability wheels, no percentage is shown.

### 7.28 `ending-select` — choice (choices memo `ty` 3758–3804; UI `ti` 1369–1392; handler 5051–5129)

Cards show `title`, `detail`, `meta` and a `CHOOSE` button.

| Condition | id | title | detail | meta |
|---|---|---|---|---|
| `isBroke(state)` — the **only** choice | `survival-job` | `Survival job` | `I have student debt I have to pay off.` | `MCDONALD'S · CREW MEMBER` |
| each masters offer | `` `grad:${schoolId}` `` | school name | `Masters offer` | school short |
| each return offer | `` `return:${job.id}` `` | `` `${company} full-time` `` | `job.role` | `` `${location} · RETURN OFFER · ${eY(1.5 * job.pay)}` `` |
| only if at least one of the two above exists | `yc-roll` | `I'm feeling lucky` | `YC moonshot` | `Y COMBINATOR` |
| otherwise (no offers at all) — the only choice | `unemployed` | `Open to work` | `The degree is complete. The search is not.` | `NO OFFERS · NO RETURNS` |

Outcomes (5058–5126): `yc-roll` → `yc-roll` stage with `ycContinuation: "graduation"`; the others → `status: "graduated"`, `stage: "done"` with `ending` = `Open to work` / `Survival job` / `` `Masters at ${name}` `` / `` `Return offer at ${company}` ``. The YC moonshot is offered only to players who already have an offer, and failing it ends as `Open to work` (`No YC. Back on the market.`), forfeiting those offers.

### 7.29 `done`

No wheel. Renders the end summary `tm` with Restart / statistics / leaderboard callbacks (4857–4863). Entering it triggers the ending scene, the unlock flag and the leaderboard POST (section 8.3).

---

## 8. Main component: state, refs, effects

### 8.1 React state (2542–2575)

| Var / setter | Initial | **[name]** | Controls |
|---|---|---|---|
| `r` / `a` | `ek("campus-preview")` | `state` | The whole game state (section 2). |
| `i` / `l` | `false` | `hydrated` | False until the load effect finishes; gates rendering (loading screen), persistence, pings, all "done" effects. |
| `s` / `o` | `false` | `busy` | True from click until the result is applied (`tw + tj`). Disables the wheel/slot button and choice clicks (4993, 5030, 5055). |
| `d` / `c` | `false` | `spinning` | True only for the animation (`tw`). Drives `ROLLING` / `SPIN` hub text and CSS classes. |
| `u` / `m` | `0` | `rotation` | Cumulative wheel angle in degrees. |
| `h` / `g` | `null` | `slotSpin` | `{stage, target, run}` for the slot reel; `run` is used as a React key to restart the animation. |
| `p` / `b` | `[]` | `sceneQueue` | Narration queue (section 1). |
| `f` / `y` | `false` | `muted` | Mute button label/pressed state. |
| `x` / `v` | `false` | `metaUnlocked` | Leaderboard / Outcomes unlocked. |
| `w` / `j` | `false` | `lockedNoticeOpen` | "Complete a run first" modal. |
| `L` / `D` | `false` | `simulationOpen` | Outcomes (Monte-Carlo) modal. |
| `F` / `G` | `null` | `simulationReport` | Worker result. |
| `U` / `_` | `null` | `simulationError` | Error string. |
| `W` / `H` | `2000` | `simulationRuns` | Slider value (range input 100–10000, step 100). |
| `B` / `V` | `false` | `simulationRunning` | |
| `J` / `X` | `null` | `simulationProgress` | `{completed, total}`; only used when runs > 1000. |
| `Y` / `q` | `false` | `leaderboardOpen` | |
| `K` / `Q` | `null` | `leaderboardReport` | Response of the POST. |
| `Z` / `ee` | `null` | `leaderboardError` | |
| `ev` / `ew` | `false` | `leaderboardLoading` | |

### 8.2 Refs (2552–2565)

| Ref | Holds |
|---|---|
| `E` | The option chosen by the spin in flight. |
| `S` | Intro `Audio` element (`loo-intro.mp3`). |
| `N` | requestAnimationFrame id of the intro fade. |
| `A` | The pending "start intro on first gesture" listener. |
| `R` | Slot `Audio` element (`slot.mp3`). |
| `I` | `AudioContext`. |
| `T` | Decoded tick buffers (`click3`, `click4`). |
| `C` | Decoded `button.mp3` buffer. |
| `k` | Muted flag (ref copy, read by audio callbacks). |
| `M` | Timeout: end of the spin animation. |
| `O` | Timeout: apply the result. |
| `z` | Key of the last ending scene queued. |
| `$` | Seed of the last run auto-submitted to the leaderboard. |
| `P` | The simulation `Worker`. |

### 8.3 Effects, in source order

| Lines | Deps | What it does |
|---|---|---|
| 2650–2692 | `[eA, eE, eO]` (stable) | **Audio setup.** Creates the two `Audio` elements (`preload = "auto"`); tries to autoplay the intro; if that works, creates the AudioContext and loads buffers; if blocked, arms a one-shot `pointerdown`/`keydown` listener that does both. Separately arms a one-shot gesture listener that creates/resumes the AudioContext and loads buffers. Cleanup removes listeners, cancels the fade, pauses and drops both elements, clears buffers, closes the context. |
| 2693–2771 | `[]` | **Hydration / load** (section 4.2). |
| 2772–2774 | `[hydrated, state]` | **Persistence**: write state JSON to localStorage. |
| 2775–2786 | `[hydrated]` | **Playtime heartbeat** every 180 s while visible. |
| 2787–2793 | `[]` | Unmount: clear both spin timers. |
| 2794–2799 | `[]` | Unmount: terminate the worker. |
| 2800–2814 | `[hydrated, endingCode, seed, stage, status]` | **Ending scene** (section 1.6). |
| 2815–2817 | `[hydrated]` | Read the unlock flag from sessionStorage. |
| 2818–2820 | `[hydrated, stage]` | On `done`: write the unlock flag, set `metaUnlocked`. |
| 2821–2829 | `[hydrated, state]` | On `done`: **auto-submit** to the leaderboard once per seed. |
| 3885–3896 | `[eA, tN, eO]` | **Global button sound**: capture-phase `pointerdown` on `document`; if the target is inside a `<button>`, ensure audio is ready and play the button sample. |
| 4734–4745 | `[queue length, spin, busy, bankNoticePending, multiTaskRollsRemaining, stage]` | **Multi-task auto-spin**: in `term-event` with `multiTaskRollsRemaining > 0`, not busy, no scene, no bank notice → `setTimeout(spin, 350)`. |
| 4746–4754 | none (re-registers every render) | **Keyboard**: `Space` spins, unless the event target is an `<input>` or a `<button>`; calls `preventDefault`. This is the only game key binding. |

### 8.4 Memos and callbacks

- `e2` (2830–3733): option builder for the current stage.
- `e7` (3734–3747): display order — shuffled for `recruit-job`, otherwise `e2`.
- `to` (3748): `availableOffers(state)`. `td` (3749–3756): programs with an admission offer. `tc` (3757): Set of return-offer job ids. `ty` (3758–3804): ending choices. `tx` (3805–3870): header for the current stage.
- `tv` (3871): `matchMedia("(prefers-reduced-motion: reduce)").matches`. `tw` (3872) spin duration: 40 ms reduced-motion; 1800 `recruit-job`; 520 slot stages; 2200 otherwise. `tj` (3873) hold before the result is applied: 120 reduced-motion, else 1500.
- `tA` (3897–4733) spin. Guard: not busy, no scene, no bank notice, has options, not `done`. Picks the outcome (3.3), sets `busy` and `spinning`, then either starts the slot (`target = 6 * options.length + index`) or computes the wheel angle:

  ```js
  companyMode = stage is "recruit-job" or "exchange-university";
  seg    = eo(displayOptions, companyMode)[index];
  jitter = eC(seed, rngCounter, `wheel-landing:${stage}:${index}`);
  margin = Math.min(2, 0.12 * seg.size);
  angle  = seg.start + margin + Math.max(0, seg.size - 2 * margin) * jitter;
  a      = (360 - angle) % 360;
  rotation = 360 * Math.ceil((rotation + (companyMode ? 180 : 1332) - a) / 360) + a;
  ```

  So a normal wheel turns at least 1332° (3.7 turns) and a company wheel at least 180°. Timers: `spinning = false` after `tw`; result applied and `busy = false` after `tw + tj`.
- `tR` restart (4.7), `tI` copy link (4.4), `tT` open leaderboard (5.1).

### 8.5 Simulation worker (5169–5216)

- Opened from Outcomes (top bar, when unlocked) or the end screen.
- Run: terminate any previous worker; `running = true`; `progress = runs > 1000 ? {completed: 0, total: runs} : null`; clear report and error; `new Worker(…, { type: "module" })`; `postMessage({ runs })`.
- Messages back: `{ error }` → show it; `{ type: "progress", completed, total }` → progress bar; anything else is the `SimulationReport`. On report or error the worker is terminated. `onerror` → `Simulation failed.`
- Worker side (TS 1178–1210): runs clamped to 1–10 000, default 2000; progress only when runs > 1000, every `max(25, round(runs / 40))` runs with a `setTimeout(0)` yield.
- Close: terminate, clear running/progress, close modal.
- Modal copy seen while tracing: eyebrow `MONTE CARLO` or `` `${runs} RUNS` ``, title `Ending probabilities`, label `RUNS`, button `RUN SIMULATION` / `RUNNING`, pending `` `SIMULATING ${runs} RUNS…` ``.

### 8.6 Top bar (4802–4855)

`<h1>` = title; buttons `Leaderboard`, `Outcomes` (padlock + `locked` class until unlocked), `COPY`, `RESTART`, `MUTE` / `UNMUTE` (aria-label `Mute game audio` / `Unmute game audio`, `aria-pressed`).

---

## 9. Audio design

Five files, two playback paths.

| Sound | File | Path | Trigger |
|---|---|---|---|
| Intro sting | `/audio/loo-intro.mp3` | `HTMLAudioElement` | Page load (autoplay attempt; else first pointer/key gesture) and every RESTART. |
| Slot roll | `/audio/slot.mp3` | `HTMLAudioElement` | Start of a spin on the five slot stages (`tE`, 3874–3877, called at 3908): pause, rewind, play. |
| Wheel tick | `/audio/click3.mp3`, `/audio/click4.mp3` | Web Audio buffer | Each time a slice boundary passes the pointer during a wheel spin (`tS`, 3878–3881): one of the two at random via `Math.random()`. |
| Button click | `/audio/button.mp3` | Web Audio buffer | `pointerdown` on any `<button>` anywhere in the document (`tN`, 3882–3884). |

Details:

- **Intro fade** (`eE`, 2576–2602): restart from 0 at volume 1, then a requestAnimationFrame loop sets `volume = max(0, 1 - currentTime / duration)` — a linear fade to silence across the whole clip — until it ends or is paused, then volume 0.
- **Tick timing** (wheel `tt`, 1091–1128): the visual spin is a CSS transition; in parallel a rAF loop recomputes the angle by inverting the same cubic Bezier (`eA` or `eR`) and counts how many slice start-angles crossed 0° since the last frame. If at least one crossed and ≥ 83.3 ms (`eE`) have passed since the last tick, it fires `onBoundaryCrossing`. So: one tick per boundary, capped at 12 per second, naturally slowing as the wheel decelerates. If buffers are not loaded yet, the tick call loads them instead of playing.
- **Slot stages have no ticks**, only the single `slot.mp3`.
- **The wheel is itself a `<button>`** on normal wheels, so clicking it plays the button click and then ticks. Spinning with Space plays no button click. Multi-task auto-spins play no click either.
- **No sounds** for results, wins, losses, scene changes or endings. No background music beyond the intro sting.
- **Web Audio playback** (`eD`, 2635–2649): returns if muted or no context; if the context is suspended it resumes and retries once running; otherwise creates a `BufferSource` straight to `destination` — **no gain node**, all samples at full volume.
- **Mute** (4837–4851): toggles `k.current`, sets `.muted` on the intro and slot elements, updates the button. Web Audio sounds are skipped by the `k.current` check. Mute is not persisted and survives RESTART only because the component stays mounted.
- **Autoplay policy handling**: the AudioContext is created or resumed on the first gesture and again on every button press.
- **Reduced motion** shortens spins to 40 ms + 120 ms but does not change audio.

---

## 10. Surprises, easter eggs, dead code

1. **Hidden `?seed=` parameter** (4.4). Deterministic, shareable runs, with no UI exposing it. Seeds are shown to the player only in the leaderboard ledger (`SEED <runId>`).
2. **`"campus-preview"` fallback run** (4.5) — a version-mismatched or corrupt save silently drops the player into a fixed shared seed. **[inferred]**, looks like a bug.
3. **Segment `detail` text and the event `log` are never shown.** `state.log` is written on every event (910) but nothing in `ui.js` reads it, and the result strip renders only `lastResult.title` (5156). In components, `.detail` is read only for ending-choice cards (1382) and leaderboard rows (2523). All the wheel `detail` strings and resolver detail strings (e.g. `The degree continues.`, `Plan declared. The radar chart has been recalculated.`) are therefore invisible in this build — probably left over from an earlier UI with a log panel **[inferred]**. They exist only in localStorage.
4. **The employer wheel misrepresents the odds** (7.19): equal slices and shuffled order, weighted outcome.
5. **Leaderboard = submit.** There is no read-only fetch; opening the leaderboard mid-run POSTs the unfinished run (5.1). Finished runs are re-POSTed on reload.
6. **Unlock gate is cosmetic**: a sessionStorage flag (4.6).
7. **Truck-kun slice**: exactly 5° on every study, co-op and off term-event wheel, tying the death ending back to the opening scene. Study multi-task chains can still be run over; co-op "performative" chains cannot and also strip every bad outcome.
8. **Hidden hackathon sub-roll**: `eC(seed, counter, "hack-result")` > 0.94 gives +$1,000 and +8 rizz, > 0.7 gives +4, else +2 (4253–4268) — no second wheel is shown.
9. **YC is gated on California**: a YC roll after every term only once any past job's location ends in `", CA"` (6.2); otherwise YC is reachable only via academic expulsion (`KICKED OUT` last chance) or the graduation moonshot.
10. **Graduation moonshot is a trap for the offer-less and a gamble for the rest**: it appears only if you already hold an offer, and failure discards it (7.28).
11. **Geomatics safety net**: added unless a *math* offer exists, so engineering admits can also pick it (6.3).
12. **Copy quirks**: both `admission` slices and both `yc-roll` slices carry identical detail text; the exchange header always says `2B`; `"Waterloop".replace("Waterloo", "W")` yields the short label `Wp`; debt jobs differ only in name.
13. **Dead or vestigial state**: `teams[].active` is always `true` (nothing sets it false); `exchange.accepted` and `exchange.active` are written but never read anywhere in `ui.js` (grep: only `universityId`, `pending` and `applicationRolled` are read); `PROGRAMS[].weight` is unused by the UI (the worker uses it to auto-pick programs); the initial `average: 78` is overwritten by the first term.
14. **Legacy traces**: `study-extra` stage and singular `currentWorkEvent` in the migration; storage key `v8` vs content version `2026.8`.
15. **UI vs simulation mismatch**: the UI rolls high-school averages 85–100, the worker 90–100 (same Gaussian; the difference is ~0.01% of mass). The worker also auto-picks programs and the best offer, so "Outcomes" statistics describe a bot's policy, not the player's.
16. **Two anonymous ids**: `waterloo-roulette:visitor` (leaderboard) and `wr_visitor` (analytics beacon in the layout chunk). The locally captured `api_analytics.txt` shows `/api/analytics` also answers GET with public view/visitor totals.
17. **No debug hooks.** No `console.*`, no `window.__*` globals, no key combos other than Space, no cheat codes in the ranges I read (grep over lines 560+ for `console.`, `debug`, `window.__` returned nothing).
18. **Log id collisions**: log entries use `rngCounter` as `id`, and choice screens do not advance the counter, so a spin and the choice after it share an id. Harmless because the log is never rendered.

---

## Appendix — things I did not verify

- Server behaviour for `/api/leaderboard` (dedupe, validation, how `city` and `player` are derived, what a mid-run POST does): not visible from the client.
- Resolver effects (3871–4780) are summarised here only as far as needed for transitions; the dedicated notes for that range are authoritative.
- Presentational components other than the ones cited (side panel `tu`, end screen `tm`, radar chart) were not read.
- Probability tables marked "(mine)" are my arithmetic from the quoted formulas, run in Node; they are not in the source.
