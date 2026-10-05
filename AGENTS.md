# AGENTS.md

Guidance for coding agents working in this repository.

## What this repo is

A UT Austin career-sim game, in the same genre as [waterloo.careers](https://waterloo.careers): the player's college and early-career path is resolved mostly by weighted random spins. Built by Will Hao and Jason Xie.

Current state:

- `index.html` is a single-file prototype (inline CSS and vanilla JS, no dependencies). It predates the research and is not the target design.
- `docs/research/` documents how waterloo.careers works. It describes someone else's game.
- **The UT game itself has not been designed yet.** There is no spec.

## Read before doing anything

1. `docs/research/README.md`: what the research covers and its ten main findings.
2. `docs/research/05-notes-for-the-ut-version.md`: the ground rules, the places where Waterloo's structure does not fit UT, and the open decisions.

## Ground rules

1. **Same genre, not a copy.** Do not reproduce waterloo.careers' text, visual identity, layout, audio or code. The table in `05-notes-for-the-ut-version.md` draws the line between what is theirs and what is general technique.
2. **UT content is Will and Jason's to design.** Colleges, majors, honors programs, clubs, events and jokes come from them. Nothing in the research is a content list, and the Waterloo mechanics are not a spec.
3. **More player agency than the original.** The original has five kinds of decisions in about a hundred spins. Jason wants players to have more control over their trajectory.

## How to start building the game

The research answers "how does the reference work". It does not answer "what is our game". Twelve design questions are listed as open at the end of `05-notes-for-the-ut-version.md`: goal, amount of agency, admission structure, timeline unit, stats, tone, visual identity, stack and others.

1. Look for `docs/design/`. If it exists, it is the spec and it overrides anything in the research.
2. If it does not exist, the first task is design, not code. Work through the open decisions with Will and Jason: ask, offer options with tradeoffs, and use the systems checklist in doc 05 to settle what the game includes. Write the outcome to `docs/design/` so the next agent starts from it.
3. Only then plan and build.

If asked to "just start building" with no design, say what is undecided and get at least these answered first: the player's goal, how admission works, the timeline unit, the stat list, and the stack. Do not fill the gaps by porting the Waterloo version.

The stack is undecided. Do not add a framework, build step or dependencies without asking. Until that is settled the project is the single `index.html`.

## Where to look things up

`docs/research/` has five numbered docs (about 60 KB in total, fine to read whole) and a `reference/` folder (about 3 MB, search it instead of reading it whole).

| Question | File |
|---|---|
| What does the player see, in what order? Where do they get to decide? | `01-game-walkthrough.md` |
| What are the odds and formulas for a mechanic? How is the game balanced? | `02-game-model.md` |
| How is state, randomness, saving, the leaderboard or the simulator built? | `03-architecture.md` |
| How do the wheel and reel work? Timings, layout, mobile, accessibility? | `04-ui-ux.md` |
| What exactly is on one wheel: every segment, weight and string? | `reference/source-notes/ui-state-and-wheels.md` |
| What does each spin outcome do to state? What are all the endings? | `reference/source-notes/ui-resolution-and-render.md` |
| How is a component drawn (wheel geometry, radar chart, end card)? | `reference/source-notes/ui-components.md` |
| Exact CSS values, breakpoints, keyframes | `reference/source-notes/css-design-system.md` |
| The 250-employer table | `reference/companies.csv` |
| What a screen looks like | `reference/screenshots/` (37 images with descriptive file names) |
| The original code | `reference/raw/`. `simulation-worker.ts` is readable TypeScript; the rest is prettified minified output |
| Facts about UT (admissions, majors, orgs, costs, culture) | `reference/source-notes/ut-austin-fact-base.md` |

Two cautions:

- Everything in `reference/` except the UT fact base is third-party material. Use it to understand, never as a source to copy from.
- The UT fact base was compiled by web research and has not been checked. Its section 12 lists what could not be verified. Confirm a number with Will or Jason, or its cited source, before building on it.

## Running

Open `index.html` in a browser. There is no build, no package manager, and no tests.

## Commits

One short imperative line, like the existing history ("Add UT LARP playable game"). No co-author or tool-attribution trailers.
