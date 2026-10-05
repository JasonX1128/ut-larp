# 04 · UI and UX

How the site looks, moves and feels, and why it works. This is a description of their design so we understand the patterns. Our game needs its own visual identity; see [05-notes-for-the-ut-version.md](05-notes-for-the-ut-version.md).

Exhaustive values (every selector, hex and breakpoint) are in `reference/source-notes/css-design-system.md` and `ui-components.md`. Screenshots are in `reference/screenshots/`.

## The feel in one paragraph

A tabletop-game cabinet rendered as flat print: warm paper and near-black olive ink, one mustard accent, heavy grotesque headlines over tiny uppercase monospace labels, 2px borders everywhere, no rounded corners except the wheel itself, and hard offset shadows only on dialogs. Nothing glows, pulses or loops. The only things that move are the wheel, the reel, numbers that flash when they change, and dialogs that rise in.

## Layout

Desktop (`12-term-event-wheel.jpg`):

```
┌──────────────────────────────────────────────────────────────┐
│ top bar 58px: title (gold)            │ meta │ COPY │ RESTART │ MUTE │
├──────────────────────────────────────────────────────────────┤
│ timeline strip: 1A 1B C1 2A ...  (one equal-width chip per term)     │
├───────────────────────────────────────────────┬──────────────┤
│ header 66px: eyebrow + title (ink)            │ sidebar 280px │
│                                               │ program code  │
│ stage area (deeper paper):                    │ radar chart   │
│ wheel / reel / choice cards                   │ 2×2 stats     │
│                                               │ team, best job│
│ result strip 48px (tone colored)              │               │
└───────────────────────────────────────────────┴──────────────┘
```

- The shell is exactly one viewport tall (`100dvh`, `overflow: hidden`). The page never scrolls; only choice lists, the end card and modals scroll internally.
- Main grid: `minmax(420px, 1fr) 280px`, 12px gap.
- The wheel is sized by `min(52vh, 430px, 42vw)`.

Phone, 720px and below (`34-mobile-390-term-event-wheel.jpg`): same screen, stacked. The sidebar becomes a fixed 122px strip under the main panel with three cells: program code, a small radar without labels, and the four stats. The wheel grows to `min(78vw, 350px, 44dvh)`. Program tiles drop from five columns to two. There are further small tweaks at 560px (modals go single-column), 430px and 360px, and one for short laptop screens.

## The two spinners

### Roulette wheel

Used for categorical outcomes (`05-admission-wheel.jpg`, `12-term-event-wheel.jpg`).

- **Drawing:** a single round element whose background is a hard-stop `conic-gradient`, one color band per segment, sized by `weight / total × 360°`. No SVG or canvas. Thin 1px separators and radial text labels are absolutely positioned children. A red CSS triangle above the wheel is the pointer.
- **Hit target:** the whole wheel is a `<button>`. The center hub reads SPIN, and changes to ROLLING while it turns. Space also spins.
- **Density rules:** above 16 segments the labels shrink; above 24 they are hidden.
- **Honest odds:** slice size is the probability. A 2% offer chance looks like a sliver. This is the core of the game's tension.

**Employer variant** (`14-employer-wheel-zoomed.jpg`): the same component at 1100–1600px wide, positioned so only its top arc is on screen. All 250 employers appear as equal thin stripes in shuffled order, colored by tier, with labels on the 24 nearest the pointer. It reads as "a huge crowd of companies rushing past". It does not show the real odds.

### Slot reel

Used for five numeric or ordered outcomes: high-school average, scholarship, term average, interview count, evaluation (`02-highschool-average-slot-reel.jpg`, `10-term-average-reel.jpg`).

- A three-row window in a gold-framed cabinet with a crank on the right. The middle row, between two red lines, is the result. Top and bottom rows fade under dark gradients.
- The option list is repeated eight times in 72px rows. A spin animates the strip to row `6 × listLength + winnerIndex`, and the crank arm rotates two full turns.
- Rows are tinted by tone, so the 0–100 grade reel passes through red, cream, grey, green and gold bands as it rolls (`11-term-average-reel-midspin.jpg`).

### Timing

| Thing | Duration | Easing |
|---|---|---|
| Wheel spin | 2200 ms | `cubic-bezier(0.12, 0.68, 0.11, 1)` |
| Employer wheel spin | 1800 ms | `cubic-bezier(0.55, 0, 0.45, 1)` |
| Slot reel and crank | 520 ms | `cubic-bezier(0.12, 0.68, 0.11, 1)` |
| Hold on the result before state updates | 1500 ms | |
| Auto-spin for bonus rolls | starts after 350 ms | |
| Number flash on change | 720 ms | ease-out |
| Narration backdrop fade / box rise | 180 ms / 240 ms | ease-out |
| Button color change | 140 ms | ease |

The wheel always turns clockwise, at least 3.7 full turns (1332°), and lands at a seeded random point inside the winning slice, kept away from the edges. Rotation accumulates, so the wheel starts each spin from where it stopped.

Measured in the browser (sampling the computed transform every frame on a 1487° spin):

| Time after click | Rotation covered |
|---|---|
| 60 ms | 15% |
| 210 ms | 50% |
| 470 ms | 75% |
| 850 ms | 90% |
| 1470 ms | 98% |
| 2200 ms | 100% |

Half the travel happens in the first tenth of the spin, and the last 10% takes more than half the time. That long crawl across the final slices is where the suspense comes from. Tick sounds follow the same curve, capped at 12 per second, so they audibly slow down.

With `prefers-reduced-motion`, spins take 40 ms and the hold drops to 120 ms, in both CSS and JavaScript.

## Feedback after a result

1. The wheel rests on the slice for 1.5 seconds.
2. The **result strip** under the stage changes text and color at once: gold, green, red, ink or cream by the outcome's tone (`06-admission-no-offer-result-strip.jpg`).
3. Any sidebar number that changed scales up 16–22% and flashes green or red for 0.72 seconds.
4. The radar polygon snaps to its new shape.
5. The next stage's header and spinner replace the current one. There is no transition between stages.

There is no confetti, no sound and no modal for ordinary results. Dialogs are reserved for five story beats (opening, acceptance, graduation, death, YC) and one explanation (the bank notice).

## Components

| Component | Notes |
|---|---|
| Top bar | Gold title block, then ink buttons separated by 1px lines. Locked buttons show a small lock icon and an `aria-label` explaining how to unlock |
| Timeline | Equal-width chips with the term code in display type and STUDY / WORK / OFF beneath. Past terms dim, the current term inverts to ink with gold text, work terms have a slightly different tint |
| Stage header | Small gold uppercase eyebrow (context: term, company, average) over a white display-type title (the question: "Term event", "Interview result") |
| Application picker | Dark grouped panels of paper tiles. Selected is a gold fill with a red inner ring. Unavailable is greyed. Empty grid cells stay dark, which reads as a punched card (`04-applications-selected.jpg`) |
| Offer cards | Paper cards with a 2px border: large name, small role, one meta line, and a green text button (ACCEPT / CHOOSE) (`16-offer-select.jpg`, `26-ending-select.jpg`) |
| Sidebar | Huge gold program code, red outlined sequence stamp, radar, 2×2 stat tiles with 1px dividers. Integrity is green at 2/2, gold at 1/2, red at 0 |
| Radar chart | Inline SVG, seven axes, heptagon rings at 25/50/75/100, gold outline with a faint fill, values printed beside the axis labels |
| Narration dialog | Paper box, 3px ink border, 9px hard gold shadow, a gold "ME" tab on the top-left corner, display-type title, three mono lines, one ink button with an arrow (`08-narration-acceptance-arc.jpg`). No typewriter effect |
| End card | Ink card centered on paper: gold ending title, red status stamp, stat grid, achievement checkboxes, job list, a small wordmark, then the action buttons (`29-end-screen-graduated.jpg`). Built to be screenshotted |
| Modals | Paper sheets with a hard offset shadow whose color identifies them: gold for statistics, green for the leaderboard, red for the bank notice |

## Visual system

**Color.** Six CSS variables carry the theme:

| Token | Value | Role |
|---|---|---|
| `--paper` | `#eee9dc` | Page and light surfaces |
| `--paper-deep` | `#d8d0bd` | Recessed stage areas |
| `--ink` | `#1d1d19` | Borders, dark surfaces, text. Olive-tinted, not neutral black |
| `--gold` | `#f2c84b` | The accent: top bar, wheel ring, selection, primary buttons, headings on dark |
| `--red` | `#d64a38` | Pointer, negative results, stamps |
| `--green` | `#247958` | Positive results, hover fills |

Outcome "tone" (gold, red, green, ink, cream) is data on every wheel segment. The wheel's slice colors come from a second, slightly different palette defined in JavaScript, and reel rows use pastel tints of the same five tones.

**Type.** Two families and a wide gap between them:

- Archivo Black for titles and numbers, 14–58px, tight tracking (-0.04em).
- IBM Plex Mono, bold uppercase, 6–9px with wide tracking for labels; regular for body lines.

There is almost no medium-sized text. Screens read as a headline plus captions.

**Surfaces.** 2px ink borders (3px on dialogs, 7px on the wheel rim), zero corner radius, flat fills, 1px dividers inside dark panels. Shadows are hard offsets with no blur, and only dialogs have them.

## Accessibility

Present:

- The wheel and reel are real buttons with labels. Space spins.
- Locked features explain themselves through `aria-label`.
- Reduced motion is honored in CSS and in the timers.
- Tone is never the only signal: every result also has text.

Missing or weak:

- Labels at 6–9px are very small, especially on phones.
- Dialogs have no focus trap and do not close on Escape.
- The white focus ring is nearly invisible on paper surfaces.
- Hover styles are not limited to hover-capable devices, so they stick after a tap.
- No safe-area insets. The fixed corner links overlap the stats strip on phones (`35-mobile-390-end-card.jpg`).
- Wheel labels are hidden above 24 segments, and the employer wheel shows a fraction of its names, so a screen-reader or low-vision player gets less than the visual.

## Why it works

Observations on the experience, from playing it.

- **One action per screen.** The thing you look at is the thing you click. There is no separate spin button to find.
- **Odds you can see.** A sliver of green on a red wheel says everything about a 4% admission chance without a number.
- **Two tempos.** Frequent numeric rolls take half a second on the reel. Dramatic categorical rolls take over two seconds on the wheel. A full run stays around ten minutes (estimate from the timings and about 100 spins).
- **A persistent character sheet.** The sidebar is always visible, and numbers flash when they change, so consequences are legible without reading a log.
- **Sparse story.** Five short narration beats frame the run. The rest of the humor is in labels.
- **The ending is an object.** The end card is self-contained, dark, branded and exportable, and it lists concrete bragging rights (employers, cities, savings).
- **Meta features are a reward.** Leaderboard and statistics unlock after one finished run, which gives a reason to finish the first one and a reason to stay after.

## Where it falls short

- **No explanation of cause.** The code has a sentence for every outcome and a full event log, but neither is shown. A player sees "Burned out before finals" and has to notice which numbers flashed.
- **The stats are never explained.** Nothing says what "job rizz" does or that the top three stats matter most.
- **Death is frequent and unearned.** About one run in six ends on a 1.4% slice with no way to influence it.
- **The employer wheel is theater.** Equal stripes hide that the outcome is mostly determined by stats.
- **Cramped phone layout.** A single non-scrolling viewport leaves 122px for the entire character sheet.
- **No history.** There is no way to review what happened in a run other than the money ledger of your best run on the leaderboard.
