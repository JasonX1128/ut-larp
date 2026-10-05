# Research: how waterloo.careers works

Reference documentation for [waterloo.careers](https://waterloo.careers) ("Isekai Waterloo: The Roulette Table that Decides my Jobless Fate!"), gathered on 2026-10-05 to inform a UT Austin game in the same genre.

**What this is:** a description of the existing site: its game loop, numbers, architecture and UI patterns.
**What this is not:** a spec for the UT game. The UT content (colleges, honors programs, clubs, events, jokes) and the look are ours to design. See [05-notes-for-the-ut-version.md](05-notes-for-the-ut-version.md) for the constraints we set for ourselves.

## The site in one paragraph

A single-page game. You spin a slot reel for a high-school average, choose up to three Waterloo programs, spin admission wheels, then live through a 14–15 term timeline of study terms and co-op work terms. Almost every step is a weighted spin: term grades, random campus events, how many interviews you get, which employer, whether you get the offer, your work evaluation. Seven "job rizz" stats (systems, product, AI/data, quant, electrical, mech/robotics, bio/nano) drive recruiting odds. A run ends in one of ten ways, from "Masters at MIT" to being run over by a truck. Finishing a run unlocks a global leaderboard and a Monte Carlo simulator that auto-plays thousands of runs to show ending probabilities.

## Documents

| Doc | Covers |
|---|---|
| [01-game-walkthrough.md](01-game-walkthrough.md) | Every screen in play order, the stage machine, and an audit of where the player actually decides anything |
| [02-game-model.md](02-game-model.md) | Stats, programs, timelines, every wheel's odds, recruiting and money formulas, endings, simulated outcome rates |
| [03-architecture.md](03-architecture.md) | Stack, module layout, state shape, seeded RNG, persistence, leaderboard API, simulation worker, audio, share card |
| [04-ui-ux.md](04-ui-ux.md) | Layout, the wheel and slot reel, animation timings, design tokens, responsive behavior, accessibility gaps |
| [05-notes-for-the-ut-version.md](05-notes-for-the-ut-version.md) | What to borrow structurally, what must be our own, where Waterloo's structure does not map to UT, open decisions |

## Reference folder

`reference/` holds the raw material these docs were written from. It is tracked in git so that anyone working on the project, including coding agents, has it. It contains another person's source code, verbatim game text and screenshots. Use it to understand how the site works. Do not copy text, code, assets or layout from it into the game (see [05-notes-for-the-ut-version.md](05-notes-for-the-ut-version.md)).

| Path | Contents |
|---|---|
| `reference/source-notes/ui-state-and-wheels.md` | State shape, RNG, persistence, network, all 28 stages with every wheel segment, weight and string |
| `reference/source-notes/ui-resolution-and-render.md` | What each spin outcome does to state, all endings, differences between the game and its simulator |
| `reference/source-notes/ui-components.md` | Each React component: wheel math, slot reel, radar chart, end card, modals |
| `reference/source-notes/css-design-system.md` | Tokens, type scale, layout, breakpoints, keyframes, theming map |
| `reference/source-notes/ut-austin-fact-base.md` | Optional UT facts with sources (admissions, programs, orgs, culture). Raw material only |
| `reference/companies.csv` | The 250 employers with tier, selectivity, pay, location and stat weights |
| `reference/screenshots/` | 37 captures: every stage on desktop, plus 390px and 820px layouts |
| `reference/raw/` | The site's simulation worker (original TypeScript), prettified bundles, CSS, HTML |

## How the research was done

- Played two full runs in Chrome (one died at term 2B, one graduated), plus about 150 automated spins to reach late-game stages.
- Downloaded and read the production bundles. The site serves its Monte Carlo worker as an untranspiled TypeScript file, which exposes the real module names, types and formulas. The rest was read from minified code.
- No public source repository was found (GitHub searches for the project name and storage key returned nothing). The creator is Theodore Zhu ([tzhu.dev](https://tzhu.dev)).

Claims in these docs come from the code unless marked as observed or inferred. Line references in the source notes point into `reference/raw/ui.pretty.js`.

## Ten findings worth knowing first

1. **It is two visual mechanics, not one.** A roulette wheel for categorical outcomes and a slot-machine reel for five numeric ones (grades, interview count, evaluation). See [04-ui-ux.md](04-ui-ux.md).
2. **The player makes five kinds of decisions in a whole run.** Programs to apply to, which offer of admission, which job offer, which master's programs, and the final ending. Everything else is a spin. See the agency audit in [01-game-walkthrough.md](01-game-walkthrough.md).
3. **Runs are deterministic from a seed.** Each spin is a hash of `seed:counter`. A hidden `?seed=` URL parameter replays a run.
4. **The employer wheel hides its odds.** It draws 250 equal slices in shuffled order while the real pick is heavily weighted by your stats.
5. **A 5° "got run over" slice sits on every term-event wheel.** That is 1.4% per spin and ends about 17% of all runs.
6. **The simulator plays a fixed policy, not yours.** It always takes the most prestigious offer and picks schools by closeness to your average.
7. **The whole game is client-side.** The only server pieces are a leaderboard endpoint (Redis, inferred) and page-view analytics. Scores are trusted from the client.
8. **Every segment has a one-line joke that never renders.** The code stores a `detail` string and an event log, but the UI only shows the result title.
9. **The visual theme is six color variables and two fonts.** Archivo Black and IBM Plex Mono, 2px ink borders, no rounded corners, hard offset shadows on dialogs only.
10. **Phone layout is the same screen compressed.** At 720px and below the sidebar becomes a 122px strip under the wheel. The page never scrolls.
