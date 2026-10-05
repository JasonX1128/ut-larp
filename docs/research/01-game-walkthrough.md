# 01 · Game walkthrough and agency audit

What a player sees, in order. Screenshot names refer to `reference/screenshots/`.

## Screen anatomy

Every in-run screen has the same four regions (`03-applications-empty.jpg`, `12-term-event-wheel.jpg`):

| Region | Contents |
|---|---|
| Top bar | Title on a gold field. Buttons: LEADERBOARD and OUTCOMES (locked until one run finishes), COPY (copies the game link), RESTART, MUTE |
| Timeline strip | One chip per term (`1A STUDY`, `C1 WORK`, ...). Appears once the co-op sequence is rolled. Current term is inverted |
| Main panel | Header (small eyebrow + title, e.g. `1B` / `Term event`), the wheel, reel or choice cards, and a full-width result strip that shows the last result in a tone color |
| Sidebar | Program code and name, sequence stamp, 7-axis radar chart, four stat tiles (average, integrity, savings, co-ops), current team, best co-op |

Dialogs sit on top: a visual-novel style narration box with a "ME" speaker tag, and the leaderboard and statistics modals.

## A run, step by step

### 1. Opening

A narration box sets the premise in three lines: the narrator died jobless, a goddess gave them one more chance at Waterloo, and a roulette table will decide whether they end up employed (`01-intro-narration.jpg`). It replays on every page load. One button: BEGIN.

### 2. High-school average (slot reel)

A three-row slot machine with a side crank. Click to roll a value from 85% to 100%, bell-shaped around 96% (`02-highschool-average-slot-reel.jpg`).

### 3. Applications (choice)

A grid of program tiles in three groups: ENGINEERING, BACKUP ENGINEERING, MATHEMATICS (`04-applications-selected.jpg`). Rules shown on screen:

- Apply to at most three programs.
- At most one of them is engineering. If you pick one, you may also name one backup engineering program, which does not count toward the three.

The player sees their average but not the admission odds.

### 4. Admission results (wheel, one spin per application)

A two-slice wheel, OFFER in green and NO OFFER in red, sized to the real probability (`05-admission-wheel.jpg`). Observed with a 96% average: Software Engineering 8%, backup Computer Engineering 20%, Computer Science 31%, CFM 69%. The backup is only rolled if the main engineering choice fails.

### 5. Choose a program (choice)

Offer cards with ACCEPT, under a row of result chips (`07-program-select-offers.jpg`). If no math-faculty program made an offer, a guaranteed fallback offer (Geomatics) is added, so nobody is stuck. Accepting triggers a second narration scene and fills the radar chart with the program's starting stats.

### 6. Co-op sequence (wheel), then entrance scholarship (slot reel)

The sequence decides the order of study and work terms for the whole run. Some programs have a forced single-slice wheel. The scholarship reel is mostly "No scholarship" (57%) with a 0.1% jackpot.

### 7. Study term loop

Each study term is two spins:

1. **Term average** (slot reel, 0–100, centered on 76). Each row carries a tier label: Cooked, Barely survived, Respectable, Academic weapon, Touch grass, bro (`10-term-average-reel.jpg`). Tuition of $3,000 is charged.
2. **Term event** (wheel, about 21 slices) (`12-term-event-wheel.jpg`). Examples: nothing happens, hackathon, side project, burnout, goose attack, caught cheating, join a design team, and a thin red "got run over" slice.

Some events open a follow-up wheel: a breakup fallout roll, a wheel of 20 design teams to join, or two extra event rolls ("multi-task").

Conditional detours: a major-selection wheel for two math programs after term 1B, an exchange application wheel once in third year if the average is 80 or more, and a forced minimum-wage job wheel when savings fall below -$10,000.

### 8. Recruiting loop (before each work term)

1. **Interview count** (slot reel, 0–7). More with later terms and higher stats.
2. For each interview: **Employer** (a giant wheel showing only its top arc, 250 employers as thin stripes, `14-employer-wheel-zoomed.jpg`), then **Interview result** (two-slice OFFER / NO OFFER wheel, `15-interview-result-wheel.jpg`).
3. **Choose an offer** (choice). Cards show company, role, city, a tier word, interview difficulty and hourly pay (`16-offer-select.jpg`). There is no decline button.

With zero offers the work term becomes an **unemployed** wheel: free training program, unpaid design-team term, research assistant, unrelated job, friend's startup, or nothing.

### 9. Work term loop

1. **Term event** (wheel, about 12 slices): shipped a feature, good mentor, forgotten by manager, production incident, laid off, fired, and so on (`34-mobile-390-term-event-wheel.jpg`).
2. **Evaluation** (slot reel, seven grades from Outstanding to Unsatisfactory). The event shifts the odds.
3. **Return offer** (wheel), only if the evaluation was Good or better. A return offer is held until graduation.

### 10. Graduation

1. **Masters applications** (choice): pick 1 to 4 of 15 schools (`25-masters-applications.jpg`). Skipped if the player is broke with no return offers.
2. **Admission result** wheel per school.
3. **Choose your next step** (choice): one card per master's admit, one per return offer, and "I'm feeling lucky" for a Y Combinator roll (`26-ending-select.jpg`). If the player has nothing, the only card is "Open to work".

### 11. End card

A dark summary card: ending title, status stamp (GRADUATED, DEAD, ...), final average, savings, work terms, integrity, scholarship, six achievement checkboxes, and the list of co-op jobs (`29-end-screen-graduated.jpg`, `18-end-screen-dead.jpg`). Buttons: SHARE RESULT (exports the card as a PNG), NEW RUN, VIEW OUTCOME STATISTICS, LEADERBOARD.

### 12. After the first finished run

- **Leaderboard** (`20-leaderboard-top.jpg`, `21-leaderboard-columns-footer.jpg`): your run count and bests, your city's player count, a term-by-term money ledger of your best run, and three top-8 lists (cities by runs, highest savings, highest total stats). Players are anonymous handles like `ANON 30D8` with a city. The footer totals everyone's play time as hours "that could've been spent applying to real jobs".
- **Outcomes** (`22-outcomes-modal-initial.jpg`, `23-outcomes-results-top.jpg`, `24-outcomes-results-distributions.jpg`): a slider from 100 to 10,000 runs (default 2,000) and a RUN SIMULATION button. Results: savings stats, 15 outcome rates, scholarship and program distributions, and average wage and placement rate per co-op with an expandable city breakdown.

## Stage machine

28 stages. Five are slot reels, five are choice screens, the rest are wheels.

```
highschool-average → applications* → admission (per program) → program-select*
  → sequence → scholarship → [term loop]

STUDY TERM   study-grade → term-event → (breakup | design-team | 2 more events)
             detours: debt-job, exchange-application → exchange-university, exchange-event, major
RECRUITING   recruit-count → (recruit-job → interview) × N → offer-select*
WORK TERM    term-event → work-eval → return-offer        or: unemployed → design-team-coop
OFF TERM     term-event
ANY TERM     yc-roll, once the player has worked in California

GRADUATION   grad-applications* → grad-admission (per school) → ending-select* → done
                                                      * = player choice
```

The full transition rules are in `reference/source-notes/ui-state-and-wheels.md` section 6.

## Agency audit

The whole game counted by who decides.

### What the player decides

| Decision | When | What it changes | Information shown |
|---|---|---|---|
| Programs to apply to (up to 3, plus an engineering backup) | Once, at the start | Starting stats, timeline shape, admission risk | Own average. Odds are hidden |
| Which offer of admission to accept | Once | Same | Program name and faculty only |
| Which job offer to accept | Before each work term, if there are two or more offers | Pay, which stats grow, layoff risk, where "escaped" achievements come from | Company, role, city, tier word, interview difficulty, pay |
| Master's programs (1 to 4 of 15) | Once, at graduation | Which admit wheels get spun | A hint that a professor reference helps. Odds are hidden |
| Final ending | Once | The ending title | The offers in hand. The YC roll's odds are hidden until chosen |

### What the player does not decide

Everything else, including things that look like choices in real life: study effort, which events happen, joining or leaving a team, which team, applying for exchange, the major, how many employers to apply to, which employers, and declining an offer.

A typical run that reaches graduation has roughly 80 to 110 spins and 8 to 10 decisions, most of them "which of two job offers". A run that dies early may contain only the two admission decisions.

### Where the existing structure already has hooks

These are places the original computes something the player might reasonably want a say in. Listed as observations, not recommendations.

- **Before a study term:** grades, events and stat growth are independent rolls. There is no effort or focus input.
- **Term events with sub-wheels:** design team (which team), breakup (how to respond), multi-task (take it or not).
- **Recruiting:** the interview count and the employer are rolled. A player cannot target a field or a tier, and cannot decline to keep searching.
- **Risk decisions that exist only once:** the YC moonshot at graduation is the game's single push-your-luck choice. It forfeits the offers in hand on failure.
- **Money:** savings only matter at two thresholds (the -$10,000 forced job, and being broke at graduation) and on the leaderboard. Nothing can be bought.
- **Integrity:** two points, lost only to random events. There is no option to take a risk in exchange for a benefit.
- **Hidden odds:** admissions, grad admissions and the employer wheel do not show probabilities. The two-slice wheels do, by slice size.
