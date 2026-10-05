# waterloo.careers — spin resolution, endings, choices, render tree

Source: `pretty/ui.js` lines ~3860–5226 (read completely), plus the helpers at 657–1006 and the
child components at 1007–2535 where needed to resolve references. Cross-checked against
`pretty/data.js` and `chunks/simulation-worker.10_qe2~6gsh~k.ts`.

All line numbers refer to `pretty/ui.js` unless prefixed with `data.js:` or `worker:`.

Conventions used below:

- "READ" = taken directly from code. "INFERRED" = my interpretation; flagged inline.
- `rizz` = 7-axis stat object. Axes (`ea.AXES`, data.js:73):
  `systems, product, aiData, quant, hardware, mechanical, bioNano`.
  "all axes +x" means `eT(rizz, [...AXES], x)`. Every axis is floored at 0, there is no upper cap (732–745).
- Money is formatted with `eX` (890): `Intl.NumberFormat("en-CA", {style:"currency", currency:"CAD", maximumFractionDigits:0})`, e.g. `$3,000`.
  `eY(pay)` (896) = `` `${eX(pay)} (CAD)/HR` ``.

---

## 0. Identifier glossary (needed to read the rest)

### Module aliases (confirmed against data.js export lists and the worker's imports)

| alias | module id | worker import name | contents used here |
|---|---|---|---|
| `et` | 71645 | React | hooks |
| `en` | 66737 | `./admissions-data` | `ADMISSION_MEDIANS`, `admissionProbability`, `nextAdmissionProgramId`, `applicationCount`, `isValidApplicationSelection`, `MAX_WATERLOO_APPLICATIONS`(3), `SELECTABLE_MATH_APPLICATION_IDS` |
| `ea` | 14353 | `./game-data` | `AXES`, `AXIS_LABELS`, `PROGRAMS`, `SEQUENCES`, `TEAMS`, `RANKS`, `MATH_MAJORS`, `MATH_MAJOR_PROGRAM_IDS`, `DESIGN_TEAM_ROLL_SIZE`(20) |
| `er` | 70510 | `./company-data` | `COMPANIES` (aliased `ex`, 723), `isOutsideGtaAndLoo`, `prestigeBandFor` |
| `ei` | 85572 | `./recruiting-model` | `resumeScore`, `offerProbability`, `interviewPoolWeights`, `companyInterviewWeight`, `traitFit`, `specialtyCoopAxes`, `SPECIALTY_COOP_GAIN`(10) |
| `ed` | 95503 | `./work-term-model` | `DESIGN_TEAM_COOP_EVALUATION`("Design team co-op"), `DESIGN_TEAM_COOP_RIZZ_GAIN`(8), `WE_ACCELERATE_EVALUATION`("WE Accelerate"), `canUseWeAccelerate` |
| `ep` | 77204 | `./finance-model` | `TUITION_PER_STUDY_TERM`(3000), `BANK_DEBT_LIMIT`(-10000), `YC_SEED_FUNDING`(500000), `STUDY_EVENT_SAVINGS`, `OFF_TERM_EVENT_SAVINGS`, `UNEMPLOYED_TERM_SAVINGS`, `FORCED_DEBT_JOBS`, `savingsAfterBadBreakup`, `workTermSavings` |
| `eb` | 30995 | `./scholarship-model` | `SCHOLARSHIP_OUTCOMES`, `scholarshipOutcome` |
| `ef` | 95659 | `./exchange-model` | `EXCHANGE_EVENTS`, `EXCHANGE_UNIVERSITIES`, `EXCHANGE_TERM_BASELINE_RIZZ`(2), `exchangeAcceptanceChance`, `isExchangeEligibleStudyTerm`, `savingsAfterRobbery` |
| `ey` | 18272 | `./grad-school-model` | `GRAD_SCHOOLS`, `MAX_GRAD_APPLICATIONS`(4), `gradAdmissionProbability`, `gradSchoolById`, `isValidGradApplicationSelection`, `returnOfferChance` |

### Module-level helpers (657–1006)

| id | line | meaning |
|---|---|---|
| `el` | 662 | integrity-expulsion ending string (see §3) |
| `es(i, k)` | 664 | lose integrity: `Math.max(0, Math.min(2, i) - Math.max(0, k))` |
| `eo(options, equal=false)` | 665 | wheel geometry: per option `{start,end,centre,size}` in degrees, proportional to `max(0,weight)` (or all equal when `equal`) |
| `ec` | 678 | title `"Isekai Waterloo: The Roulette Table that Decides my Jobless Fate!"` |
| `eu/em/eh/eg` | 679–718 | narration scenes: opening / graduation / death / yc |
| `ej` | 726 | Set of SLOT-MACHINE stages: `highschool-average, scholarship, study-grade, recruit-count, work-eval` |
| `eE` | 727 | `1000/12` ms — min gap between wheel tick sounds |
| `eN` | 729 | sessionStorage key `"waterloo-roulette:meta-unlocked"` |
| `eA`, `eR` | 730–731 | bezier control points for wheel easing (normal / company wheel) |
| `eI` | 732 | normalize a rizz object (missing axis → 0) |
| `eT(rizz, axesOrDelta, amount)` | 733 | add rizz (array of axes + amount, or per-axis delta object), floor 0 |
| `eC(seed, counter, label="spin")` | 746 | seeded PRNG → [0,1) (see §1.2) |
| `ek(seed)` | 755 | fresh state |
| `e$` | 823 | POST run to `/api/leaderboard` |
| `eP` / `eL` | 846–847 | current term / next term in `timeline` |
| `eF(before, after, label, term?)` | 849 | append a `moneyEvents` ledger row `{term,label,amount,balance}` if savings changed (keeps last 64). Default `term` = current term label of `before`, or `"PRE-REG"` |
| `eG` | 860 | `returnOffers ?? []` |
| `eU` | 861 | `savings < 0 && returnOffers.length === 0` → "survival job" graduation |
| `e_(offers, id)` | 862 | remove a return offer by job id |
| `eW` | 863 | work-term number = count of `coop` terms in `timeline.slice(0, termIndex + 2)` |
| `eH` | 864 | "market rizz" = `0.55*top1 + 0.25*top2 + 0.2*top3` axis values |
| `eB` | 868 | recruiting profile `{rizz, completedCoops: jobs with a real job, leadership: Σ team rank, average, integrityIncidents: 2-integrity, workTerm: max(1,eW)}` |
| `eV` | 876 | work-event → evaluation signal table |
| `eJ` | 889 | `resumeScore(profile, job)` ("job rizz" number shown to player) |
| `eq(selectivity)` | 897 | `<=2 "easy interview"`, `<=4 "doable interview"`, `<=6 "hard interview"`, `<=8 "very hard interview"`, else `"insane interview"` |
| `eK(state, title, detail, tone="ink")` | 907 | push log entry `{id: state.rngCounter, term: current term label ?? "PRE-REG", title, detail, tone}` (newest first, max 80) and set `lastResult = {title, detail, tone}` |
| `eQ` | 912 | dispatch stage for the CURRENT term (see §2.0) |
| `eZ` | 930 | `eQ({...s, termIndex: s.termIndex + 1})` |
| `e0` | 931 | after a NON-study term: next term coop → `recruit-count` (recruiting reset) else `eZ` |
| `e1` | 939 | after a STUDY term: math/mathbba + no major + term label `"1B"` → `major`; else same as `e0` |
| `e2()` | 951 | the Amazon job object (`"Amazon"` + `"Software Development Engineer Intern"`) |
| `e5(state, kind)` | 955 | after-term YC gate: if any completed job location `endsWith(", CA")` → stage `yc-roll` with `ycContinuation = kind`; else `kind==="study" ? e1 : e0` |
| `e3` | 961 | after study-term events: exchange gate → `exchange-application`, else `e5(state,"study")` |
| `e6` | 965 | sample up to 20 design teams the player is not in (seeded shuffle, label `team:<name>`) |
| `e4` | 983 | append the `run-over` option with weight giving exactly 5/360 probability |
| `e8` | 997 | offers available at offer-select: interview offers + return-offer jobs + guaranteed Amazon, de-duplicated by job id |
| `e7` (module) | 1003 | cubic-bezier component evaluator (used by the wheel's tick-sound loop). NOTE: shadowed inside the main component by a different `e7` |

### Main-component locals (2541–2575, 2830, 3734–3870)

| id | meaning |
|---|---|
| `r` / `a` | game state / setState |
| `i` / `l` | hydrated flag (false → loading screen) |
| `s` / `o` | **busy** (spin in flight, result not yet applied) |
| `d` / `c` | **spinning** (animation running) |
| `u` / `m` | wheel rotation in degrees (cumulative; reset only by RESTART) |
| `h` / `g` | slot state `{stage, target, run}` |
| `p` / `b` | queue of narration scenes (modal shown while non-empty) |
| `f` / `y` | muted |
| `x` / `v` | meta features unlocked (Leaderboard / Outcomes) |
| `w` / `j` | "complete a run first" notice open |
| `L` / `D` | Outcomes (Monte-Carlo) modal open |
| `F/G`, `U/_`, `W/H`, `B/V`, `J/X` | simulation report, error, run count (default 2000), running flag, progress |
| `Y` / `q` | Leaderboard modal open; `K/Q` report; `Z/ee` error; `ev/ew` loading |
| refs | `E` pending winning option; `M` spin-end timer; `O` resolve timer; `S` intro `Audio`; `R` slot `Audio`; `I` AudioContext; `T` click buffers; `C` button buffer; `k` muted ref; `z` last ending-scene key; `$` last seed submitted to leaderboard; `P` simulation Worker; `N` rAF id for intro fade; `A` pending audio-unlock listener |
| `e2` (2830) | wheel/slot option list for the current stage, in canonical order (each `{id,label,short,detail,weight,tone,payload?}`) |
| `e7` (3734) | DISPLAY order of options: equals `e2`, except in `recruit-job` where it is a seeded Fisher–Yates shuffle of `e2` (`eC(seed, rngCounter, "employer-order:<i>")`) |
| `to` (3748) | `e8(r)` — jobs offered at offer-select |
| `td` (3749) | programs with an `"offer"` admission result |
| `tc` (3757) | Set of job ids that are return offers |
| `ty` (3758) | ending-select choices (see §5.5) |
| `tx` (3805) | `{eyebrow,title}` header for the current stage (see §7.3) |

---

## 1. Spin mechanics (3871–3927, 4727–4754)

### 1.1 Timing constants (3871–3873)

```js
tv = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
tw = tv ? 40 : "recruit-job" === r.stage ? 1800 : ej.has(r.stage) ? 520 : 2200,   // animation ms
tj = tv ? 120 : 1500,                                                              // settle delay ms
```

| presentation | stages | spin `tw` | result applied at `tw + tj` |
|---|---|---|---|
| slot machine (`tn`) | `highschool-average, scholarship, study-grade, recruit-count, work-eval` | 520 ms | 2020 ms |
| employer wheel (`tt`, companyMode) | `recruit-job` | 1800 ms | 3300 ms |
| normal wheel (`tt`) incl. `exchange-university` (companyMode but 2200 ms) | everything else | 2200 ms | 3700 ms |
| any, with prefers-reduced-motion | all | 40 ms | 160 ms |

`matchMedia` is evaluated on every render (not subscribed). CSS additionally forces
`transition-duration/animation-duration: 0.01ms !important` on `.wheel`, `.slot-reel.rolling`, the crank arm,
narration and metric animations under `@media (prefers-reduced-motion: reduce)` (styles.css ~2775).

### 1.2 PRNG (746–754) — fully deterministic per seed

```js
eC = (seed, counter, label = "spin") => {
  let r = (FNV-1a 32-bit of `${seed}:${counter}:${label}`, >>> 0) || 1;   // offset 0x811c9dc5, prime 0x1000193 via Math.imul
  return ((r ^= r << 13), (r ^= r >>> 17), ((r ^= r << 5) >>> 0) / 0x100000000);
}
```

One xorshift32 step over a string hash; returns [0,1). There is no stream state: every draw is a pure function of
`(seed, rngCounter, label)`. `rngCounter` increments by exactly 1 each time a spin result is applied (3933), and is
NOT incremented by menu choices. Labels in use:

| label | where | purpose |
|---|---|---|
| `"spin"` (default) | 3903 | which option wins |
| `` `wheel-landing:${stage}:${index}` `` | 3918 | where inside the winning segment the pointer lands (cosmetic) |
| `` `employer-order:${i}` `` | 3740 | shuffle of the employer wheel display order (cosmetic) |
| `` `team:${name}` `` | 977 | which ≤20 design teams appear on a team wheel |
| `"hack-result"` | 4254 | hackathon quality roll (uses the already-incremented counter) |

Consequence: a run is reproducible from the seed plus the player's menu choices; refreshing mid-spin cannot re-roll.

### 1.3 Spin handler `tA` (3897–4733)

Guard (3898) — the spin is ignored when:

```js
if (s || p.length > 0 || r.bankNoticePending || 0 === e2.length || "done" === r.stage) return;
```

i.e. busy, a narration scene is open, the bank notice is open, the stage has no wheel (choice stages return `[]`), or the run is over.

Winner selection (3899–3906) — weighted pick over the canonical list `e2` (not the shuffled display list):

```js
let e = ((opts, u) => {
    let n = u * opts.reduce((a, o) => a + Math.max(0, o.weight), 0);
    for (let t = 0; t < opts.length; t += 1) if ((n -= Math.max(0, opts[t].weight)) <= 0) return t;
    return opts.length - 1;
  })(e2, eC(r.seed, r.rngCounter)),
  t = e2[e],
  n = "recruit-job" === r.stage ? e7.findIndex((o) => o.id === t.id) : e,   // index in DISPLAY order
  i = n >= 0 ? n : e;
```

Then `E.current = t` (pending result), `o(true)` (busy), `c(true)` (spinning).

**Slot stages** (3907–3908): play `/audio/slot.mp3` from the start (`tE`, unless muted), then

```js
g((prev) => ({ stage: r.stage, target: 6 * e7.length + i, run: (prev?.run ?? 0) + 1 }));
```

In `tn` (1220–1271) the reel is the option list repeated 8 times, each row 72px tall, showing `option.label` with a
tone class. `--slot-shift = -72 * max(0, target - 1) px`; the red marker band sits at `top: 72px`, so row `target`
(= 7th copy of the list, winning row `i`) ends under the marker. The reel `<span>` is keyed by `run`, so it remounts
each spin and the CSS animation `slot-roll` (translateY 0 → `--slot-shift`, `cubic-bezier(0.12,0.68,0.11,1) forwards`,
duration `--slot-duration = tw`) restarts; a crank arm rotates -18°→702° in parallel. `targetIndex` is only passed
while `h.stage === r.stage`; otherwise the idle position is row `len` (or `len + floor(0.75*len)` when there are more
than 20 options, e.g. the 101-row grade reel idles at "75%"). All rows are equal height, so the slot does NOT
visualize odds.

**Wheel stages** (3909–3924):

```js
s = "recruit-job" === r.stage || "exchange-university" === r.stage,       // companyMode: equal-size segments
l = eo(e7, s)[i],                                                          // winning segment geometry
d = eC(r.seed, r.rngCounter, `wheel-landing:${r.stage}:${i}`),
e = Math.min(2, 0.12 * l.size),                                            // margin from each segment edge (deg)
t = Math.max(0, l.size - 2 * e),
n = Math.max(0, Math.min(1, d)),
o = l.start + e + t * n,                                                   // landing angle inside the segment
a = (360 - o) % 360,
m(360 * Math.ceil((u + (s ? 180 : 1332) - a) / 360) + a);                  // new cumulative rotation
```

The new rotation is the smallest angle ≡ `a` (mod 360) that is at least `u + 1332°` (3.7 turns; 180° for the two
company-mode wheels, which are giant — `clamp(1100px,130vw,1600px)` — with only the top arc visible). The wheel is a
`conic-gradient(from 0deg, …)` rotated with `transform: rotate(u deg)` and a CSS transition
(`--spin-duration = tw`; easing `cubic-bezier(0.12, 0.68, 0.11, 1)`, company mode `cubic-bezier(0.55, 0, 0.45, 1)`).
The pointer is fixed at the top. On normal wheels segment size is proportional to weight, so the wheel shows true
odds; on company-mode wheels segments are equal while the pick is still weighted. `tt` runs a rAF loop that mirrors
the bezier easing to detect separator crossings and calls `onBoundaryCrossing` (`tS`: random `click3.mp3`/`click4.mp3`
buffer), throttled to ≤12 ticks/s.

**Timers** (3925–3927, 3928–3931, 4727–4732):

```js
M.current = setTimeout(() => { c(false); M.current = null; }, tw);                 // spinning → false
O.current = setTimeout(() => {
  let opt = E.current;
  opt && a((state) => resolve(state, opt));       // the big switch, §2
  E.current = null; o(false); O.current = null;   // unlock
}, tw + tj);
```

So input is locked from click until `tw + tj`; the hub label reads `ROLLING` while spinning, `SPIN` otherwise; wheel
buttons are `disabled` while busy (`aria-label` "Wheel spinning" / "Wheel result pending" / "Spin the wheel"; slot:
"Slot reel rolling" / "Slot result pending" / "Roll the slot reel"; company: "Company wheel spinning" / "Company
result pending" / "Spin the company wheel").

Resolver preamble (3933–3934): `n = {...state, rngCounter: state.rngCounter + 1, lastResult: null}`; `r = option.tone ?? "ink"` is
the log tone for every wheel result.

### 1.4 Other triggers

- **Auto-spin during multi-task** (4734–4745): whenever `stage === "term-event" && multiTaskRollsRemaining > 0` and not
  busy / no scene / no bank notice, `setTimeout(tA, 350)`. The two bonus rolls spin themselves.
- **Space bar** (4746–4754): `keydown` with `code === "Space"` whose target is not an `HTMLInputElement` or
  `HTMLButtonElement` → `preventDefault(); tA()`. (Effect has no dependency array; re-registered every render.)
- **Button sound** (3885–3896): capture-phase `pointerdown` on any `<button>` resumes the AudioContext and plays `/audio/button.mp3`.

---

## 2. Outcome resolution by stage (the switch at 3935–4726)

### 2.0 Stage router helpers (912–964) and overall flow

```
highschool-average (slot) → applications (form) → admission (wheel, once per application rolled)
  → program-select (choice) → sequence (wheel) → scholarship (slot) → eQ → first term

STUDY term:  study-grade (slot)
               ├─ 2nd consecutive term <60 → yc-roll[academic-expulsion]
               ├─ exchange pending        → exchange-event (wheel)            ┐
               ├─ savings < -10,000       → debt-job (wheel)                  ├→ e3
               └─ otherwise               → term-event (wheel; may chain      ┘
                                             multi-task ×2, breakup, design-team)
             e3: [exchange-application → exchange-university] → e5("study")
             e5: [yc-roll if any past job in California] → e1
             e1: [major if math/mathbba at 1B] → recruit-count if next term is co-op, else next term
OFF term:    term-event (wheel) → e5("non-study") → e0 → recruit-count or next term
RECRUITING (still on the term before the co-op):
             recruit-count (slot) → N × [recruit-job (employer wheel) → interview (wheel)]
               → offer-select (choice) if any offer/return offer/Amazon guarantee, else advance to co-op as `unemployed`
CO-OP term with job:    term-event (wheel; performative-multitask → 2 auto-spins) → work-eval (slot)
                          → [return-offer wheel if evaluation ≥ Good] → e5("non-study")
CO-OP term without job: unemployed (wheel) → [design-team-coop wheel] → e5("non-study")
END of timeline (eQ): eU ? ending-select (only "Survival job") : grad-applications (form)
                          → grad-admission × N (wheel) → ending-select (choice) → done | yc-roll[graduation] → done
```

`eQ` (912): current term `study` → `study-grade`; `off` → `term-event`; `coop` → if `pendingJob`: `term-event` with
`currentJob = pendingJob, pendingJob = null, currentWorkEvents = []`, else `unemployed` (`currentJob = null`); no
term left → `eU(state) ? "ending-select" : "grad-applications"`.

Narration scenes: no wheel outcome triggers a scene directly. The only scenes are opening (load/restart), "THE
ACCEPTANCE ARC" (program choice, §5.2) and the three ending scenes chosen by status/endingCode (§3.3).

Log entries: every row below ends with `eK(state, title, detail, tone)`. Tone = the option's tone unless stated.
(IMPORTANT: the log and `lastResult.detail` are stored but never rendered — see §8.)

### 2.1 `highschool-average` (3936–3944) — slot

Options: 16 rows `85%…100%`, weight `100*exp(-0.5*((n-96)/1.8)^2)`, `payload = n`, tone green ≥98 / gold ≥95 / cream.

| outcome | state changes | log title / detail | next |
|---|---|---|---|
| `highschool-<n>` | `highSchoolAverage = n` | `` `${n}% high-school average` `` / `Final admission average.` | `applications` |

### 2.2 `admission` (3945–3995) — wheel, one spin per application

`a = admissions.currentProgramId` (if null: only the counter increments). Probability
`o = admissionProbability(highSchoolAverage ?? 96, ADMISSION_MEDIANS[a] ?? 95, isBackup)` where (data.js:43)
`p = 1/(1+exp(-(avg - median)/1.25))`, backup uses `0.4*p`, clamped to [0.01, 0.99].
Medians: math 95, mathbba 96, farm 95, cfm 95, cs 97, csbba 97, se 99, ce 96, bme 97, tron 97, mech 96, syde 96, ee 97, mgmt 94, nano 94.

| outcome | state changes | log title / detail (tone) |
|---|---|---|
| `offer` | append `{programId, outcome:"offer", probability:o, source}` to `admissions.results` | `` `${program.short ?? id}: Offer` `` / `` `${Math.round(100*o)}% admission chance.` `` (green) |
| `no-offer` | same with `outcome:"no-offer"` | `` `${short}: No offer` `` / `` `${Math.round(100*o)}% admission chance.` `` (red) |

`source` = `"main"` | `"backup"` | `"selected"`. Next program = `nextAdmissionProgramId` (data.js:58):
main → backup only if main was `no-offer` and a backup exists, otherwise first math pick; backup → first math pick;
math pick → next math pick. When there is no next program:

```js
c.some((e) => SELECTABLE_MATH_APPLICATION_IDS.includes(e.programId) && "offer" === e.outcome) ||
  (c = [...c, { programId: "geomatics", outcome: "offer", probability: 1, source: "fallback" }]);
stage = "program-select"; currentProgramId = null;
```

So a guaranteed Geomatics offer (`GEO`, faculty `ENV`, math-style sequence) is appended whenever the player holds no
offer from the six Math-faculty programs — even if they hold an Engineering offer. Otherwise stage stays `admission`
with `currentProgramId = next`.

### 2.3 No-op stages (3996–4002)

`applications, program-select, offer-select, grad-applications, ending-select, done` return the state with only the
counter bump (unreachable in practice: their option list is `[]`, so `tA` returns early).

### 2.4 `sequence` (4003–4012) — wheel

| outcome ids | state changes | log | next |
|---|---|---|---|
| `SEQ 1`…`SEQ 4`, `STREAM 4`, `STREAM 4D`, `STREAM 8`, `STREAM 8S` | `timeline = SEQUENCES[id] ?? SEQUENCES["SEQ 1"]`; `sequenceName = id` except `"STREAM 4D"` is displayed as `"STREAM 4"` (note `"STREAM 8S"` is shown as-is) | option label / option detail | `scholarship` |

Labels/details (2883–2957): `Sequence 1` "The classic alternate-every-term conveyor belt." · `Sequence 2` "Two study
terms together, then the calendar gets weird." · `Sequence 3` "An early off term to contemplate the consequences." ·
`Sequence 4` "2A before your first co-op. More courses, same panic." · eng4-only `Stream 4` "First co-op in January.
Good luck with that résumé." · eng8-only `Stream 8` "Two study terms before your first co-op." · dual programs
`Stream 4` "You apply for co-op almost immediately." / `Stream 8` "You get 1B before WaterlooWorks discovers you."

### 2.5 `scholarship` (4013–4033) — slot

`e = scholarshipOutcome(id)` (data.js:1210–1271).

| id | label | detail | weight | savings | all-axis rizz |
|---|---|---|---|---|---|
| `none` | No scholarship | No entrance award. | 56.9 | 0 | 0 |
| `merit` | $1,000 Merit | Entrance scholarship. | 22 | +1,000 | +0.5 |
| `president` | President's Scholarship | Entrance scholarship. | 13 | +2,000 | +1 |
| `faculty` | Faculty entrance award | Faculty entrance award. | 7 | +10,000 | +2 |
| `olympiad` | Olympiad jackpot | Olympiad scholarship. | 1 | +50,000 | +4 |
| `schulich` | Schulich Leader Scholarship | +15 job rizz in every category. | 0.1 | +100,000 | +15 |

State: `savings += e.savings`; all axes `+= e.allAxisRizz` (if > 0); `scholarshipId = e.id`; then `eQ` (→ `study-grade`
for term 0). Ledger row: label `e.label`, term `"BEGIN"`. Log: label / `` a ? `${detail} ${eX(a)} added to savings.` : detail ``.

### 2.6 `exchange-application` (4034–4045) — wheel

Reached from `e3` when the current study term label is `2B`, `3A` or `3B`, `average >= 80`, and not yet rolled.
Chance `exchangeAcceptanceChance(avg)` (data.js:1486): `<80 → 0`; `80..90 → 0.25 + (avg-80)*0.025`; `>90 → min(1, 0.5 + (avg-90)*0.05)`.

| outcome | state | log title / detail | next |
|---|---|---|---|
| `exchange` | `exchange.applicationRolled = true, accepted = true` | `Matched for exchange` / `` `${(100*t).toFixed(1)}% chance from CAV.` `` (green) | `exchange-university` |
| `no-exchange` | `applicationRolled = true, accepted = false` | `No exchange match` / `` `${(100*t).toFixed(1)}% chance was not enough.` `` (red) | `e5(n,"study")` |

Rolled at most once per run. There is no way to decline.

### 2.7 `exchange-university` (4046–4062) — company-mode wheel, 40 equal options

| outcome | state | log | next |
|---|---|---|---|
| university id | `exchange = {...,accepted:true, universityId, pending:true}` | `university.name` / `university.country` (gold) | `e5(n,"study")` |

The exchange itself happens during the NEXT study term (see 2.9).

### 2.8 `exchange-event` (4063–4098) — wheel (replaces that study term's term-event AND debt-job)

Order of operations: `exchange.active = false`; `savings += e.savings ?? 0`; `momentum += e.momentum ?? 0`;
`guaranteedAmazonOffer ||= e.guaranteesAmazon`; if `robbed`: `savings = Math.min(0.6*s, s - 4000)`; ledger row
(label = event label); all axes `+2` (baseline, always); then `allAxisRizz`; then `axes/axisRizz`.

| id | label | detail (verbatim) | weight | tone | effect beyond the +2 baseline |
|---|---|---|---|---|---|
| `true-love` | Found true love | +4 job rizz in every category. | 10 | green | all axes +4, momentum +5 |
| `lost-forever` | Got lost forever | The exchange never ends. Neither does the search party. | 5 | red | **ends run** (§3) |
| `bezos` | Bumped into Jeff Bezos | +$30,000 and a guaranteed Amazon offer at the next offer selection. | 7 | gold | savings +30,000; `guaranteedAmazonOffer = true` |
| `food-poisoning` | Got food poisoning | -6 job rizz in every category. | 10 | red | all axes -6, momentum -3 |
| `robbed` | Got robbed | Lose 40% of positive savings or $4,000, whichever leaves less. | 10 | red | `savings = min(0.6*s, s-4000)` |
| `missed-flight` | Missed the flight | -$1,500. | 8 | red | savings -1,500 |
| `language` | Learned the local language | Product and systems rizz increase. | 10 | green | product, systems +4 |
| `research` | Joined a research lab | AI/data and technical rizz increase. | 8 | green | aiData, systems, bioNano +5 |
| `backpacking` | Backpacked across the region | Momentum restored. | 10 | green | momentum +4 |
| `club-night` | Went out on a Tuesday | Momentum drops. | 10 | ink | momentum -2 |
| `viral` | Travel post went viral | +$10,000 and product rizz. | 7 | gold | savings +10,000; product +5 |
| `ordinary` | Actually attended class | Nothing unusual happened. | 10 | cream | — |

Log: label / detail. Next: `e3(n)` (→ `e5` since the application was already rolled), or the ending.

### 2.9 `study-grade` (4099–4149) — slot, 101 rows `0%…100%`

Options: weight `max(0.02, 100*exp(-0.5*((g-76)/12)^2))`, `payload = g`; label `` `${g}% · ${tagline}` ``:
`<60` "Cooked" / "The curve was not a rescue operation." (red); `<70` "Barely survived" / "Credit acquired. Knowledge
unclear." (cream); `<80` "Respectable" / "Perfectly employable academic camouflage." (ink); `<90` "Academic weapon" /
"You corrected the TA once and survived." (green); else "Touch grass, bro" / "Office hours now come to you." (gold).

```js
l = clamp(payload + momentum, 0, 100)                       // actual term mark
average = (average * studyTerms + l) / (studyTerms + 1)     // starting 78 is overwritten by the first term
consecutiveLowTerms = l < 60 ? consecutiveLowTerms + 1 : 0
momentum = Math.round(0.25 * momentum)
rizz: all axes += l >= 90 ? 2 : l >= 85 ? 1.5 : l >= 75 ? 1 : l >= 65 ? 0.5 : 0.2
savings -= 3000                                             // ledger label "Tuition - OSAP"
studyTerms += 1
c = savings < -10000 && !bankNoticeShown  → bankNoticeShown = true, bankNoticePending = c   (one-time modal)
stage = exchange.pending ? "exchange-event" : savings < -10000 ? "debt-job" : "term-event"
exchange = {...exchange, pending: false-if-it-was-pending, active: wasPending}
if (consecutiveLowTerms >= 2) → status "expelled", stage "yc-roll", ycContinuation "academic-expulsion", bankNoticePending false
```

Log: `` `${Math.round(l)}% term average` `` / `` `${option.detail} $3,000 tuition paid.` `` (note the title shows the
momentum-adjusted mark, the reel showed the raw one).

### 2.10 `term-event` (4150–4350) — wheel; behaviour depends on the current term kind

**`run-over` (any term kind, 4153–4165):** `status "dead"`, `stage "done"`, `ending "sometimes life happens..."`,
`endingCode "run-over"`. Log: `Got run over` / `The run ends immediately.` (red). Probability exactly 5/360 on study
wheels, co-op wheels (not during performative multi-task) and off-term wheels.

#### Study term (4166–4296)

Sequence: (1) `multi-task` handled first; (2) otherwise `multiTaskRollsRemaining` is decremented if > 0;
(3) `bad-breakup` → sub-wheel; (4) `savings += STUDY_EVENT_SAVINGS[id] ?? 0` with a ledger row labelled with the
event label; (5) per-event effects; (6) `join-design-team` → sub-wheel; (7) integrity check → expulsion;
(8) more multi-task rolls → `term-event`; else `e3(n)`.

| id | label | detail (verbatim) | weight | tone | effects |
|---|---|---|---|---|---|
| `clean` | Nothing reportable | An ordinary four months. | 36 | cream | none |
| `bad-breakup` | Bad breakup | Roll for the fallout. | 14 | red | → stage `breakup` |
| `roommate` | Roommate starts DJing | Sleep quality collapses. | 7 | red | savings -120; momentum -3 |
| `recommendation` | Professor offers a reference | Doubles masters admit odds. +2 systems/aiData rizz. | 8 | green | `professorReference = true`; systems, aiData +2 |
| `scholarship` | Upper-year scholarship | Academic performance pays out. | `max(2, average-76)` | gold | savings `+2500` if avg ≥90, `+1500` if ≥85, else `+750` (ledger label `Upper-year scholarship`); all axes +0.4; log title becomes `` `Upper-year scholarship · ${eX(amount)}` `` |
| `collab` | Caught over-collaborating | Lose one integrity point. | 5 | red | integrity -1; average -2 (floor 0); all axes -3 |
| `exam` | Caught with unauthorized aid | Lose both integrity points. Expelled. | 2 | red | integrity -2 (→0, always expelled); average -6; all axes -7 |
| `concussion` | Had a concussion | Recovery costs momentum and job rizz across every category. | 4 | red | savings -1,200; momentum -8; all axes -5 |
| `failed-course` | Failed a required course | The average and every job-rizz category take a hit. | 4 | red | savings -1,500; average -4; all axes -4 |
| `resume-lie` | Résumé exaggeration exposed | Every job-rizz category drops sharply. | 2 | red | integrity -1 (not mentioned in the text); all axes -9 |
| `contest` | Won a math contest | Quant and data rizz increase. | 5 | green | quant, aiData +3 |
| `hack-win` | Won a hackathon | A strong project lands on the résumé. | 5 | green | savings +1,000; product, systems, aiData +5 |
| `burnout` | Burned out before finals | Momentum and every job-rizz category drop. | 8 | red | momentum -5; all axes -2 |
| `goose` | Attacked by a goose | No stat change. | 9 | gold | savings -250 (despite the text) |
| `hackathon` | Hackathon run | Sleep is exchanged for a dubious demo. | 15 | gold | `x = eC(seed, rngCounter(after increment), "hack-result")`; product, systems, aiData `+8` if x>0.94, `+4` if x>0.7, else `+2`; savings +1,000 if x>0.94 (ledger label `Hackathon prize`); momentum -1 |
| `side-project` | Ship a side project | Twelve users, including your roommates. | 16 | green | savings -120; product, systems +4 |
| `leetcode` | LeetCode sabbatical | Systems rizz rises. Social life delists. | 12 | ink | savings -60; systems, quant +3; momentum -1 |
| `nothing` | Did absolutely nothing | Every job-rizz category drops slightly. | 13 | cream | savings -300; all axes -1 |
| `join-design-team` (only if unjoined teams remain) | Join a design team | Roll for which team takes your free time. | 30 | gold | → stage `design-team` |
| `promote:<team>` (one per active team below top rank) | `` `Promoted in ${team}` `` | `` `${RANKS[rank]} → ${RANKS[rank+1]}.` `` | 12 each | gold | team `rank += 1` (max 3); rizz on the team's axes `+= 3 + newRank` (LEAD +4, DIRECTOR +5, CAPTAIN +6); momentum -1 |
| `multi-task` (only when `multiTaskRollsRemaining === 0`) | Multi-task | Roll two more term events. | 25/360 of wheel | gold | `multiTaskRollsRemaining = 2`, stage stays `term-event` (the two rolls auto-spin and cannot be `multi-task`) |
| `run-over` | Got run over | The run ends immediately. | 5/360 of wheel | red | death (above) |

`RANKS = ["MEMBER","LEAD","DIRECTOR","CAPTAIN"]`. Post-event routing (4279–4295):

```js
n.integrity <= 0
  ? { ...n, status: "expelled", stage: "done", ending: el, endingCode: "integrity-expulsion" }
  : n.multiTaskRollsRemaining > 0 ? { ...n, stage: "term-event" } : e3(n)
```

Log: label (or scholarship variant) / detail.

#### Co-op term (4297–4332)

| id | label | detail (verbatim) | weight | tone | rizz now | eval signal (`eV`) | pay effect at work-eval |
|---|---|---|---|---|---|---|---|
| `ship` | Shipped a production feature | Role rizz rises. Evaluation odds improve. | 23 | green | job axes +3 | +2.75 | — |
| `mentor` | Found a great mentor | Role rizz rises. Evaluation odds improve slightly. | 12 | green | job axes +2 | +1 | — |
| `tests` | Wrote tests for four months | Small systems and evaluation boost. | 14 | ink | systems +1 | +0.5 | — |
| `patent` | Named on a patent or paper | +6 role rizz, +1× co-op pay, and a large evaluation boost. | 5 | gold | job axes +6 | +4.5 | + 1× base |
| `workaholic` | Did a lot of overtime | Role rizz rises slightly. Overtime adds 1.5× co-op pay on top. | 10 | green | job axes +2 | 0 | + 1.5× base |
| `forgotten` | Manager forgot the intern | Evaluation odds drop. | 11 | cream | — | -2.5 | — |
| `incident` | Pushed to prod on Friday | Evaluation odds drop sharply. | 9 | red | — | -5 | — |
| `performative-multitask` | Performative multi-tasking | Roll twice on only the good work outcomes. | 7 | gold | — | — | — |
| `cancelled` | Project cancelled in reorg | Small evaluation penalty. | 9 | cream | — | -0.5 | — |
| `layoff` | Laid off mid-term | Pay is cut. Evaluation is barely affected. | `max(2, job.volatility)` | red | — | -0.25 | base × 0.55 |
| `fired` | Got fired | Evaluation odds collapse. | `max(1, job.volatility/2)` | red | — | -8 | base × 0.35 |
| `dropout` (only if `jobs.length >= 3 && currentJob.prestige >= 6`) | Full-time conversion | Strong evaluation boost. Accept full-time and leave Waterloo. | 2.5 | gold | — | +4 | ends run after work-eval (§3) |
| `run-over` (not during multitask) | Got run over | The run ends immediately. | 5/360 of wheel | red | death | | |

"job axes" = `currentJob.axes ?? ["systems"]`.

- `performative-multitask`: `multiTaskRollsRemaining = 2`, `currentWorkEvents = []`, stage stays `term-event`. While
  rolls remain the wheel contains only `ship, mentor, tests, patent, workaholic` (+ `dropout` if eligible) and no
  `run-over`; both rolls auto-spin.
- Any other event: `currentWorkEvents = multitasking ? [...currentWorkEvents, id] : [id]`; `multiTaskRollsRemaining`
  decremented when multitasking; stage = rolls left > 0 ? `term-event` : `work-eval`.

Log: label / detail.

#### Off term (4333–4348)

| id | label | detail | weight | tone | effects |
|---|---|---|---|---|---|
| `sleep` | Slept for four months | Momentum restored. | 25 | cream | `momentum = 4` (assignment, not addition) |
| `project` | Built a serious side project | Product and systems rizz increase. | 25 | green | savings -250; product, systems +5 |
| `hack` | Won a hackathon | Technical rizz increases sharply. | 8 | gold | savings +1,000; product, systems, aiData +7 |
| `travel` | Travelled | Momentum restored. | 18 | green | savings -2,000; `momentum = 3` |
| `doom` | Doomscrolled the job market | Momentum falls. | 24 | red | savings -450; `momentum = -2` |
| `run-over` | Got run over | The run ends immediately. | 5/360 | red | death |

Ledger label = event label. Next: `e5(n, "non-study")`.

### 2.11 `breakup` (4351–4383) — wheel

| id | label | detail (verbatim) | weight | effects |
|---|---|---|---|---|
| `ruined-life` | She ruins your life | Lose 30% job rizz, one integrity point, and whichever leaves less: half your savings or another $2,000. | 40 | every axis `= max(0, 0.7 * value)`; `savings = Math.min(0.5*s, s - 2000)`; integrity -1; ledger label `She ruins your life` (red) |
| `walk-it-off` | Walk it off | No lasting damage. | 60 | none (green) |

Then the same routing as study events: integrity ≤ 0 → integrity-expulsion ending; else more multi-task rolls →
`term-event`; else `e3(n)`. Log: label / detail.

### 2.12 `debt-job` (4384–4399) — wheel (replaces the study term's term-event when savings < -$10,000 after tuition)

`FORCED_DEBT_JOBS`: `mcdonalds` "McDonald's" (42), `wendys` "Wendy's" (42), `meat-processing` "Meat processing
plant" (16); all `hourlyWage 17.6`. Wheel detail: `` `${eY(17.6)}. Every job-rizz category drops.` `` (red).

| outcome | state | log | next |
|---|---|---|---|
| any | `savings += workTermSavings(17.6)` = +$2,440.53; all axes -2; ledger label `` `Worked at ${label}` `` | `` `Worked at ${label}` `` / `` `${eX(2440.53)} added to savings.` `` → "$2,441 added to savings." | `e3(n)` |

`workTermSavings(pay, fraction=1) = 40 * pay * (52/3) * (0.2 + 0.4 * clamp((pay-25)/175, 0, 1)) * fraction`
(data.js:1201). Examples: $17.60/h → $2,441; $25/h → $3,467; $66/h → $13,440; $200/h → $83,200.

### 2.13 `design-team` (4400–4419) — wheel of up to 20 unjoined teams (`id = "team:<name>"`, equal weights, detail "Join as a member.")

| outcome | state | log | next |
|---|---|---|---|
| `team:<name>` | `teams.push({name, axes, rank:0, active:true})`; team axes +3; `momentum -= 2` if the player already had ≥1 active team | `` `Joined ${name}` `` / `MEMBER rank acquired.` (gold) | more multi-task rolls → `term-event`; else `e3(n)` |

Unknown/duplicate team: no change, no log, same routing.

### 2.14 `design-team-coop` (4420–4453) — wheel

Options: the player's active teams (detail "$0 co-op with your design team.", green), or if none, 20 sampled
unjoined teams (detail "Join this team and work a $0 co-op.", gold).

| outcome | state | log | next |
|---|---|---|---|
| `team:<name>` | join the team if not a member (rank 0, active); all axes +1; team axes + (8-1) = +7 more; `jobs.push({term, job:null, evaluation: "Design team co-op · <name>"})` | `` `${name} co-op` `` / `` `$0 added to savings.${alreadyMember ? "" : " Joined as a member."}` `` | `e5(n,"non-study")` |

### 2.15 `major` (4454–4465) — wheel (only `math` / `mathbba` programs, at term 1B)

`MATH_MAJORS` (data.js:230–237; delta args are `a(systems, product, aiData, quant, hardware, mechanical, bioNano, 0)`):

| id | label | weight | rizz delta |
|---|---|---|---|
| `stats` | Statistics | 18 | aiData +8, quant +6 |
| `actsci` | Actuarial Science | 15 | aiData +2, quant +14 |
| `compmath` | Computational Mathematics | 15 | systems +8, product +2, aiData +8, quant +4 |
| `pure` | Pure Mathematics | 13 | systems +2, quant +4 |
| `co` | Combinatorics & Optimization | 12 | systems +4, aiData +5, quant +10 |
| `amath` | Applied Math / Scientific ML | 12 | systems +2, aiData +10, quant +2, mechanical +4, bioNano +4 |
| `mathfin` | Mathematical Finance | 10 | aiData +2, quant +15 |
| `datasci` | Data Science transfer | 5 | systems +4, product +3, aiData +14, quant +4 |

State: `major = label`; rizz += delta. Log: label / `Plan declared. The radar chart has been recalculated.` (tone
green for `datasci`, gold otherwise). Next: next term co-op → `recruit-count` (without resetting `recruiting`), else `eZ`.

### 2.16 `recruit-count` (4466–4478) — slot

Options `0…7`: label `` `${k} interview${k===1?"":"s"}` ``; detail `WaterlooWorks has reviewed your vibes.` for 0,
otherwise `Calendar conflicts are about to multiply.`; Poisson weights with `λ = 0.25 + 0.5*max(1, workTermNo) + 0.06*marketRizz`,
each `max(0.15, 100*e^-λ λ^k / k!)`, the "7" row also absorbs k = 8; tone red for 0, green ≥ 6, gold otherwise.

| outcome | state | next |
|---|---|---|
| `k > 0` | `recruiting = {...,target:k, completed:0, selectedJob:null}` | `recruit-job` |
| `0`, with a return offer or Amazon guarantee | same with target 0 | `offer-select` |
| `0`, nothing in hand | `eZ({...n, pendingJob:null})` → term advances to the co-op | `unemployed` |

Log: label / detail.

### 2.17 `recruit-job` (4479–4491) — employer wheel (all companies not yet interviewed this round)

| outcome | state | log | next |
|---|---|---|---|
| company job id | `recruiting.selectedJob = job` | `` `${company} interview` `` / `` `${role} · ${location} · ${prestigeBandFor(prestige)} company · ${eq(selectivity)} · ${Math.round(resumeScore)} job rizz` `` | `interview` |

`prestigeBandFor` (data.js:440): `<=2 "Trash"`, `<=4 "mid"`, `<=6 "ok i guess"`, `<=8 "ballin'"`, else `"cracked af"`.
Wheel tone: prestige ≥9 green, ≤3 red, ≥7 gold, else ink.

### 2.18 `interview` (4492–4516) — wheel

Chance `offerProbability(profile, job)` (data.js:1112): `clamp(1/(1+exp(-(resumeScore + 1.5*max(1,workTerm) - (18 + 3.8*selectivity))/7.5)), 0.02, 0.82)`
with `resumeScore = traitFit + 3*completedCoops + 1.5*leadership + 0.2*(average-70) - 2*integrityIncidents`.

| outcome | state | log title / detail |
|---|---|---|
| `offer` | job axes +0.75; push `{job, outcome:"offer"}` to `recruiting.interviews`; `completed += 1` | `` `${company}: Offer` `` / `` `${pct}% offer chance from role fit, experience, grades, and interview difficulty.` `` (green) |
| `no-offer` | job axes +0.2; push with `"no-offer"`; `completed += 1` | `` `${company}: No offer` `` / `` `${pct}% offer chance was not enough.` `` (red) |

Next: `completed < target` → `recruit-job`; otherwise `offer-select` if any offer this round, any return offer, or
the Amazon guarantee; else `eZ({...n, pendingJob:null})` → `unemployed` on the co-op term.

### 2.19 `work-eval` (4517–4581) — slot

Option weights use `signal = clamp(Σ eV[event] + clamp((traitFit(rizz, job) - 20)/15, -1.25, 1.5), -8, 6)` (3533–3606).

| id (also the stored evaluation name) | detail (verbatim) | weight | tone | role boost on job axes | all-axis penalty | return-offer chance |
|---|---|---|---|---|---|---|
| `Outstanding` | Reserved for only those few students. Somehow, you. | `max(0.4, 3*e^(0.22 s))` | green | +6 | — | 100% |
| `Excellent` | Your supervisor is delighted. Officially. | `max(1.5, 11*e^(0.16 s))` | green | +4 | — | 75% |
| `Very Good` | Met all and exceeded some expectations. | `max(4, 26*e^(0.08 s))` | gold | +3 | — | 50% |
| `Good` | Expectations met. Corporate equilibrium achieved. | `max(8, 28 - 1.2*abs(s))` | ink | +1 | — | 25% |
| `Satisfactory` | Credit granted. Every job-rizz category drops slightly. | `max(1, 14*e^(-0.15 s))` | cream | 0 | -2 | 0 |
| `Marginal` | The transcript warning cuts every job-rizz category hard. | `max(0.4, 5*e^(-0.23 s))` | red | 0 | -7 | 0 |
| `Unsatisfactory` (short `NCR`) | No credit. Every job-rizz category collapses. | `max(0.15, 1.5*e^(-0.32 s))` | red | 0 | -12 | 0 |

State changes, in order (all only if `currentJob` exists):

1. `specialtyCoopAxes(job)` (those of `hardware, mechanical, bioNano` where `job.modifiers[axis] >= 8`) each +10.
2. job axes + role boost; then the all-axis penalty.
3. Pay: `fraction = fired ? 0.35 : layoff ? 0.55 : 1`; `base = workTermSavings(job.pay, fraction)`;
   `total = base + (workaholic ? 1.5*base : 0) + (patent ? base : 0)`; `savings += total`; ledger label = company name (or `"Co-op pay"`).
4. `jobs.push({term: label ?? "CO-OP", job, evaluation})`.

Log: `` `${evaluation} performance` `` / `` `${option.detail} ${eX(total)} added to savings.` ``.

Next: `currentWorkEvents.includes("dropout")` → full-time dropout ending (§3); else if return-offer chance > 0 →
`return-offer`; else `e5({...n, currentJob:null}, "non-study")`.

### 2.20 `return-offer` (4582–4595) — wheel

Chance from the evaluation of the last `jobs` entry.

| outcome | state | log title / detail |
|---|---|---|
| `return` | `returnOffers = [...others with a different job id, {job: currentJob}]` | `Return offer` / `` `${pct}% chance from ${evaluation}.` `` (green) |
| `no-return` | — | `No return offer` / `` `${pct}% was not enough.` `` (cream) |

Next (both): `e5({...n, currentJob:null}, "non-study")`. A return offer (a) reappears as an option at every later
offer-select until accepted, and (b) becomes a full-time ending choice at graduation.

### 2.21 `yc-roll` (4596–4644) — wheel

Chance `t = min(0.06, 0.003 + 0.055 * (marketRizz/100)^2)`. Options: `yc` "Got into YC" (gold) / `no-yc` "Rejected by
YC" (red), both with detail `` `${(100*t).toFixed(1)}% chance.` ``.

| outcome | continuation | state | log title / detail | next |
|---|---|---|---|---|
| `yc` | any | `status "dropout"`, `ending "Got into YC"`, `endingCode "yc"`, `savings += 500000` (ledger `YC seed funding`) | `Got into YC` / `$500,000 in seed funding. Moved to San Francisco.` | `done` |
| `no-yc` | `academic-expulsion` | `status "expelled"`, `ending "maybe getting into uni was sheer luck"`, `endingCode "academic-expulsion"` | `Rejected by YC` / `The run ends.` | `done` |
| `no-yc` | `graduation` | `status "graduated"`, `ending "Open to work"`, `endingCode "unemployed"` | `Rejected by YC` / `No YC. Back on the market.` | `done` |
| `no-yc` | `study` | — | `Rejected by YC` / `The degree continues.` | `e1(n)` |
| `no-yc` | `non-study` (default) | — | `Rejected by YC` / `The degree continues.` | `e0(n)` |

When it is rolled: (1) after EVERY term once any completed job's location ends in `", CA"` (California);
(2) on academic expulsion (always, one last chance); (3) when the player picks "I'm feeling lucky" at graduation.

### 2.22 `grad-admission` (4645–4666) — wheel, one per application in selection order

Chance `gradAdmissionProbability(average, median, professorReference)` (data.js:1523):
`clamp(clamp(1/(1+exp(-(avg-median)/3.5)), 0.01, 0.99) * (ref ? 2 : 1), 0.01, 0.99)`.
Schools/medians: MIT 95, Stanford 93, Caltech 94, UC Berkeley 92, Harvard 92, CMU 91, Cornell 88, Columbia 87,
U of T 85, Waterloo 84, UBC 82, McGill 80, Northeastern 78, ASU 76, "Regional state university" (`STATE U`) 75.

| outcome | state | log title / detail |
|---|---|---|
| `offer` | push `{schoolId, outcome, probability}` to `gradSchool.results` | `` `${school.short}: Offer` `` / `Reference letter on file.` if `professorReference` else `Admit chance from your CAV.` (green) |
| `no-offer` | same | `` `${school.short}: No offer` `` / `Not this cycle.` (red) |

Next: next selected school → `grad-admission`; none left → `ending-select`.

### 2.23 `unemployed` (4667–4725) — wheel (co-op term with no job)

| id | label | detail (verbatim) | weight | tone | savings | effects |
|---|---|---|---|---|---|---|
| `wea` (only work term #1, once) | WE Accelerate | A work-integrated learning experience appears. | 28 | gold | 0 | all axes +0.5; job record with evaluation `WE Accelerate` |
| `design-team-coop` | Design team co-op | $0 pay. Four months of building useful things. | 20 | green | 0 | → stage `design-team-coop`; log detail overridden to `Spin for the design team.` |
| `ra` | University research assistant | A professor has funding and low expectations. | 22 | green | +2,000 | aiData, systems +2; job record `Research term` |
| `unrelated` | Unrelated approved job | Co-op credit, minimal role fit, actual money. | 25 | cream | +1,800 | product, systems +0.5; job record `Credit` |
| `startup` | Friend's startup | Compensation arrives in narrative form. | 15 | red | +500 | product +1; job record `Marginal` |
| `nothing` | Fully unemployed | Four months of refreshing job boards. | 10 | red | -1,000 | product +0.1; no job record |

Job records are `{term: label ?? "C", job: null, evaluation}`. Ledger label = option label. Log: label / detail.
Next: `e5(n, "non-study")`. Note there is no `run-over` slice on this wheel.

---

## 3. Endings

### 3.1 Every way a run ends

| # | `status` | `endingCode` | `ending` (h1 on the result card) | trigger | code |
|---|---|---|---|---|---|
| 1 | `dead` | `run-over` | `sometimes life happens...` | `run-over` slice (5/360) on a study, co-op (non-multitask) or off-term event wheel | 4153 |
| 2 | `withdrawn` | `lost-forever` | `Got lost forever` | exchange event `lost-forever` (weight 5 of 105) | 4084 |
| 3 | `expelled` | `integrity-expulsion` | `maybe spend more time locking in, and less time cheating. You're pretty bad at the latter anyways` | integrity reaches 0 via `collab` (-1), `exam` (-2), `resume-lie` (-1) or breakup `ruined-life` (-1). No YC roll | 4281, 4369 |
| 4 | `expelled` | `academic-expulsion` | `maybe getting into uni was sheer luck` | two consecutive study terms with a (momentum-adjusted) mark below 60, then a failed YC roll | 4134, 4617 |
| 5 | `dropout` | `yc` | `Got into YC` | winning any YC roll (after-term, expulsion, or graduation). +$500,000 | 4597 |
| 6 | `dropout` | `full-time` | `` `Dropped out for full-time at ${company ?? "the employer"}` `` | co-op event `dropout` ("Full-time conversion"), applied after that term's evaluation and pay | 4565 |
| 7 | `graduated` | `unemployed` | `Open to work` | (a) graduation with no masters admit and no return offer → sole choice "Open to work"; (b) failed "I'm feeling lucky" YC roll at graduation | 5065, 4630 |
| 8 | `graduated` | `survival-job` | `Survival job` | reaching the end of the timeline with `savings < 0` and no return offers (grad applications are skipped; this is the only choice) | 5078 |
| 9 | `graduated` | `` `grad:${schoolId}` `` | `` `Masters at ${school.name}` `` (fallback `Masters offer`) | choosing a masters admit | 5091 |
| 10 | `graduated` | `` `return:${jobId}` `` | `` `Return offer at ${company}` `` | choosing a return offer at graduation | 5107 |

Quirks: winning YC at graduation still yields `status "dropout"` (so the "Graduated" achievement stays unchecked);
during the expulsion YC roll, `status` is already `"expelled"` while the stage is `yc-roll`.

### 3.2 Log entries written by the choice endings (5058–5126)

| choice id | log title / detail / tone |
|---|---|
| `unemployed` | `Open to work` / `The degree is complete. The search is not.` / red |
| `survival-job` | `Survival job` / `I have student debt I have to pay off.` / red |
| `grad:<id>` | `school.name ?? "Masters"` / `You accept the admit.` / green |
| `return:<id>` | `` `${company} full-time` `` / `` `${role} · ${location}.` `` / green (the offer is also removed from `returnOffers`) |
| `yc-roll` | none — sets `stage "yc-roll"`, `ycContinuation "graduation"`, `lastResult null` |

### 3.3 Ending narration scene (effect at 2800–2814)

When `stage === "done"`: `endingCode === "yc"` → `eg`; else `status === "dead" || endingCode === "run-over"` → `eh`;
else `status === "graduated"` → `em`; else none (expulsions, lost-forever and full-time dropout get no scene).
De-duplicated per `` `${seed}:${status}:${endingCode ?? "none"}` ``.

- `em` — title `THE GRADUATION ARC`, button `SEE MY FATE →`:
  1. "Somehow, I survived Waterloo and walked across the stage with a degree in my hands."
  2. "Every terrible roll, rejected interview, and sleepless term has become lore for my character arc."
  3. "Now I only need the labour market to believe any of this was worth it."
- `eh` — title `TRUCK-KUN RETURNS`, button `SEE MY FATE →`:
  1. "Truck-kun found me again, which feels less like fate and more like targeted harassment."
  2. "My second life at Waterloo ends before I can optimize the résumé bullet."
  3. "Sometimes life happens... to me, apparently."
- `eg` — title `THE FOUNDER ARC`, button `SEE MY FATE →`:
  1. "I got into YC, so apparently dropping out is visionary when investors approve it."
  2. "Aqua is already calling this my genius founder arc instead of academic withdrawal."
  3. "I am moving to California to become someone else's LinkedIn post."
- (for reference) opening `eu` — title = game title, button `BEGIN →`:
  1. "I was a jobless bum on a Leetcode sabbatical when Truck-kun flattened me before I could update LinkedIn."
  2. "Then Goddess Aqua decided I was hot enough for one more chance and dropped me into Waterloo."
  3. "With this roulette table, let me not become unemployed in another world!!"

### 3.4 Result card (`tm`, 1737–1960) — what the ending looks like

- Stamp: `status.toUpperCase()` → `GRADUATED` / `EXPELLED` / `WITHDRAWN` / `DROPOUT` / `DEAD`.
- `<h1>` = `ending`.
- Lede: `` `${program.name} · ${major ? major + " · " : ""}${sequenceName}${exchange ? " · Exchange: " + (university.short ?? "ABROAD") : ""}` ``.
- Grid: `FINAL CAV` `${Math.round(average)}%` · `FINAL SAVINGS` `eX(savings)` (plus small `+500,000$ Seed` when
  `endingCode === "yc"`; the 500k is already included in savings) · `WORK TERMS` `jobs.length` · `INTEGRITY POINTS`
  `n/2` · `SCHOLARSHIP` label (` · $amount` if > 0).
- Achievement checkboxes: `Made it into Cali` (yc or any job ending `", CA"`), `Made it to NYC` (job at
  `"New York, NY"`), `Made it outta the GTA` (yc, or went on exchange, or any job where `isOutsideGtaAndLoo`),
  `Masters admit` (`grad:` ending), `Return full-time` (`return:` ending), `Graduated` (`status === "graduated"`).
- Jobs list: last 6 `jobs` rows: term · `company ?? evaluation` · `` `${role} · ${location}` `` or
  `Alternate work-term outcome`, then ` · ${evaluation}`. For `survival-job` an extra row: `FT` / `McDonald's` /
  `McDonald's crew member`.
- Brand line `Waterloo Roulette`.
- Buttons: `SHARE RESULT` (`SHARING…` while busy), `NEW RUN`, `VIEW OUTCOME STATISTICS`, `LEADERBOARD`.

---

## 4. Interactive game vs. the simulation worker

Identical in both (verified): Gaussian HS-average weights, admission probability/medians, backup 0.4× and only rolled
when the primary is rejected, sequence weights, scholarship table, grade distribution `N(76,12)` + momentum, rizz gain
per mark band, tuition 3000, debt limit -10000 and the $17.60 job with all-axis -2, all study/co-op/off/unemployed
event weights and effects, multi-task 25/360 and run-over 5/360, breakup 40%, hackathon thresholds (0.94 / 0.7),
promotion gain `3 + newRank`, Poisson interview count (cap 7), `interviewPoolWeights`, `offerProbability`, +0.75/+0.2
interview rizz, +0.5 on acceptance, evaluation weight formulas and signal table, specialty +10, role boost/penalty,
pay multipliers (0.35 / 0.55 / +1.5× / +1×), return-offer chances, exchange eligibility/acceptance/events/+2 baseline,
YC formula and the California gate, grad admission formula, survival-job rule.

Differences:

| topic | interactive UI | worker |
|---|---|---|
| Randomness | seeded `eC(seed, rngCounter, label)`; deterministic | `Math.random()` |
| HS average range | 85–100 (16 rows; P(85–89) ≈ 0.013%) | 90–100 (11 values) |
| Applications | player chooses ≤3 (main ENG counts, backup is free, 0–3 math) | always 1 weighted-random ENG primary + 1 ENG backup + 2 distinct weighted math picks |
| Program choice | player picks any offer | highest `programMarketRizz` offer |
| Offer choice | player picks; must accept one | best by prestige, then trait fit, then pay |
| Sub-wheels | `breakup`, `design-team`, `design-team-coop`, `major`, `exchange-university`, `return-offer`, `interview`, `yc-roll` are separate spins (each consumes an `rngCounter`) | resolved inline (`random() < p`, uniform picks) |
| Design team pick | wheel of ≤20 seeded-sampled unjoined teams | uniform over ALL unjoined teams |
| Design-team co-op with no team | wheel of 20 sampled unjoined teams | uniform over ALL `TEAMS` (could in theory re-pick; state has none, so fine) |
| Team `active` flag | exists (always `true` in current code; promotions/co-op filter on it) | no such field |
| Alternate work terms | add `jobs` rows with `job: null` (`WE Accelerate`, `Research term`, `Credit`, `Marginal`, `Design team co-op · X`) | not added to `jobs`; only `coopPlacements` (design-team co-op recorded as pay 0 at "Waterloo, ON") |
| **Full-time conversion eligibility** | `jobs.length >= 3` counts those alternate rows too | `state.jobs.length >= 3` counts real company jobs only |
| WE Accelerate gate | `canUseWeAccelerate(jobs, eW)` = work-term count is 1 and no prior `WE Accelerate` row | `workNumber === 1 && !usedWeAccelerate` |
| Order inside a study term | events → exchange application → YC roll → major | events → major → exchange application → YC roll |
| Off-term run-over | a 5/360 slice on the wheel | separate `random() < 5/360` before the event |
| Grad applications | player picks 1–4 schools | the 4 schools whose median is closest to the average |
| Graduation choice | player picks | uniform among admits + return offers + "yc-roll" |
| Bank notice, narration, log, ledger (`moneyEvents`), leaderboard, audio | UI only | — |
| Reporting | — | merges `unemployed` + `survival-job` as "Open to work"; caps runs at 10,000; progress messages every `max(25, round(runs/40))` runs when runs > 1000 |

---

## 5. Choice (non-wheel) interactions

### 5.1 Applications — `tl` (render 4879–4954; component 1393–1512)

Rules shown: "You can only apply to 3 Waterloo programs" / "If you apply to engineering, you can select one backup".
Three button grids: `ENGINEERING` (main), `BACKUP ENGINEERING`, `MATHEMATICS` (`mathbba, csbba, cfm, farm, cs, math`),
then `SUBMIT APPLICATIONS`.

- `applicationCount = (main ? 1 : 0) + math.length`, max 3. The backup does not count.
- `onChange("math", id)`: toggle; adding only allowed while count < 3.
- `onChange("main", id)`: clicking the current main clears it; otherwise it is set if count < 3 or a main already exists.
- Backup: forced to `null` when there is no main (so deselecting the main also drops the backup); `onChange("backup", id)` toggles. The handler would also clear the backup if it were picked as main, but that button is disabled, so it cannot happen through the UI.
- Disabled: main button if it is the backup or (no main and count ≥ 3); backup buttons if no main or equal to main; math buttons if unselected and count ≥ 3.
- Valid (`isValidApplicationSelection`): `0 < count <= 3 && (!backup || main) && main !== backup`.
- Submit: `stage = "admission"`, `lastResult = null`, `currentProgramId = main ?? math[0] ?? null`, `results = []`.
  Roll order: main → backup (only if main rejected) → math picks in the order selected.

### 5.2 Program choice — `ts` (4988–5024; component 1513–1554)

Shows chips `` `${short} · OFFER` `` / `` `${short} · NO OFFER` `` for every non-fallback result, then one button per
offer (`name`, `faculty`, `ACCEPT`). Ignored while busy. On select:
`program = p`, `rizz = eI(p.rizz)` (replaces rizz), `stage = "sequence"`; log `` `Accepted ${p.name}` `` / `Program selected.` / green;
and queues the scene:

- title `THE ACCEPTANCE ARC`, button `CONTINUE →`
  1. `` `Against all logic, Waterloo actually let me into ${p.name}.` ``
  2. "I can already feel my personality collapsing into a co-op sequence and a radar chart."
  3. "If this degree cannot save me from joblessness, nothing in this world can."

### 5.3 Offer choice — `tr` (5025–5050; component 1272–1307)

One button per job in `e8(state)`: company, role, meta
`` `${isReturnOffer ? "RETURN OFFER · " : ""}${location} · ${prestigeBand} · ${eq(selectivity)} · ${eY(pay)}` ``, `ACCEPT`.
No decline option. On select: job axes +0.5; that job removed from `returnOffers`; `guaranteedAmazonOffer = false`
(consumed whether or not Amazon was picked); `pendingJob = job`; `eZ` → co-op term `term-event` with `currentJob`.
Log: `` `Accepted ${company}` `` / `` `${role} · ${location} · ${eY(pay)}.` `` / green.

### 5.4 Masters applications — `ta` (4955–4987; component 1308–1368)

Rules: "Apply to up to 4 masters programs" / "A professor reference improves admit odds". Heading
`MASTERS (n/4)`; 15 toggle buttons (`short`, `name`); unselected buttons disable at 4. `SUBMIT APPLICATIONS` needs 1–4
valid ids (cannot skip). Submit: `stage = "grad-admission"`, `currentId = selectedIds[0]`, `results = []`, `lastResult = null`.

### 5.5 Ending choice — `ti` (5051–5129; component 1369–1392; choices `ty` at 3758–3804)

Each button: title, detail, meta, `CHOOSE`.

| condition | choices (`id` — title / detail / meta) |
|---|---|
| `savings < 0` and no return offers | `survival-job` — `Survival job` / `I have student debt I have to pay off.` / `MCDONALD'S · CREW MEMBER` |
| at least one admit or return offer | `grad:<id>` — school name / `Masters offer` / school short; `return:<jobId>` — `` `${company} full-time` `` / role / `` `${location} · RETURN OFFER · ${eY(1.5 * pay)}` ``; plus `yc-roll` — `I'm feeling lucky` / `YC moonshot` / `Y COMBINATOR` |
| otherwise | `unemployed` — `Open to work` / `The degree is complete. The search is not.` / `NO OFFERS · NO RETURNS` |

### 5.6 Things that look like choices but are wheels

Design-team selection (`design-team`, `design-team-coop`), exchange (application, host university, event), major,
co-op sequence and return offers are all spins. The player cannot decline an exchange, a team, or a co-op offer round.

---

## 6. The "COPY" button (`tI`, 4774–4785)

There is no result-text template. COPY writes only the bare game URL (no seed, no query string) and flashes a status:

```js
let e = `${window.location.origin}${window.location.pathname}`;
await navigator.clipboard.writeText(e);
setState((s) => ({ ...s, lastResult: {
  title: "Game link copied",
  detail: "The generic game link is ready to share. Each visitor gets a fresh run.",
  tone: "green",
}}));
```

Clipboard content, exactly: `https://waterloo.careers/` (origin + pathname). The result strip then shows
`Game link copied` on a green strip. No try/catch: a rejected clipboard write is an unhandled rejection and nothing changes.

The only result-text template is in `SHARE RESULT` on the end card (1761–1791): a PNG of the card (html-to-image,
`pixelRatio = min(2, devicePixelRatio || 2)`, background `#1d1d19`, file `waterloo-roulette-result.png`) shared via
`navigator.share` with `title: "Waterloo Roulette"` and

```
Waterloo Roulette — ${ending} · ${eX(savings)}
```

(falls back to `navigator.share({title, text, url: location.href})` without the file, then to downloading the PNG).

---

## 7. Render tree (4798–5220)

### 7.1 Skeleton

```
!hydrated → <main class="loading">ENTERING ANOTHER WORLD…</main>

<main class="game-shell">
  <header class="topbar">
    <div class="brand-block"><h1>{title}</h1></div>
    <div class="top-actions">
      <div class="top-meta-links">
        <button class="top-meta-link[ locked]">[lock svg e9] Leaderboard</button>
        <button class="top-meta-link[ locked]">[lock svg e9] Outcomes</button>
      </div>
      <button>COPY</button> <button>RESTART</button> <button class="active"?>MUTE | UNMUTE</button>
    </div>
  </header>
  <te state/>                                   // timeline strip
  stage === "done"
    ? <tm state onRestart=tR onViewStatistics={() => D(true)} onViewLeaderboard=tT/>
    : <div class="game-grid">
        <section class="roulette-panel">
          <div class="prompt-block"><div><span>{tx.eyebrow}</span><h2>{tx.title}</h2></div></div>
          { applications → <tl/> | grad-applications → <ta/> | program-select → <ts/> | offer-select → <tr/>
            | ending-select → <ti/> | slot stage → <tn/> | else → <tt/> }
          <div class="result-strip {lastResult.tone ?? 'cream'}" aria-live="polite">
            <b>{lastResult ? lastResult.title : "Click above to spin"}</b>
          </div>
        </section>
        <tu state/>                             // dossier sidebar
      </div>
  {p[0] && <th scene={p[0]} onContinue={() => b(q => q.slice(1))}/>}
  {bankNoticePending && <tg onContinue={() => set bankNoticePending false}/>}
  {w && <tp onContinue={() => j(false)}/>}
  {L && <tb …/>}                                // Outcomes / Monte-Carlo modal
  {Y && <tf report=K error=Z loading=ev onClose={() => q(false)}/>}   // Leaderboard modal
</main>
```

### 7.2 Top bar

| button | behaviour |
|---|---|
| **Leaderboard** | Locked until a run has been completed this browser session (`title` "Complete a run to unlock Leaderboard" vs "Leaderboard"). Locked click → opens `tp`. Unlocked → `tT` (4786): open modal, set loading, POST the CURRENT run via `e$(r)` and show the response. Error text is `error.message` (`e$` throws "Leaderboard is waiting for its Redis connection." when the response is not ok / not `configured`) or "Leaderboard unavailable." |
| **Outcomes** | Same lock (`title` "Complete a run to unlock Outcomes"). Unlocked → opens the Monte-Carlo modal `tb` |
| **COPY** | §6 |
| **RESTART** (`tR`, 4755) | Replays the intro jingle; new seed = two `crypto.getRandomValues` Uint32s in base 36 joined by `-`; `history.replaceState` to the bare pathname (drops `?seed=`); clears both timers, pending option, busy/spinning, rotation → 0, slot state → null, ending-scene key; scene queue = `[opening]`; state = `ek(seed)`. No confirmation |
| **MUTE / UNMUTE** | Toggles `f`; sets `k.current` and `.muted` on the intro and slot `Audio` elements (WebAudio click/button buffers check `k.current`). `aria-pressed`, `aria-label` "Mute game audio" / "Unmute game audio", class `active` when muted. Not persisted |

### 7.3 Prompt header `tx` (3805–3870)

| stage | eyebrow | title |
|---|---|---|
| `highschool-average` | `START` | High-school average |
| `applications` | `` `${highSchoolAverage ?? "—"}%` `` | Applications |
| `admission` | `` `${hs}% · ${currentProgram.short ?? "UW"}` `` | Admission result |
| `program-select` | `OFFERS` | Choose a program |
| `sequence` | `program.short ?? "PROGRAM"` | Co-op sequence |
| `scholarship` | `ADMISSION` | Entrance scholarship |
| `exchange-application` | `` `2B · ${average.toFixed(1)}% CAV` `` (hard-coded "2B" even in 3A/3B) | Exchange match |
| `exchange-university` | `EXCHANGE` | Host university |
| `exchange-event` | `university.short ?? "EXCHANGE"` | Exchange event |
| `study-grade` | `termLabel ?? "STUDY"` | Term average |
| `term-event` | co-op: `` `${termLabel ?? "CO-OP"} · ${currentJob.company ?? "WORK"}` ``; else `termLabel ?? "TERM"` | Term event |
| `breakup` | `termLabel ?? "STUDY"` | Bad breakup |
| `debt-job` | `termLabel ?? "STUDY"` | Minimum-wage job |
| `design-team` | `termLabel ?? "STUDY"` | Design team |
| `design-team-coop` | `termLabel ?? "CO-OP"` | Design team co-op |
| `major` | `MATH` | Major |
| `recruit-count` | `WATERLOOWORKS` | Interview count |
| `recruit-job` | `` `${completed + 1} / ${target}` `` | Employer |
| `interview` | `selectedJob.company ?? "INTERVIEW"` | Interview result |
| `offer-select` | `` `${n} OFFERS` `` | Choose an offer |
| `work-eval` | `CO-OP` | Evaluation |
| `return-offer` | `currentJob.company ?? "CO-OP"` | Return offer |
| `yc-roll` | `KICKED OUT` (academic-expulsion) / `GRADUATION` / `AFTER TERM` | Y Combinator |
| `unemployed` | `termLabel ?? "CO-OP"` | Work-term outcome |
| `grad-applications` | `GRADUATION` | Masters applications |
| `grad-admission` | `school.short ?? "MASTERS"` | Admission result |
| `ending-select` | `GRADUATION` | Choose your next step |
| `done` | `COMPLETE` | `ending ?? "Run complete"` (never displayed: the panel is replaced by `tm`) |

### 7.4 Child components and props

| component | lines | where | props |
|---|---|---|---|
| `e9` | 1007 | inside locked meta buttons | lock icon SVG |
| `te` | 1032 | under the top bar, always | `state`. Empty placeholder (`.timeline.empty`) until a sequence exists; then one `.timeline-node {kind} [current] [past]` per term with the label and `STUDY` / `WORK` / `OFF` |
| `tt` (wheel) | 1055 | non-slot wheel stages | `options=e7, rotation=u, spinning=d, busy=s, companyMode=(recruit-job or exchange-university), duration=tw, onSpin=tA, onBoundaryCrossing=tS` |
| `tn` (slot) | 1220 | slot stages | `options=e7, targetIndex=(h.stage===stage ? h.target : null), run=h.run ?? 0, spinning=d, busy=s, duration=tw, onSpin=tA` |
| `tl` | 1393 | `applications` | `mainEngineeringId, backupEngineeringId, selectedMathProgramIds, onChange(kind,id), onSubmit` |
| `ts` | 1513 | `program-select` | `programs=td, results=admissions.results, onSelect(id)` |
| `tr` | 1272 | `offer-select` | `jobs=to, returnOfferIds=tc, onSelect(id)` |
| `ta` | 1308 | `grad-applications` | `selectedIds, onToggle(id), onSubmit` |
| `ti` | 1369 | `ending-select` | `choices=ty, onSelect(id)` |
| `tu` (dossier) | 1649 | right column while playing | `state`: program short / major-or-program name / sequence stamp; radar chart `tc` (values capped at 100 for drawing, labels show rounded values); stats `HS AVERAGE`→`AVERAGE`, `INTEGRITY n/2`, `SAVINGS` (animated `to`), `CO-OPS` (`jobs.length`); `TEAM` (first active team + rank) and `BEST CO-OP · <band>` (highest-prestige real job) |
| `tm` | 1737 | replaces the grid when `done` | §3.4 |
| `th` | 1961 | modal while `p.length > 0` | `scene, onContinue` — speaker tag `ME`, title, lines, autofocused button `` `${continueLabel} →` `` |
| `tg` | 1986 | modal while `bankNoticePending` | text: "I’m below the bank’s borrowing limit, so they won’t lend me any more money and I have to work this term." + `OK` |
| `tp` | 2004 | modal when a locked meta button is clicked | text: "Complete a run first to see the leaderboard and simulate outcome statistics with Monte Carlo." + `OK` |
| `tb` | 2022 | Outcomes modal | `report=F, error=U, runs=W, running=B, progress=J, onRunsChange=H, onRun, onClose`. Header `MONTE CARLO` / `N RUNS`, title "Ending probabilities"; range input 100–10000 step 100 (default 2000); `RUN SIMULATION` / `RUNNING`; shows savings avg/median/max/min, design-team points, 15 outcome percentages, scholarship and program distributions, average wage and locations per co-op |
| `tf` | 2334 | Leaderboard modal | `report=K, error=Z, loading=ev, onClose` |

`onRun` (5177–5211): terminate any previous worker; reset report/error; progress shown only when runs > 1000; create
the worker with `e.r(52990)(Worker, {type:"module"})` (INFERRED: Turbopack's worker-URL loader for the simulation
chunk); `postMessage({runs: W})`; messages are `{error}`, `{type:"progress", completed, total}` or the final report.
`onClose` terminates the worker.

Spin input is blocked while the narration or bank-notice modals are open (guard in `tA`), but NOT by the locked
notice, Outcomes or Leaderboard modals.

---

## 8. Surprises, hidden features, quirks

1. **Option `detail` text and the event log are never shown.** `eK` stores a `log` (80 entries) and
   `lastResult.detail`, but the only JSX that reads them is the result strip showing `lastResult.title`. Wheel labels
   render `short ?? label`; slot rows render `label`. Verified by grep: `.detail` is read in JSX only by the ending
   choice list (1382) and leaderboard rows (2523); `.log` is only written (910). All the "detail" sentences in §2 are
   therefore effectively unused copy in this build (INFERRED: a log panel was removed or not yet built).
2. **Locked meta features.** Leaderboard and Outcomes are locked (lock icon, `locked` class) until `stage === "done"`
   is reached once; the flag is `sessionStorage["waterloo-roulette:meta-unlocked"] = "1"` (2815–2820), so it resets
   per tab/session and can be set by hand. The end card always exposes both features.
3. **`?seed=<anything>`** (2695): starts a fresh deterministic run with that seed and ignores the saved game. COPY
   deliberately does not include the seed, and RESTART strips it. No other query parameters, debug flags, cheat codes,
   key combos or `window` hooks exist in this chunk (searched for debug/cheat/konami/console/global assignments).
4. **Placeholder seed.** State initializes as `ek("campus-preview")`. If localStorage holds a save whose
   `contentVersion !== "2026.8"` (or whose JSON fails to parse — the catch only removes the key), neither branch at
   2697–2767 replaces it, so that session silently plays the fixed seed `"campus-preview"` (it is then saved under the
   new version). Looks like a bug. A legacy stage `"study-extra"` in a save is migrated to `e3({...state, stage: "term-event"})` (2754).
5. **Persistence.** Whole state JSON in `localStorage["waterloo-roulette:v8"]` on every change; visitor id (UUID) in
   `localStorage["waterloo-roulette:visitor"]`. The opening scene replays on every page load, including resumed and
   finished runs (a finished run also replays its ending scene and re-POSTs to the leaderboard).
6. **Leaderboard is client-trusted.** `POST /api/leaderboard` with `{visitorId, runId: seed, savings, totalRizz,
   escaped, coopJobs, moneyEvents}` automatically on `done` (2821), and again with the in-progress state whenever the
   Leaderboard button is pressed. A playtime heartbeat `{action:"playtime", visitorId}` is sent every 180 s while the
   tab is visible. Footer copy: `` `${h} hours ${m} minutes that could've been spent applying to real jobs` `` and
   `N players · N runs · N escaped the Loo · N co-op jobs`. Server behaviour (dedupe, validation) is unknown.
7. **Geomatics safety net** — see 2.2: always offered unless a Math-faculty offer is held.
8. **Text/behaviour mismatches:** `goose` says "No stat change." but costs $250; `resume-lie` silently costs an
   integrity point; `sleep`/`travel`/`doom` SET momentum (4 / 3 / -2) rather than adding; the exchange header always
   says "2B"; the bank notice can appear on a term that is actually spent on exchange (exchange takes priority over
   the debt job); the grade reel shows the raw roll while the recorded mark adds momentum.
9. **Run-over is literally 5° of the wheel** and multi-task 25° (`5/360`, `25/360`). "Truck-kun" bookends the story
   (opening scene and death scene).
10. **Full-time conversion counts fake co-ops** toward its `jobs.length >= 3` requirement (differs from the worker, §4).
11. **Return-offer full-time pay** is displayed as 1.5× the co-op hourly rate; it has no effect on savings.
12. **Log term labels can be off by one** (eK reads the term after `termIndex` advanced) and choice entries reuse the
    current `rngCounter` as their id — harmless only because the log is not rendered.
13. **Audio:** `/audio/loo-intro.mp3` autoplays (or on first pointer/key event) with a linear fade to silence over its
    length and replays on RESTART; `/audio/slot.mp3` on slot spins; `/audio/click3.mp3` / `click4.mp3` as wheel ticks;
    `/audio/button.mp3` on every button press.
