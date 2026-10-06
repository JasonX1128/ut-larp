# Longhorn Launch quality review

Focused QA checklist for the gameplay/state-machine rewrite. The current implementation under review is `game-engine.js` plus `app.js`; `company-data.js` supplies the 250-employer wheel, `index.html` is the document shell, and `styles.css` owns presentation.

## Test setup

- [x] Run from the same URL with a fixed `?seed=<value>` when comparing two runs; seed `1220` matched the engine replay.
- [x] Record the seed, choices, stage reached, and final outcome for the fixed-seed and no-admission runs.
- [x] Exercise mouse/touch and keyboard input, including Space and Escape.
- [x] Repeat the completed run after refresh; the end card and totals remained intact. A second-tab pass remains unrecorded.
- [x] Confirm the verified browser run had no uncaught exceptions or console errors.

## Engine contract tests

The Node suite at [`tests/engine.test.js`](../tests/engine.test.js) is intentionally limited to the agreed engine boundary:

```sh
node --test tests/engine.test.js
```

It loads CommonJS `Game` from `game-engine.js` and covers:

- documented state shape from `Game.create(seed)`;
- seeded spin sampling, result-item agreement, and duplicate-spin no-ops;
- complete-run determinism through `Game.autoPlay(seed)`;
- eight academic terms with `state.summer === 3` at full-timeline completion; `jobs.length` counts placements only;
- all 250 unique employer roles, mild role-fit/Texas weighting, and random employer selection through `recruit-employer`;
- interview count decrementing only on interview rolls, with offers held until all interviews are spent;
- a full run with at least one no-job summer;
- the no-admission terminal branch (direct smoke test: seed `0` rejects CS/ECE/Math and ends before academics);
- unique return offers carried through a terminal ending;
- full-schema validation, malformed-save rejection, interview chance bounds, multi-offer acceptance/pay, integrity termination, and rejected-club filtering.

The browser-only restart-during-animation behavior remains an integration check because the engine action contract does not define a restart action. The browser adapter must cancel or invalidate pending animation callbacks when it creates a new state.

## Critical state-machine paths

### Admissions

- [ ] A profile can be rolled exactly once; repeated clicks, double-clicks, and pressing Enter during the animation produce one value and one log entry.
- [ ] A player can select zero through the allowed maximum number of applications, cannot exceed the maximum, and can deselect before submission.
- [ ] Every submitted application receives exactly one admission result.
- [ ] **Offer path:** at least one offer is rendered, only offered programs are selectable, and accepting one initializes the correct program stats and clears incompatible pre-admission state.
- [x] **No-offer path:** browser seed `0` produced a complete admissions ending with no program, 0/8 academic terms, 0 summers, and 0 jobs; `NEW RUN` worked afterward. Terminal spins were no-ops and the resulting save passed `G.isValidState()`.
- [ ] Admission outcomes are not silently rerolled by re-rendering, opening/closing a modal, resizing, or navigating browser focus.

### Full run: eight study terms and three summers

- [ ] A successful run visits exactly eight study terms and exactly three summer recruiting/work terms.
- [ ] The timeline advances in order: Fall 1, Spring 1, Summer 1, Fall 2, Spring 2, Summer 2, Fall 3, Spring 3, Summer 3, Fall 4, Spring 4.
- [ ] Each study term has one grade roll and one study-event roll, with tuition charged once.
- [ ] Each summer has one interview-count step, the expected number of interview attempts, a work/no-work outcome, and one evaluation step.
- [ ] Summer counters increment once per summer. Re-rendering a screen never advances the term or summer counter.
- [ ] The final Spring 4 event transitions to graduation exactly once; no extra grade, summer, or recruiting step is shown.
- [ ] Back-to-back clicks on every continue/roll button cannot skip a stage or apply a stage twice.

### No-job branch

- [ ] Force or use a seed with zero interviews and verify the no-job summer branch is reachable.
- [ ] A no-job summer still receives the correct summer event/evaluation flow without inventing an employer, internship, pay, or return offer.
- [ ] A no-job summer does not evaluate or mutate the internship from a previous summer.
- [ ] A later successful internship replaces the no-job state cleanly and is recorded under the correct summer.
- [ ] Savings, stats, log entries, and timeline state remain internally consistent after a no-job summer.

### Recruiting and offers

- [ ] Interview count is resolved once and displayed accurately.
- [ ] All allocated interviews can be spent; a failed interview advances to the next interview, while a successful interview follows the intended offer policy.
- [ ] Employer identity is rolled from the full employer wheel, with role-fit/stat weighting mild enough that the wheel remains broad; manual employer targeting is not part of the user flow.
- [ ] The same employer cannot be rolled repeatedly within one summer; the attempted-employer filter shrinks the wheel after each employer roll.
- [ ] Offers are collected across all interview rolls and cannot open the offer-selection stage early.
- [ ] If multiple offers are possible, all offers remain available for comparison and exactly one can be accepted. If first-offer-wins is intended, the UI must not imply a multi-offer choice.
- [ ] Accepting an offer applies pay, employer stats, internship history, and summer identity exactly once.
- [ ] A return offer is created only from the current summer’s internship and is not duplicated across later no-job summers.
- [ ] Graduation correctly exposes all valid return offers and does not allow a locked return-offer card to trigger a no-op.

### Termination and endings

- [ ] Repeated integrity-loss events terminate the run at the documented threshold and do not permit another spin.
- [ ] Academic termination, if supported, occurs at the correct GPA/term condition and records a stable ending.
- [ ] Every graduation choice resolves once to a valid ending, including graduate school, startup success/failure, open-to-work, and return offer.
- [ ] The final card never shows an undefined ending, missing program, stale job, or impossible timeline status.
- [ ] A finished run cannot mutate when an old animation callback, delayed promise, or stale button fires.

## RNG, restart, and replay

- [ ] Two fresh `NEW RUN` actions produce different seeds and different RNG streams by default.
- [x] A URL seed is replayable: browser seed `1220` matched `Game.autoPlay(1220)` through the same final ECE/return ending.
- [ ] `?seed=0`, negative seeds, large numeric seeds, missing seeds, and invalid seed text are normalized intentionally and documented.
- [x] Restart during a spin returns to a fresh-seed profile with no stale result.
- [x] Space successfully rolls the employer wheel; the in-motion/settled mobile checks showed one committed result and the old run did not write into the new run. Enter/double-click coverage remains outside this pass.
- [ ] Opening Outcomes or Research while a spin is active does not consume RNG or commit hidden state changes.
- [x] The displayed URL seed matched the fresh seed after restart (`328844165`).

## Persistence and simulator

- [x] Refresh preserved the completed end card and matching totals in the verified browser run.
- [ ] Corrupt, old-version, or unavailable local storage fails gracefully without blocking a new run.
- [ ] A completed run increments persistent run statistics exactly once, including the no-admission ending if that is counted as a run.
- [x] Simulator output uses the same engine rules and is recorded as a seeded approximation; the 1,000-run snapshot below is the current reference.
- [ ] Simulator categories include every live ending, including startup failure and academic/integrity endings where applicable; percentages sum to 100%.
- [ ] Running the simulator does not change the live run’s RNG state, stats, seed, counters, or ending.

Simulator snapshot: 1,000 runs with sample seeds `i * 7919` produced 384 admission, 158 graduate, 396 return, 60 open, and 2 academic endings (100% total). Startup-failure coverage is not represented in this snapshot and remains a follow-up check.

## Mobile and keyboard accessibility

- [x] At 390px × 844px, `pageWidth === 390`; the employer wheel settled without horizontal overflow, and the result strip stayed above the sheet and viewport.
- [x] At 320px × 568px, the employer reel frame stayed within the 320px stage with no horizontal overflow.
- [ ] Every actionable control is reachable in a logical Tab order and has a visible focus state.
- [x] Space activated a focused roll once; Enter and repeated-click coverage remain open.
- [x] Escape closed Help/Export in the verified browser pass.
- [ ] Buttons remain large enough for touch, and disabled/locked controls are actually disabled rather than merely styled as locked.
- [ ] Long employer/program names, result text, and copied seed links do not overflow or make controls unreachable.
- [ ] Reduced-motion users receive an immediate but equivalent result, with no race introduced by skipped animation. The source path was reviewed, but no OS-level `prefers-reduced-motion` browser run was performed.

## Resolution status and remaining risks

Resolved in the current implementation:

- Accepted offers are cleared when a job is accepted ([game-engine.js:162](../game-engine.js#L162)).
- `job` is cleared when advancing out of a summer ([game-engine.js:115](../game-engine.js#L115)).
- `app.js` delegates save validation to `G.isValidState()` ([app.js:11](../app.js#L11)).
- Spin setup now has `try/finally` cleanup and restart generation invalidation ([app.js:114](../app.js#L114), [app.js:121](../app.js#L121)).
- Negative numeric seed links are accepted and normalized ([app.js:9](../app.js#L9)).
- Rejected clubs are recorded and filtered from later choices ([game-engine.js:132](../game-engine.js#L132), [app.js:86](../app.js#L86)).
- Terminal-state validation now requires `finished` to match the `ending` stage ([game-engine.js:189](../game-engine.js#L189)).
- `lastResult` and pending result items now validate payload fields and allowed tones ([game-engine.js:204](../game-engine.js#L204), [game-engine.js:212](../game-engine.js#L212)).
- Result-strip state persists through the next stage, and auto-continue has a manual Continue escape hatch ([app.js:123](../app.js#L123), [app.js:124](../app.js#L124)).
- v4 replaces manual employer targeting with a weighted `recruit-employer` wheel backed by 250 unique company/role records ([game-engine.js:93](../game-engine.js#L93), [company-data.js](../company-data.js)).
- Employer selection does not consume an interview; each interview roll decrements the count, and offer selection is reachable only after the final interview ([game-engine.js:129](../game-engine.js#L129)).
- The stale `choose-employer` and `keep-searching` flow is removed from autoplay and browser-facing progression ([game-engine.js:160](../game-engine.js#L160)).
- Browser seed `1220` now matches `Game.autoPlay(1220)` through the full 8-study/3-summer run: ECE, GPA 3.4125, $81,120 cash, placements at Wealthsimple, ServiceNow, and HRT, and the same return ending; no browser console errors were observed.
- Browser mobile/restart/persistence checks passed: 390×844 wheel motion and settled layout, Space rolling, refresh-preserved end card, Escape closing Help/Export, restart during spin producing a fresh profile, automatic continuation, and persistent result strip.
- The real-canvas PNG preview was generated and visually verified at [`docs/qa/result-preview.jpg`](qa/result-preview.jpg); IAB download-event delivery is not observable in this environment.

Remaining findings:

1. **P2 — Reduced-motion behavior is not OS-preference verified.** The source path was reviewed, but no browser run with `prefers-reduced-motion` enabled has confirmed immediate equivalent results and race-free auto-advance.
2. **P2 — `Game.autoPlay()` is a simulator policy, not full manual-path coverage.** It hard-codes applications, focus, club skip, employer-wheel spins, offer selection, and ending choice ([game-engine.js:160](../game-engine.js#L160)). Keep browser/manual checks for club acceptance, multi-offer comparison, startup, and open-to-work paths.
3. **Verification limit — IAB download events are not observable.** PNG generation and the visible preview passed; the browser container cannot independently confirm the download event.

Current test result: **16 passing, 0 failing** (`node --test tests/engine.test.js`), plus the seed-0 no-admission smoke test. The verified browser seed-1220 run completed 8 study terms and 3 summers with ECE, 3.4125 GPA, $81,120 cash, three placements, a matching return ending, and zero console errors.

## Release gate

- [x] No P0/P1 checklist item remains reproducible; terminal-state and result-payload validation are resolved.
- [x] A fixed-seed run and a fresh-seed restart are demonstrated in the QA notes.
- [x] One complete eight-study/three-summer run is recorded with `academicTerms === 8`, `summer === 3`, and placement count reported separately.
- [ ] No-job, integrity-termination, and multi-offer/offer-comparison cases are each recorded in browser QA; engine coverage is green.
- [x] Mobile 390px/320px and Space/Escape keyboard checks are recorded; full keyboard traversal remains open.
- [x] `node --check`/unit tests pass; the current unit suite is 16/16 green and the desktop seed-1220 browser smoke test reported no console errors.
- [x] Mobile 390px, restart during spin, auto-continue, and manual result-strip behavior are verified in the browser.
- [ ] OS-level reduced-motion behavior remains to be verified.
