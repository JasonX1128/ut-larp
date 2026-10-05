# waterloo.careers — CSS design-system notes

Source: `scratchpad/wc/pretty/styles.css` (2811 lines, prettified production CSS; read in full).
Cross-reference: `scratchpad/wc/pretty/ui.js` (React bundle) and `scratchpad/wc/index.html` (server HTML).
All `L123` references are line numbers in `styles.css` unless prefixed `ui.js:`.

Conventions used below: "ink" = `--ink`, "paper" = `--paper`, etc. "Display" = Archivo Black, "mono" = IBM Plex Mono.

---

## 0. File map and stack

| Lines | Content |
|---|---|
| L1–L39 | Archivo Black `@font-face` x2 (latin-ext, latin), metric-matched fallback face, next/font `className` + `variable` classes |
| L40–L248 | IBM Plex Mono `@font-face` x20 (weights 400/500/600/700 x 5 subsets), fallback face, next/font classes |
| L249–L263 | `@layer properties` (Tailwind v4 `--tw-*` fallback init) |
| L264–L277 | `@layer theme` (Tailwind defaults: `--font-sans`, `--font-mono`, `--spacing`) |
| L278–L528 | `@layer base` (Tailwind v4 preflight reset) |
| L529 | `@layer components;` (empty) |
| L530–L559 | `@layer utilities` (9 stray utilities, see section 8) |
| L560–L567 | **`:root` palette tokens** |
| L568–L590 | Global element rules (`*`, `html, body`, `button`, `button:focus-visible`) |
| L591–L599 | `.loading` |
| L600–L606 | `.game-shell` |
| L607–L705 | Top bar |
| L706–L778 | Creator links (fixed corner) |
| L779–L826 | Timeline strip |
| L827–L847 | `.game-grid`, panel shells |
| L848–L872 | Prompt block (panel header) |
| L873–L918 | Wheel zone + "company" (giant) wheel variant |
| L919–L1089 | Slot machine (reel variant of the roll) + its 2 keyframes |
| L1090–L1290 | Offer picker, application picker, admission badges, offer cards |
| L1291–L1421 | Pointer, wheel, separators, labels, hub |
| L1422–L1456 | Result strip (tone classes) |
| L1457–L1688 | Dossier sidebar: head, radar, stat grid, metric flash keyframes, compact records |
| L1689–L1871 | End screen / share card |
| L1872–L1933 | Narration (visual-novel) dialog |
| L1934–L1969 | Bank notice / small alert dialog |
| L1970–L2310 | Simulation ("Outcomes" Monte Carlo) modal |
| L2311–L2551 | Leaderboard modal |
| L2552–L2578 | `@media (max-width: 560px)` (modal grids) |
| L2579–L2594 | Narration keyframes |
| L2595–L2611 | `@media (max-height: 720px) and (min-width: 721px)` |
| L2612–L2728 | `@media (max-width: 720px)` (the mobile layout) |
| L2729–L2758 | `@media (max-width: 430px)` |
| L2759–L2774 | `@media (max-width: 360px)` |
| L2775–L2791 | `@media (prefers-reduced-motion: reduce)` |
| L2792–L2811 | `@property --tw-*` registrations |

Stack facts that matter for a rebuild:

- Next.js + `next/font` (hashed font files, `size-adjust` fallbacks) + Tailwind v4, but **Tailwind is used only for its preflight**. Every component is hand-written semantic class CSS; there are no utility classes in the markup.
- The app CSS (L560+) is **unlayered**, so it beats everything inside `@layer base` regardless of specificity. Preflight consequences the design relies on: `* { border: 0 solid; margin: 0; padding: 0; box-sizing: border-box }` (L279–L287), `button { background-color: #0000; border-radius: 0; font: inherit; color: inherit }` (L416–L429), `h1–h6 { font-size: inherit; font-weight: inherit }` (L322–L330), `ol, ul, menu { list-style: none }` (L395–L399), `-webkit-tap-highlight-color: transparent` (L311).
- About 142 distinct class names. Flat, low-specificity selectors (mostly one class, or class + element).

---

## 1. Design tokens

### 1.1 Every CSS custom property

| Property | Value | Defined | Used for |
|---|---|---|---|
| `--paper` | `#eee9dc` | `:root` L561 | Page background, light panel fill, text on ink. 39 `var()` uses |
| `--paper-deep` | `#d8d0bd` | `:root` L562 | Recessed "stage" fill: timeline strip, wheel zone, slot zone, pickers, hover of program tiles. 6 uses (L781, L875, L920, L1091, L1097, L1172) |
| `--ink` | `#1d1d19` | `:root` L563 | All borders, dark surfaces (sidebar, panel header, summary card, top-bar buttons), body text. 78 uses. Note it is olive-tinted (R=G > B), not neutral black |
| `--gold` | `#f2c84b` | `:root` L564 | Primary accent: top bar fill, wheel ring/hub, selected state, primary button, eyebrow text on ink, big headings on ink, offset shadows. 36 uses |
| `--red` | `#d64a38` | `:root` L565 | Pointer, slot marker, pressed-tile inset ring, alternate focus ring, stamps, danger/negative, close-button hover, bank-notice shadow, range `accent-color`. 22 uses |
| `--green` | `#247958` | `:root` L566 | Universal hover fill for dark/gold buttons, positive/accepted, leaderboard shadow. 12 uses |
| `--font-display` | `"Archivo Black", "Archivo Black Fallback"` | `.archivo_black_…__variable` on `<body>` L37–L39 | 28 uses, always as `font-family: var(--font-display), sans-serif` |
| `--font-mono` | `"IBM Plex Mono", "IBM Plex Mono Fallback"` | `.ibm_plex_mono_…__variable` on `<body>` L246–L248 (overrides the Tailwind default at L270–L272) | 1 use: `html, body { font-family: var(--font-mono), monospace }` L577 |
| `--font-mono` (Tailwind default) | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` | `@layer theme :root` L270–L272 | Only resolves on `<html>` itself; `<body>` overrides it |
| `--font-sans` | `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"` | L267–L269 | Tailwind default; effectively unused |
| `--spacing` | `0.25rem` | L273 | Only by stray `.start`/`.end` utilities (dead) |
| `--default-font-family`, `--default-mono-font-family` | `var(--font-sans)`, `var(--font-mono)` | L274–L275 | Preflight `html` / `code` font |
| `--wheel-size` | `min(52vh, 430px, 42vw)` | `.wheel-zone` L874 | Wheel width/height (L1304–L1305), spinning hub font-size (L1415), and label radius in inline styles (`ui.js:1171`) |
| `--wheel-size` (short desktop) | `min(48vh, 340px, 38vw)` | L2609 | height <= 720px and width >= 721px |
| `--wheel-size` (mobile) | `min(78vw, 350px, 44dvh)` | L2655 | width <= 720px |
| `--wheel-size` (company) | `var(--company-wheel-size)` | `.company-wheel` L1318 | Re-points the wheel at the giant size |
| `--company-wheel-size` | `clamp(1100px, 130vw, 1600px)` | `.company-wheel-zone` L883 | Giant cropped wheel for employer / exchange-university rolls |
| `--company-wheel-size` (mobile) | `min(145vw, 820px)` | L2658 | width <= 720px |
| `--spin-duration` | set inline from JS: `` `${l}ms` `` (2200, 1800, or 40); CSS fallback `2.2s` | `ui.js:1131`, consumed L1311 | Wheel transition duration |
| `--spin-easing` | set inline from JS: `cubic-bezier(0.12, 0.68, 0.11, 1)` or `cubic-bezier(0.55, 0, 0.45, 1)` (company mode); CSS fallback is the former | `ui.js:1132`, consumed L1312 | Wheel transition easing |
| `--slot-shift` | set inline from JS: `` `${-72 * o}px` `` | `ui.js:1223`, consumed L985, L1079 | Slot reel final offset (72px = one row) |
| `--slot-duration` | set inline from JS: `` `${l}ms` `` (520, or 40 reduced) | `ui.js:1223`, consumed L993, L1039 | Slot reel + crank animation duration |
| `--tw-rotate-x/y/z`, `--tw-skew-x/y` | `initial` | L256–L260, `@property` L2792–L2811 | Tailwind `.transform` utility only (dead) |
| `--font-body` | **never defined** | referenced L2203 | Bug: `.simulation-scholarships p small` falls through to `sans-serif` |

There are **no tokens for spacing, type scale, radii, shadows, borders, z-index or motion** — all literal values. The whole theme is 6 color tokens + 2 font tokens.

### 1.2 Complete color palette

Counts are occurrences in the app CSS (L560+).

**Tokenized (6):**

| Token | Hex | Uses |
|---|---|---|
| `--ink` | `#1d1d19` | 78 |
| `--paper` | `#eee9dc` | 39 |
| `--gold` | `#f2c84b` | 36 |
| `--red` | `#d64a38` | 22 |
| `--green` | `#247958` | 12 |
| `--paper-deep` | `#d8d0bd` | 6 |

**Hard-coded neutrals (all warm olive-grey, i.e. roughly ink-to-paper mixes; "mix" = approx. % paper in an ink/paper blend):**

| Hex | Uses | Mix | Role | Lines |
|---|---|---|---|---|
| `#45443b` | 18 | ~19% | Hairline dividers on ink surfaces (dossier, summary grids), radar spokes | L1464, L1497, L1513, L1546, L1547, L1669, L1742, L1743, L1752, L1753, L1760, L1761, L1792, L1793, L1798, L1799, L2667, L2686 |
| `#4a493e` | 3 | ~21% | Dividers between ink top-bar buttons | L642, L656, L696 |
| `#56544b` | 1 | ~27% | Radar rings | L1509 |
| `#5c5a4f` | 1 | ~29% | Divider between creator links | L735 |
| `#615e54` | 1 | ~32% | Disabled submit text | L1208 |
| `#625e55` | 6 | ~32% | Secondary text on paper (dt, row labels, control labels) | L2038, L2113, L2144, L2189, L2240, L2284 |
| `#777368` | 3 | ~42% | Dim text/outline on ink (unchecked achievements, share brand) | L1708, L1759, L1769 |
| `#7f796d` | 8 | ~45% | Eyebrow labels on paper (modals) | L1996, L2169, L2202, L2220, L2329, L2356, L2452, L2541 |
| `#8c897f` | 1 | ~53% | Disabled program tile text | L1181 |
| `#8e8879` | 7 | ~52% | Medium divider on paper (slot rows, modal column rules) | L1047, L2128, L2217, L2371, L2489, L2564, L2575 |
| `#8f8a7d` | 12 | ~53% | Muted label: stat labels on ink, tertiary "small" text on paper, ghost-button text | L1554, L1682, L1816, L1855, L2252, L2275, L2296, L2389, L2415, L2471, L2510, L2530 |
| `#aaa596` | 4 | ~66% | Soft text on ink (dossier sub, lede, radar labels); disabled submit fill | L1210, L1481, L1523, L1737 |
| `#b9b1a1` | 4 | ~72% | Ledger grid lines | L2430, L2431, L2441, L2442 |
| `#bbb6a9` | 1 | ~75% | Slot row tint "ink" | L1062 |
| `#c8c1b2` | 5 | ~80% | Light row dividers on paper | L2135, L2180, L2231, L2258, L2502 |
| `#c9bfa9` | 1 | ~79% | Progress-track mix target (also the JS wheel "cream") | L2099 |
| `#ddd7ca` | 1 | ~91% | Nested location row divider | L2307 |
| `#ded8ca` | 1 | ~92% | Simulation controls bar fill | L2024 |
| `#000` | 1 | — | Wheel separator lines (pure black, not ink) | L1340 |
| `#fff` | 17 | — | Text on green/red/kofi fills, default focus outline, wheel labels, Ko-fi icon | L589, L704, L742, L746, L755, L764, L768, L1205, L1232, L1236, L1349, L1420, L1435, L1439, L1867, L2020, L2353 |
| `#0000` | 2 | — | Transparent sides of the pointer triangle | L1293, L1294 |

**Hard-coded chromatic values:**

| Hex | Role | Lines |
|---|---|---|
| `#f2c84b2e` | Radar polygon fill = gold @ 18% alpha | L1517 |
| `#f2c84b21` | Ledger header gradient = gold @ 13% alpha | L2396 |
| `#24795824` | Timeline `.coop` tint = green @ 14% | L814 |
| `#d64a3821` | Timeline `.off` tint = red @ 13% | L817 |
| `#1d1d19c7` | Narration backdrop = ink @ 78% | L1874 |
| `#1d1d19b8` | Simulation/leaderboard backdrop = ink @ 72% | L1972 |
| `#1d1d1985` | Bank-notice backdrop = ink @ 52% | L1936 |
| `#eadca9` | Slot row tint gold | L1053 |
| `#b8d1c3` | Slot row tint green | L1056 |
| `#d9aaa0` | Slot row tint red | L1059 |
| `#45c68a` | "Value went up" flash (bright green) | L1615, L1643 |
| `#f06a58` | "Value went down" flash (bright red) | L1629, L1657 |
| `#29abe0` | Ko-fi brand blue (hover) | L747 |
| `#ff5e5b` | Ko-fi heart | L772 |

**Colors that live in JavaScript, not CSS (easy to miss):**

| Value | Where | Role |
|---|---|---|
| `{ gold: "#f7c948", red: "#d94a38", green: "#1f8a60", ink: "#262622", cream: "#c9bfa9" }` | `ui.js:725` (`ew`) | **Wheel segment colors** — inlined into a `conic-gradient`. Slightly different from the CSS tokens (brighter gold, greener green, lighter ink) |
| `"#1d1d19"` | `ui.js:1769` | `backgroundColor` passed to html-to-image when rasterizing the share card |

No `rgb()`/`hsl()`/`oklch()` color literals. Two `color-mix()` uses (both inside `@supports (color: color-mix(in lab, red, red))` with a flat fallback before): L679 `color-mix(in srgb, var(--paper) 55%, transparent)` and L2099 `color-mix(in srgb, var(--paper) 70%, #c9bfa9)`. Two gradients only: L964/L969 slot fade (`linear-gradient(var(--ink), transparent)`) and L2396 ledger wash.

### 1.3 Tone system (gold / red / green / ink / cream)

Every roll option and result carries `tone: "gold" | "red" | "green" | "ink" | "cream"` in game state. There is **no shared `.tone-*` utility**; each consumer maps the tone name itself:

| Consumer | Mechanism | Mapping |
|---|---|---|
| Wheel segments | Inline `background: conic-gradient(from 0deg, <color> <start>deg <end>deg, …)` (`ui.js:1133–1144`) | JS map `ew` (hexes above). Options without a tone alternate by index: even = gold, odd = ink. Empty wheel = `var(--ink)` |
| Slot rows | Class `slot-row ${tone ?? "ink"}` (`ui.js:1248`), rules L1052–L1063 | Pastel tints: gold `#eadca9`, green `#b8d1c3`, red `#d9aaa0`, ink `#bbb6a9`; `cream` has no rule, so base `var(--paper)`. Text always ink |
| Result strip | Class `result-strip ${lastResult?.tone ?? "cream"}` (`ui.js:5153`), rules L1430–L1447 | Full-saturation fills: gold = gold bg / ink text; red = red bg / `#fff`; green = green bg / `#fff`; ink = ink bg / paper text; cream = paper bg / ink text |
| Admission badges | `.admission-results .accepted` / `.rejected` L1230–L1237 | green / red fill, `#fff` text, 1px ink border |
| Stat values | `.integrity-danger` / `-warning` / `-safe` L1572–L1583 | red / gold / green text on ink |
| Ledger amounts | `strong.positive` / `.negative` L2478–L2483 | green / red text on paper |
| Stamps | `.id-stamp` L1487, `.summary-stamp` L1715 | red outline + red text on ink |
| Modal identity | Offset shadow color | narration + simulation = gold, leaderboard = green, bank notice = red |
| Value flashes | Keyframes L1609–L1664 | up = `#45c68a`, down = `#f06a58` |

**Event log:** state keeps a `log` array (max 80 entries, each with `tone`, `ui.js:909–910`) but **nothing renders it**, and there are no log styles in the CSS. The only on-screen result feedback is the result strip showing `lastResult.title` (the `detail` string is not rendered either). The "history" surfaces that do exist are `.compact-records` (sidebar) and `.summary-jobs` (end screen).

---

## 2. Typography

### 2.1 Families and loading

- **Archivo Black** (display), weight 400 only, `font-display: swap`. Two subset files: latin-ext (L1–L11) and latin (L12–L21).
- **IBM Plex Mono** (everything else), weights **400, 500, 600, 700**, 5 subsets each (cyrillic-ext, cyrillic, vietnamese, latin-ext, latin), `font-display: swap` (L40–L231).
- Metric-matched fallbacks (next/font):
  - `Archivo Black Fallback`: `src: local(Arial); ascent-override: 70.78%; descent-override: 16.93%; line-gap-override: 0%; size-adjust: 124.05%` (L22–L29)
  - `IBM Plex Mono Fallback`: `src: local(Arial); ascent-override: 76.16%; descent-override: 20.43%; line-gap-override: 0%; size-adjust: 134.59%` (L232–L239)
- next/font classes: `.archivo_black_54fc8325-module__I3Prxq__variable` sets `--font-display` (L37–L39); `.ibm_plex_mono_a15deaec-module__FL-Ytq__variable` sets `--font-mono` (L246–L248). Both are applied to `<body>` (index.html). The `__className` variants (L30–L36, L240–L245) exist but are unused.
- Preloaded in `<head>`: the five latin files (Archivo Black 400, Plex Mono 400/500/600/700).
- Usage: `html, body { font-family: var(--font-mono), monospace }` (L577); display type always `font-family: var(--font-display), sans-serif` (28 places).
- Weight reality check: CSS asks for `font-weight: 800` in 9 places (modal eyebrows, company-wheel labels) but 800 is not loaded, so those render at 700. Weight 500 is downloaded and never requested. Weight 600 is used once (L1953).
- No base `font-size` is set on `html`/`body` — every text role sets its own px size. Anything that forgets to (e.g. `.application-submit`) lands on the browser default 16px.
- Display type on `<b>` always adds `font-weight: 400` to cancel the default bolder (avoids faux-bold on a single-weight face).
- `text-transform: uppercase` appears only 3 times (L651, L1163, L1711). Almost all caps text is authored in caps in the JSX strings ("COPY", "RESTART", "ENGINEERING", "SUBMIT APPLICATIONS").

### 2.2 Type scale by role

**Display (Archivo Black, weight 400):**

| Role | Selector | Size | Letter-spacing | Line-height | Other | Lines |
|---|---|---|---|---|---|---|
| Page title | `.brand-block h1` | `clamp(13px, 1.55vw, 21px)`; 12px <=720; 10px <=430; 9px <=360 | `-0.05em` | (inherit 1.5) | `white-space: nowrap; text-overflow: ellipsis; overflow: hidden` | L624–L634, L2624, L2741, L2763 |
| Panel title | `.prompt-block h2` | `clamp(22px, 3vh, 31px)` | `-0.04em` | `1` | `margin: 3px 0 0`, paper on ink | L865–L872 |
| Sidebar program code | `.dossier-head h2` | `38px` (28px <=720) | `-0.05em` | `0.9` | gold on ink | L1471–L1479, L2674 |
| End-screen headline | `.summary-card h1` | `clamp(34px, 6vh, 58px)` | `-0.05em` | `0.95` | gold, `max-width: 560px; padding-right: 90px` | L1725–L1735 |
| Narration title | `.narration-window h2` | `clamp(20px, 3vw, 34px)` | `-0.045em` | `1.05` | `max-width: 760px; margin: 0 0 16px` | L1903–L1911 |
| Modal title | `.simulation-modal h2`, `.leaderboard-modal h2` | `27px` | `-0.04em` | (inherit) | `margin: 3px 0 0` | L2001–L2007, L2334–L2340 |
| Slot reel value | `.slot-row b` | `clamp(20px, 3vw, 34px)` | — | `1` | nowrap + ellipsis | L1064–L1073 |
| Wheel hub | `.wheel-hub b` | `clamp(18px, 3vh, 28px)`; spinning: `clamp(11px, calc(var(--wheel-size) * 0.042), 20px)` | spinning `-0.05em` | `1` | nowrap | L1406–L1417 |
| Offer card title | `.offer-company` | `22px` | — | `1` | ellipsis | L1265–L1269 |
| Stat number | `.stat-grid b`, `.summary-grid b` | `21px` (stat 16px <=720) | — | (inherit) | `margin-top: 5px`, ellipsis, paper on ink | L1560–L1571, L2698 |
| Result strip | `.result-strip b` | `18px` | — | `1` | ellipsis | L1448–L1456 |
| Big buttons | `.restart-large`, `.share-button` | `18px` | — | — | | L1840–L1844 |
| Leaderboard stat | `.leaderboard-summary b`, `.leaderboard-money-ledger > header > b` | `18px` | — | — | | L2378–L2387, L2423–L2428 |
| Program tile code | `.program-choice b` | `17px` | — | `1` | | L1155–L1160 |
| Simulation numbers | `.simulation-controls label b`, `.simulation-summary dd` | `15px` | — | — | | L2043–L2047, L2147–L2151 |
| Timeline term | `.timeline-node span` | `14px` | — | — | | L802–L806 |
| Outcome % | `.simulation-outcomes b` | `14px` | — | — | | L2158–L2163 |
| Table values | `.simulation-scholarships p b`, `.simulation-breakdowns p b`, `.simulation-coops summary > b` | `13px` | — | — | | L2195, L2246, L2290 |
| Ghost buttons, share brand | `.statistics-button`, `.leaderboard-button`; `.summary-share-brand` | `11px` | `0.04em`; `0.08em` + uppercase | — | | L1852–L1859, L1707–L1714 |
| Rank numerals | `.leaderboard-columns li strong` 11px; `li i` 10px; `.leaderboard-money-ledger li > span` 9px; `summary:before` 11px | | | | | L2534, L2509, L2451, L2273 |

**Mono (IBM Plex Mono):**

| Role | Selector | Size / weight | Letter-spacing | Line-height | Lines |
|---|---|---|---|---|---|
| Loading screen | `.loading` | 12px / 700 | — | — | L591–L599 |
| Eyebrow on ink | `.prompt-block span` | 8px / 700, gold | `0.12em` | — | L858–L864 |
| Eyebrow on paper (modals) | `.simulation-modal > header span`, `.simulation-summary > section > span`, `.simulation-scholarships > span`, `.simulation-breakdowns > section > span` | 8px / 800, `#7f796d` | `0.12em` | — | L1994–L2000, L2168, L2219 |
| Eyebrow (leaderboard) | `.leaderboard-modal > header span`, `.leaderboard-columns > section > span`, `.leaderboard-summary span` | 8px / 800, `#7f796d` | `0.1em` | — | L2326–L2333 |
| Stat label on ink | `.stat-grid > div > span`, `.summary-grid > div > span`, `.compact-records span` | 7px / 700, `#8f8a7d` | `0.09em` | — | L1551–L1559 |
| Group header | `.program-choice-group h3` | 8px / 700, gold on ink | `0.06em` | — | L1128–L1136 |
| Speaker tag | `.narration-speaker` | 10px / 700 | `0.12em` | — | L1892–L1902 |
| Body copy (narration) | `.narration-copy p` | `clamp(10px, 1.25vw, 13px)` / 400 | — | `1.45` | L1915–L1919 |
| Alert body | `.bank-notice p` | 11px / 600 | — | `1.5` | L1950–L1955 |
| Top-bar action | `.top-actions > button` | 9px / 700 (7px <=720; 6px <=360) | — | — | L690–L700 |
| Top-bar meta link | `.top-meta-link` | 8px / 700 uppercase (6px <=720) | `0.04em` | `1.1` | L647–L667 |
| Corner links | `.creator-link` | 8px / 700 (7px <=430) | `0.035em` | `1` | L716–L733 |
| Timeline kind | `.timeline-node small` | 6px / 700 | `0.08em` | — | L807–L812 |
| Wheel label | `.wheel-label` | `clamp(6px, 0.8vw, 9px)` / 700; `.dense`: `clamp(5px, 0.6vw, 7px)`; company: 10px / 800, `-0.03em`; <=430: 6px | | `1` | L1347–L1388, L2747 |
| Rules list | `.application-rules ul` | 8px / 700 | — | `1.55` | L1116–L1122 |
| Tile caption | `.program-choice span` | 7px / 700 uppercase | — | `1.1` | L1161–L1170 |
| Primary submit | `.application-submit` | **inherits 16px** / 700 | — | — | L1194–L1201 |
| Badge | `.admission-results span` | 7px / 700 | — | — | L1223–L1229 |
| Offer text | `.offer-role` 8px; `.offer-meta` 8px / 700; `.offer-list b` 8px bold green | | | | L1270–L1286 |
| Sidebar sub | `.dossier-head p` | 8px, `#aaa596` (7px <=720) | — | `1.4` | L1480–L1486 |
| Stamp | `.id-stamp` 8px / 700; `.summary-stamp` 9px / 700 | | | | L1487–L1495, L1715–L1724 |
| Radar | `.radar-axis-label` 5.5px / 700 `0.02em` (SVG user units in a 220 viewBox); `.radar-axis-value` 8px | | | | L1522–L1533 |
| Records | `.compact-records b` 9px lh 1.4; `small` 7px | | | | L1673–L1688 |
| End screen | `.summary-lede` 9px; `.achievement-check b` 7px lh 1.25; check glyph 10px; `.summary-jobs span` 7px gold, `b` 9px, `small` 7px lh 1.25; `.yc-seed-bonus` 8px / 700 `0.035em` lh 1.2 | | | | L1584–L1592, L1736–L1823 |
| Dialog buttons | `.narration-window button` 10px / 700; `.bank-notice button` 9px / 700; `.simulation-controls button` 8px / 800 `0.06em` | | | | L1920–L1930, L1956–L1966, L2053–L2062 |
| Close "x" | `.simulation-modal > header button`, `.leaderboard-modal > header button` | 21px, lh 1 | | | L2008–L2017, L2341–L2350 |
| Table text | dt / row labels 9px or 8px `#625e55`; notes 7px `#8f8a7d`; ledger small 6px | | | | L2142–L2146, L2188, L2239, L2251, L2470 |
| Status | `.simulation-pending/.simulation-error` 11px `0.08em`; `.leaderboard-status` 9px / 800 `0.08em`; progress count 9px `0.1em` | | | | L2071–L2080, L2355–L2364, L2110–L2115 |
| Footer | `.leaderboard-content > footer` 8px; `strong` 9px | | | | L2539–L2551 |

Size frequency in app CSS: 8px x25, 7px x17, 9px x12, 10px x6, 11px x6, 6px x5, 18px x4, then singles. Letter-spacing vocabulary: positive tracking `0.12em` / `0.1em` / `0.09em` / `0.08em` / `0.06em` / `0.04em` / `0.035em` / `0.02em` for mono caps; negative `-0.05em` / `-0.045em` / `-0.04em` / `-0.03em` for display type. Line-height `1` on 11 display rules.

**The typographic idea:** two extremes with nothing in between — heavy, tightly tracked Archivo Black at 14–58px for values and titles; tiny (6–9px), bold, widely tracked Plex Mono caps for every label. No mid-size body text exists except narration copy (10–13px).

### 2.3 clamp() and viewport units

| Line | Declaration |
|---|---|
| L631 | `font-size: clamp(13px, 1.55vw, 21px)` (page title) |
| L869 | `font-size: clamp(22px, 3vh, 31px)` (panel title — scales on viewport **height**) |
| L874 | `--wheel-size: min(52vh, 430px, 42vw)` |
| L883 | `--company-wheel-size: clamp(1100px, 130vw, 1600px)` |
| L1069 | `font-size: clamp(20px, 3vw, 34px)` (slot value) |
| L1355 | `font-size: clamp(6px, 0.8vw, 9px)` (wheel label) |
| L1379 | `font-size: clamp(5px, 0.6vw, 7px)` (dense wheel label) |
| L1410 | `font-size: clamp(18px, 3vh, 28px)` (hub) |
| L1415 | `font-size: clamp(11px, calc(var(--wheel-size) * 0.042), 20px)` (hub while spinning — sized off the wheel) |
| L1732 | `font-size: clamp(34px, 6vh, 58px)` (end headline) |
| L1877 | `padding: clamp(16px, 4vw, 46px)` (narration backdrop) |
| L1908 | `font-size: clamp(20px, 3vw, 34px)` (narration title) |
| L1917 | `font-size: clamp(10px, 1.25vw, 13px)` (narration copy) |
| L593, L603, L2615 | `height: 100dvh` |
| L1983, L2315 | `max-height: min(760px, 100vh - 36px)` / `min(720px, 100vh - 36px)` |
| L2609, L2655, L2658 | responsive wheel-size overrides (`48vh`, `78vw`, `44dvh`, `145vw`) |

Because the app is a fixed-height, no-scroll shell, vertical-fit elements use `vh` and horizontal-fit ones use `vw`.

---

## 3. Layout

### 3.1 Page shell

```css
/* L571–L579 */
html, body { background: var(--paper); min-width: 320px; min-height: 100%;
  color: var(--ink); font-family: var(--font-mono), monospace; margin: 0; }

/* L600–L606 */
.game-shell { grid-template-rows: 58px auto minmax(0, 1fr); width: 100%;
  height: 100dvh; display: grid; overflow: hidden; }
```

- Three rows: **top bar 58px** / **timeline auto** (min-height 42px; collapses to 0 with `.timeline.empty`, L790–L793) / **content `minmax(0, 1fr)`**.
- Row 3 holds either `.game-grid` (playing) or `.summary-card` (stage `done`) — `ui.js:4857–4863`.
- App-style viewport lock: `100dvh` + `overflow: hidden`; the page itself never scrolls. Only inner regions scroll.
- Dialogs are children of `.game-shell` but `position: fixed`, so they do not occupy grid rows. `.creator-links` is rendered by the root layout outside `<main>`.
- Loading state replaces the shell with `<main class="loading">` (also `100dvh`).

### 3.2 Top bar (L607–L705)

```css
.topbar { border-bottom: 2px solid var(--ink); background: var(--gold);
  justify-content: space-between; align-items: stretch; width: 100%; min-width: 0; display: flex; }
.brand-block { flex: 1 1 0; align-items: center; min-width: 0; padding: 0 20px; display: flex; overflow: hidden; }
.top-actions { border-left: 2px solid var(--ink); flex: none; display: flex; }
```

Structure: `[brand-block h1 (flex 1, truncates)] | [top-actions: (top-meta-links column: LEADERBOARD / OUTCOMES) | COPY | RESTART | MUTE]`. Buttons stretch to full bar height, no gaps, separated by 1px `#4a493e` rules.

### 3.3 Timeline (L779–L826)

```css
.timeline { border-bottom: 2px solid var(--ink); background: var(--paper-deep);
  scrollbar-width: none; min-height: 42px; display: flex; overflow-x: auto; }
.timeline-node { border-right: 1px solid var(--ink); opacity: 0.42;
  flex: 1 0 56px; min-width: 56px; padding: 7px 8px 5px; position: relative; }
```

Nodes share width equally, never shrink below 56px; strip scrolls horizontally with a hidden scrollbar when it overflows. No scroll-snap, and no JS scroll-to-current.

### 3.4 Main grid and panels (L827–L847)

```css
.game-grid { grid-template-columns: minmax(420px, 1fr) 280px; gap: 12px;
  width: 100%; min-width: 0; min-height: 0; padding: 12px; display: grid; }
.roulette-panel, .dossier { border: 2px solid var(--ink); background: var(--paper); min-width: 0; min-height: 0; }
.roulette-panel { grid-template-rows: 66px minmax(0, 1fr) 48px; display: grid; overflow: hidden; }
```

- Two columns: fluid main panel (min 420px) + **fixed 280px sidebar**, 12px gutter and 12px page padding.
- Main panel rows: **66px prompt header** (ink) / **flexible stage** (wheel, slot, or picker on paper-deep) / **48px result strip**.
- Sidebar `.dossier` (L1457–L1462): `background: var(--ink); color: var(--paper); align-self: stretch; overflow: auto` — stacked: head (min-height 88px) / radar (230px) / 2x2 stat grid / compact records.
- `min-width: 0` / `min-height: 0` everywhere so grid children can shrink and inner regions scroll (`minmax(0, 1fr)` pattern throughout).

### 3.5 Spacing scale (informal)

No tokens; the observed set is small and mostly **odd pixel values**:

- Gaps: `8px` x7, `7px` x5, `12px` x3, `14px` x2, `5px` x2, `4px` x2, plus `1px` (hairline grid), `3px`, `10px`, `16px`; column gaps `26px`, `18px`.
- Padding: `8px`, `12px`, `16px`, `18px`, `14px`, `24px`, `28px`; modal sections use `20px` inline with 12–19px block (`18px 20px 15px`, `17px 20px`, `14px 20px 19px`); dense cells `5px 7px`, `6px 8px`, `7px 10px`, `9px`.
- Outer rhythm: 12px (page padding and grid gap on desktop), 8px on mobile.
- Label-to-value gap is consistently `margin-top: 5px` (stat) or `3px` (title under eyebrow).

### 3.6 Borders

| Weight | Use |
|---|---|
| `2px solid var(--ink)` | Default structural border: panels, bar bottoms, section rules, buttons, cards (x12 `border`, x9 `border-bottom`, x5 `border-top`, x2 `border-left`) |
| `3px solid var(--ink)` | Elevated surfaces: narration window, speaker tag, modals, bank notice, summary card (x8); also wheel rim dot, crank grip |
| `7px solid var(--ink)` | Wheel and slot machine body (x2) |
| `5px` / `4px solid var(--ink)` | Wheel hub / crank knob |
| `1px solid var(--ink)` | Timeline node dividers, badges, progress track |
| `1px solid #45443b` | Hairlines on ink surfaces |
| `1px solid #4a493e` / `#5c5a4f` | Dividers between ink buttons |
| `1px solid #8e8879` / `#c8c1b2` / `#b9b1a1` / `#ddd7ca` | Hairlines on paper, in decreasing emphasis |
| `1px` / `2px solid var(--red)` | Stamps |
| `3px solid var(--red)` (top + bottom) | Slot marker band |

Table-like grids use the "top + left on container, bottom + right on cells" trick (L1742–L1743 with L1546–L1547; L2430–L2431 with L2441–L2442). The program tile grid instead uses `gap: 1px` over an ink background (L1137–L1142).

### 3.7 Shadows (all hard-edged, zero blur)

| Line | Value | On |
|---|---|---|
| L1887 | `box-shadow: 9px 9px 0 var(--gold)` | `.narration-window` (L2725: `6px 6px 0` on mobile) |
| L1984 | `box-shadow: 9px 9px 0 var(--gold)` | `.simulation-modal` |
| L2316 | `box-shadow: 9px 9px 0 var(--green)` | `.leaderboard-modal` |
| L1947 | `box-shadow: 7px 7px 0 var(--red)` | `.bank-notice` |
| L1307–L1309, L936–L938 | `box-shadow: 0 0 0 4px var(--gold), 0 0 0 7px var(--ink)` | `.wheel`, `.slot-machine` — concentric rings: 7px ink border + 4px gold + 3px ink |
| L1177 | `box-shadow: inset 0 0 0 3px var(--red)` | pressed program tile |
| L1298 | `filter: drop-shadow(0 2px 0 var(--ink))` | pointer triangle |
| L1352 | `text-shadow: 1px 1px 0 var(--ink)` | wheel labels |

Offset shadows are reserved for **floating dialogs only**; in-flow panels are flat. There is no blurred shadow anywhere.

### 3.8 Corner radii

Square everywhere. Preflight forces `border-radius: 0` on form controls (L428). The only radii: `50%` on wheel (L1313), wheel rim (L1329), hub (L1393), crank knob (L1011); `7px` on the crank grip (L1031).

### 3.9 z-index layers

| z | Element | Line |
|---|---|---|
| 1 | `.wheel-separator`; pressed `.program-choice` | L1337, L1175 |
| 2 | `.wheel-label`; focused `.program-choice`; slot fade overlays | L1348, L1186, L955 |
| 3 | `.wheel-hub`; `.slot-marker` | L1390, L974 |
| 4 | `.pointer`; `.slot-crank` | L1292, L998 |
| 5 | `.company-wheel-trigger` | L904 |
| 6 | `.company-wheel-zone .pointer` | L900 |
| 20 | `.creator-links` (fixed) | L707 |
| 100 | `.narration-backdrop` | L1873 |
| 110 | `.bank-notice-backdrop` | L1935 |
| 120 | `.simulation-backdrop` (also hosts the leaderboard) | L1971 |

### 3.10 Scroll behavior

- Page: none (`.game-shell { overflow: hidden }`).
- `overflow: auto`: `.offer-picker` L1094, `.application-picker` L1102, `.dossier` L1461, `.summary-card` L1699, `.simulation-modal` L1985, `.leaderboard-modal` L2317.
- `overflow-y: auto`: `.simulation-locations` (max-height 150px) L2304, `.leaderboard-money-ledger ol` (max-height 172px) L2438.
- `overflow-x: auto` + hidden scrollbar: `.timeline` L782–L789.
- `overflow: clip`: `.company-wheel-zone` L885.
- No `scroll-behavior`, `overscroll-behavior`, `scroll-snap`, or body scroll-lock (not needed since the body never scrolls).

---

## 4. Responsive behavior

Desktop-first, `max-width` queries. **No container queries.** No `prefers-color-scheme`, no `@media (hover)` / `(pointer: coarse)`, no `env(safe-area-inset-*)`, no print styles. Viewport meta is `width=device-width, initial-scale=1` (no `viewport-fit=cover`).

### 4.1 `@media (max-width: 560px)` — L2552–L2578 (modals only)

- `.simulation-summary`, `.simulation-outcomes`, `.simulation-scholarships > div`, `.simulation-breakdowns`, `.leaderboard-summary`, `.leaderboard-money-ledger ol`, `.leaderboard-columns` all become `grid-template-columns: 1fr`.
- Vertical rules flip to horizontal: `section + section { border-top: 1px solid #8e8879; border-left: 0 }`; leaderboard cells `border-bottom: 1px solid #8e8879; border-right: 0`.
- `.simulation-controls`: `grid-template-columns: 72px minmax(80px, 1fr)`; its button spans `grid-column: 1/-1`.

### 4.2 `@media (max-height: 720px) and (min-width: 721px)` — L2595–L2611 (short laptops)

- Shell rows `50px auto minmax(0, 1fr)`; timeline `min-height: 34px`, node `padding-top: 4px`.
- Panel rows `55px minmax(0, 1fr) 42px`.
- `--wheel-size: min(48vh, 340px, 38vw)`.

### 4.3 `@media (max-width: 720px)` — L2612–L2728 (the mobile layout)

- Shell rows `54px auto minmax(0, 1fr)`; `.topbar { height: 54px }`; still `100dvh` + `overflow: hidden` (no page scroll on phones either).
- Top bar: brand padding `0 12px`, h1 `12px`; action buttons `min-width: 60px; padding: 0 6px; font-size: 7px`; meta links `gap: 3px; padding: 0 7px; font-size: 6px`; lock icon 7px.
- Timeline `min-height: 38px`.
- **Grid stacks:** `.game-grid { grid-template-rows: minmax(0, 1fr) 122px; grid-template-columns: minmax(0, 1fr); gap: 8px; padding: 8px }` — wheel panel on top, sidebar becomes a fixed **122px bottom strip**.
- Panel rows `52px minmax(0, 1fr) 40px`.
- `--wheel-size: min(78vw, 350px, 44dvh)`; `--company-wheel-size: min(145vw, 820px)`.
- **Sidebar turns horizontal:** `.dossier { grid-template-columns: 74px 122px minmax(0, 1fr); display: grid; overflow: hidden }` = [program code 74px] [radar 122px square] [2x2 stats].
  - `.dossier-head`: no bottom border, `border-right: 1px solid #45443b`, `padding: 10px`, h2 `28px`, p `7px` max-width `54px` with ellipsis.
  - `.id-stamp`, `.radar-axis-label` (axis names; the numeric `tspan` children vanish with them), and `.compact-records` are `display: none`.
  - `.radar-shell { height: 122px }`, `.radar { padding: 8px }`.
  - Stat cells `padding: 8px`; values `16px`, `margin-top: 2px`.
- Application picker: `padding: 8px`; form `gap: 7px`; rules box `justify-self: stretch`; math grid 2 columns.
- Narration: backdrop `padding: 16px`; window `box-shadow: 6px 6px 0 var(--gold); padding: 25px 18px 16px`.

### 4.4 `@media (max-width: 430px)` — L2729–L2758

- Creator links: `gap: 5px; height: 30px; padding: 0 8px; font-size: 7px`; Ko-fi icon 15px.
- h1 `10px`; action buttons `min-width: 52px`; wheel labels fixed `6px`.
- `.program-choice-grid` drops from 5 to **2 columns**.
- `.summary-grid`, `.summary-jobs`, `.summary-achievements` become `1fr 1fr`.

### 4.5 `@media (max-width: 360px)` — L2759–L2774

- Brand padding `0 9px`; h1 `9px`.
- `.top-actions button { min-width: 44px; padding: 0 4px; font-size: 6px }` — note the descendant selector (no `>`), so this also hits the `.top-meta-link` buttons.
- Dossier columns `68px 108px minmax(0, 1fr)`.

### 4.6 Touch targets, hover, safe areas

- No dedicated touch-target sizing. Good: full-height top-bar buttons (~52px tall on mobile, though only 44–60px wide), program tiles `min-height: 46px`, submit `min-height: 48px`, narration button ~41px tall, whole wheel / whole company zone is the tap target. Weak: modal close button 31x31px, creator links 34px (30px on phones), `.top-meta-link` rows are half the bar height (~26–28px).
- Hover rules are unguarded (`:hover` with no `@media (hover: hover)`), so hover fills can stick after a tap on touch devices. Five rules use `:hover:not(:disabled)` (L1171, L1202, L1418, L1869, L2063).
- No safe-area handling: the fixed bottom-right creator links and the 122px bottom strip sit under the iOS home indicator, and the creator links overlap the lower-right of the content (stat grid on mobile, sidebar on desktop).
- `min-width: 320px` on `html, body` is the only floor.
- Reduced motion: see 5.4. Color scheme: none — single fixed theme; no `color-scheme` property.

---

## 5. Motion

### 5.1 Keyframes

| Name | Lines | Animates | Duration / easing | Used by |
|---|---|---|---|---|
| `slot-roll` | L1074–L1081 | `transform: translateY(0)` to `translateY(var(--slot-shift))` | `var(--slot-duration)` (520ms from JS) `cubic-bezier(0.12, 0.68, 0.11, 1) forwards` | `.slot-reel.rolling` L992–L996 |
| `crank-turn` | L1082–L1089 | `rotate(-18deg)` to `rotate(702deg)` (two full turns) | `var(--slot-duration) cubic-bezier(0.12, 0.68, 0.11, 1)` | `.slot-cabinet.rolling .slot-crank-arm` L1038–L1041 |
| `metric-value-up` | L1609–L1622 | color paper -> `#45c68a` at 36% -> paper; `scale(1)` -> `1.16` -> `1` | `0.72s ease-out` | `.metric-change-up` L1603–L1605 |
| `metric-value-down` | L1623–L1636 | same with `#f06a58` | `0.72s ease-out` | `.metric-change-down` L1606–L1608 |
| `radar-value-up` | L1637–L1650 | SVG `fill` gold -> `#45c68a` -> gold; `scale(1)` -> `1.22` -> `1` | `0.72s ease-out` | `.radar-axis-value.metric-change-up` L1534–L1536 |
| `radar-value-down` | L1651–L1664 | same with `#f06a58` | `0.72s ease-out` | `.radar-axis-value.metric-change-down` L1537–L1539 |
| `narration-fade-in` | L2579–L2586 | `opacity: 0` to `1` | `0.18s ease-out both` | `.narration-backdrop` L1878 |
| `narration-rise-in` | L2587–L2594 | `translateY(18px)` to `0` | `0.24s ease-out both` | `.narration-window` L1889 |

No infinite/looping animations anywhere (no pulsing, blinking, or spinner).

### 5.2 Transitions

| Line | Declaration | On |
|---|---|---|
| L583–L585 | `transition: background-color 0.14s, color 0.14s` | every `button` (global) |
| L728–L731 | `transition: background-color 0.14s, color 0.14s, transform 0.14s` | `.creator-link` (hover lifts `translateY(-3px)`, L738) |
| L1397–L1399 | `transition: background-color 0.14s, color 0.14s` | `.wheel-hub` |
| L1311–L1312 | `transition: transform var(--spin-duration, 2.2s) var(--spin-easing, cubic-bezier(0.12, 0.68, 0.11, 1))` | `.wheel` |
| L2108 | `transition: width 90ms linear` | `.simulation-progress-fill` |

`0.14s` with default `ease` is the single UI micro-interaction speed. Because `.wheel` sets `transition`, it replaces the global button transition on the wheel element itself (the hub keeps its own).

### 5.3 Wheel spin mechanics (CSS + JS)

- The wheel is a single element whose inline style carries four things (`ui.js:1130–1146`): `--spin-duration`, `--spin-easing`, a `conic-gradient` background, and `transform: rotate(${rotation}deg)`. Spinning = React writes a larger cumulative rotation; the CSS transition does the rest. Rotation only ever increases (always clockwise).
- Durations (`ui.js:3872`): **2200ms** standard wheel; **1800ms** for the `recruit-job` giant wheel; **520ms** for slot-reel stages; **40ms** when `prefers-reduced-motion` matches (read once via `matchMedia` in JS).
- Easing: standard `cubic-bezier(0.12, 0.68, 0.11, 1)` (fast launch, very long deceleration tail); company mode `cubic-bezier(0.55, 0, 0.45, 1)` (symmetric ease-in-out, because that wheel only travels about half a turn).
- Target angle (`ui.js:3916–3923`): lands at a seeded random point inside the winning segment, inset by `min(2deg, 12% of segment)` from each edge; total travel is at least **1332deg** (3.7 turns) for normal wheels, **180deg** for company wheels, rounded up to the next alignment.
- Timing after the spin: `spinning` flips false at the duration; the result is committed to state `duration + 1500ms` later (`+120ms` reduced), so the wheel rests on its segment for 1.5s before the strip/stat updates.
- Tick sounds: a `requestAnimationFrame` loop re-evaluates the same cubic-bezier in JS (`eA` / `eR`, `ui.js:730–731`, solver at `ui.js:1107–1116`) to detect separator crossings and fires a click, throttled to one per `1000/12` ms.
- `.wheel.spinning` only adds `will-change: transform` (L1323–L1325) and shrinks/tightens the hub label, which changes from "SPIN" to "ROLLING".
- Labels are positioned by inline transform `rotate(θ) translateY(calc(var(--wheel-size) * -0.34)) rotate(90deg)` (company: `-0.44` / `-0.46` alternating to stagger) around `transform-origin: 44px 6px` (L1354). `data-side="left|right"` (flips at 180deg of current rotation) switches text alignment (L1370–L1377). Label hidden entirely when a normal wheel has more than 24 options; `.dense` class when more than 16.
- Separators: 1px black lines rotated inline, `transform-origin: 50% 100%` (L1336–L1346).
- Company mode: the wheel is a non-interactive `div` (1100–1600px wide) absolutely placed `top: 48px; left: 50%; transform: translate(-50%)` inside an `overflow: clip` zone, so only its top arc shows; a transparent full-zone `button.company-wheel-trigger` (L903–L918) takes the click. Only the 24 labels nearest the pointer are rendered; separators drawn every 8th boundary past 32 options.

### 5.4 Slot reel mechanics

- Used instead of the wheel for stages `highschool-average`, `scholarship`, `study-grade`, `recruit-count`, `work-eval` (`ui.js:726`).
- Reel = options repeated 8 times as 72px rows; target row index = `6 * n + i`; `--slot-shift = -72px * (target - 1)` so the winner sits in the middle of a 3-row window (230px box minus 7px borders = 216px).
- Rest state `transform: translateY(var(--slot-shift))` (L985); `.rolling` replays `slot-roll` from 0. The reel is re-keyed per run so the animation restarts.
- Marker band: red 3px top/bottom borders at `top: 72px; height: 72px` (L973–L983); top and bottom rows fade under `linear-gradient` ink overlays at `opacity: 0.72` (L953–L972).

### 5.5 Result feedback

- **No flashing or pulsing on results.** Feedback is: the result strip swaps tone class instantly (no transition on a `div`), and changed numbers do the 0.72s scale + color flash (savings via `.metric-change`, radar axis values via `.radar-axis-value`). JS toggles the class with a forced reflow (`getBoundingClientRect()`) and removes it on `animationend` (`ui.js:1559–1574`, `1585–1600`).
- The radar polygon itself has no transition; it snaps to new points.

### 5.6 Loading screen

```css
/* L591–L599 */
.loading { background: var(--ink); height: 100dvh; color: var(--gold);
  place-items: center; font-size: 12px; font-weight: 700; display: grid; }
```

Static text "ENTERING ANOTHER WORLD…" (`ui.js:5220`) centered in gold mono on ink. No animation.

### 5.7 Reduced motion (L2775–L2791)

- `.wheel`, `.wheel-label-text`, `.slot-reel.rolling`, `.slot-cabinet.rolling .slot-crank-arm`: `transition-duration: 0.01ms !important; animation-duration: 0.01ms !important`.
- `.narration-backdrop`, `.narration-window`, `.metric-change-up/down`, `.radar-axis-value.metric-change-up/down`: `animation-duration: 0.01ms !important`.
- JS also shortens its timers (40ms spin, 120ms settle), so logic and visuals stay in sync.
- Not covered: the global button color transition and the creator-link hover lift (both minor).

---

## 6. Components

### 6.1 Top bar and buttons (L607–L705)

- Bar: gold fill, 2px ink bottom border, 58px tall (54px mobile, 50px short desktop).
- Title: Archivo Black, single line, ellipsis.
- Action buttons (`.top-actions > button`, COPY / RESTART / MUTE): `background: var(--ink); color: var(--paper); min-width: 90px; padding: 0 14px; font-size: 9px; font-weight: 700; border-right: 1px solid #4a493e`. **Hover and `.active`** (mute engaged, with `aria-pressed`): `background: var(--green); color: #fff`.
- Meta links (`.top-meta-links`): an ink column holding two stacked half-height text buttons (LEADERBOARD, OUTCOMES): transparent bg, paper text, 8px/700 uppercase, `letter-spacing: 0.04em`, `border-bottom: 1px solid #4a493e` between them, `display: inline-flex; gap: 4px`. Hover = gold text.
- **Locked state** (`.top-meta-link.locked`, before the first completed run): text `color-mix(in srgb, var(--paper) 55%, transparent)` (fallback full paper) with an 8x8px inline SVG padlock (`.top-meta-lock`, `currentColor`); hover goes to full paper rather than gold (L674–L684). It is not `disabled` — clicking opens the "Complete a run first" notice. Native `title` tooltip explains.

### 6.2 Timeline term chips (L794–L826)

- Chip: Archivo 14px term label (`span`) over 6px/700 `letter-spacing: 0.08em` kind (`small`: STUDY / WORK / OFF); `padding: 7px 8px 5px`; 1px ink right border.
- Kind: `.study` = no rule (transparent over paper-deep); `.coop` = `background: #24795824`; `.off` = `background: #d64a3821`.
- State: future = `opacity: 0.42`; `.past` = `opacity: 0.7`; `.current` = `background: var(--ink); color: var(--gold); opacity: 1` (declared last so it overrides the kind tint).

### 6.3 Prompt block (L848–L872)

Ink header bar of the main panel: gold 8px eyebrow (`letter-spacing: 0.12em`) above a paper Archivo title; inner padding `9px 16px`; 2px ink bottom border.

### 6.4 Wheel and pointer (L1291–L1421)

- `.wheel`: `var(--wheel-size)` square, circle, `border: 7px solid var(--ink)`, ring shadow `0 0 0 4px var(--gold), 0 0 0 7px var(--ink)`, `cursor: pointer` (`wait` when disabled). It is itself the `<button>` ("Spin the wheel").
- `.wheel-hub`: 26% diameter, `border: 5px solid var(--ink); background: var(--gold)`, centered; label "SPIN". **This is the spin button** — there is no separate one. `.wheel:hover:not(:disabled) .wheel-hub { background: var(--red); color: #fff }`.
- `.wheel-label`: 88px wide, white, 700, `text-shadow: 1px 1px 0 var(--ink)`, ellipsis.
- `.pointer`: CSS triangle — `border-left/right: 15px solid #0000; border-top: 29px solid var(--red)`, `filter: drop-shadow(0 2px 0 var(--ink))`, `top: 8px; left: calc(50% - 15px)`.
- `.wheel-zone`: paper-deep stage, `display: grid; place-items: center; overflow: hidden`. `.wheel-frame { display: contents }` in normal mode.
- Keyboard: Space anywhere (outside inputs/buttons) spins (`ui.js:4747–4753`).

### 6.5 Slot machine (L919–L1073)

- `.slot-cabinet { width: min(620px, 100% - 70px) }`; `.slot-machine` is a button: 230px tall, same 7px border + gold/ink ring as the wheel.
- Rows: 72px, centered Archivo value, `border-bottom: 1px solid #8e8879`, pastel tone fills.
- Crank (decorative): gold knob circle with 4px ink border, red arm `34x8px` with 2px ink border, gold grip `14x28px` with `border-radius: 7px`.

### 6.6 Result strip (L1422–L1456)

48px footer row of the main panel: `border-top: 2px solid var(--ink)`, centered Archivo 18px, `padding: 8px 14px`, tone-class fill. `aria-live="polite"`. Idle text: "Click above to spin".

### 6.7 Application picker (L1096–L1211)

- Container: paper-deep, centered, `padding: 16px`, scrolls. Form: single column, `gap: 8px`, `width: min(780px, 100%)`.
- Rules box (`.application-rules`): ink fill, paper 8px/700 text, right-aligned (`justify-self: end`), `padding: 7px 12px 7px 27px` (preflight strips bullets, so the left padding is just an indent).
- Group (`.program-choice-group`, ENGINEERING / BACKUP ENGINEERING / MATHEMATICS): 2px ink border; `h3` header strip ink bg, gold 8px/700 `letter-spacing: 0.06em`, `padding: 7px 10px`.
- Grid: `grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1px; background: var(--ink)` (gap shows as hairlines). Math variant 4 columns. Mobile: math 2 columns at <=720, all 2 columns at <=430.
- Tile (`.program-choice`): paper, `min-height: 46px; padding: 6px 8px`, Archivo 17px code + 7px uppercase caption (ellipsis).
  - Hover (enabled): `background: var(--paper-deep)`.
  - **Selected** (`[aria-pressed="true"]`): `background: var(--gold); box-shadow: inset 0 0 0 3px var(--red); z-index: 1`.
  - **Disabled**: `color: #8c897f; cursor: not-allowed; opacity: 0.42`.
  - Focus: `outline: 3px solid var(--red); outline-offset: -3px; z-index: 2`.
- Submit (`.application-submit`): `border: 2px solid var(--ink); background: var(--gold); min-height: 48px; font-weight: 700; grid-column: 1/-1`. Hover/focus: green + white. Disabled: `color: #615e54; background: #aaa596; cursor: not-allowed`.

### 6.8 Admission badges and offer cards (L1212–L1290)

- Badges (`.admission-results span`): flex-wrap row, `gap: 5px`; each `border: 1px solid var(--ink); padding: 5px 7px; font-size: 7px; font-weight: 700`; `.accepted` green/white, `.rejected` red/white. Text like "SE · OFFER".
- Offer list: `grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 8px`.
- Offer card (a `button`): `border: 2px solid var(--ink); background: var(--paper); padding: 12px; text-align: left`, inner grid `minmax(0, 1fr) auto`: Archivo 22px title, 8px role line (full width), 8px/700 meta line, and a green 8px "ACCEPT" / "CHOOSE" tag in column 2 row 1. Hover/focus: whole card gold, tag turns ink. Used for co-op offers, program selection, and ending choices.

### 6.9 Narration dialog (L1872–L1933)

- Backdrop: fixed, `inset: 0`, `background: #1d1d19c7`, flex with `align-items: flex-end` (dialog docks to the **bottom**, visual-novel style), `padding: clamp(16px, 4vw, 46px)`, fade-in 0.18s.
- Window: `border: 3px solid var(--ink); background: var(--paper); width: min(900px, 100%); box-shadow: 9px 9px 0 var(--gold); padding: 30px 30px 24px`, rise-in 0.24s.
- Speaker tag: `position: absolute; top: -24px; left: 18px` (straddles the top border), `border: 3px solid var(--ink); background: var(--gold); padding: 7px 16px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em`. Content "ME".
- Title Archivo `clamp(20px, 3vw, 34px)`; copy paragraphs `clamp(10px, 1.25vw, 13px)` / 1.45, `max-width: 760px`.
- Continue button: ink fill, paper text, right-aligned via `margin: 18px 0 0 auto; display: block`, `padding: 11px 18px`, hover green. Label like "BEGIN →". `autoFocus`.
- No backdrop blur, no typewriter effect; scenes queue and advance one click at a time.

### 6.10 Bank notice / small alert (L1934–L1969)

Centered (`place-items: center`), lighter backdrop `#1d1d1985`, `width: min(390px, 100%)`, 3px ink border, `box-shadow: 7px 7px 0 var(--red)`, `padding: 18px`; body 11px/600; OK button ink, hover **red**. Reused for the "Complete a run first" lock notice.

### 6.11 Sidebar ("dossier") (L1457–L1688)

- Head: flex space-between, `min-height: 88px; padding: 15px`; gold Archivo 38px program code; 8px `#aaa596` sub-line (`max-width: 165px`); `.id-stamp` (sequence name) = `border: 1px solid var(--red); color: var(--red); max-width: 92px; padding: 5px 7px; font-size: 8px; font-weight: 700; text-align: center`.
- Stat tiles (`.stat-grid`): `grid-template-columns: 1fr 1fr`, each cell `padding: 14px` with bottom + right 1px `#45443b` hairlines; label 7px/700 `#8f8a7d` `letter-spacing: 0.09em`; value Archivo 21px paper, ellipsis. Four tiles: AVERAGE, INTEGRITY, SAVINGS, CO-OPS. Integrity value colored by state class. Savings uses `b.animated-metric { overflow: visible }` so the scale flash is not clipped.
- Compact records: stacked cells `padding: 14px`, hairline bottom; label / 9px value / 7px `#8f8a7d` note, all ellipsized (TEAM, BEST CO-OP).

### 6.12 Radar chart (L1496–L1539; markup `ui.js:1604–1648`)

- `.radar-shell { height: 230px; border-bottom: 1px solid #45443b }`; SVG `viewBox="0 0 220 220"`, `padding: 12px 22px; overflow: visible`.
- Geometry: center (110, 110), radius 72, 7 axes starting at 12 o'clock; 4 concentric **polygon** rings at 25/50/75/100% (`.radar-ring`: no fill, `stroke: #56544b`, 1px); spokes (`.radar line`: `stroke: #45443b`, 1px); value polygon (`.radar-value`: `fill: #f2c84b2e; stroke: var(--gold); stroke-width: 3px; stroke-linejoin: round`); labels at 1.28x radius, anchor start/middle/end by x position.
- Axis label: `fill: #aaa596; font-size: 5.5px; font-weight: 700; letter-spacing: 0.02em`; value `tspan` below it (`dy="9"`): `fill: var(--gold); font-size: 8px`, with `transform-box: fill-box; transform-origin: 50%` so the flash scales in place.
- Values clamp to 100 for the polygon; `role="img"` with a full text `aria-label`.

### 6.13 End screen / share card (L1689–L1871)

- `.summary-card`: replaces the grid in shell row 3; `border: 3px solid var(--ink); background: var(--ink); color: var(--paper); width: min(760px, 100% - 28px); max-height: calc(100% - 28px); align-self: center; margin: 14px auto; padding: 28px; overflow: auto`. (Ink card with ink border on a paper page; no offset shadow.)
- `.summary-share-target` is the node rasterized to PNG (`pixelRatio: min(2, dpr)`, bg `#1d1d19`); it holds everything except the buttons.
- Stamp (`.summary-stamp`): absolute top-right, `border: 2px solid var(--red); color: var(--red); padding: 6px 9px; font-size: 9px; font-weight: 700` (status in caps).
- Headline: gold Archivo `clamp(34px, 6vh, 58px)`. Lede 9px `#aaa596`.
- `.summary-grid`: 4 columns of stat tiles (same recipe as sidebar), `margin: 20px 0`; `.summary-scholarship` spans all columns.
- Achievements: 5-column hairline grid of read-only checkboxes; unchecked = `#777368` text + 14px empty box with 1px `#777368` border; `.checked` = paper text + gold-filled box with ink check mark.
- Jobs: 3-column hairline grid; gold 7px term, 9px company, 7px `#8f8a7d` detail.
- Share brand line: Archivo 11px uppercase `#777368`, `letter-spacing: 0.08em`.
- Actions (`.summary-actions`: grid, `gap: 7px`, `margin-top: 18px`), all full-width Archivo, `padding: 12px`, no border unless noted:
  - SHARE RESULT `.share-button`: paper fill, 18px; hover gold; disabled `opacity: 0.7; cursor: wait`.
  - NEW RUN `.restart-large`: gold fill, 18px; hover green + white.
  - VIEW OUTCOME STATISTICS / LEADERBOARD: ghost — transparent, `border: 2px solid var(--ink)` (invisible on the ink card), `#8f8a7d` 11px text; hover paper text.
- Mobile (<=430): the three grids become 2 columns.

### 6.14 Statistics ("Outcomes") modal (L1970–L2310)

- Backdrop `.simulation-backdrop`: `#1d1d19b8`, centered, `padding: 18px`, z 120.
- Modal: 3px ink border, paper, `width: min(680px, 100%); max-height: min(760px, 100vh - 36px); box-shadow: 9px 9px 0 var(--gold); overflow: auto`.
- Header: `padding: 18px 20px 15px`, 2px ink bottom rule; eyebrow ("MONTE CARLO" / "N RUNS") + Archivo 27px title; close button 31x31px, 2px ink border, "×" at 21px, hover red + white.
- Controls bar: `background: #ded8ca`, grid `76px minmax(120px, 1fr) auto`, `gap: 14px; padding: 12px 20px`; label (7px/800 caption + Archivo 15px value), native range input with `accent-color: var(--red)`, ink button (8px/800 `letter-spacing: 0.06em`, hover green). Disabled: `opacity: 0.58; cursor: wait`.
- Pending: centered 11px text, plus progress bar for >1000 runs — track `height: 10px; border: 1px solid var(--ink)`, fill ink, `transition: width 90ms linear`, count below in 9px `#625e55`.
- Error: same box in red text.
- "Tables" are not `<table>`s. They are label/value rows: `display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid #c8c1b2; padding: 5px 0` with a 9px/8px `#625e55` label and Archivo 13–15px value. Sections split into 2 columns (`1fr 1fr`, or `1.25fr 0.75fr` for breakdowns) with `1px solid #8e8879` rules between and 2px ink rules between bands.
- Co-op wages use `<details>`: custom "+" / "−" marker via `summary:before` (Archivo 11px `#8f8a7d`), native marker hidden; nested location list `max-height: 150px; overflow-y: auto; margin: 7px 0 4px 17px` with lighter `#ddd7ca` rules.

### 6.15 Leaderboard modal (L2311–L2551)

- Same shell as the statistics modal but `width: min(820px, 100%); max-height: min(720px, 100vh - 36px); box-shadow: 9px 9px 0 var(--green)`.
- Status ("LOADING" / error): centered, `min-height: 180px`, 9px/800 `#7f796d`.
- Summary band: 4 equal columns, cells `padding: 13px 16px`, `1px solid #8e8879` right rules; eyebrow + Archivo 18px value + optional 7px note.
- Money ledger: `background: linear-gradient(90deg, #f2c84b21, transparent 42%), var(--paper)`; header with eyebrow, 7px seed line, Archivo 18px total; 2-column hairline grid (`#b9b1a1`) of rows `grid-template-columns: 34px minmax(0, 1fr) auto; min-height: 39px; padding: 6px 8px`; amount `strong` green/red; scrolls at 172px.
- Columns: 3 equal ranked lists (top 8 each); row `grid-template-columns: 18px minmax(0, 1fr) auto; gap: 7px; min-height: 33px; border-top: 1px solid #c8c1b2`; rank numeral Archivo 10px `#8f8a7d`, name 8px bold, city 7px, score Archivo 11px.
- Footer: right-aligned 8px `#7f796d` with a 9px ink `strong` line.

### 6.16 Creator links (L706–L778; markup in index.html)

Fixed bottom-right tab, `z-index: 20`, ink background with 2px ink top/left border. Two 34px-tall links, 8px/700: Ko-fi ("fowlfarmer", paper on ink, 17px SVG cup; hover `background: #29abe0; color: #fff`) and site ("tzhu.dev ↗", gold fill + ink text; hover green + white). Both lift `translateY(-3px)` on hover. Focus: `outline: 3px solid #fff; outline-offset: -5px`. Divider `1px solid #5c5a4f`.

### 6.17 Scrollbars, focus, selection

- Scrollbars: only the timeline is styled (hidden: `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`, L782–L789). All other scroll regions use native scrollbars.
- Focus: global `button:focus-visible { outline-offset: 3px; outline: 3px solid #fff }` (L587–L590). Overrides: company wheel trigger and program tiles use red inset outlines (L915–L918, L1185–L1190); creator links white inset (L740–L744). Submit and offer cards also change fill on focus.
- Selection: **no `::selection` rule** (browser default). No `user-select` rules.

---

## 7. Reusable recipes (quoted from source)

**Palette**

```css
:root { --paper: #eee9dc; --paper-deep: #d8d0bd; --ink: #1d1d19;
  --gold: #f2c84b; --red: #d64a38; --green: #247958; }
```

**App shell: fixed viewport, three bands**

```css
.game-shell { grid-template-rows: 58px auto minmax(0, 1fr); width: 100%; height: 100dvh; display: grid; overflow: hidden; }
.game-grid { grid-template-columns: minmax(420px, 1fr) 280px; gap: 12px; width: 100%; min-width: 0; min-height: 0; padding: 12px; display: grid; }
```

**Panel = 2px ink border + flat fill + ink header with gold eyebrow**

```css
.roulette-panel, .dossier { border: 2px solid var(--ink); background: var(--paper); min-width: 0; min-height: 0; }
.prompt-block { border-bottom: 2px solid var(--ink); background: var(--ink); color: var(--paper); align-items: center; display: flex; }
.prompt-block span { color: var(--gold); letter-spacing: 0.12em; font-size: 8px; font-weight: 700; display: block; }
.prompt-block h2 { font-family: var(--font-display), sans-serif; letter-spacing: -0.04em; margin: 3px 0 0; font-size: clamp(22px, 3vh, 31px); font-weight: 400; line-height: 1; }
```

**Display heading**: `font-family: var(--font-display), sans-serif; font-weight: 400; letter-spacing: -0.04em to -0.05em; line-height: 0.9 to 1.05`.

**Eyebrow label**: `font-size: 7–8px; font-weight: 700; letter-spacing: 0.09–0.12em;` caps; gold on ink, `#8f8a7d` on ink for stat labels, `#7f796d` on paper.

**Stat tile (label over big number, hairline grid)**

```css
.stat-grid > div { border-bottom: 1px solid #45443b; border-right: 1px solid #45443b; min-width: 0; padding: 14px; }
.stat-grid > div > span { color: #8f8a7d; letter-spacing: 0.09em; font-size: 7px; font-weight: 700; display: block; }
.stat-grid b { color: var(--paper); font-family: var(--font-display), sans-serif; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px; font-size: 21px; font-weight: 400; display: block; overflow: hidden; }
```

**Primary button (gold, hover green)**

```css
.application-submit { border: 2px solid var(--ink); background: var(--gold); cursor: pointer; min-height: 48px; font-weight: 700; }
.application-submit:hover:not(:disabled), .application-submit:focus-visible { background: var(--green); color: #fff; }
.application-submit:disabled { color: #615e54; cursor: not-allowed; background: #aaa596; }
```

**Dark button (ink, hover green)**

```css
.narration-window button { border: 2px solid var(--ink); background: var(--ink); color: var(--paper); cursor: pointer; margin: 18px 0 0 auto; padding: 11px 18px; font-size: 10px; font-weight: 700; display: block; }
.narration-window button:hover { background: var(--green); }
```

**Global button micro-transition**: `button { transition: background-color 0.14s, color 0.14s; }`

**Offset-shadow dialog card + straddling tag**

```css
.narration-window { border: 3px solid var(--ink); background: var(--paper); width: min(900px, 100%); box-shadow: 9px 9px 0 var(--gold); padding: 30px 30px 24px; position: relative; }
.narration-speaker { border: 3px solid var(--ink); background: var(--gold); letter-spacing: 0.12em; padding: 7px 16px; font-size: 10px; font-weight: 700; position: absolute; top: -24px; left: 18px; }
```

**Scrim**: `position: fixed; inset: 0; background: #1d1d19c7;` (78% ink; 72% for data modals, 52% for alerts).

**Modal header with square close button**

```css
.simulation-modal > header { border-bottom: 2px solid var(--ink); justify-content: space-between; align-items: flex-start; padding: 18px 20px 15px; display: flex; }
.simulation-modal > header button { border: 2px solid var(--ink); width: 31px; height: 31px; color: var(--ink); cursor: pointer; background: 0 0; font-size: 21px; line-height: 1; }
.simulation-modal > header button:hover { background: var(--red); color: #fff; }
```

**Hairline tile grid via 1px gap over ink**

```css
.program-choice-grid { background: var(--ink); grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1px; display: grid; }
```

**Selected tile: gold fill + red inset ring**

```css
.program-choice[aria-pressed="true"] { z-index: 1; background: var(--gold); box-shadow: inset 0 0 0 3px var(--red); position: relative; }
.program-choice:disabled { color: #8c897f; cursor: not-allowed; opacity: 0.42; }
```

**Stamp**: `border: 1px solid var(--red); color: var(--red); padding: 5px 7px; font-size: 8px; font-weight: 700; text-align: center;`

**Status badge**: `border: 1px solid var(--ink); padding: 5px 7px; font-size: 7px; font-weight: 700;` + `.accepted { background: var(--green); color: #fff }` / `.rejected { background: var(--red); color: #fff }`.

**Key/value data row**

```css
.simulation-summary dl > div { border-top: 1px solid #c8c1b2; justify-content: space-between; align-items: baseline; gap: 16px; padding: 5px 0; display: flex; }
```

**Triple-ring circular object**

```css
.wheel { border: 7px solid var(--ink); box-shadow: 0 0 0 4px var(--gold), 0 0 0 7px var(--ink); border-radius: 50%;
  transition: transform var(--spin-duration, 2.2s) var(--spin-easing, cubic-bezier(0.12, 0.68, 0.11, 1)); }
```

**CSS-triangle pointer with hard drop shadow**

```css
.pointer { border-left: 15px solid #0000; border-right: 15px solid #0000; border-top: 29px solid var(--red); width: 0; height: 0; filter: drop-shadow(0 2px 0 var(--ink)); }
```

**Value-change flash**

```css
.metric-change-up { animation: 0.72s ease-out metric-value-up; }
@keyframes metric-value-up { 0% { color: var(--paper); transform: scale(1); } 36% { color: #45c68a; transform: scale(1.16); } to { color: var(--paper); transform: scale(1); } }
```

**State-by-opacity timeline chip**: future `opacity: 0.42`, past `0.7`, current `background: var(--ink); color: var(--gold); opacity: 1`.

Design rules that fall out of the above:

1. Two surfaces only (paper and ink), each with its own hairline color; gold is the accent on both.
2. Structure is drawn with borders (2px structural, 3px floating, 7px hero object), never with shadows or radii.
3. Depth appears only on dialogs, as a hard 7–9px offset block in a tone color.
4. Hover is always a flat color swap in 0.14s: ink/gold -> green; destructive or dismissive -> red; cards -> gold.
5. Circles are reserved for the wheel family; everything else is rectangular.
6. Density over whitespace: 6–9px labels, 12px gutters, truncation with ellipsis nearly everywhere (`min-width: 0` + `text-overflow: ellipsis; white-space: nowrap; overflow: hidden`).

---

## 8. Accessibility-related CSS and oddities

### 8.1 What is there

- `button:focus-visible` ring (3px white, offset 3px), with red inset variants for tiles and the company wheel.
- `prefers-reduced-motion` block (L2775–L2791) plus matching JS timer changes.
- ARIA in markup (not CSS): dialogs have `role="dialog"` + `aria-modal`; result strip is `aria-live="polite"`; radar has a descriptive `aria-label`; tiles use `aria-pressed`; decorative parts are `aria-hidden`.
- `[hidden] { display: none !important }` from preflight (L525–L527).

### 8.2 What is missing

- No `.sr-only` / visually-hidden utility.
- No `::selection`, no `color-scheme`, no `prefers-color-scheme`, no `forced-colors` handling, no `prefers-contrast`.
- No focus style for non-button focusables except `.creator-link` (range input and `<summary>` rely on UA defaults).
- No focus trap or scroll lock in CSS (dialogs rely on `autoFocus` only).

### 8.3 Contrast (WCAG ratios computed from the hexes)

| Pair | Ratio | Where |
|---|---|---|
| paper on ink | 13.95 | body text on dark surfaces |
| gold on ink / ink on gold | 10.58 | eyebrows, top bar |
| ink on paper-deep | 11.01 | stage text |
| `#fff` on green | 5.32 | hover states, accepted badge |
| `#fff` on red | 4.29 | rejected badge, red strip (below 4.5) |
| `#aaa596` on ink | 6.87 | sidebar sub-text |
| `#8f8a7d` on ink | 4.91 | stat labels (7px) |
| locked link (55% paper on ink, about `#908d84`) | 5.10 | locked top-bar links |
| `#777368` on ink | 3.57 | unchecked achievements, share brand |
| red on ink | 3.94 | stamps, integrity-danger |
| **green on ink** | **3.18** | integrity-safe value |
| `#625e55` on paper | 5.33 | modal row labels |
| `#7f796d` on paper | 3.57 | modal eyebrows (8px) |
| **`#8f8a7d` on paper** | **2.84** | modal small notes (6–7px) |
| green on paper | 4.38 | "ACCEPT" tag, positive amounts |
| red on paper | 3.54 | negative amounts, error text |
| `#615e54` on `#aaa596` | 2.64 | disabled submit |
| **`#fff` on wheel gold `#f7c948`** | **1.57** | wheel labels on gold segments (rescued only by the 1px ink text-shadow) |
| `#fff` on wheel cream `#c9bfa9` | 1.82 | wheel labels on cream segments |
| `#fff` on Ko-fi blue | 2.63 | creator link hover |
| **white focus ring on paper / gold / paper-deep** | **1.21 / 1.60 / 1.54** | default focus outline is nearly invisible on every light surface |

Beyond ratios: text at 5.5–8px is the dominant size, far below comfortable reading size; tone is conveyed by color alone on wheel segments and the result strip (though the strip also carries text).

### 8.4 Oddities and dead rules

- `var(--font-body)` (L2203) is never defined — `.simulation-scholarships p small` renders in generic `sans-serif`.
- `font-weight: 800` x9 with no 800 face loaded (renders 700); weight 500 loaded but unused.
- `.wheel-rim` (L1326–L1335) is an 18px dot at the wheel center that is completely covered by the 26% hub — visually dead.
- `.wheel-label-text` is listed in the reduced-motion block (L2777) but has no transition or animation.
- `.application-submit` has no `font-size`, so it inherits 16px — by far the largest mono text in the UI (likely unintentional but reads as a big CTA).
- `.statistics-button, .leaderboard-button { border: 2px solid var(--ink) }` on an ink card: the border is invisible, and hover `background: var(--ink)` is a no-op; only the text color changes.
- `.share-button` is first given gold + 18px (L1840–L1844) then immediately overridden to paper (L1845–L1847).
- `.game-shell { height: 100dvh; overflow: hidden }` is redeclared unchanged inside the 720px query (L2615–L2616).
- L2766 `.top-actions button` (descendant) vs. `.top-actions > button` everywhere else — at <=360px it also restyles the meta links (min-width 44px, padding 0 4px).
- `.simulation-progress-track` is declared three times in a row (L2092–L2104) because of the `@supports` split.
- `.top-meta-link.locked` fallback color equals the unlocked color (no visible lock dimming without `color-mix` support; the padlock icon still shows).
- Classes present in markup with no CSS: `summary-savings`, `simulation-results`, `math-application-group`; timeline kind `study` has no rule (intentional default).
- Tailwind false positives in `@layer utilities` (L531–L558): `.collapse`, `.visible`, `.fixed`, `.relative`, `.start`, `.end`, `.block`, `.table`, `.transform` — generated because those words appear in source text; none is used as a class. The `@property --tw-*` blocks and `@layer properties` exist only for `.transform`.
- Wheel palette (JS) drifts from the CSS tokens: gold `#f7c948` vs `#f2c84b`, red `#d94a38` vs `#d64a38`, green `#1f8a60` vs `#247958`, ink `#262622` vs `#1d1d19`.
- Wheel separators are pure `#000`, the only non-ink black.
- The `log` array is maintained but never displayed (see 1.3).
- Fixed creator links overlap content in the bottom-right corner at every breakpoint; nothing reserves space for them.

---

## 9. Theming map for a burnt-orange (#BF5700) UT Austin re-skin

### 9.1 What actually carries the theme

Six color tokens, two font tokens, and one JS object do roughly 90% of the work:

| Carrier | Current | Role in a re-skin |
|---|---|---|
| `--gold` (36 uses) | `#f2c84b` | **The brand accent.** This is the slot burnt orange takes |
| `--ink` (78 uses) | `#1d1d19` | Dark surface + all borders + body text. Its olive tint sets the temperature of every grey |
| `--paper` / `--paper-deep` | `#eee9dc` / `#d8d0bd` | Light surface and recessed stage |
| `--red` (22 uses) | `#d64a38` | Secondary "hot" accent: pointer, marker, selected ring, stamps, danger |
| `--green` (12 uses) | `#247958` | Hover fill and success |
| `ew` in JS (`ui.js:725`) | 5 hexes | Wheel segment colors — the single largest colored area on screen, and **not driven by CSS variables** |
| `--font-display` / `--font-mono` | Archivo Black / IBM Plex Mono | Voice; can stay as-is |

### 9.2 Two problems a straight `--gold: #BF5700` swap creates

These are computed, not guessed:

1. **Burnt orange collides with the existing red.** `#BF5700` vs `#d64a38` has a contrast ratio of 1.07 and a near-identical hue. Every place that pairs gold with red stops reading: the red pointer over a gold-ringed wheel, the red inset ring on a gold selected tile (L1176–L1177), the hub's gold -> red hover (L1392 -> L1419), the red slot marker next to the gold ring, red stamps beside gold headings in the sidebar and share card, and gold vs red wheel segments. `--red` must move (deeper crimson/maroon, or hand the "pointer / selected ring / marker" job to ink or white) at the same time.
2. **Burnt orange is a mid-tone; gold is a light tone.** Gold works both as a fill under ink text and as text on ink (10.58 either way). `#BF5700` gives only 3.69 against ink in both directions (white on `#BF5700` is 4.59). So the single `--gold` token has to split into two roles:
   - **Accent as fill** (text sits on it) — L609 top bar, L750 site link, L937/L1308 wheel + slot ring, L1009/L1030 crank, L1176 selected tile, L1196 submit, L1257 offer hover, L1328/L1392 rim + hub, L1431 `.result-strip.gold`, L1787–L1788 checked box, L1842 NEW RUN, L1870 share hover, L1887/L1984/L2725 offset shadows, L1894 speaker tag. With burnt orange these need **white/cream text instead of ink** (ink text currently comes from inheritance: top-bar title, hub label, submit, speaker tag, selected tile, offer-card hover, `.result-strip.gold`, check mark L1789, `.creator-link-site` L751).
   - **Accent as text/stroke on ink** — L594 loading, L672 meta-link hover, L824 current timeline chip, L859 eyebrow, L1130 group header, L1472 sidebar code, L1518 radar stroke, L1529 radar values, L1578 integrity-warning, L1585 seed bonus, L1639/L1647/L1653/L1661 radar keyframes, L1727 end headline, L1805 job term. These are mostly 7–8px labels and need a **lighter orange** to stay legible on a dark surface.

   Practical shape (suggestion): `--accent: #BF5700; --accent-ink: <text color on accent>; --accent-bright: <lighter orange for use on dark>`. UT's own secondary palette has candidates for the bright role; verify exact values against the current UT brand guide before committing.

### 9.3 Hard-coded values to hunt down

**Gold baked into alpha hexes (will not follow the token):**

- L1517 `#f2c84b2e` — radar polygon fill
- L2396 `#f2c84b21` — leaderboard ledger gradient

**Red / green baked into alpha hexes:**

- L814 `#24795824` (timeline co-op tint), L817 `#d64a3821` (timeline off tint)

**Ink baked into alpha hexes (only if ink changes):**

- L1874 `#1d1d19c7`, L1972 `#1d1d19b8`, L1936 `#1d1d1985` (scrims)
- `ui.js:1769` `"#1d1d19"` (share-image background)

Replace all of the above with `color-mix(in srgb, var(--token) N%, transparent)` so they track the tokens (the file already uses `color-mix` behind `@supports` at L677–L681 and L2097–L2101).

**Tone tints derived from gold/red/green/ink:**

- L1053 `#eadca9`, L1056 `#b8d1c3`, L1059 `#d9aaa0`, L1062 `#bbb6a9` (slot rows)
- L1615/L1643 `#45c68a`, L1629/L1657 `#f06a58` (up/down flashes — can stay as universal semantic colors, but the red flash will sit close to burnt orange)

**JS wheel palette:** `ui.js:725` — all five values. In a rebuild, read these from the CSS custom properties so the wheel cannot drift from the theme. Also reconsider label color: white labels already fail on the gold and cream segments.

**The warm-olive neutral ramp (only matters if ink/paper temperature changes, e.g. to UT charcoal or a cooler off-white):** 19 greys, each approximately an ink/paper mix (percentages in section 1.2): `#45443b` x18, `#8f8a7d` x12, `#7f796d` x8, `#8e8879` x7, `#625e55` x6, `#c8c1b2` x5, `#b9b1a1` x4, `#aaa596` x4, `#777368` x3, `#4a493e` x3, and singles `#56544b`, `#5c5a4f`, `#615e54`, `#8c897f`, `#bbb6a9`, `#c9bfa9`, `#ddd7ca`, `#ded8ca`. Simplest rebuild: define 5–6 neutral tokens (`--line-on-ink`, `--muted-on-ink`, `--dim-on-ink`, `--line-on-paper`, `--line-on-paper-soft`, `--muted-on-paper`) as `color-mix()` of ink and paper and collapse the 19 values onto them. If the olive ink and cream paper are kept (they pair naturally with burnt orange), this ramp can be left alone.

**Neutral literals that are theme-independent but worth a decision:**

- `#fff` x17 — text on green/red fills and the default focus ring. The white focus ring (L589) is nearly invisible on light surfaces; make it ink or accent in the rebuild.
- `#000` L1340 — wheel separators (should be ink).
- Third-party brand colors `#29abe0`, `#ff5e5b` (Ko-fi) — drop or replace with whatever corner links the UT version has.

### 9.4 Things that do not need to change

- All layout, spacing, border weights, zero radii, hard offset shadows, type scale, motion timings and easings are palette-independent.
- Fonts: Archivo Black + IBM Plex Mono are neutral enough to keep; the fallback `size-adjust` metrics (L22–L29, L232–L239) only matter if you reuse next/font.
- Shadow colors, button hovers, and stamps follow the tokens automatically once `--gold` / `--red` / `--green` are re-pointed — but check the green hover against burnt orange; green-on-orange hover is a much louder shift than green-on-gold, so an ink or darker-orange hover may suit the new palette better.

### 9.5 Minimum change list

1. Re-point `--gold` (and split it into fill vs. on-dark roles as in 9.2).
2. Move `--red` away from orange; decide what the pointer / selected ring / slot marker use.
3. Set explicit text color on every accent-filled element (currently inherited ink).
4. Rewrite the JS wheel palette from tokens.
5. Replace the 4 token-derived alpha hexes (L814, L817, L1517, L2396) and the 4 slot tints (L1053–L1062).
6. Optionally re-derive the neutral ramp if ink or paper changes temperature.
7. Fix the focus ring color while there.
