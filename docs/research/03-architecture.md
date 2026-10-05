# 03 · Architecture

How the site is built. Read from response headers, the HTML, the production bundles, and network activity during play. Items marked "inferred" are not directly visible from the client.

## Stack

| Layer | What it uses | Evidence |
|---|---|---|
| Framework | Next.js App Router, built with Turbopack | RSC payload in the HTML, `turbopack-*.js` chunks |
| Hosting | Vercel. The page `/` is statically prerendered | `server: Vercel`, `x-nextjs-prerender: 1` |
| Rendering | One client component, loaded without server rendering. The server HTML is only a loading line ("ENTERING ANOTHER WORLD…") and the creator links | `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker in the HTML |
| UI | React, plain `useState`. No state library, no router use, no component library | Bundle contents |
| Styling | One global stylesheet of hand-written class names. Tailwind v4's base layer is present but almost unused | CSS bundle |
| Fonts | Archivo Black and IBM Plex Mono through `next/font` (self-hosted woff2) | Preload tags |
| Share image | `html-to-image`, bundled into the main chunk | Bundle contents |
| Leaderboard | A route handler at `/api/leaderboard`, backed by Redis (inferred from an error string) | Network, bundle |
| Analytics | Vercel Analytics, Speed Insights, and a custom page-view beacon at `/api/analytics` | Layout chunk |

There is no account system, no database-backed game state, and no server-side game logic. Everything a run needs ships to the browser.

Approximate payload: 10.6 KB HTML, 48 KB CSS, about 99 KB for the game UI chunk, 44 KB for game data, 59 KB for the worker bundle, plus the React and Next runtime. Five small mp3 files load on demand.

## Source layout

The worker's TypeScript imports reveal the original module names. The same modules feed the interactive UI.

```
admissions-data.ts     ADMISSION_MEDIANS, admissionProbability, application rules
game-data.ts           AXES, PROGRAMS, MATH_MAJORS, SEQUENCES, TEAMS, RANKS
company-data.ts        COMPANIES (250), location map, prestige bands, GTA city set
(currency helpers)     currencyForLocation, hourlyWageInCad, payRarityMultiplier
recruiting-model.ts    traitFit, resumeScore, interviewPoolWeights, offerProbability
work-term-model.ts     design-team co-op and WE Accelerate constants
finance-model.ts       tuition, debt limit, event costs, workTermSavings, YC funding
scholarship-model.ts   SCHOLARSHIP_OUTCOMES
exchange-model.ts      EXCHANGE_UNIVERSITIES, EXCHANGE_EVENTS, acceptance curve
grad-school-model.ts   GRAD_SCHOOLS, gradAdmissionProbability, returnOfferChance
simulation-worker.ts   auto-play of the whole game for the Outcomes modal
(game component)       one large client component: state, wheel builders, resolver, render
(narration scenes)     five scene objects: opening, acceptance, graduation, death, yc
```

The split that matters: **data and pure formulas live in small modules; the UI component and the worker are two separate consumers of them.**

## State

A single plain object held in React state. Forty top-level keys, in four groups:

- **Run identity:** `contentVersion`, `seed`, `rngCounter`, `stage`, `status`, `ending`, `endingCode`.
- **Character:** `highSchoolAverage`, `program`, `major`, `sequenceName`, `timeline`, `termIndex`, `studyTerms`, `consecutiveLowTerms`, `rizz`, `average`, `integrity`, `momentum`, `savings`, `scholarshipId`, `teams`, `jobs`, `returnOffers`, `professorReference`, `guaranteedAmazonOffer`, `exchange`.
- **In-progress sub-flows:** `admissions` (applications and per-program results with the probability that was rolled), `recruiting` (target, completed, interviews, selected job), `gradSchool`, `pendingJob`, `currentJob`, `currentWorkEvents`, `ycContinuation`, `multiTaskRollsRemaining`, `bankNoticeShown`, `bankNoticePending`.
- **History:** `moneyEvents` (a ledger of up to 64 entries: term, label, amount, balance), `log` (up to 80 entries), `lastResult` (title, detail, tone).

`stage` is a string enum with 28 values and drives everything: which widget renders, which options the wheel shows, and which branch of the resolver runs.

### The stage pipeline

Three functions keyed on `stage` make up the game:

1. **Option builder** (a memo). For the current stage and state, returns the list of segments: `{ id, label, short, detail, weight, tone, payload? }`. Returns an empty list for choice screens.
2. **Spin handler.** Picks the winner from the weights, starts the animation, and after the animation plus a hold calls the resolver.
3. **Resolver** (one large `switch`). Applies the outcome to state, writes a log entry and `lastResult`, and sets the next stage through a few small routing helpers (`enterTerm`, `afterStudyTerm`, `afterNonStudyTerm`, `afterTermWithYcCheck`).

Choice screens bypass the wheel and have their own handlers in the render code.

## Randomness

```ts
// stateless: FNV-1a over a string, then one xorshift32 round, scaled to [0, 1)
rand(seed, counter, label = "spin") = xorshift(fnv1a(`${seed}:${counter}:${label}`)) / 2**32
```

- Each spin outcome is `rand(seed, rngCounter)`. `rngCounter` increases by one per resolved spin. Choice screens do not advance it.
- Secondary draws use the same counter with a different label, for example the landing angle within a slice, the employer display order, and the hidden hackathon result.
- **A run is fully determined by its seed and the player's choices.** The site uses this in one place: a hidden `?seed=` URL parameter starts a run with that seed. The leaderboard shows the seed of your best run.
- `Math.random` is used only for which tick sound to play, and inside the simulation worker.

## Persistence

| Storage | Key | Contents |
|---|---|---|
| localStorage | `waterloo-roulette:v8` | The whole state object as JSON, rewritten on every change |
| localStorage | `waterloo-roulette:visitor` | Random UUID used for the leaderboard |
| localStorage | `wr_visitor` | A second UUID used by the analytics beacon |
| sessionStorage | `waterloo-roulette:meta-unlocked` | Set after the first finished run. Unlocks the Leaderboard and Outcomes buttons for the tab session |

On load, a saved state is used only if its `contentVersion` equals the current one (`"2026.8"`). Fields are then normalized one by one with defaults, which doubles as a migration step. A mismatched or corrupt save is discarded. Reloading mid-run resumes exactly where the player left off, including mid-recruiting.

## Network

### `POST /api/leaderboard`

One endpoint does submission and retrieval.

```jsonc
// request
{ "visitorId": "<uuid>", "runId": "<seed>", "savings": 4375.74, "totalRizz": 312.5,
  "escaped": true, "coopJobs": 6, "moneyEvents": [ { "term": "1A", "label": "...", "amount": -3000, "balance": -3000 } ] }

// response (shape reconstructed from how the modal reads it)
{ "configured": true, "city": "Austin",
  "user": { "runs": 3, "bestSavings": 44108, "bestRizz": 256.5, "bestRun": { "runId": "...", "savings": 44108, "items": [] } },
  "cityStats": { "users": 33, "runs": 119 },
  "cities": [ { "city": "Toronto", "runs": 3204 } ],
  "topSavings": [ { "player": "ANON 30D8", "city": "Toronto", "score": 862941 } ],
  "topRizz": [ { "player": "ANON DEC3", "city": "Washington", "score": 515.3 } ],
  "totals": { "playtimeSeconds": 2736240, "users": 1582, "runs": 5199, "escapedPlayers": 1394, "coopJobs": 20965 } }
```

- Fires automatically when a run reaches `done`, and again every time the leaderboard modal opens (including mid-run, which posts the unfinished run).
- `player` and `city` are assigned by the server: a handle derived from the visitor id and a city from IP geolocation (inferred). The client never sends a name.
- A second message shape, `{ "action": "playtime", "visitorId": "..." }`, is sent every 180 seconds while the tab is visible. It feeds the "hours that could've been spent applying to real jobs" counter.
- **Trust model:** the server receives final numbers only, with no record of choices, so it cannot verify a score. Anyone can post any savings value.

### `/api/analytics`

A page-view beacon (`sendBeacon`) with path, query string, referrer and the analytics UUID. The same path answers `GET` with public totals: views, visitors, daily series, referrers, countries, devices. On 2026-10-05 it reported 743 views and 490 visitors over the previous 30 days, 70% from Canada and 30% from the United States.

## Simulation worker

- Created with `new Worker(new URL("./simulation-worker.ts", import.meta.url), { type: "module" })`. Because of how the bundler handles that URL, the raw TypeScript file is also published as a static asset.
- Protocol: the page posts `{ runs }` (clamped to 1–10,000). The worker posts `{ type: "progress", completed, total }` about 40 times when runs exceed 1,000, yielding to the event loop between batches, then posts a `SimulationReport` or `{ error }`.
- It is a **second implementation of the rules** (about 1,200 lines) that imports the same data and formula modules but has its own turn logic and uses `Math.random`. It replaces every player choice with a policy:
  - Applications: one engineering program, one backup and two math programs, drawn by popularity weights.
  - Program: the offer with the highest starting market rizz.
  - Job offer: highest prestige, then best fit, then pay.
  - Master's: the four schools whose median is closest to the player's average.
  - Ending: a uniform pick among admits, return offers and one YC roll.
- Known drift from the interactive game: the worker rolls high-school averages from 90, the UI from 85; the order of the major, exchange and YC checks differs slightly; the UI counts non-job work terms toward the full-time conversion requirement and the worker does not.

## Audio

| Sound | File | Played through | Trigger |
|---|---|---|---|
| Intro sting | `loo-intro.mp3` | `<audio>` element | Page load (or first gesture) and every restart. Fades linearly to silence over its length |
| Slot roll | `slot.mp3` | `<audio>` element | Start of each slot-reel spin |
| Wheel tick | `click3.mp3`, `click4.mp3` | Web Audio buffers | Each slice boundary passing the pointer, at most 12 per second, one of the two at random |
| Button click | `button.mp3` | Web Audio buffer | `pointerdown` on any button |

There is no sound for results or endings and no background music. Mute is a button and is not saved. The audio context is created on the first user gesture to satisfy autoplay rules.

## Share

SHARE RESULT renders the end card to a PNG with `html-to-image` (`toBlob`, pixel ratio up to 2, dark background), then tries in order: the Web Share API with the file, the Web Share API with text and URL, and a download link. The COPY button in the top bar copies only the site URL.

## Quirks and bugs seen in the code

- **Unrendered content.** Every wheel segment has a `detail` sentence and every event writes a log entry, but no component displays either. Only `lastResult.title` appears, in the result strip.
- **Fallback seed.** The initial state is created with the fixed seed `"campus-preview"` before the saved state loads. A discarded save may leave a player on that shared seed (inferred).
- **Leaderboard posts are not idempotent on the client.** A finished run is re-posted on reload. Deduplication by `runId` on the server is assumed.
- **The unlock gate is cosmetic.** It is a sessionStorage flag.
- **The exchange header always says "2B"** even in terms 3A and 3B.
- **CSS:** one undefined variable (`--font-body`), a font weight that is not loaded (800), and a white focus ring that is nearly invisible on light surfaces.
- **Mobile:** the fixed creator links in the bottom-right corner overlap the stats strip.
