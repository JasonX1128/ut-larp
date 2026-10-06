# 05 · Notes for the UT version

The other four docs describe waterloo.careers. This one collects what that research means for our game. It lists constraints we have set, structural mismatches to resolve, and open decisions. It does not design the UT game.

## Ground rules

Set by Will and Jason on 2026-10-05:

1. **Same genre, not a copy.** We want the UT Austin equivalent of the idea. We do not want to reproduce their exact UI, UX or writing.
2. **Our own content.** UT colleges, majors, honors programs, clubs, activities and events are ours to design. Nothing in the research is a content list for us.
3. **More agency.** Jason's note: players should have "a little more control over the trajectory" than the original gives.

### What is theirs and what is the genre

A working line for rule 1.

| Theirs: do not reuse | Genre or general technique: free to use |
|---|---|
| The title and its light-novel format, and the isekai framing (reincarnation, the truck, the goddess) | A career sim resolved by weighted random spins |
| All written text: narration, event names, tier words, jokes, labels | Visible odds through slice size |
| The specific visual identity: paper/ink/mustard palette with Archivo Black and IBM Plex Mono, the screen layout, the cabinet-with-crank reel, the "ME" dialog box | A stat profile that drives recruiting odds; a radar chart |
| Their audio files | Seeded, replayable runs |
| Their code, including the simulation worker in `reference/raw/` | A Monte Carlo "what are the odds" view |
| Their tuned tables as-is (employer list values, event weights) | Leaderboards, share cards, save and resume |

Formulas and probabilities are useful to study for balance. Ours should come from our own model of UT.

### Where the repo is today

`index.html` is an 85-line single-file prototype titled "Isekai Texas · The Roulette Table That Decides My UT Fate". It has five stats, a three-program application step, a clubs step and a short term loop. Two things in it sit close to the original and are worth revisiting under rule 1: the title mirrors theirs, and the term labels (`1A`, `1B`, `C1`, ...) are Waterloo's co-op calendar, which UT does not have.

## Where Waterloo's structure does not fit UT

The original's mechanics encode how Waterloo works. Each row is a place where a straight translation would be wrong or would miss what is distinctive about UT. UT details here are from our own knowledge and should be checked against `reference/source-notes/ut-austin-fact-base.md` before they turn into numbers.

| The original assumes | At UT | What it puts in question |
|---|---|---|
| Admission is one number (a percentage average) against a program median | Class rank and automatic admission get you into the university, not into a major. Majors are reviewed holistically | What the first roll is, and whether "admitted to UT but not to your major" is an outcome |
| You apply to up to three programs and pick among offers | First-choice and second-choice major, with honors programs applied to separately on top | The shape of the application screen |
| Program is fixed for the whole run | Internal transfer into CS, engineering or McCombs is a multi-semester storyline of its own | Whether the program can change mid-run |
| No honors layer | Turing Scholars, Texas CSB, Business Honors, engineering honors and others sit on top of majors | A second axis of admission with its own odds and perks |
| Six co-op work terms alternating with eight study terms | Eight semesters and three summers. Internships are recruited months ahead | The timeline shape and when recruiting happens |
| A co-op job board supplies interviews every term | Career fairs, online applications, referrals and org pipelines | What generates opportunities |
| Design teams are joined by a wheel | Many orgs have applications, interviews and rejection | Whether clubs are luck, choice or both |
| Grades are percentages; expulsion at two terms under 60 | GPA on a 4.0 scale, probation rules, Q-drops | The grade roll and its failure states |
| "Escaping" means leaving the Toronto area; pay is in CAD | Staying in Austin is often the goal; Texas has its own destinations (Dallas, Houston, the Bay, New York) | What the achievements celebrate |
| One flat tuition figure | In-state and out-of-state tuition differ by a large factor | Whether residency is part of the character |

## Systems inventory

Every system in the original, as a checklist for deciding what our game includes. The third column is intentionally blank.

| System | What it does in the original | Keep, change or drop |
|---|---|---|
| Starting roll | One number that gates admission | |
| Application choice | Up to three programs, hidden odds | |
| Admission wheels | One visible-odds spin per application | |
| Fallback program | Guarantees every run can continue | |
| Timeline | Fixed term order chosen by a wheel | |
| Stat profile | Seven axes; top three drive recruiting | |
| Term grade | Bell-curve roll; feeds average, stats, exchange, master's odds | |
| Term events | About 20 weighted outcomes per study term | |
| Follow-up wheels | Breakup, team choice, bonus rolls | |
| Teams and ranks | Stat boosts and a leadership term in the résumé score | |
| Money | Tuition, pay, event costs; forced job when deep in debt | |
| Integrity | Two points; zero ends the run | |
| Momentum | Carries luck into the next grade | |
| Recruiting loop | Interview count, employer, offer, choose | |
| Employer table | 250 entries with tier, selectivity, pay, location, stat weights | |
| Work events and evaluation | One event shifts a seven-grade evaluation | |
| Return offers | Banked for graduation | |
| Unemployed term | Consolation outcomes | |
| Exchange | One-time detour with its own events | |
| Major selection | Stat bundle for two programs | |
| Sudden death | 1.4% per event spin | |
| Startup exit | Small chance, large payout | |
| Graduate school | Up to four applications | |
| Ending choice | Pick among what you earned | |
| Narration scenes | Five story beats | |
| End card and share image | Summary, achievements, PNG export | |
| Leaderboard | Savings and total stats, by anonymous handle and city | |
| Outcome simulator | Monte Carlo over the whole game | |
| Save and resume | Whole state in localStorage | |
| Sound | Ticks, reel, button, intro | |

## Agency

The original has five decision types in a run of roughly a hundred spins ([01-game-walkthrough.md](01-game-walkthrough.md), agency audit). Ways a game in this genre can hand over more control, with what each costs. These are options to discuss, not a recommendation.

| Approach | Example | Cost |
|---|---|---|
| Choose before the spin | Pick this semester's focus; the event wheel's weights shift to match | The wheel must visibly change or the choice feels fake |
| Choose which wheel | Apply to a selective org or a safe one; target a field when recruiting | More content per branch |
| Spend a limited resource | A few rerolls or "pull a favor" tokens per run | Needs an economy and a reason not to hoard |
| Budget allocation | Split a fixed number of hours among classes, recruiting, orgs and rest | More UI per turn; slows the pace |
| Push your luck | Decline an offer to keep interviewing; take a risk to integrity for a gain | Players can lose by their own hand, which is the point |
| Shape the build | Pick which stat an event's reward goes to | Reduces the "see what fate gives me" feel |

Three things the original gets from having almost no agency, which any added control trades against:

- **Pace.** A run is about ten minutes because most screens need one click.
- **The simulator.** Auto-play needs a policy for every decision. Each new choice needs a default strategy, or the simulator has to compare strategies, which could itself be a feature.
- **The joke.** The game's premise is that outcomes are luck. Agency changes the tone from fatalism to strategy.

## Engineering lessons from their build

Independent of content and look.

- **One rules engine, two front ends.** They wrote the rules twice (interactive UI and simulator) and the two have drifted. A single pure function `step(state, choice, rand) → state` could serve the UI, the simulator and tests.
- **Seed plus choices is a complete record.** Their runs are deterministic, but they only store final numbers. Saving the list of choices alongside the seed would allow replays, shareable runs and server-side score checking.
- **Show the reasons.** They wrote a sentence for every outcome and never display it. A visible log is cheap and answers "what just happened to my stats".
- **Data in typed modules.** Their content is a set of small data files with pure helper functions. That is what made the simulator possible and makes rebalancing an edit to a table.
- **Version the save.** They gate on a content version and normalize field by field.
- **Client-only is enough.** The only server pieces are a leaderboard endpoint and analytics.
- **Plan for phones.** A third of their traffic is mobile, and their single-viewport layout is tight there.

## Open decisions

1. What is the player's goal: money, prestige, a "fit" score, something UT-specific, or several leaderboards?
2. How much agency, and which of the approaches above?
3. How does admission work: one step or layered (university, major, honors)?
4. Is internal transfer a core loop or a side event?
5. What is the timeline unit: semesters and summers?
6. Which stats, and how many?
7. Real employer and org names, invented ones, or a mix?
8. Tone and framing: what replaces the isekai premise?
9. Visual identity: a direction that is recognizably ours.
10. Is there a simulator at launch, and does it compare strategies?
11. Does the leaderboard need to be cheat-resistant?
12. Stack: stay single-file, or move to a framework with a build step?
