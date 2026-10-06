# waterloo.careers — presentational React components (`pretty/ui.js` lines 1007–2536)

Scope: every component function between line 1007 and 2536 of `pretty/ui.js`, cross-referenced against
`pretty/styles.css`, `pretty/data.js`, and `chunks/simulation-worker.*.ts`. Lines outside that range
(helpers at 637–1006, the main component's spin handler at ~3871–3927 and its render tree at 4798–5220)
were read only where needed to explain props, timing, and math. Anything marked **(inferred)** was not
read directly from source.

Conventions: `n.jsx / n.jsxs` = React JSX runtime. `et` = React, `ea` = game-data, `er` = company-data,
`en` = admissions-data (module 66737 — not in the alias list I was given, confirmed by its exports),
`ei` = recruiting-model, `ed` = module 95503 (exports `DESIGN_TEAM_COOP_EVALUATION`,
`WE_ACCELERATE_EVALUATION`, `canUseWeAccelerate`; probably work-term-model — inferred), `ep` = finance-model,
`eb` = scholarship-model, `ef` = exchange-model, `ey` = grad-school-model.

---

## 0. Corrections to the component map I was given

| Fn | Line | Actual identity |
|----|------|-----------------|
| `e9` | 1007 | Lock icon SVG (used on locked top-bar links) |
| `te` | 1032 | Term timeline strip |
| `tt` | 1055 | **The roulette wheel** (conic-gradient disc; also the giant "company wheel" variant) |
| `tn` | 1220 | **Slot-machine reel** — NOT a wheel. Used for 5 "quick roll" stages |
| `tr` | 1272 | Job-offer picker (co-op offers) |
| `ta` | 1308 | Masters (grad school) application picker |
| `ti` | 1369 | Generic choice list (ending selection) |
| `tl` | 1393 | Undergrad program application picker |
| `ts` | 1513 | Admission results + program offer picker |
| `to` | 1555 | Animated currency metric (pulse on change — **not** a count-up) |
| `td` | 1581 | Animated radar axis value (`<tspan>`, same pulse pattern) |
| `tc` | 1604 | 7-axis radar chart ("Role fit" / job rizz) |
| `tu` | 1649 | Sidebar "dossier" |
| `tm` | 1737 | End-of-run summary card + share |
| `th` | 1961 | Narration dialog (speaker tag "ME") |
| `tg` | 1986 | Bank borrowing-limit notice dialog |
| `tp` | 2004 | "Complete a run first" locked-feature notice dialog |
| `tb` | 2022 | **Monte-Carlo simulation ("Outcomes") modal** — this is the stats modal, not `tf` |
| `tf` | 2334 | **Leaderboard modal** |
| `ty` | 2507 | Ranked list section used 3x inside the leaderboard |

---

## 1. Shared helpers the components depend on (ui.js 637–1006)

### 1.1 Number / label formatters

```js
// 890
eX = (e) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(e)
// 896
eY = (e) => `${eX(e)} (CAD)/HR`
// 897 — job.selectivity -> interview difficulty
eq = (e) => e <= 2 ? "easy interview" : e <= 4 ? "doable interview" : e <= 6 ? "hard interview"
          : e <= 8 ? "very hard interview" : "insane interview"
// data.js 440 — er.prestigeBandFor(job.prestige)
h  = (e) => e <= 2 ? "Trash" : e <= 4 ? "mid" : e <= 6 ? "ok i guess" : e <= 8 ? "ballin'" : "cracked af"
```

- `eX` yields whole-dollar strings like `$12,345` / `-$1,000` (en-CA, CAD, no cents).
- Other ad-hoc formatting inside components: `toLocaleString()` for counts, `toFixed(2)` for outcome
  percentages, `toFixed(1)` for program-distribution / location percentages and rizz scores,
  `toFixed(0)` for placement rate, `Math.round()` for averages and radar values.
- There is **no count-up / tweened number component** anywhere in this range. "Animation" of numbers is
  a CSS pulse (scale + colour flash) — see `to` / `td` in section 10.

### 1.2 Wheel geometry — `eo(options, equalSizes = false)` (line 665)

```js
eo = (e, t = !1) => {
  if (0 === e.length) return [];
  let n = e.map((e) => (t ? 1 : Math.max(0, e.weight))),
      r = n.reduce((e, t) => e + t, 0) > 0 ? n : e.map(() => 1),   // all-zero weights -> equal slices
      a = r.reduce((e, t) => e + t, 0),
      i = 0;
  return r.map((e) => {
    let t = (i / a) * 360, n = ((i += e) / a) * 360;
    return { start: t, end: n, centre: (t + n) / 2, size: n - t };
  });
};
```

Segment angle is **directly proportional to weight** (`size = weight / totalWeight * 360`), laid out
cumulatively clockwise from 0deg (top). In "company mode" (`equalSizes = true`) every segment is the
same size regardless of weight (the weighting still decides the outcome, it just is not drawn).

### 1.3 Colours, easing, tick throttle (lines 725–731)

```js
ew = { gold: "#f7c948", red: "#d94a38", green: "#1f8a60", ink: "#262622", cream: "#c9bfa9" }  // wheel segment fills
ej = new Set(["highschool-average", "scholarship", "study-grade", "recruit-count", "work-eval"]) // stages that use the SLOT reel
eE = 1e3 / 12                                  // min ms between tick sounds (max 12 ticks/second)
eS = ["/audio/click3.mp3", "/audio/click4.mp3"] // tick samples
eA = { x1: 0.12, y1: 0.68, x2: 0.11, y2: 1 }   // normal wheel easing  == cubic-bezier(0.12, 0.68, 0.11, 1)
eR = { x1: 0.55, y1: 0,    x2: 0.45, y2: 1 }   // company wheel easing == cubic-bezier(0.55, 0, 0.45, 1)
// 1003 — one coordinate of a cubic bezier with P0=0, P3=1
e7 = (e, t, n) => { let r = 1 - e; return 3*r*r*e*t + 3*r*e*e*n + e*e*e; }
```

Note the wheel fill palette `ew` is slightly different from the CSS theme tokens
(`--gold #f2c84b`, `--red #d64a38`, `--green #247958`, `--ink #1d1d19`, `--paper #eee9dc`, `--paper-deep #d8d0bd`).

### 1.4 html-to-image

Lines 1–656 are the bundled `html-to-image` library. The **only entry point the app calls is `ee`
(line 637) = `toBlob(node, options)`**, which internally runs `Z` (= `toCanvas`, line 600) -> `Q`
(= `toSvg`, line 580) and then `canvas.toBlob(cb, "image/png", 1)`. No `toPng` / `toJpeg` usage.

### 1.5 Wheel option shape (from main component `e2`, e.g. line 2835)

`{ id, label, short?, detail, weight, tone?, payload? }`. The wheel label shows `short ?? label`;
the slot row shows `label`. `tone` is one of `gold | red | green | ink | cream`.

---

## 2. `e9` — lock icon (1007–1031)

- `<svg class="top-meta-lock" viewBox="0 0 12 12" aria-hidden="true" focusable="false">` with a
  `<rect x=2.5 y=5.5 width=7 height=5 rx=0.6 fill=currentColor>` body and a shackle
  `<path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill=none stroke=currentColor stroke-width=1.2 stroke-linecap=square>`.
- CSS (685): 8x8px (7x7 at <=720px), `flex: none`.
- Used by the top bar: links "Leaderboard" and "Outcomes" get class `top-meta-link locked` plus this
  icon until a run has been completed in this browser session (`sessionStorage["waterloo-roulette:meta-unlocked"] === "1"`).
  Titles: `"Complete a run to unlock Leaderboard"` / `"Complete a run to unlock Outcomes"`; clicking
  while locked opens the `tp` notice.

---

## 3. `te` — term timeline strip (1032–1054)

Props: `{ state }` (reads `state.timeline[]` of `{ id, label, kind }` and `state.termIndex`).

```
empty:   <div class="timeline empty" aria-hidden="true" />
else:    <div class="timeline" aria-label="Study and work term timeline">
           <div class="timeline-node {kind} {current?} {past?}" key=id>
             <span>{label}</span>                         e.g. 1A, 1B, ...
             <small>STUDY | WORK | OFF</small>
           </div> ...
         </div>
```

- `kind` is `study | coop | off`; small text is `"STUDY"` for study, `"WORK"` for coop, `"OFF"` otherwise.
- `current` when `index === termIndex`; `past` when `index < termIndex`.
- No click handlers, no auto-scroll-into-view logic.

CSS (779–826): flex row, `min-height: 42px`, background `--paper-deep`, 2px ink bottom border,
`overflow-x: auto` with hidden scrollbar. Each node `flex: 1 0 56px; min-width: 56px; padding: 7px 8px 5px`,
1px ink right border, **`opacity: 0.42` for future terms, `0.7` for `.past`, `1` for `.current`**.
Label in the display font at 14px; the kind caption is 6px bold with 0.08em tracking.
Tints: `.coop` `#24795824` (green @ ~14%), `.off` `#d64a3821` (red @ ~13%), `.current` solid ink
background with gold text. `.timeline.empty` collapses (no border, `min-height: 0`).

---

## 4. `tt` — the roulette wheel (1055–1219)

### 4.1 Props

| Prop | Meaning |
|------|---------|
| `options` | Array of wheel options (section 1.5) |
| `rotation` | Cumulative target rotation in degrees (state owned by the main component; only ever increases) |
| `spinning` | true for `duration` ms after a spin starts |
| `busy` | true from spin start until the result is applied (`duration + hold`) |
| `companyMode` | true for stages `recruit-job` and `exchange-university` |
| `duration` | spin duration in ms |
| `onSpin` | click handler |
| `onBoundaryCrossing` | called when a segment boundary passes the pointer (plays a tick) |

### 4.2 How it is drawn — a CSS `conic-gradient` disc, not SVG/canvas

The wheel is a single element (`<button>` normally, `<div aria-hidden>` in company mode) whose
**inline `background` is a hard-stop conic gradient built from the segment geometry**:

```js
background: ((e, t = !1) => {
  let n = eo(e, t);
  if (0 === e.length) return "var(--ink)";
  let r = e.map((e, t) => {
    let r = n[t], a = r.start, i = r.end,
        l = ew[e.tone ?? (t % 2 ? "ink" : "gold")];       // default: alternate gold / ink
    return `${l} ${a}deg ${i}deg`;
  });
  return `conic-gradient(from 0deg, ${r.join(",")})`;
})(options, companyMode),
transform: `rotate(${rotation}deg)`,
"--spin-duration": `${duration}ms`,
"--spin-easing": companyMode ? "cubic-bezier(0.55, 0, 0.45, 1)" : "cubic-bezier(0.12, 0.68, 0.11, 1)",
```

Class string: `` `wheel ${companyMode ? "company-wheel" : ""} ${options.length > 16 ? "dense" : ""} ${spinning ? "spinning" : ""}` ``.

### 4.3 DOM

```
<div class="wheel-zone [company-wheel-zone]">
  <div class="pointer" aria-hidden="true" />
  <div class="wheel-frame [company-wheel-frame]">
    <!-- normal mode -->
    <button class="wheel ..." type="button" onClick={onSpin}
            disabled={busy || options.length === 0}
            aria-label={spinning ? "Wheel spinning" : busy ? "Wheel result pending" : "Spin the wheel"}
            style={...}>
      {children}
    </button>
    <!-- company mode: the disc is a non-interactive <div class="wheel company-wheel ..." aria-hidden="true"> -->
  </div>
  <!-- company mode only: transparent full-zone click target -->
  <button type="button" class="company-wheel-trigger" onClick={onSpin}
          disabled={busy || options.length === 0}
          aria-label={spinning ? "Company wheel spinning" : busy ? "Company result pending" : "Spin the company wheel"} />
</div>

children =
  <span class="wheel-rim" aria-hidden="true" />
  <span class="wheel-separator" style="transform: rotate({start}deg)" aria-hidden="true" />   (one per segment start)
  <span class="wheel-label" data-side="left|right" style="transform: ..."><span class="wheel-label-text">{short ?? label}</span></span>
  <span class="wheel-hub"><b>{spinning ? "ROLLING" : "SPIN"}</b></span>
```

Player-facing text: hub `SPIN` / `ROLLING`; labels from data. The strip under the wheel (rendered by
the main component, line 5152) is `<div class="result-strip {tone|cream}" aria-live="polite"><b>{lastResult.title}</b></div>`
and shows **`Click above to spin`** when there is no last result.

### 4.4 Separators

`u = eo(options, companyMode).map(s => s.start)`. One 1px black line per segment start, drawn as a
span `width: 1px; height: 50%; top: 0; left: calc(50% - 0.5px); transform-origin: 50% 100%` rotated
by `rotate(${start}deg)` (so it runs from the centre to the rim). Stride:
`h = companyMode && options.length > 32 ? 8 : 1` — on a crowded company wheel only every 8th separator
is rendered (`index % h === 0`).

### 4.5 Labels

Which labels render (`m`, line 1068):

```js
!companyMode && options.length > 24 ? []                    // normal wheel with >24 options: NO labels at all
: companyMode
    ? centres.length <= 24 ? all indices
      : centres.map((c, n) => { let r = (((c + rotation) % 360) + 360) % 360;
                                return { index: n, dist: Math.min(r, 360 - r) }; })
               .sort((a, b) => a.dist - b.dist).slice(0, 24)   // the 24 segments nearest the pointer
               .map(e => e.index).sort((a, b) => a - b)
    : all indices
```

Because `rotation` is the *target* rotation (it is set to its final value at spin start and CSS
animates toward it), on a big company wheel the 24 labels rendered during a spin are the ones that will
end up around the pointer when it stops.

Placement (line 1171):

```js
transform: `rotate(${centre}deg) translateY(calc(var(--wheel-size) * ${companyMode ? (index % 2 ? -0.44 : -0.46) : -0.34})) rotate(90deg)`
"data-side": (((centre + rotation) % 360) + 360) % 360 >= 180 ? "left" : "right"
```

- The label box is absolutely positioned with its centre on the wheel centre
  (`top: calc(50% - 6px); left: calc(50% - 44px); width: 88px; transform-origin: 44px 6px`), then
  rotated to the segment's centre angle, pushed outward along the radius by 34% of the wheel diameter
  (= 68% of the radius), and finally rotated 90deg so the **text runs along the radius, reading from
  the rim toward the hub**.
- Company wheel: labels sit at 88% / 92% of the radius, alternating by index parity to stagger
  neighbours; box is 74px wide (`transform-origin: 37px 6px`), 10px / weight 800 / -0.03em tracking.
- Text: white, bold, `text-shadow: 1px 1px 0 var(--ink)`, `font-size: clamp(6px, 0.8vw, 9px)`
  (`.dense`, i.e. >16 options: `clamp(5px, 0.6vw, 7px)`; <=430px viewport: 6px), single line with ellipsis.
- `data-side` picks which end of the box the text hugs: `left` -> `text-align: left; margin-right: auto`
  (rim end), `right` -> `text-align: right; margin-left: auto` (hub end). It is computed from the
  target rotation, so it flips at spin start rather than continuously. The design intent of this
  left/right switch is **uncertain** — I can only report the mechanics.

### 4.6 Pointer, hub, rim, frame (CSS 873–918, 1291–1421)

- `.wheel-zone`: `--wheel-size: min(52vh, 430px, 42vw)`; `display: grid; place-items: center`,
  background `--paper-deep`, `overflow: hidden`, `position: relative`.
  Short desktop (`max-height: 720px` and `min-width: 721px`): `min(48vh, 340px, 38vw)`.
  Mobile (`max-width: 720px`): `min(78vw, 350px, 44dvh)`.
- `.pointer`: CSS-border triangle pointing **down** at top centre — `border-left/right: 15px solid transparent;
  border-top: 29px solid var(--red); top: 8px; left: calc(50% - 15px); z-index: 4;
  filter: drop-shadow(0 2px 0 var(--ink))`. The pointer is fixed; the disc rotates beneath it.
- `.wheel`: `width/height: var(--wheel-size); border-radius: 50%; border: 7px solid var(--ink);
  box-shadow: 0 0 0 4px var(--gold), 0 0 0 7px var(--ink)` (ink / gold / ink triple ring);
  `cursor: pointer` (`wait` when disabled); `.spinning` adds `will-change: transform`.
- `.wheel-hub`: gold disc, `width/height: 26%`, 5px ink border, centred, `z-index: 3`; text in the
  display font `clamp(18px, 3vh, 28px)`; while spinning the text shrinks to
  `clamp(11px, calc(var(--wheel-size) * 0.042), 20px)` with -0.05em tracking so "ROLLING" fits.
  Hover (wheel not disabled): hub turns red with white text.
- `.wheel-rim`: an 18px gold dot with 3px ink border at the exact centre (sits under the hub).
- `.wheel-frame` is `display: contents` in normal mode.

Company wheel variant: `.company-wheel-zone { --company-wheel-size: clamp(1100px, 130vw, 1600px); display: block; overflow: clip }`
(mobile: `min(145vw, 820px)`); `.company-wheel-frame` is that size, `position: absolute; top: 48px; left: 50%; transform: translate(-50%)`.
So the company wheel is a **giant disc whose top arc is the only part visible** inside the panel —
it reads like a curved horizontal band of employer names sliding under the pointer
(`.company-wheel-zone .pointer { top: 10px; z-index: 6 }`). The transparent `.company-wheel-trigger`
(`position: absolute; inset: 0; z-index: 5`) makes the whole zone clickable; focus ring is a 3px red
inset outline.

### 4.7 Spin animation

**The visual spin is a plain CSS transition on `transform`:**

```css
.wheel { transition: transform var(--spin-duration, 2.2s) var(--spin-easing, cubic-bezier(0.12, 0.68, 0.11, 1)); }
```

The main component sets the `rotation` state to the final angle in one step; the browser animates it.
Normal easing `cubic-bezier(0.12, 0.68, 0.11, 1)` is a fast launch with a very long deceleration;
company easing `cubic-bezier(0.55, 0, 0.45, 1)` is a symmetric ease-in-out.

**Durations** (main component, 3871–3873):

```js
tv = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
tw = tv ? 40 : "recruit-job" === r.stage ? 1800 : ej.has(r.stage) ? 520 : 2200,   // spin duration (ms)
tj = tv ? 120 : 1500,                                                              // hold before result is applied
```

- Normal wheel: 2200 ms. Company wheel on `recruit-job`: 1800 ms (`exchange-university` uses 2200 ms).
  Slot reel stages: 520 ms.
- After `tw` ms -> `spinning = false`. After `tw + tj` ms -> the outcome reducer runs and `busy = false`
  (so the player looks at the landed result for 1.5 s before the game advances).

**Target rotation math** (main component, 3899–3923). The outcome is chosen first by a seeded weighted
pick; the wheel is then rotated to land inside that segment:

```js
// weighted pick: eC(seed, rngCounter) is a deterministic 0..1 hash (FNV-1a + xorshift)
let n = t * e.reduce((e, t) => e + Math.max(0, t.weight), 0);
for (let t = 0; t < e.length; t += 1) if ((n -= Math.max(0, e[t].weight)) <= 0) return t;

s = "recruit-job" === r.stage || "exchange-university" === r.stage      // companyMode
l = eo(e7, s)[i]                                    // geometry of the winning segment (i = its display index)
d = eC(r.seed, r.rngCounter, `wheel-landing:${r.stage}:${i}`)   // second deterministic 0..1 value
e = Math.min(2, 0.12 * l.size)                      // keep-out margin from each edge: 12% of the slice, max 2deg
t = Math.max(0, l.size - 2 * e)                     // usable arc
n = Math.max(0, Math.min(1, d))
o = l.start + e + t * n                             // landing angle in wheel-local degrees
a = (360 - o) % 360                                 // rotation (mod 360) that puts angle o under the top pointer
m(360 * Math.ceil((u + (s ? 180 : 1332) - a) / 360) + a)   // new cumulative rotation; u = current rotation
```

i.e. new rotation = the smallest angle congruent to `a` (mod 360) that is at least
`current + 1332deg` (3.7 turns) for a normal wheel, or `current + 180deg` for the company wheel.
Actual travel is therefore 1332–1692deg (normal) or 180–540deg (company), always clockwise, and the
rotation value accumulates across spins (reset to 0 only on RESTART). The landing point inside the
slice is randomised but never within 2deg (or 12% of the slice) of an edge.

On `recruit-job` the display order of the employer options is a seeded Fisher–Yates shuffle of the
weighted pool (`e7`, line 3734), and `i` is looked up by id in that shuffled order.

**Tick sounds — a requestAnimationFrame loop that mirrors the CSS curve** (1091–1128). It does not
move anything; it only predicts the current angle so it can click on boundary crossings:

```js
let e = d.current,            // rotation at rest before this spin (ref updated whenever !spinning)
    n = t - e;                // total travel
let a = companyMode ? eR : eA, s = performance.now(), c = 0, m = e, h = -1 / 0,
g = (t) => {
  let r, i = Math.min(1, (t - s) / l),                         // linear progress 0..1
      d = e + n * ((e, t) => {                                 // eased angle
        let n = Math.max(0, Math.min(1, e));
        if (0 === n || 1 === n) return n;
        let r = 0, a = 1, i = n;
        for (let e = 0; e < 12; e += 1) e7((i = (r + a) / 2), t.x1, t.x2) < n ? (r = i) : (a = i);  // 12-step bisection for bezier t
        return e7(i, t.y1, t.y2);
      })(i, a);
  ((r = m),
   u.reduce((e, t) => e + Math.max(0, Math.floor((t + d) / 360) - Math.floor((t + r) / 360)), 0) > 0   // any segment start crossed 0deg since last frame?
     && t - h >= eE                                             // and >= 83.3 ms since last tick
     && (o(), (h = t)),                                         // -> onBoundaryCrossing()
   (m = d),
   i < 1 && (c = window.requestAnimationFrame(g)));
};
c = window.requestAnimationFrame(g); return () => window.cancelAnimationFrame(c);
```

- Guard: the effect returns early if `!spinning || starts.length === 0 || duration <= 0` or travel is 0.
- `onBoundaryCrossing` (main `tS`, 3878) plays a random one of the two decoded click buffers through a
  Web Audio `AudioBufferSourceNode` (skipped when muted). At most one tick per frame and 12 per second,
  so ticks blur during the fast phase and separate out as the wheel slows.
- Other audio wired by the main component: `/audio/slot.mp3` (HTMLAudio, restarted on each slot roll),
  `/audio/button.mp3` (Web Audio, on capture-phase `pointerdown` on any `<button>`), and
  `/audio/loo-intro.mp3` intro sting on load / RESTART with a linear fade (`volume = 1 - currentTime/duration`).

### 4.8 Other spin triggers and guards (main component)

- Spin is refused while `busy`, while any narration scene is queued, while the bank notice is pending,
  when there are no options, or when `stage === "done"` (3898).
- **Space bar** spins unless focus is in an `<input>` or on a `<button>` (4746).
- In `term-event` with `multiTaskRollsRemaining > 0` the wheel auto-spins after 350 ms (4734).

### 4.9 Reduced motion

- JS: `tw = 40` ms, `tj = 120` ms (read via `matchMedia(...).matches` on every render; no change listener).
- CSS (2775): `.wheel, .wheel-label-text, .slot-reel.rolling, .slot-cabinet.rolling .slot-crank-arm
  { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important }` and
  `animation-duration: 0.01ms !important` for the narration fade/rise and the metric pulses.
- Net effect: the wheel/reel snaps to the result, the tick loop runs for ~40 ms (at most one click),
  and the result is applied 160 ms after the click instead of 3.7 s.

---

## 5. `tn` — slot-machine reel (1220–1271)

Used instead of the wheel when `ej.has(stage)`: `highschool-average`, `scholarship`, `study-grade`,
`recruit-count`, `work-eval`.

Props: `{ options, targetIndex, run, spinning, busy, duration, onSpin }`.

```js
o = Math.max(0, (targetIndex ?? (options.length > 20 ? options.length + Math.floor(0.75 * options.length) : options.length)) - 1),
d = Array.from({ length: 8 }, () => options).flat(),              // the option list repeated 8 times
c = { "--slot-shift": `${-72 * o}px`, "--slot-duration": `${duration}ms` };
```

Main component supplies `targetIndex = 6 * options.length + winningIndex` and increments `run` per spin
(3908); `targetIndex` is `null` when the stored spin belongs to a different stage (5133).

```
<div class="slot-zone">
  <div class="slot-cabinet [rolling]" style="--slot-shift; --slot-duration">
    <button type="button" class="slot-machine" onClick={onSpin} disabled={busy || options.length === 0}
            aria-label={spinning ? "Slot reel rolling" : busy ? "Slot result pending" : "Roll the slot reel"}>
      <span class="slot-marker" aria-hidden="true" />
      <span class="slot-window">
        <span class="slot-reel [rolling]" key={run}>
          <span class="slot-row {tone ?? 'ink'}"><b>{label}</b></span>   x (8 * options.length)
        </span>
      </span>
    </button>
    <span class="slot-crank" aria-hidden="true"><span class="slot-crank-arm"><span class="slot-crank-grip" /></span></span>
  </div>
</div>
```

Mechanics (CSS 919–1089):

- Rows are exactly **72px** tall. `.slot-machine` is 230px tall with a 7px border -> a 216px window = 3
  visible rows. `.slot-marker` (`top: 72px; height: 72px`, 3px red top and bottom borders) frames the
  **middle row**, which is the result. `--slot-shift = -72 * (target - 1)` therefore puts row `target`
  in the middle with its neighbours above and below.
- Idle: `.slot-reel { transform: translateY(var(--slot-shift)) }`. With no target, the middle row is
  option 0 of the second copy (or the option at 75% of the list when there are more than 20 options).
- Rolling: the reel is **re-keyed by `run`** so it remounts each spin, then
  `animation: slot-roll var(--slot-duration) cubic-bezier(0.12, 0.68, 0.11, 1) forwards` runs from
  `translateY(0)` to `translateY(var(--slot-shift))` — roughly six full passes of the list in 520 ms.
  When `spinning` flips off the static transform holds the same position, so there is no jump.
- `.slot-window::before/::after`: 72px ink-to-transparent gradients at 0.72 opacity that darken the top
  and bottom rows.
- Row tints: `.gold #eadca9`, `.green #b8d1c3`, `.red #d9aaa0`, `.ink #bbb6a9`, default `--paper`
  (note `cream` has no rule, so cream-toned options fall back to paper); 1px `#8e8879` divider;
  label in the display font `clamp(20px, 3vw, 34px)`, single line with ellipsis.
- Cabinet: `width: min(620px, 100% - 70px)`; machine has the same ink/gold/ink triple ring as the wheel.
- Crank: 44x74px block to the right of the cabinet (`left: 100%`), gold pivot dot, red 34x8px arm
  (`transform-origin: 5px`), gold 14x28px grip. While `.slot-cabinet.rolling`, the arm runs
  `crank-turn`: `rotate(-18deg)` -> `rotate(702deg)` (two full turns) over the slot duration, same easing.
- No tick loop for the reel; the main component plays `/audio/slot.mp3` once per roll.

---

## 6. Pickers and choice lists

All of these replace the wheel in the middle row of `.roulette-panel`
(`grid-template-rows: 66px minmax(0, 1fr) 48px` = prompt block / interactive area / result strip).

### 6.1 `tl` — program application picker (1393–1512), stage `applications`

Props: `{ mainEngineeringId, backupEngineeringId, selectedMathProgramIds, onChange(kind, id), onSubmit }`
where `kind` is `"main" | "backup" | "math"`.

```
<div class="application-picker">
  <div class="application-form">
    <aside class="application-rules" aria-label="Application rules">
      <ul><li>You can only apply to 3 Waterloo programs</li>
          <li>If you apply to engineering, you can select one backup</li></ul>
    </aside>
    <section class="program-choice-group" aria-labelledby="main-engineering-label">
      <h3 id="main-engineering-label">ENGINEERING</h3>
      <div class="program-choice-grid">
        <button type="button" class="program-choice" aria-pressed={id === main} disabled={...}>
          <b>{short}</b><span>{name.replace(/ Engineering$/, "")}</span>
        </button> ...
      </div>
    </section>
    <section class="program-choice-group" aria-labelledby="backup-engineering-label">
      <h3 id="backup-engineering-label">BACKUP ENGINEERING</h3> ... same buttons, aria-pressed={id === backup}
    </section>
    <section class="program-choice-group math-application-group" aria-labelledby="math-programs-label">
      <h3 id="math-programs-label">MATHEMATICS</h3>
      <div class="program-choice-grid math-program-choice-grid"> ... <b>{short}</b><span>{name}</span>
    </section>
    <button type="button" class="application-submit" disabled={!isValidApplicationSelection(main, backup, math)}>SUBMIT APPLICATIONS</button>
  </div>
</div>
```

- Engineering list = `PROGRAMS.filter(p => p.faculty === "ENG")` (9 programs: SE, CE, EE, TRON, MECH,
  SYDE, MGMT, NANO, BME). Math list = `SELECTABLE_MATH_APPLICATION_IDS`
  `["mathbba", "csbba", "cfm", "farm", "cs", "math"]`.
- Disable rules: main button disabled if it is the current backup, or if no main is chosen and the
  application count is already 3; backup button disabled if no main is chosen or it equals the main;
  math button disabled if unselected and count >= 3.
- `applicationCount(main, math) = +!!main + math.length` (the backup does **not** count toward the 3).
  Valid when `count > 0 && count <= 3 && (!backup || main) && main !== backup`.
- Toggle semantics live in the main component (4884): clicking a selected item deselects it; clearing
  the main clears the backup; choosing a main equal to the backup clears the backup.
- Toggle state is exposed with `aria-pressed` (these are toggle buttons, not checkboxes/radios).

CSS (1096–1211): `.application-picker` centres an `.application-form` of `width: min(780px, 100%)`,
8px gaps, scrolls if needed. Rules box: ink background, paper text, 8px bold, right-aligned
(`justify-self: end`; stretches on mobile). Each group: 2px ink border, ink header bar with gold 8px
caps. Grid: 5 columns (math grid 4; mobile 2) with `gap: 1px` over an ink background to draw hairlines.
`.program-choice`: paper tile, `min-height: 46px`, code in display font 17px over a 7px uppercase
caption; hover -> `--paper-deep`; **selected (`[aria-pressed="true"]`) -> gold fill with a 3px inset
red ring**; disabled -> `opacity: 0.42`, `cursor: not-allowed`; focus-visible -> 3px red inset outline.
Submit: full-width gold bar, 48px min-height, green on hover/focus, grey `#aaa596` when disabled.

### 6.2 `ta` — masters application picker (1308–1368), stage `grad-applications`

Props: `{ selectedIds, onToggle(id), onSubmit }`. Same shell and classes as 6.1:

- `<aside class="application-rules" aria-label="Masters application rules">` with
  `Apply to up to {MAX_GRAD_APPLICATIONS = 4} masters programs` and
  `A professor reference improves admit odds`.
- `<section class="program-choice-group" aria-labelledby="grad-schools-label">`,
  `<h3 id="grad-schools-label">MASTERS ({selected}/{4})</h3>`.
- `.program-choice-grid.math-program-choice-grid` (4 columns) of `ey.GRAD_SCHOOLS` (15 schools) as
  `<button class="program-choice" aria-pressed disabled={!selected && selected.length >= 4}><b>{short}</b><span>{name}</span></button>`.
- `<button class="application-submit" disabled={!isValidGradApplicationSelection(ids)}>SUBMIT APPLICATIONS</button>`
  (valid = 1–4 known ids).

### 6.3 `ts` — admission results + program offer picker (1513–1554), stage `program-select`

Props: `{ programs, results, onSelect(id) }`.

```
<div class="offer-picker program-picker">
  <div class="admission-results" aria-label="Admission results">
    <span class="accepted|rejected">{program.short} · OFFER | NO OFFER</span>   (results with source !== "fallback")
  </div>
  <div class="offer-list program-offer-list">
    <button type="button" onClick={() => onSelect(id)}>
      <span class="offer-company">{program.name}</span>
      <span class="offer-role">{program.faculty}</span>
      <b>ACCEPT</b>
    </button> ...
  </div>
</div>
```

Result chips: 7px bold, 1px ink border; `.accepted` green/white, `.rejected` red/white. The automatic
fallback offer (Geomatics, `source: "fallback"`) is hidden from the chips but still appears as a card.
Selecting a program also queues the "THE ACCEPTANCE ARC" narration scene (main, 5006).

### 6.4 `tr` — co-op offer picker (1272–1307), stage `offer-select`

Props: `{ jobs, returnOfferIds: Set, onSelect(id) }`.

```
<div class="offer-picker"><div class="offer-list">
  <button type="button" onClick={() => onSelect(job.id)}>
    <span class="offer-company">{job.company}</span>
    <span class="offer-role">{job.role}</span>
    <span class="offer-meta">[RETURN OFFER · ]{location} · {prestigeBandFor(prestige)} · {eq(selectivity)} · {eY(pay)}</span>
    <b>ACCEPT</b>
  </button> ...
</div></div>
```

Illustrative meta line (values made up, format exact): `RETURN OFFER · New York, NY · cracked af · insane interview · $85 (CAD)/HR`.

### 6.5 `ti` — generic choice list (1369–1392), stage `ending-select`

Props: `{ choices: [{ id, title, detail, meta }], onSelect(id) }`. Identical markup to 6.4 with
`offer-company = title`, `offer-role = detail`, `offer-meta = meta`, and CTA **`CHOOSE`**.
Choices are built by the main component (3758): "Survival job", masters offers, "{Company} full-time"
return offers, "I'm feeling lucky" (YC moonshot), or "Open to work".

### 6.6 Shared card styling (`.offer-picker`, `.offer-list`; CSS 1090–1290)

`.offer-picker`: `--paper-deep` background, 12px padding, scrolls. `.offer-list`:
`grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px`. Each `<button>` is a card:
2px ink border, paper fill, left-aligned, 12px padding, inner grid `minmax(0, 1fr) auto`.
Title in display font 22px (ellipsised; wraps inside `.program-offer-list`), role 8px on its own row,
meta 8px bold, CTA `<b>` in green 8px placed top-right (`grid-area: 1 / 2`). Hover / focus-visible:
**whole card turns gold** and the CTA turns ink. No selected state — one click commits.

---

## 7. Sidebar — `tu` "dossier" (1649–1736) and radar `tc` (1604–1648)

### 7.1 `tu` structure

Props: `{ state }`.

```
<aside class="dossier">
  <div class="dossier-head">
    <div><h2>{program.short ?? "—"}</h2><p>{major ?? program.name ?? "No program"}</p></div>
    <div class="id-stamp">{sequenceName ?? "—"}</div>
  </div>
  <tc rizz={state.rizz} />
  <div class="stat-grid">
    <div><span>{studyTerms ? "AVERAGE" : "HS AVERAGE"}</span>
         <b>{studyTerms ? `${Math.round(average)}%` : highSchoolAverage ? `${highSchoolAverage}%` : "—"}</b></div>
    <div><span>INTEGRITY</span><b class="integrity-danger|integrity-warning|integrity-safe">{integrity}/2</b></div>
    <div><span>SAVINGS</span><to value={savings} /></div>
    <div><span>CO-OPS</span><b>{jobs.length}</b></div>
  </div>
  {(activeTeam || bestJob) && <section class="compact-records">
    {activeTeam && <div><span>TEAM</span><b>{team.name}</b><small>{RANKS[team.rank]}</small></div>}
    {bestJob && <div><span>BEST CO-OP · {prestigeBandFor(prestige)}</span><b>{company}</b><small>{role} · {location}</small></div>}
  </section>}
</aside>
```

- Integrity class: `<= 0` danger (red), `=== 1` warning (gold), otherwise safe (green). Max is the
  literal `2`.
- `activeTeam` = first of `teams.filter(t => t.active)`. `RANKS = ["MEMBER", "LEAD", "DIRECTOR", "CAPTAIN"]`.
- `bestJob` = the entry in `state.jobs` with a non-null `job` and the highest `job.prestige`.
- **There is no job-history list, team list, or event log in the sidebar** — only one team and the
  single best co-op. `state.log` (up to 80 entries) and `lastResult.detail` are stored but no component
  renders them; the full work history only appears on the end card (last 6 terms).
- No ARIA attributes on the sidebar beyond the radar's `role="img"` label.

CSS (1457–1688): ink panel with paper text, 2px ink border, scrolls. Head: `min-height: 88px`,
15px padding; program code in gold display font 38px (`line-height: 0.9`), subtitle 8px `#aaa596`;
`.id-stamp` is a 1px red outlined tag with red 8px bold text. `.stat-grid`: 2 columns, cells with
`#45443b` hairlines and 14px padding, caption 7px `#8f8a7d` with 0.09em tracking, value in display
font 21px. `.compact-records` rows: caption / 9px bold value / 7px muted detail, each ellipsised.

Mobile (`max-width: 720px`): `.game-grid` stacks into `minmax(0, 1fr)` + a fixed **122px** dossier row;
the dossier becomes a 3-column grid `74px 122px minmax(0, 1fr)` (head / radar / stats);
`.id-stamp`, `.compact-records`, and the radar's axis labels are hidden; stat values drop to 16px.
Desktop layout is `.game-grid { grid-template-columns: minmax(420px, 1fr) 280px; gap: 12px; padding: 12px }`.

### 7.2 `tc` radar chart — geometry

Props: `{ rizz }` (object keyed by axis). `ea.AXES = ["systems", "product", "aiData", "quant", "hardware", "mechanical", "bioNano"]`;
`AXIS_LABELS = { systems: "SYSTEMS", product: "PRODUCT", aiData: "AI / DATA", quant: "QUANT",
hardware: "ELECTRICAL", mechanical: "MECH / ROBOTICS", bioNano: "BIO / NANO" }`.

```js
t = (e, t) => {                                   // (axisIndex, scale 0..1) -> [x, y]
  let n = (2 * Math.PI * e) / ea.AXES.length - Math.PI / 2;      // first axis straight up, then clockwise
  return [110 + 72 * Math.cos(n) * t, 110 + 72 * Math.sin(n) * t];
},
r = ea.AXES.map((n, r) => t(r, Math.min(100, e[n]) / 100).join(",")).join(" ");   // value polygon points
```

- `viewBox="0 0 220 220"`, centre (110, 110), outer radius **72**. Scale is linear 0–100; values above
  100 are clamped for the polygon (the printed number is not clamped).
- Rings: four `<polygon class="radar-ring">` heptagons at scales `[0.25, 0.5, 0.75, 1]` (no circles).
- Spokes: one `<line x1=110 y1=110 x2 y2>` per axis to scale 1.
- Value: `<polygon class="radar-value" points={r}>`.
- Labels: `<text class="radar-axis-label">` at scale **1.28** (radius 92.16);
  `textAnchor = x < 106 ? "end" : x > 114 ? "start" : "middle"`. Content is the axis label followed by
  `<td value={rizz[axis]} x={x} />`, a `<tspan class="radar-axis-value" x={x} dy="9">` holding
  `Math.round(value)` on a second line.
- Wrapper: `<div class="radar-shell"><svg class="radar" role="img" aria-label="Role fit: SYSTEMS 12, PRODUCT 8, ...">`
  (label built from every axis label + rounded value).

CSS (1496–1539): shell 230px tall (122px mobile) with a bottom hairline; svg fills it with
`padding: 12px 22px; overflow: visible`. Rings `stroke: #56544b` 1px no fill; spokes `#45443b` 1px;
value polygon `fill: #f2c84b2e` (gold @ 18%) with a 3px gold stroke, `stroke-linejoin: round`;
axis labels `#aaa596` 5.5px bold; values gold 8px with `transform-box: fill-box; transform-origin: 50%`
so they can pulse in place.

---

## 8. `tm` — end-of-run summary and share card (1737–1960)

Rendered instead of `.game-grid` when `state.stage === "done"` (the timeline strip stays above it).
Props: `{ state, onRestart, onViewStatistics, onViewLeaderboard }`.

### 8.1 Derived data

```js
i = e.jobs.flatMap((e) => (e.job ? [e.job.location] : []))      // locations of real jobs
achievements = [
  { label: "Made it into Cali",     achieved: "yc" === e.endingCode || i.some((e) => e.endsWith(", CA")) },
  { label: "Made it to NYC",        achieved: i.includes("New York, NY") },
  { label: "Made it outta the GTA", achieved: "yc" === e.endingCode || !!e.exchange.universityId || i.some((e) => er.isOutsideGtaAndLoo(e)) },
  { label: "Masters admit",         achieved: !!e.endingCode?.startsWith("grad:") },
  { label: "Return full-time",      achieved: !!e.endingCode?.startsWith("return:") },
  { label: "Graduated",             achieved: "graduated" === e.status },
]
s = eb.scholarshipOutcome(e.scholarshipId ?? "none")            // { label, savings, ... }
```

Note `", CA"` means California here (Canadian locations end in province codes such as `, ON`).

### 8.2 DOM

```
<div class="summary-card">
  <div ref={shareRef} class="summary-share-target">          <-- the node that is rasterised
    <span class="summary-stamp">{status.toUpperCase()}</span>     GRADUATED / DEAD / EXPELLED / DROPOUT / WITHDRAWN
    <h1>{state.ending}</h1>                                        the "fate" headline
    <p class="summary-lede">{program.name} · [{major} · ]{sequenceName}[ · Exchange: {university.short ?? "ABROAD"}]</p>
    <div class="summary-grid">
      <div><span>FINAL CAV</span><b>{Math.round(average)}%</b></div>
      <div class="summary-savings"><span>FINAL SAVINGS</span><b>{eX(savings)}</b>
           [endingCode === "yc": <small class="yc-seed-bonus">+{YC_SEED_FUNDING.toLocaleString()}$ Seed</small>]</div>   -> "+500,000$ Seed"
      <div><span>WORK TERMS</span><b>{jobs.length}</b></div>
      <div><span>INTEGRITY POINTS</span><b class="integrity-*">{integrity}/2</b></div>
      <div class="summary-scholarship"><span>SCHOLARSHIP</span><b title={label}>{label}[ · {eX(savings)}]</b></div>
    </div>
    <div class="summary-achievements" role="list" aria-label="Run achievements">
      <div class="achievement-check [checked]" role="checkbox" aria-checked={achieved} aria-readonly="true">
        <span aria-hidden="true">{achieved ? "✓" : ""}</span><b>{label}</b>
      </div> x 6
    </div>
    <div class="summary-jobs">
      {jobs.slice(-6).map: <div><span>{term}</span><b>{job?.company ?? evaluation}</b>
           <small>{job ? `${role} · ${location}` : "Alternate work-term outcome"} · {evaluation}</small></div>}
      [endingCode === "survival-job": <div><span>FT</span><b>McDonald's</b><small>McDonald's crew member</small></div>]
    </div>
    <p class="summary-share-brand">Waterloo Roulette</p>
  </div>
  <div class="summary-actions">
    <button type="button" class="share-button" disabled={sharing}>{sharing ? "SHARING…" : "SHARE RESULT"}</button>
    <button type="button" class="restart-large">NEW RUN</button>
    <button type="button" class="statistics-button">VIEW OUTCOME STATISTICS</button>
    <button type="button" class="leaderboard-button">LEADERBOARD</button>
  </div>
</div>
```

Ending headlines found in the reducer (outside my range, for reference): `Got into YC`,
`Got lost forever`, `maybe getting into uni was sheer luck`, `Open to work`, `sometimes life happens...`,
`Survival job`, `Dropped out for full-time at {company}`, `Return offer at {company}`,
`Masters at {school}` / `Masters offer`.

Accessibility oddity worth not copying blindly: the achievements container is `role="list"` but its
children are `role="checkbox"` (read-only), not `listitem`.

### 8.3 Styling (CSS 1689–1871)

- `.summary-card`: ink card, 3px ink border, `width: min(760px, 100% - 28px)`,
  `max-height: calc(100% - 28px)`, `margin: 14px auto`, `padding: 28px`, scrolls internally.
- `.summary-share-target`: ink background, paper text, `position: relative`, `padding-bottom: 4px`.
- `.summary-stamp`: absolutely positioned top-right, 2px red outline, red 9px bold.
- `h1`: gold display font, `clamp(34px, 6vh, 58px)`, `line-height: 0.95`, -0.05em tracking,
  `max-width: 560px`, `padding-right: 90px` to clear the stamp.
- `.summary-lede`: 9px `#aaa596`.
- `.summary-grid`: 4 columns with `#45443b` hairlines (cells share `.stat-grid` cell styles: 7px caption,
  21px display value); `.summary-scholarship` spans the full row; `.yc-seed-bonus` is gold 8px bold.
- `.summary-achievements`: 5 columns (the 6th item wraps to a second row); each item is a 14px square
  box + 7px bold label, muted `#777368` until `.checked`, which fills the box gold with an ink tick and
  turns the label paper.
- `.summary-jobs`: 3 columns; at most the last 6 work terms (plus one extra `FT` row on the
  survival-job ending); term in gold 7px, company 9px bold, detail 7px muted, all ellipsised.
- `.summary-share-brand`: display font 11px uppercase `#777368`, 0.08em tracking.
- At `max-width: 430px` the grid, jobs and achievements all become 2 columns.
- `.summary-actions`: stacked full-width buttons with 7px gaps. SHARE RESULT = paper fill (gold on
  hover, `opacity: 0.7; cursor: wait` while sharing), NEW RUN = gold (green on hover), both display
  font 18px. The statistics and leaderboard buttons are ghost buttons: transparent, 2px ink border on
  an ink card (so effectively borderless), muted `#8f8a7d` 11px text; hover -> ink fill, paper text.

### 8.4 Share flow (1761–1791)

```js
u = async () => {
  let t = o.current;                               // .summary-share-target
  if (t && !d) {
    c(!0);                                         // sharing = true
    try {
      let n = await ee(t, {                        // html-to-image toBlob
        cacheBust: !0,
        pixelRatio: Math.min(2, window.devicePixelRatio || 2),
        backgroundColor: "#1d1d19",
      });
      if (!n) return;
      let r = new File([n], "waterloo-roulette-result.png", { type: "image/png" }),
          a = `Waterloo Roulette — ${e.ending} \xb7 ${eX(e.savings)}`;
      if (navigator.canShare?.({ files: [r] }))
        return void (await navigator.share({ files: [r], title: "Waterloo Roulette", text: a }));
      if (navigator.share)
        return void (await navigator.share({ title: "Waterloo Roulette", text: a, url: window.location.href }));
      let i = URL.createObjectURL(n), l = document.createElement("a");
      ((l.href = i), (l.download = r.name), l.click(), URL.revokeObjectURL(i));
    } catch (e) {
      if (e instanceof DOMException && "AbortError" === e.name) return;
    } finally { c(!1); }
  }
};
```

- Function: **`toBlob`**; options `cacheBust: true`, `pixelRatio: min(2, devicePixelRatio || 2)`,
  `backgroundColor: "#1d1d19"` (the ink colour). No explicit width/height, so the image is the live
  size of the share target. Output is PNG.
- Only the upper block is captured: the action buttons are outside the ref, and the branding line
  `Waterloo Roulette` is inside it so it lands on the image.
- Fallback chain: (1) Web Share Level 2 with the PNG file; (2) `navigator.share` with title/text/URL
  and no image; (3) download the PNG through a temporary `<a download>`.
- File name `waterloo-roulette-result.png`; title `Waterloo Roulette`; text
  `Waterloo Roulette — {ending} · {$savings}`.
- All errors are swallowed (the catch block has no other branch); there is no failure message.
- Separately, the top bar's COPY button (main, 4774) writes `origin + pathname` to the clipboard and
  shows `Game link copied` in the result strip.

---

## 9. Dialogs

### 9.1 `th` — narration scene (1961–1985)

Props: `{ scene: { id, title, lines[], continueLabel }, onContinue }`.

```
<div class="narration-backdrop">
  <section class="narration-window" role="dialog" aria-modal="true" aria-labelledby="narration-title-{id}">
    <span class="narration-speaker">ME</span>
    <h2 id="narration-title-{id}">{title}</h2>
    <div class="narration-copy">{lines.map(l => <p key={l}>{l}</p>)}</div>
    <button type="button" autoFocus onClick={onContinue}>{continueLabel} →</button>
  </section>
</div>
```

- **No typewriter effect.** All lines appear at once. The only motion is the backdrop
  `narration-fade-in` (opacity 0 -> 1, 0.18s ease-out) and the window `narration-rise-in`
  (`translateY(18px)` -> 0, 0.24s ease-out).
- The speaker tag is the hard-coded string `ME`. The button label is `{continueLabel} →`.
- Focus: the button has `autoFocus`, so Enter/Space dismisses. There is no focus trap, no Escape
  handler, and no backdrop-click dismissal.
- Scenes are a queue in the main component (`p`); `p[0]` is shown and Continue shifts it. Spinning is
  blocked while the queue is non-empty.

CSS (1872–1933): backdrop `position: fixed; inset: 0; z-index: 100; background: #1d1d19c7`,
content anchored to the **bottom** (`align-items: flex-end`), padding `clamp(16px, 4vw, 46px)`.
Window: paper, 3px ink border, `width: min(900px, 100%)`, hard offset shadow `9px 9px 0 var(--gold)`
(6px on mobile), padding `30px 30px 24px`. Speaker tag: gold chip with 3px ink border, 10px bold,
0.12em tracking, overlapping the top edge (`top: -24px; left: 18px`). Title: display font
`clamp(20px, 3vw, 34px)`. Copy: `clamp(10px, 1.25vw, 13px)`, `line-height: 1.45`, max-width 760px.
Button: ink fill, paper text, 10px bold, right-aligned (`margin: 18px 0 0 auto`), green on hover.

Scene copy that this component renders (defined at 678–718 and 5010):

| id | Title | continueLabel |
|----|-------|---------------|
| `opening` | `Isekai Waterloo: The Roulette Table that Decides my Jobless Fate!` | `BEGIN` |
| `program` | `THE ACCEPTANCE ARC` | `CONTINUE` |
| `graduation` | `THE GRADUATION ARC` | `SEE MY FATE` |
| `death` | `TRUCK-KUN RETURNS` | `SEE MY FATE` |
| `yc` | `THE FOUNDER ARC` | `SEE MY FATE` |

(Full line text is in ui.js 682–716 and 5014–5018; another agent owns that range.)

### 9.2 `tg` — bank notice (1986–2003)

`<div class="bank-notice-backdrop"><section class="bank-notice" role="dialog" aria-modal="true" aria-label="Bank borrowing limit">`
with one paragraph —
`I’m below the bank’s borrowing limit, so they won’t lend me any more money and I have to work this term.`
— and `<button type="button" autoFocus>OK</button>`.

### 9.3 `tp` — locked-feature notice (2004–2021)

Same markup, `aria-label="Complete a run first"`, text
`Complete a run first to see the leaderboard and simulate outcome statistics with Monte Carlo.`, button `OK`.

CSS for both (1934–1969): centred, `z-index: 110`, backdrop `#1d1d1985`; card `width: min(390px, 100%)`,
paper, 3px ink border, **red** hard shadow `7px 7px 0 var(--red)`, 18px padding; text 11px / weight 600;
button ink, 9px bold, right-aligned, red on hover.

---

## 10. Animated values — `to` (1555–1580) and `td` (1581–1603)

Both use the same imperative pattern; neither interpolates the number.

```js
let t = useRef(null), r = useRef(e);              // element ref, previous value
useEffect(() => {
  let n = t.current, a = e > r.current ? "up" : e < r.current ? "down" : null;
  if (((r.current = e), !n || !a)) return;
  let i = `metric-change-${a}`;
  (n.classList.remove("metric-change-up", "metric-change-down"),
   n.getBoundingClientRect(),                     // force reflow so the animation restarts
   n.classList.add(i));
  let l = () => n.classList.remove(i);
  return (n.addEventListener("animationend", l, { once: !0 }),
          () => { n.removeEventListener("animationend", l); n.classList.remove(i); });
}, [e]);
```

- `to` renders `<b class="animated-metric"><span ref class="metric-change">{eX(value)}</span></b>`
  (used only for SAVINGS in the sidebar).
- `td` renders `<tspan ref class="radar-axis-value" x={x} dy="9">{Math.round(value)}</tspan>`.
- CSS (1596–1664): `0.72s ease-out` keyframes. HTML metric: `scale(1) -> scale(1.16) at 36% -> scale(1)`
  with the colour flashing `#45c68a` (up) or `#f06a58` (down) and returning to paper. Radar value:
  `scale(1.22)` at 36% with `fill` flashing the same colours and returning to gold.
- The new value appears instantly; the pulse just draws the eye. Reduced motion collapses it to 0.01ms.

---

## 11. `tb` — Monte-Carlo "Outcomes" modal (2022–2333)

Opened from the top bar "Outcomes" link or the end card's VIEW OUTCOME STATISTICS button.

Props: `{ report: SimulationReport | null, error: string | null, runs, running, progress: { completed, total } | null, onRunsChange, onRun, onClose }`.

### 11.1 Shell and controls

```
<div class="simulation-backdrop" role="presentation">
  <section class="simulation-modal" role="dialog" aria-modal="true" aria-labelledby="simulation-title">
    <header>
      <div><span>{report ? `${report.runs.toLocaleString()} RUNS` : "MONTE CARLO"}</span>
           <h2 id="simulation-title">Ending probabilities</h2></div>
      <button type="button" aria-label="Close simulation results">×</button>
    </header>
    <div class="simulation-controls">
      <label for="simulation-runs"><span>RUNS</span><b>{runs.toLocaleString()}</b></label>
      <input id="simulation-runs" type="range" min="100" max="10000" step="100" value={runs} disabled={running} />
      <button type="button" disabled={running}>{running ? "RUNNING" : "RUN SIMULATION"}</button>
    </div>
    {error ? <p class="simulation-error">{error}</p>
     : running ? <div class="simulation-pending">...</div>
     : report ? <div class="simulation-results">...</div>
     : null}
  </section>
</div>
```

- Run count: range slider 100–10,000 in steps of 100; default **2,000** (main state `W`).
- Before the first run the body is empty (header + controls only). Nothing auto-runs.
- Errors: the worker's message, or `Simulation failed.` from `onerror`.

### 11.2 Progress

```js
c = running && runs > 1e3,
u = Math.round(100 * (c ? Math.min(1, (progress?.completed ?? 0) / Math.max(1, progress?.total ?? runs)) : 0));
```

```
<div class="simulation-pending">
  <b>SIMULATING {runs.toLocaleString()} RUNS…</b>
  {c && <div class="simulation-progress" role="progressbar" aria-valuemin=0 aria-valuemax=100 aria-valuenow={u} aria-label="Simulation progress">
     <div class="simulation-progress-track"><div class="simulation-progress-fill" style="width: {u}%" /></div>
     <span>{completed.toLocaleString()} / {total.toLocaleString()}</span>
  </div>}
</div>
```

The bar only appears for runs > 1,000. The worker (`simulation-worker.ts` 1177–1210) clamps runs to
1–10,000, and when `runs > 1000` posts `{ type: "progress", completed, total }` every
`Math.max(25, Math.round(runs / 40))` runs (about 40 updates) with a `setTimeout(0)` yield between
batches; then posts the `SimulationReport`, or `{ error }`. The main component creates a fresh module
Worker per run, sends `{ runs }`, and terminates it on completion, error, or modal close.

### 11.3 Results — every section and label

1. **`.simulation-summary`** (two columns)
   - `SAVINGS` — `<dl>` rows `Average`, `Median`, `Maximum`, `Minimum`, each `eX(...)`.
   - `DESIGN-TEAM POINTS` — `Average` (`toFixed(2)`), `Median` (`toFixed(1)`), `Maximum` (raw).
2. **`.simulation-outcomes`** (two-column list, each `<div><span>{label}</span><b>{value.toFixed(2)}%</b></div>`),
   in this order with the `report.outcomes` key:

   | Label | Key |
   |-------|-----|
   | Academic expulsion | `academicExpulsion` |
   | Integrity expulsion | `integrityExpulsion` |
   | YC ending | `yc` |
   | Masters ending | `gradSchool` |
   | Return full-time | `returnFullTime` |
   | Open to work | `openToWork` |
   | Made it outta the GTA | `madeItOuttaTheGta` |
   | Made it to NYC | `madeItToNyc` |
   | Made it into Cali | `madeItIntoCali` |
   | Graduated | `graduated` |
   | Got run over | `runOver` |
   | Full-time dropout | `fullTimeDropout` |
   | Exchange eligible | `exchangeEligible` |
   | Went on exchange | `wentOnExchange` |
   | Lost forever abroad | `lostForever` |

3. **`.simulation-scholarships`** — heading `SCHOLARSHIP DISTRIBUTION`; per entry
   `<p><span>{label}</span><b>{percentage.toFixed(2)}%<small>{count.toLocaleString()}</small></b></p>`
   (worker emits one row per `SCHOLARSHIP_OUTCOMES` entry in definition order, including zero rows).
4. **`.simulation-breakdowns`** (two columns, 1.25fr / 0.75fr)
   - `PROGRAM DISTRIBUTION` — `<p><span>{label}</span><b>{percentage.toFixed(1)}%</b></p>`, sorted by
     percentage descending by the worker, shown in two sub-columns.
   - `AVERAGE WAGE BY CO-OP` — `.simulation-coops`, one native `<details>` per co-op 1–6:
     `<summary><span>C{coop}</span><b>{eY(averageHourlyPay)}</b><small>{placementRate.toFixed(0)}% placed</small></summary>`
     expanding to `.simulation-locations` rows `<p><span>{location}</span><b>{percentage.toFixed(1)}%</b></p>`
     (sorted by share, then name), or `No placements` / `—` when empty.

`SimulationReport` (worker lines 58–111): `runs`, `savings{average, median, maximum, minimum}`,
`designTeamPoints{average, median, maximum}`, `programDistribution[{id, label, count, percentage}]`,
`scholarshipDistribution[{id, label, count, percentage}]`,
`coopWages[{coop, averageHourlyPay, placementRate, reachedRuns, locations[{location, count, percentage}]}]`,
`outcomes{...15 percentages}`. `reachedRuns` and the per-location `count` are not displayed.

### 11.4 Styling (CSS 1970–2310)

Backdrop: fixed, centred, `z-index: 120`, `#1d1d19b8`, 18px padding. Modal: paper, 3px ink border,
`width: min(680px, 100%)`, `max-height: min(760px, 100vh - 36px)`, scrolls, hard shadow
`9px 9px 0 var(--gold)`. Header: eyebrow 8px / weight 800 / 0.12em `#7f796d`, title display font 27px,
31x31px outlined close button (red on hover). Controls bar: `#ded8ca` strip, grid
`76px minmax(120px, 1fr) auto`, slider `accent-color: var(--red)`, ink button (green on hover),
disabled controls `opacity: 0.58; cursor: wait`. Pending / error area: `min-height: 230px`, centred,
11px with 0.08em tracking (error in red). Progress: `width: min(100%, 280px)`, 10px track with 1px ink
border, ink fill with `transition: width 90ms linear`, counter 9px `#625e55`. Result rows: 1px
`#c8c1b2` top rules, labels 8–9px `#625e55`, values in the display font 13–15px; sections divided by
2px ink rules and 1px `#8e8879` column rules. `<details>` markers are replaced with a `+` / `−`
pseudo-element; location lists cap at 150px and scroll. At `max-width: 560px` every multi-column grid
collapses to one column and the run button drops to its own row.

Accessibility notes: `role="dialog"` + `aria-modal` + `aria-labelledby`; labelled close button;
`<label for>` on the slider; `role="progressbar"` with value attributes. No focus trap, no Escape key,
no backdrop-click close, no initial focus management.

---

## 12. `tf` — leaderboard modal (2334–2506) and `ty` ranked list (2507–2535)

Props: `{ report, error, loading, onClose }`.

```
<div class="simulation-backdrop" role="presentation">
  <section class="leaderboard-modal" role="dialog" aria-modal="true" aria-labelledby="leaderboard-title">
    <header>
      <div><span>{report?.city ?? "GLOBAL"}</span><h2 id="leaderboard-title">Leaderboard</h2></div>
      <button type="button" aria-label="Close leaderboard">×</button>
    </header>
    {loading ? <div class="leaderboard-status">LOADING</div>
     : error ? <div class="leaderboard-status">{error}</div>
     : report ? <div class="leaderboard-content">...</div> : null}
  </section>
</div>
```

Content, top to bottom:

1. **`.leaderboard-summary`** — four tiles:
   `YOUR RUNS` -> `user.runs`; `YOUR BEST SAVINGS` -> `eX(user.bestSavings)`;
   `YOUR BEST JOB RIZZ` -> `user.bestRizz.toFixed(1)`;
   `{CITY}` (uppercased) -> `{cityStats.users} players` with `<small>{cityStats.runs} runs</small>`.
2. **`.leaderboard-money-ledger`** (only if `user.bestRun?.items.length`) — header
   `YOUR HIGHEST-SAVINGS RUN`, `<small>SEED {bestRun.runId}</small>`, total `eX(bestRun.savings)`;
   then an `<ol>` of money events:
   `<li><span>{term}</span><p><b>{label}</b><small>Balance {eX(balance)}</small></p><strong class="positive|negative">{amount > 0 ? "+" : ""}{eX(amount)}</strong></li>`.
3. **`.leaderboard-columns`** — three `ty` lists:

   | Title | Row label | Row detail | Row value |
   |-------|-----------|------------|-----------|
   | `CITIES BY RUNS` | `city` | (none) | `runs.toLocaleString()` |
   | `HIGHEST SAVINGS` | `player` | `city` | `eX(score)` |
   | `HIGHEST TOTAL JOB RIZZ` | `player` | `city` | `score.toFixed(1)` |

4. **`<footer>`** —
   `<strong>{H} hour(s) {M} minute(s) that could've been spent applying to real jobs</strong>` where
   `minutes = max(0, floor(totals.playtimeSeconds / 60))`, `H = floor(minutes / 60)` (localised),
   `M = minutes % 60`, with singular/plural handling; then
   `<span>{users} players · {runs} runs · {escapedPlayers} escaped the Loo · {coopJobs} co-op jobs</span>`.

`ty({ title, rows })`: `<section><span>{title}</span><ol>` of `rows.slice(0, 8)` as
`<li><i>{rank}</i><p><b>{label}</b>{detail && <small>{detail}</small>}</p><strong>{value}</strong></li>`.

Key facts:

- **Top 8 per list; no client-side sorting, filtering, tabs, or pagination** — order is whatever the
  server returns.
- **There is no name-entry UI anywhere.** Rows show a server-supplied `player` string. Identity is an
  anonymous `crypto.randomUUID()` kept in `localStorage["waterloo-roulette:visitor"]`. How the server
  turns that into a display name, and how it derives `city`, is not visible in the client
  **(inferred: generated handle + IP geolocation)**.
- Data comes from `POST /api/leaderboard` (main helpers at 811–845). A finished run is submitted
  automatically once per seed with `{ visitorId, runId: seed, savings, totalRizz (sum of the 7 axes),
  escaped, coopJobs, moneyEvents }`; opening the modal re-posts and shows `LOADING`. Failure text:
  the thrown message (e.g. `Leaderboard is waiting for its Redis connection.`) or `Leaderboard unavailable.`
  A separate `{ action: "playtime", visitorId }` ping runs every 180 s while the tab is visible.
- Response shape as consumed here: `{ configured, city, user{ runs, bestSavings, bestRizz,
  bestRun{ runId, savings, items[{ term, label, amount, balance }] } }, cityStats{ users, runs },
  cities[{ city, runs }], topSavings[{ player, city, score }], topRizz[{ player, city, score }],
  totals{ playtimeSeconds, users, runs, escapedPlayers, coopJobs } }` (reconstructed from property
  accesses; the server code is not in these files).

CSS (2311–2551): same backdrop as the simulation modal; modal `width: min(820px, 100%)`,
`max-height: min(720px, 100vh - 36px)`, hard shadow `9px 9px 0 var(--green)` (green distinguishes it
from the gold-shadowed stats modal). Status area: `min-height: 180px`, centred 9px / weight 800 muted
caps. Summary: 4 equal tiles with `#8e8879` dividers, 8px captions, 18px display values. Ledger:
subtle left-to-right gold wash (`linear-gradient(90deg, #f2c84b21, transparent 42%)`), 2-column grid
of rows (`34px minmax(0, 1fr) auto`, `min-height: 39px`) capped at 172px with scroll; amounts green
(`.positive`) or red (`.negative`). Columns: 3 equal sections; rows `18px minmax(0, 1fr) auto`,
`min-height: 33px`, rank numeral in muted display font 10px, name 8px bold, city 7px muted, value
display font 11px. Footer: right-aligned 8px muted text with a 9px ink `<strong>`. Collapses to one
column at `max-width: 560px`.

---

## 13. How the pieces are mounted (main component render, 4798–5220 — context only)

```
<main class="game-shell">                                grid rows: 58px / auto / minmax(0, 1fr); height 100dvh
  <header class="topbar">  brand h1 + [Leaderboard | Outcomes] links, COPY, RESTART, MUTE/UNMUTE
  <te state />                                           timeline strip
  {stage === "done"
    ? <tm state onRestart onViewStatistics onViewLeaderboard />
    : <div class="game-grid">
        <section class="roulette-panel">
          <div class="prompt-block"><div><span>{eyebrow}</span><h2>{title}</h2></div></div>
          {applications -> tl | grad-applications -> ta | program-select -> ts | offer-select -> tr
           | ending-select -> ti | slot stages -> tn | everything else -> tt}
          <div class="result-strip {tone}" aria-live="polite"><b>{lastResult.title ?? "Click above to spin"}</b></div>
        </section>
        <tu state />
      </div>}
  {scene queue head -> th} {bankNoticePending -> tg} {locked notice -> tp} {stats open -> tb} {leaderboard open -> tf}
</main>
```

Before hydration finishes the page is `<main class="loading">ENTERING ANOTHER WORLD…</main>`
(ink background, gold 12px bold, centred).

Overlay stacking: narration `z-index: 100` < notices `110` < stats / leaderboard `120`.

---

## 14. Waterloo-specific strings in this range (to re-theme)

- Picker rules: `You can only apply to 3 Waterloo programs`, `If you apply to engineering, you can select one backup`;
  group headings `ENGINEERING`, `BACKUP ENGINEERING`, `MATHEMATICS`; `MASTERS (n/4)`.
- Sidebar: `HS AVERAGE` / `AVERAGE` (percent grades), `CO-OPS`, `BEST CO-OP · …`, `TEAM` with design-team ranks.
- End card: `FINAL CAV`, `WORK TERMS`, achievements `Made it outta the GTA`, `Made it to NYC`,
  `Made it into Cali`, `Masters admit`, `Return full-time`, `Graduated`; survival job `McDonald's`;
  brand `Waterloo Roulette`; share file `waterloo-roulette-result.png`.
- Stats modal: `DESIGN-TEAM POINTS`, `Made it outta the GTA`, `AVERAGE WAGE BY CO-OP`, `C1…C6`, `(CAD)/HR`.
- Leaderboard: `escaped the Loo`, `co-op jobs`, `that could've been spent applying to real jobs`.
- Currency formatter is hard-wired to `en-CA` / `CAD`.
- Storage keys: `waterloo-roulette:v8` (save), `waterloo-roulette:visitor`, `waterloo-roulette:meta-unlocked` (sessionStorage).
