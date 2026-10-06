# 02 · Game model

The numbers behind the wheels. Formulas are quoted from the site's simulation worker (original TypeScript) and data modules. Percentages marked "computed" are arithmetic on those formulas. Exhaustive per-segment tables, including every string, are in `reference/source-notes/ui-state-and-wheels.md` section 7.

## Player state

| Field | Start | Meaning |
|---|---|---|
| `rizz` | program's starting values | Seven stats, each floored at 0: systems, product, aiData, quant, hardware (shown as ELECTRICAL), mechanical (MECH / ROBOTICS), bioNano |
| `average` | first term's grade | Cumulative average of term grades |
| `integrity` | 2 | Points. Reaching 0 is expulsion |
| `momentum` | 0 | Added to the next term's grade, then decays to 25% |
| `savings` | 0 | Dollars. Can go negative |
| `teams` | none | Design teams joined, each with a rank 0–3 (MEMBER, LEAD, DIRECTOR, CAPTAIN) |
| `jobs`, `returnOffers` | none | Work history with evaluations, and offers held for graduation |
| flags | false | `professorReference`, `guaranteedAmazonOffer`, exchange status, scholarship id |

One derived number matters throughout:

```ts
// "market rizz": the top three stats, weighted
marketRizz = top1 * 0.55 + top2 * 0.25 + top3 * 0.2
```

Being excellent at one or two things beats being average at seven.

## Programs

Sixteen programs. Each sets starting stats, an admission median and a timeline family.

| Program | Faculty | Admit median | Sequence type | Sys | Prod | AI | Quant | Elec | Mech | Bio | Market rizz |
|---|---|---|---|---|---|---|---|---|---|---|---|
| CS Computer Science | Math | 97 | math | 35 | 32.6 | 29.2 | 18 | 10.6 | 6.4 | 3 | 33.2 |
| CS/BBA | Math | 97 | math | 32.3 | 35.8 | 25.5 | 24 | 8.8 | 5.8 | 3 | 32.8 |
| CFM Computing & Financial Mgmt | Math | 95 | math | 25 | 25.6 | 21.2 | 36 | 6.6 | 5.4 | 3 | 31.2 |
| FARM Financial Analysis & Risk Mgmt | Math | 95 | math | 13 | 18.6 | 21.2 | 42 | 3.6 | 3.4 | 2 | 32.1 |
| MATH/BBA | Math | 96 | math | 18 | 27.6 | 19.2 | 31 | 5.6 | 4.4 | 3 | 27.8 |
| MATH Honours Mathematics | Math | 95 | math | 16 | 8.6 | 19.2 | 28 | 5.6 | 4.4 | 3 | 23.4 |
| SE Software Engineering | Eng | 99 | eng8 | 34 | 36.6 | 23.2 | 10 | 12.6 | 7.4 | 3 | 33.3 |
| CE Computer Engineering | Eng | 96 | dual-standard | 30.3 | 20.8 | 21.5 | 9 | 36.8 | 18.8 | 4 | 32.1 |
| EE Electrical Engineering | Eng | 97 | eng4 | 19.3 | 8.8 | 16.5 | 7 | 42.8 | 15.8 | 5 | 31.6 |
| TRON Mechatronics | Eng | 97 | dual-double | 22.3 | 14.8 | 16.5 | 6 | 29.8 | 37.8 | 6 | 32.7 |
| MECH Mechanical | Eng | 96 | dual-double | 10 | 6.2 | 9.4 | 4 | 13.2 | 44.8 | 7 | 29.9 |
| SYDE Systems Design | Eng | 96 | eng4 | 24 | 23.8 | 23.6 | 10 | 20.8 | 26.2 | 12 | 25.2 |
| MGMT Management Engineering | Eng | 94 | eng8 | 16 | 19.8 | 20.6 | 22 | 9.8 | 17.2 | 4 | 21.2 |
| NANO Nanotechnology | Eng | 94 | eng8 | 9.3 | 5.8 | 13.5 | 5 | 24.8 | 15.8 | 40 | 31.3 |
| BME Biomedical | Eng | 97 | eng8 | 11.3 | 8.8 | 19.5 | 5 | 18.8 | 21.8 | 38 | 30.2 |
| GEO Geomatics (fallback only) | Env | none | math | 19.3 | 12.8 | 19.5 | 12 | 12.8 | 11.8 | 4 | 18.1 |

Two math programs (MATH, MATH/BBA) roll a **major** wheel after term 1B that adds a stat bundle, for example Statistics (+8 AI, +6 quant), Actuarial Science (+14 quant), Data Science transfer (+14 AI, weight 5 of 100).

## Admission

```ts
highSchoolAverage ~ Gaussian(mean 96, sd 1.8) over 85..100      // 16 slot rows
P(offer) = clamp(0.01, 0.99, 1 / (1 + exp(-(average - median) / 1.25)))
P(backup engineering offer) = 0.4 * that
```

Computed offer chance:

| HS average | median 94 | 95 | 96 | 97 | 99 (SE) | backup, median 96 |
|---|---|---|---|---|---|---|
| 94% | 50% | 31% | 17% | 8% | 2% | 7% |
| 95% | 69% | 50% | 31% | 17% | 4% | 12% |
| 96% | 83% | 69% | 50% | 31% | 8% | 20% |
| 97% | 92% | 83% | 69% | 50% | 17% | 28% |
| 98% | 96% | 92% | 83% | 69% | 31% | 33% |
| 99% | 98% | 96% | 92% | 83% | 50% | 37% |

The curve is steep: one percentage point of average roughly doubles or halves the odds near the median. About 85% of players roll 94–98, so the application screen is a real risk decision even though the odds are not displayed.

**Entrance scholarship** (slot): none 56.9%, $1,000 (22%), $2,000 (13%), $10,000 (7%), $50,000 (1%), $100,000 (0.1%). Larger awards also add 0.5 to 15 points to every stat.

## Timelines

The sequence wheel picks one of eight term orders. `C` is a work term.

| Sequence | Who gets it | Terms |
|---|---|---|
| SEQ 1 | Math programs, 35% | 1A 1B C1 2A C2 2B C3 3A C4 3B C5 4A C6 4B |
| SEQ 2 | Math, 30% | 1A 1B C1 2A 2B C2 3A C3 3B C4 4A C5 C6 4B |
| SEQ 3 | Math, 15% | 1A 1B OFF 2A C1 2B C2 3A C3 3B C4 4A C5 C6 4B |
| SEQ 4 | Math, 20% | 1A 1B 2A C1 2B C2 3A C3 3B C4 4A C5 C6 4B |
| STREAM 4 | EE, SYDE (forced); CE 50% | 1A C1 1B C2 2A C3 2B C4 3A 3B C5 4A C6 4B |
| STREAM 4D | TRON, MECH 50% | 1A C1 1B C2 2A C3 2B C4 3A 3B C5 C6 4A 4B |
| STREAM 8 | SE, MGMT, NANO, BME (forced); TRON, MECH 50% | 1A 1B C1 2A C2 2B C3 3A C4 3B C5 C6 4A 4B |
| STREAM 8S | CE 50% | 1A 1B C1 2A C2 2B C3 3A C4 3B C5 4A C6 4B |

Every timeline has 8 study terms and 6 work terms; SEQ 3 adds one off term. Stream 4 puts the first job search after a single study term.

## Study term

### Grade

```ts
rolled ~ Gaussian(mean 76, sd 12) over 0..100, floor weight 0.02
grade  = clamp(0, 100, rolled + momentum)
average = running mean of grades
momentum = round(momentum * 0.25)
stats: +2 each if grade >= 90, +1.5 if >= 85, +1 if >= 75, +0.5 if >= 65, else +0.2
savings -= 3000                                   // tuition
```

Tier odds (computed): under 60, 8.6%; 60–69, 21.4%; 70–79, 32.8%; 80–89, 26.0%; 90 and up, 11.2%.

Two consecutive grades under 60 trigger academic expulsion, softened by one last-chance YC roll.

### Event wheel

Weights for a player with no teams and an average of 78 or lower. Percentages are computed and include the two fixed-angle slices.

| Event | Weight | Chance | Effect |
|---|---|---|---|
| Nothing reportable | 36 | 16.8% | None |
| Join a design team | 30 | 14.0% | Opens a wheel of 20 teams. +3 on the team's stats. A second team costs 2 momentum |
| Ship a side project | 16 | 7.4% | +4 product and systems, -$120 |
| Hackathon run | 15 | 7.0% | +2, +4 or +8 on product, systems and AI by a hidden roll (6% win adds $1,000). -1 momentum |
| Bad breakup | 14 | 6.5% | Opens a wheel: 60% no damage; 40% lose 30% of every stat, 1 integrity, and half of savings or $2,000 |
| Did absolutely nothing | 13 | 6.0% | -1 every stat, -$300 |
| LeetCode sabbatical | 12 | 5.6% | +3 systems and quant, -1 momentum, -$60 |
| Attacked by a goose | 9 | 4.2% | -$250 |
| Professor offers a reference | 8 | 3.7% | Doubles master's admit odds. +2 systems and AI |
| Burned out before finals | 8 | 3.7% | -5 momentum, -2 every stat |
| Roommate starts DJing | 7 | 3.3% | -3 momentum, -$120 |
| Caught over-collaborating | 5 | 2.3% | -1 integrity, -2 average, -3 every stat |
| Won a math contest | 5 | 2.3% | +3 quant and AI |
| Won a hackathon | 5 | 2.3% | +5 product, systems and AI, +$1,000 |
| Had a concussion | 4 | 1.9% | -8 momentum, -5 every stat, -$1,200 |
| Failed a required course | 4 | 1.9% | -4 average, -4 every stat, -$1,500 |
| Upper-year scholarship | max(2, average - 76) | 0.9% and up | +$750, $1,500 or $2,500 by average. +0.4 every stat |
| Caught with unauthorized aid | 2 | 0.9% | -2 integrity, which is immediate expulsion |
| Résumé exaggeration exposed | 2 | 0.9% | -1 integrity, -9 every stat |
| Promoted in a team | 12 per team | varies | Rank +1. +(3 + new rank) on the team's stats. -1 momentum |
| Multi-task | fixed 25° | 6.9% | Roll two more events. Cannot chain |
| Got run over | fixed 5° | 1.4% | The run ends |

Design teams: 69 real Waterloo teams and clubs, each mapped to two or three stats by keyword (for example anything matching "robot" gives mechanical, hardware and AI).

### Detours

- **Forced job.** If savings after tuition are below -$10,000, the event wheel is replaced by a minimum-wage job wheel ($17.60/h, about +$2,441) and every stat drops 2. A "bank notice" dialog explains it the first time.
- **Exchange.** Once per run, at the end of term 2B, 3A or 3B with an average of 80 or more: `P(match) = 25% at 80, 50% at 90, 100% at 100`. A matched player spins a wheel of 40 universities, and their next study term's event is replaced by an exchange event: 12 outcomes including +$30,000 and a guaranteed Amazon offer (6.7%), being robbed, and "got lost forever" (4.8%, ends the run).

## Recruiting

Runs before every work term.

### Interview count

```ts
lambda = 0.25 + 0.5 * workTermNumber + 0.06 * marketRizz
interviews ~ Poisson(lambda), capped at 7
```

Computed: first term with market rizz 30 gives a mean of about 2.5 interviews and an 8% chance of zero. Sixth term with market rizz 60 gives 37% at the cap of 7.

### Which employer

250 employers. Each has prestige (1–10), selectivity (1–10), hourly pay, volatility, a location, and a weight on each of the seven stats.

```ts
traitFit    = sum(rizz[a] * job.modifiers[a]) / max(1, sum(job.modifiers[a]))
resumeScore = traitFit + 3 * completedCoops + 1.5 * teamRanksTotal
              + 0.2 * (average - 70) - 2 * integrityIncidents

interviewWeight = (0.025 + (10 - selectivity) * 0.015
                   + 30 / (1 + exp(-(resumeScore + 4 * workTerm - (18 + 6.5 * selectivity)) / 7.5)))
                  * payRarityMultiplier(pay)        // up to -30% for the highest pay
```

Eighteen employers are flagged `survivalJob` (fast food, warehouses, retail). Their combined share of the wheel is pinned: 25% for the first work term, about 16% for the second and third, then down to 8.5% by the sixth.

### Offer

```ts
P(offer) = clamp(0.02, 0.82,
  1 / (1 + exp(-(resumeScore + 1.5 * workTerm - (18 + 3.8 * selectivity)) / 7.5)))
```

Each interview also nudges the job's top stats: +0.75 on an offer, +0.2 on a rejection. Accepting adds +0.5.

### Employer table

| Tier word (prestige) | Count | Examples |
|---|---|---|
| "cracked af" (9–10) | 57 | Jane Street, OpenAI, Google, NVIDIA, Anthropic |
| "ballin'" (7–8) | 70 | Goldman Sachs, Coinbase, Discord, Datadog |
| "ok i guess" (5–6) | 59 | IBM, Cisco, Ford, Capital One |
| "mid" (3–4) | 31 | TD, Bell, TELUS, OpenText |
| "Trash" (1–2) | 33 | Infosys, Wipro, Canada Post, plus the 18 survival jobs |

131 pay in CAD, 115 in USD, 4 in other currencies, all converted to CAD/h at fixed rates (USD 1.35). Pay ranges from $17.60 to $195.75 an hour. Most common cities: Toronto 51, San Francisco 24, New York 19, Waterloo 12. Full list: `reference/companies.csv`.

### No offers

The work term becomes an "unemployed" wheel: free training program (first work term only, weight 28), unrelated job (25, +$1,800), research assistant (22, +$2,000, +2 AI and systems), unpaid design-team term (20, +8 on the team's stats and +1 elsewhere), friend's startup (15, +$500), nothing (10, -$1,000).

## Work term

### Event wheel

| Event | Weight | Effect on stats | Evaluation signal |
|---|---|---|---|
| Shipped a production feature | 23 | +3 on the job's stats | +2.75 |
| Wrote tests for four months | 14 | +1 systems | +0.5 |
| Found a great mentor | 12 | +2 | +1 |
| Manager forgot the intern | 11 | none | -2.5 |
| Did a lot of overtime | 10 | +2, and pay ×2.5 | 0 |
| Pushed to prod on Friday | 9 | none | -5 |
| Project cancelled in reorg | 9 | none | -0.5 |
| Performative multi-tasking | 7 | Roll twice on the good outcomes only | sum |
| Named on a patent or paper | 5 | +6, and pay ×2 | +4.5 |
| Laid off mid-term | max(2, volatility) | pay ×0.55 | -0.25 |
| Got fired | max(1, volatility / 2) | pay ×0.35 | -8 |
| Full-time conversion | 2.5 | Only with three or more jobs already on record, at an employer of prestige 6 or higher. Ends the run as a dropout with a job | +4 |
| Got run over | fixed 5° | Ends the run | |

### Evaluation

```ts
signal = clamp(-8, 6, eventSignal + clamp(-1.25, 1.5, (traitFit - 20) / 15))
```

Seven grades with signal-dependent weights. Computed distributions:

| Signal | Outstanding | Excellent | Very Good | Good | Satisfactory | Marginal | Unsatisfactory |
|---|---|---|---|---|---|---|---|
| -8 (fired) | 0.4% | 2.3% | 10.3% | 13.8% | 34.9% | 23.7% | 14.6% |
| 0 | 3.4% | 12.4% | 29.4% | 31.6% | 15.8% | 5.6% | 1.7% |
| +2.75 (shipped) | 6.0% | 18.5% | 35.1% | 26.8% | 10.1% | 2.9% | 0.7% |

Effects: Outstanding +6 on the job's stats, Excellent +4, Very Good +3, Good +1. Satisfactory -2 on every stat, Marginal -7, Unsatisfactory -12. Jobs that weight a hardware, mechanical or bio stat at 8 or more add +10 to that stat.

**Return offer** chance: Outstanding 100%, Excellent 75%, Very Good 50%, Good 25%.

### Pay

```ts
termSavings = 40 * hourly * (52 / 3) * saveRate * fraction
saveRate    = 0.2 + 0.4 * clamp(0, 1, (hourly - 25) / 175)     // 20% at $25/h, 60% at $200/h
```

Computed: $17.60/h saves $2,441; $29/h, $4,205; $60/h, $11,648; $100/h, $25,752; $195.75/h, $80,114. Tuition is $3,000 a study term, so eight terms cost $24,000 and low-paid co-ops do not cover it.

## Y Combinator

```ts
P(yc) = min(0.06, 0.003 + (marketRizz / 100)^2 * 0.055)        // 0.5% at 20, 2.3% at 60, cap 6%
```

Rolled after every term once the player has worked any job in California, as a last chance on academic expulsion, and by choice at graduation. Success adds $500,000 and ends the run.

## Graduation

- **Broke** (savings below 0 and no return offers): the only ending is "Survival job".
- Otherwise pick 1 to 4 of 15 master's programs, medians from 95 (MIT) down to 75 (regional state university):

```ts
P(admit) = clamp(0.01, 0.99, logistic((average - median) / 3.5) * (professorReference ? 2 : 1))
```

Computed: average 85 against a median of 92 is 12%, or 24% with a reference. Average equal to the median is 50%, or 99% with a reference.

- Then choose among master's admits, return offers (shown at 1.5× the co-op pay) and a YC roll. The YC option appears only if the player holds at least one offer, and failing it ends as "Open to work".

## Endings

| Code | Status | Trigger |
|---|---|---|
| `run-over` | dead | 5° slice on every study, work and off-term event wheel |
| `integrity-expulsion` | expelled | Integrity reaches 0 |
| `academic-expulsion` | expelled | Two consecutive grades under 60, then a failed YC roll |
| `lost-forever` | withdrawn | Exchange event |
| `yc` | dropout | Any successful YC roll. +$500,000 |
| `full-time` | dropout | "Full-time conversion" work event |
| `grad:<school>` | graduated | Chosen at graduation |
| `return:<job>` | graduated | Chosen at graduation |
| `unemployed` | graduated | No offers, or a failed YC moonshot. Title: "Open to work" |
| `survival-job` | graduated | Broke at graduation |

The end card also awards six checkboxes: made it into California, made it to New York, left the Toronto area, master's admit, return full-time, graduated.

## What the simulator reports

One 2,000-run simulation from the site's own Outcomes modal (2026-10-05). The simulator auto-plays with a fixed policy, so these describe the game's balance, not any player's choices.

| Outcome | Rate | | Outcome | Rate |
|---|---|---|---|---|
| Graduated | 55.5% | | Got run over | 16.6% |
| Open to work | 19.4% | | Integrity expulsion | 14.3% |
| Return full-time | 18.2% | | Academic expulsion | 4.9% |
| Master's ending | 18.0% | | YC ending | 4.3% |
| Left the Toronto area | 73.6% | | Full-time dropout | 4.0% |
| Made it into California | 41.8% | | Went on exchange | 6.4% |
| Made it to New York | 12.6% | | Lost forever abroad | 0.6% |

Savings: mean $52,984, median $20,041, maximum $711,663, minimum -$13,270. Average wage by work term: $25, $32, $40, $53, $67, $79 an hour, with placement rising from 66% to 97%.

Observations on balance:

- About 45% of runs end before graduation, and the two largest causes are pure bad luck (run over) and two specific event slices (integrity).
- Wages roughly triple across six work terms, driven by the `3 * completedCoops` term in the résumé score. Experience compounds faster than anything a player can roll.
- The median outcome is a modest positive balance. The leaderboard's $700,000 and up scores need a YC exit or several trading-firm terms.
