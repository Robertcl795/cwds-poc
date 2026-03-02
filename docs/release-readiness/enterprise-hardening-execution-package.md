# Enterprise Hardening Sprint Execution Package

Date: 2026-03-02
Scope: action-ribbon, alert, dialog extensions, context menu extensions, toolbar, snackbar, tooltip extensions, card

## A. Assumptions (minimal)

- Test stack: Vitest (unit + interaction in jsdom), Playwright (E2E smoke), Storybook addon-a11y (axe) in CI.
- Visual regression tooling: Chromatic (`pnpm test:visual`) on PRs when `CHROMATIC_PROJECT_TOKEN` is present.
- Storybook/showcase setup:
  - Storybook: `apps/storybook/src/**/*.stories.ts` with HTML stories.
  - Showcase: `apps/ux-showcase` route-based demos + Playwright route smoke specs.
- "Enterprise component set complete" for this sprint means each in-scope component already has:
  - a public primitive factory API,
  - baseline style hooks/data-state,
  - at least one story and one baseline test path.
- Repo mapping note (non-breaking): requested `packages/components`/`packages/web-components` maps to current workspace `packages/ui-system/primitives` and `packages/ui-system/web-components`.
- In-scope shipped targets and variants/extensions (as implemented now):
  - `action-ribbon`: tones (`neutral|info|success|warning|error`), dense, sticky, dismissible, overflow actions (`maxVisibleActions` + context menu), selection count, optional live announcement.
  - `alert`: variants (`soft|outlined|filled`), tones (`neutral|info|success|warning|error`), priorities (`polite|assertive`), dense, dismissible, action row.
  - `dialog` extensions: `default|alert|confirm|destructive-confirm`, `actionsLayout` (`end|space-between`), `closeOnEscape`, optional outside-press close, alertdialog semantics for alert/destructive.
  - `menu` context extensions: trigger mode (`contextmenu|click|both`), item/label/separator, checkbox/radio/switch menuitems, shortcut labels.
  - `toolbar`: title/leading/trailing/action partitions, dense, overflow context menu.
  - `snackbar`: host-based queue, one-visible-at-a-time, tone/priority/duration, action + dismiss affordance, hover/focus pause timers.
  - `tooltip`: placement (`top|bottom|start|end`), delayed open/close timers, touch suppression, max width.
  - `card`: variants (`outlined|filled|elevated`), dense, interactive flag, action footer.

## B. Hardening Sprint Execution Overview (dependency order)

1. Contract audit + terminology normalization.
   Why first: aligns names/events/data hooks before adding stories/tests that would otherwise encode inconsistency.
2. State matrix + story expansion.
   Why second: creates visible acceptance baseline for all later behavior hardening and visual snapshots.
3. Live-region hardening (`alert`/`snackbar`).
   Why third: highest risk for a11y regressions; stabilizes announcements before queue/focus tests are finalized.
4. Overlay focus/dismiss hardening (`dialog`/context menu/tooltip).
   Why fourth: depends on normalized contracts and produces deterministic interaction expectations for E2E.
5. Enterprise workflow semantics hardening (`action-ribbon`/`toolbar`).
   Why fifth: these rely on alert/snackbar/context actions semantics and should consume already-hardened feedback/overlay behavior.
6. Visual consistency hardening (density/status/forced-colors/reduced-motion).
   Why sixth: reduces snapshot churn by doing visual tuning after semantic/interaction behavior is stable.
7. Support-path fallback parity validation (enhancement on/off).
   Why seventh: compare stable behavior across paths; avoids debugging fallback while core behavior is still changing.
8. API cleanup/deprecations (non-breaking first).
   Why eighth: after behavior is validated, freeze naming and start deprecation notices safely.
9. CI gates + release-readiness report.
   Why last: gates should reflect final matrix and avoid false negatives during active refactoring.

## C. File-By-File Hardening Scaffold (exact)

### Proposed modify/add set

| Path | Purpose | Dependencies | Why this sprint needs it |
|---|---|---|---|
| `packages/ui-system/primitives/src/shared-feedback/live-region.ts` (modify) | Add deterministic announce policy (dedupe/repeat guard and node-replacement strategy hook) | `shared-feedback/types`, alert/snackbar | Core of live region correctness and repeat-message behavior.
| `packages/ui-system/primitives/src/alert/create-alert.ts` (modify) | Normalize role/live strategy and action/dismiss semantics | `shared-feedback`, `button` | Fix immediate vs polite announcements and avoid double announcements.
| `packages/ui-system/primitives/src/snackbar/create-snackbar.ts` (modify) | Queue semantics, timer determinism hooks, polite/assertive policy guard | `snackbar-queue`, `button`, `shared-feedback` | Highest-risk transient feedback behavior.
| `packages/ui-system/primitives/src/snackbar/snackbar.types.ts` (modify, non-breaking additive) | Optional test hooks/timer control config | host factory | Enables deterministic timer tests without runtime hacks.
| `packages/ui-system/primitives/src/shared-overlay/overlay-controller.ts` (modify) | Strengthen restore target validity checks | `headless OverlayStack` | Prevent restoration to detached/disabled nodes.
| `packages/ui-system/primitives/src/shared-overlay/dismiss.ts` (modify) | Dismiss reason consistency + outside/focus-out edge fixes | overlay controller | Stabilizes close behavior under nested overlays.
| `packages/ui-system/primitives/src/shared-overlay-advanced/advanced-overlay-controller.ts` (modify) | Trigger linkage normalization and open/close lifecycle instrumentation | positioning + dismiss | Central place to normalize tooltip/menu/dialog extension behavior.
| `packages/ui-system/primitives/src/composites/dialog.ts` (modify) | Dialog extension focus placement/restoration and outside press policy refinement | shared overlay, button | Prevent focus regressions and dismissal inconsistencies.
| `packages/ui-system/primitives/src/menu/create-context-menu.ts` (modify) | Right-click reopen, keyboard invocation parity, dismiss safety | advanced overlay | Enterprise context actions need deterministic trigger behavior.
| `packages/ui-system/primitives/src/tooltip/create-tooltip.ts` (modify) | Informational-only guardrails, timer determinism, touch policy docs hooks | advanced overlay | Tooltip must remain non-critical and predictable.
| `packages/ui-system/primitives/src/action-ribbon/create-action-ribbon.ts` (modify) | Workflow semantics normalization for status/actions/dismiss + live announcement policy | shared-feedback/actions/menu | Align enterprise semantics with alert/snackbar.
| `packages/ui-system/primitives/src/toolbar/create-toolbar.ts` (modify) | Group labeling/action partition semantics and overflow linkage | shared-actions/context menu | Enterprise command surface consistency.
| `packages/ui-system/primitives/src/card/create-card.ts` (modify) | Density/status visual hook normalization + action semantics check | shared actions/button | Keeps status and density parity across surfaces.
| `packages/design-core/styles/src/components/composites.css` (modify) | Tone/density/forced-colors/reduced-motion alignment for tooltip/context-menu/card | tokens aliases | Visual consistency and HC/reduced-motion parity.
| `packages/design-core/styles/src/components/primitives.css` (modify) | Alert/snackbar/toolbar/action-ribbon layering and focus/ripple stack rules | tokens aliases | Prevent visual drift and state-layer collisions.
| `packages/ui-system/primitives/src/testing/enterprise-hardening/*.spec.ts` (add) | Cross-component hardening regression tests | primitives factories + shared helpers | Shared high-risk behavior tests in one place reduce duplication.
| `apps/storybook/src/enterprise-hardening/*.stories.ts` (add) | Canonical state/density/tone/environment hardening matrices | primitives + styles | Converts hardening matrix into reviewable artifacts.
| `apps/storybook/src/enterprise-hardening/live-region.alert-snackbar.stories.ts` (add) | Live region scenarios and repeat-message checks | alert/snackbar | Direct manual+automated review surface for top priority area.
| `apps/storybook/src/enterprise-hardening/overlay-focus-dismiss.stories.ts` (add) | Overlay lifecycle and dismissal matrix | dialog/menu/tooltip | Directly validates trigger/open/close/focus rules.
| `apps/ux-showcase/src/routes/enterprise-hardening/index.ts` (add) | End-to-end integrated enterprise hardening route | primitives | Demonstrates realistic multi-surface workflows.
| `apps/ux-showcase/src/routes/enterprise-hardening/enterprise-hardening.css` (add) | Route-specific density/status/state matrix layout | styles/tokens | Keeps E2E demo stable and readable.
| `apps/ux-showcase/e2e/enterprise-hardening.spec.ts` (add) | Chromium-first smoke flows for hardening-critical paths | Playwright + showcase route | Release confidence for true interaction paths.
| `docs/components/enterprise-hardening-checklists.md` (add) | Component-facing checklists and terminology | architecture + package reference | Single source for component hardening acceptance.
| `docs/release-readiness/enterprise-hardening-execution-package.md` (add) | Tactical A-O hardening package | sprint scope | Main implementation plan and governance artifact.
| `docs/release-readiness/enterprise-hardening-ci-gates.md` (add) | CI gate definitions and warn-only transitions | quality workflow | Makes pass criteria explicit and enforceable.
| `docs/release-readiness/enterprise-hardening-report-template.md` (add) | Release-ready reporting template | above docs | Standardized signoff.
| `docs/release-readiness/Presentation.md` (add) | Slide scaffold for enterprise hardening POC | execution package + report | Stakeholder communication artifact.
| `docs/architecture-vision/framework-agnostic-contracts.md` (modify) | Add boundary note for enterprise hardening contracts | architecture docs | Captures non-breaking normalization decisions.

### Colocation note

- Keep component-specific unit specs colocated when behavior is local.
- Add `packages/ui-system/primitives/src/testing/enterprise-hardening` only for cross-cutting behavior (live region, focus restoration fallback, enhancement parity) to avoid repeating identical helpers in 8 components.

## D. Contract Audit + Normalization Plan

### Audit categories

| Category | What to check | Common failures | Normalization approach | Safe now vs defer | Breaking risk |
|---|---|---|---|---|---|
| 1. Attribute/property naming | `dense`, `dismissible`, `tone`, `priority`, `triggerMode`, `closeOn*` naming across options | synonyms (`compact`, `severity`, `intent`) drift in stories/docs | Canonical dictionary + alias mapping in docs only; keep runtime names stable | Safe now: docs + lint checks. Defer: runtime aliases unless demanded | Non-breaking if docs-only |
| 2. Event naming | `cv-*-action`, `cv-*-dismiss`, `cv-tooltip-open/close` payload consistency | mixed detail shapes, inconsistent source naming | Event payload schema table + tests for `detail` shape | Safe now | Non-breaking |
| 3. `data-*` hooks | `data-open`, `data-state`, `data-tone`, `data-dense`, `data-dismissed` consistency | component-specific ad hoc flags | shared state-map constants for new tests/stories (no API rename yet) | Safe now for additions | Potentially breaking if removing old hooks -> defer removal |
| 4. Token consumption | Use `--cv-comp-*` aliases and avoid raw literals for status/density | hardcoded shadows, spacing, and colors in enterprise surfaces | stylelint-like token-drift test + targeted CSS refactor | Safe now | Non-breaking visual-only if careful |
| 5. Focus ring integration | visible focus on actionable elements and overlays | focus hidden by state layer/ripple/box-shadow | enforce focus layer z-index and outline tokens | Safe now | Non-breaking |
| 6. Ripple opt-in policy | ripple disabled mode behavior parity | ripple obscures focus or disabled states | document: semantics/focus pass even with ripple off; tests for both modes | Safe now | Non-breaking |
| 7. Trigger/surface linkage | `id`, `aria-controls`, `aria-expanded`, `aria-haspopup` on menu/tooltip/dialog triggers | missing cleanup on destroy, stale ids | centralize linkage rules in advanced overlay/shared helpers | Safe now | Non-breaking |
| 8. Open/close API consistency | `open/close/dismiss` reason mappings | ambiguous reason (`programmatic` vs `action`) | reason taxonomy table + assertion tests | Safe now | Non-breaking |
| 9. Status/tone/severity terms | `tone`, `priority`, alert/snackbar/action-ribbon terminology | `severity` used in docs while code says `tone` | docs normalize on `tone` + mapping note | Safe now | Non-breaking |
| 10. Density terms | `dense` usage across toolbar/card/action-ribbon/alert | `compact` appears in menu labels/stories | keep UI label text flexible, API term fixed as `dense` | Safe now | Non-breaking |
| 11. Docs terminology | dismiss vs close, transient vs persistent, sticky vs inline | mixed glossary across stories/docs | publish glossary table and enforce in PR checklist | Safe now | Non-breaking |

### Safe-now vs defer summary

- Safe now:
  - Add missing tests, Storybook matrices, docs normalization, additive non-breaking options/test hooks.
  - Internal helper refactors preserving current public API names and events.
- Defer:
  - Renaming existing event names or option keys.
  - Removing old `data-*` hooks without deprecation window.
  - Introducing new variants outside current shipped scope.

## E. Hardening Matrix Per Component

### 1) Action Ribbon

- State coverage:
  - hover/focus-visible/active/disabled on action buttons and overflow trigger.
  - tone: neutral/info/success/warning/error.
  - dismissible true/false.
  - dense true/false.
  - sticky true/false.
  - selected context: `selectionCount` null/0/1/n.
- Interaction coverage:
  - pointer/touch/keyboard activation for primary, danger, overflow actions.
- A11y checks:
  - status region label clarity, live politeness based on tone, action names.
- Visual checks:
  - tone parity with alert/snackbar, focus ring visible above state layers.
- Environment checks:
  - reduced motion and forced colors; ripple off path.
- Security checks:
  - dynamic message/action labels rendered as text only.
- Regression risk:
  - high: message updates causing repeated announcements; overflow menu losing trigger linkage.

### 2) Alert

- State coverage:
  - variant soft/outlined/filled.
  - tone neutral/info/success/warning/error.
  - dismissible and action rows.
  - dense true/false.
- Interaction coverage:
  - pointer/keyboard action + dismiss.
- A11y checks:
  - role `status` vs `alert` policy, polite/assertive parity, title/message naming.
- Visual checks:
  - icon/color emphasis parity and density spacing.
- Environment checks:
  - forced-colors border/foreground contrast.
- Security checks:
  - no HTML injection in title/message/action labels.
- Regression risk:
  - high: over-assertive alerts causing screen reader noise.

### 3) Dialog Extensions

- State coverage:
  - variants default/confirm/alert/destructive-confirm.
  - open/closed cycles, closeOnEscape true/false, outside press true/false.
  - actions layout end/space-between.
- Interaction coverage:
  - pointer open/confirm/cancel, keyboard Escape and tab order.
- A11y checks:
  - `alertdialog` role on alert/destructive; title/description linkage.
- Visual checks:
  - tone severity parity and button emphasis.
- Environment checks:
  - reduced motion for open/close transitions if any.
- Security checks:
  - focus restoration target validation and safe dismissal.
- Regression risk:
  - high: focus not returning to valid trigger after close.

### 4) Context Menu Extensions

- State coverage:
  - triggerMode contextmenu/click/both.
  - item kinds default/danger.
  - checkbox/radio/switch checked/unchecked.
  - open/closed/reopen on repeated right-click.
- Interaction coverage:
  - mouse right-click, keyboard context key/Shift+F10, touch long-press policy (explicitly unsupported or mapped).
- A11y checks:
  - role menu/menuitem/menuitemcheckbox/menuitemradio, `aria-checked`, shortcut hints not masquerading as handler.
- Visual checks:
  - danger styling, focus indicator, separators and labels parity.
- Environment checks:
  - forced-colors focus outlines and contrast.
- Security checks:
  - disabled activation prevented, outside-click dismiss reliability.
- Regression risk:
  - high: incorrect close/reopen behavior and stale checked state.

### 5) Toolbar

- State coverage:
  - dense true/false, overflow on/off, primary/secondary/danger action mix.
- Interaction coverage:
  - pointer/keyboard activation, overflow menu path.
- A11y checks:
  - `role=toolbar`, label strategy (`aria-label`), group semantics for leading/title/actions.
- Visual checks:
  - density/shape parity with card and action-ribbon.
- Environment checks:
  - forced-colors and reduced-motion for state changes.
- Security checks:
  - disabled actions non-activatable.
- Regression risk:
  - medium-high: overflow action mapping mismatch to source action ids.

### 6) Snackbar

- State coverage:
  - queued/visible/closing/hidden.
  - tones + polite/assertive priorities.
  - dismissible true/false, action present/absent.
  - duration 0/custom/default.
- Interaction coverage:
  - pointer action/dismiss, keyboard action/dismiss, hover/focus pause/resume.
- A11y checks:
  - role and live behavior; no forced focus steal.
- Visual checks:
  - tone parity with alert/action-ribbon, close animation states.
- Environment checks:
  - reduced motion disables close animation delay.
- Security checks:
  - dynamic content safe; queue operations cannot expose stale actions.
- Regression risk:
  - high: queue order/announcement order mismatch and timer flakiness.

### 7) Tooltip Extensions

- State coverage:
  - open/closed with open and close delays.
  - placement top/bottom/start/end.
  - disabled true/false, touch disabled true/false.
- Interaction coverage:
  - hover/focus open-close, Escape close.
- A11y checks:
  - `aria-describedby` merge/cleanup correctness; informational-only policy.
- Visual checks:
  - max width, contrast, motion fade/transform.
- Environment checks:
  - reduced-motion transition suppression, forced-colors border.
- Security checks:
  - text-only content remains safe.
- Regression risk:
  - medium-high: dangling `aria-describedby` ids after destroy.

### 8) Card

- State coverage:
  - variant outlined/filled/elevated, dense true/false, interactive true/false.
  - action button states and disabled.
- Interaction coverage:
  - pointer/keyboard action paths.
- A11y checks:
  - heading hierarchy and actionable footer semantics.
- Visual checks:
  - spacing/radius/typography parity under density.
- Environment checks:
  - forced-colors border clarity.
- Security checks:
  - body text content safety (string/HTMLElement boundaries).
- Regression risk:
  - medium: inconsistent density metrics across card vs toolbar/action-ribbon.

## F. Live Region Hardening Strategy (Alert + Snackbar)

### 1. Role and announcement strategy

- `alert`:
  - Use `role="alert"` + `aria-live="assertive"` only for blocking/failure/high-urgency messages.
  - Use `role="status"` + `aria-live="polite"` for informational/success/background updates.
- `snackbar`:
  - Default to `status/polite` for transient confirmations.
  - Allow `alert/assertive` only for actionable failure requiring immediate awareness.
- Do not use live regions for static non-changing informational text in cards/toolbars.

### 2. Message update behavior

- For updates in same surface:
  - preferred: clear then set text in microtask when announcement is required.
- Repeat message behavior:
  - include optional dedupe token/timestamp strategy to prevent silent drops by SR when exact same string repeats rapidly.
- Avoid double announcements:
  - never maintain both visible live region and separate hidden live region for same message unless explicitly needed for repeated-message workaround.

### 3. Snackbar semantics

- Snackbar is transient feedback, not critical blocking UI.
- Action button:
  - semantic as optional remediation/navigation action, not mandatory task completion.
- Dismiss affordance:
  - button with clear accessible name (`Dismiss`).

### 4. Timing + accessibility

- Auto-dismiss defaults:
  - keep 4-5s default, allow per-message override.
  - duration 0 means sticky until programmatic/action close.
- Reduced motion:
  - skip close animation delay; remove transition waits.
- Interaction pausing:
  - pause timer on pointer hover and focus within snackbar; resume on leave/focusout.
- Deterministic tests:
  - run with fake timers; assert show -> pause -> resume -> dismiss timeline.

### 5. Queue/stack policy validation

- Shipped policy: queue, single visible at a time.
- Validate:
  - FIFO display order.
  - dismissal drains queue predictably.
  - assertive messages do not skip queue unless explicitly documented.

### 6. Focus behavior

- Default: keep focus where user is (no focus steal).
- Focus may move only if user explicitly activates snackbar action/dismiss.

### 7. Tests

- Automation:
  - axe catches structure issues but not SR announcement correctness.
- Manual SR checklist:
  - NVDA/JAWS + VoiceOver spot checks for polite/assertive timing and repetition.
- Timer tests:
  - deterministic fake timer suites for queue and pause/resume.
- Repeated-message regression:
  - enqueue same message twice; verify expected second announcement policy.

## G. Overlay Focus/Dismiss Hardening Strategy

### 1. Open/close lifecycle validation

- Validate per component:
  - trigger activation -> open -> expected initial focus.
  - close by all routes -> focus restored to valid trigger/anchor fallback.
  - repeated open/close cycles do not leak listeners or stale aria linkage.

### 2. Dismiss behavior matrix

- Escape: closes topmost overlay when policy enabled.
- Outside pointer: close behavior matches component contract.
- Context menu right-click reopen:
  - right-click while open repositions/reopens deterministically.
- Trigger re-activation:
  - toggles for click-trigger menus, no duplicate open states.
- Selecting menu item:
  - respects `closeOnSelect`.
- Blur/focus transitions:
  - tooltip closes on focus out, menu closes when focus leaves (if configured).

### 3. Focus restoration rules

- Restore to trigger if connected + visible + enabled.
- Fallback order when trigger invalid:
  - nearest valid ancestor focusable -> previously active valid element -> `document.body` (last resort).
- Explicitly block restoring to disconnected nodes.

### 4. Tooltip-specific hardening

- Informational-only enforcement:
  - docs + lint/test rule: critical instructions must be visible elsewhere.
- Hover/focus policy:
  - delayed open on hover/focus, delayed close on leave/blur.
- Touch policy:
  - default disabled for touch pointer; document exception path.
- Deterministic timers:
  - fake timer tests for open/close delays.
- No focus trap.

### 5. Context menu-specific hardening

- Pointer-origin placement:
  - clamp in viewport and verify near cursor.
- Keyboard invocation:
  - ContextMenu key / Shift+F10 opens near target.
- Dismiss safety:
  - outside press + Escape always closes topmost menu.
- Fallback positioning:
  - absolute placement quality remains usable even without anchor features.

### 6. Dialog extension-specific hardening

- Keep compatibility with existing dialog baseline (`<dialog>` + current APIs).
- Validate action layout and focus order for confirm/cancel and alert variants.
- Validate semantics for destructive confirm (`alertdialog`, negative emphasis).

### 7. Tests

- Interaction/E2E:
  - assert active element transitions on open/close paths.
- Fallback tests:
  - run with enhancement flags forced off where applicable.
- Manual SR:
  - announce title/description + escape/close behavior.

## H. Enterprise Workflow Semantics Hardening

### 1. Action-ribbon semantics validation

- Shipped role: workflow status + contextual bulk actions surface.
- Validate split:
  - status text (informational), action group (operational), dismiss control (state management).
- Sticky vs inline:
  - sticky uses persistent placement and still preserves reading order and focus behavior.

### 2. Toolbar semantics validation

- Grouping:
  - leading controls, title, primary/secondary actions, overflow group.
- Labeling:
  - required accessible name for `role=toolbar` via `aria-label`.
- Overflow strategy:
  - overflow menu contains secondary actions while preserving source IDs/event payload.

### 3. Keyboard/focus behavior

- Tab order follows DOM order; no roving tabindex unless explicit APG need.
- Shortcut hints:
  - visual hints in menus are descriptive only unless actual key handlers exist.

### 4. Enterprise scenarios

- Bulk selection actions:
  - action-ribbon selection count + save/discard/validate actions.
- Pending changes notices:
  - warning tone + dismiss policy.
- Validation failures:
  - error tone in alert/snackbar with action to recover.
- Contextual workflow actions:
  - toolbar + context menu + dialog confirmation chain.

### 5. Tests

- Scenario smoke tests:
  - integrated flow in showcase route.
- Visual state matrices:
  - action-ribbon + toolbar dense/tone combos.
- A11y grouping checks:
  - toolbar labels and action names.

## I. Visual Consistency Hardening Strategy

### 1. Story matrix strategy

- Canonical stories:
  - one per component with recommended enterprise usage.
- State matrix stories:
  - interaction states + overlay states.
- Density matrix stories:
  - default vs dense (and comfortable if introduced later).
- Tone matrix stories:
  - neutral/info/success/warning/error for feedback surfaces.
- Environment matrix stories:
  - reduced motion, forced colors, enhancement on/off.

Sample naming:
- `Enterprise Hardening/Alert/State Matrix`
- `Enterprise Hardening/Snackbar/Queue + Live`
- `Enterprise Hardening/Overlay/Focus + Dismiss`
- `Enterprise Hardening/Surface/Density + Tone`

### 2. Visual regression baseline strategy

- Capture snapshots for:
  - canonical usage + one matrix per dimension (state, density, tone, environment).
- Prevent snapshot explosion:
  - one snapshot per matrix panel set, not per single cell.
  - split high-variance interactions into dedicated stories.

### 3. Token drift detection

- Enforce no raw color/spacing/radius for enterprise components.
- Require `--cv-comp-*` aliases feeding `--cv-sys-*` where applicable.

### 4. Density/shape consistency checks

- Compare padding/min-height/radius/typography across card, toolbar, alert, action-ribbon.
- Define tolerance table (e.g., dense multiplier) and assert via visual + style checks.

### 5. Status/tone consistency checks

- Tone mapping includes color, icon presence policy, emphasis level, action affordance style.
- Ensure error semantics align between alert/snackbar/action-ribbon.

### 6. Layering verification

- Focus ring > ripple/state layer.
- Overlay surfaces and snackbar z-order predictability.

### 7. Forced-colors + reduced-motion

- Prefer native behavior first; custom overrides only where native is insufficient.
- Pitfalls:
  - status colors collapsing in HC mode.
  - tooltip/snackbar animation-only visibility cues.

Snapshot grouping convention:
- `enterprise-hardening-feedback`
- `enterprise-hardening-overlay`
- `enterprise-hardening-workflow`
- `enterprise-hardening-environment`

## J. Support-Path Parity / Fallback Validation

### 1. Feature inventory (current scope)

- Overlay positioning mode selection (`popover-anchor` vs `absolute`) in advanced overlay positioning adapter.
- Overlay feature detection (`dialog`, `popover`, `anchorPositioning`, `inert`, `:open`) in shared support helper.

### 2. Detection strategy audit

- Checks are explicit, capability-based (`HTMLElement.prototype.showPopover`, `CSS.supports('anchor-name: ...')`, dialog API support).
- Failure handling currently falls back to absolute positioning and baseline overlay behavior.

### 3. Parity guarantees

- Must match:
  - keyboard access, role/state semantics, dismissal correctness, focus restoration.
- May differ:
  - placement precision, animation polish, collision handling quality.

### 4. Global/per-story/test toggles

- Add story args or global decorator to force `strategy='absolute'`.
- Add test helper to stub support detection and run both paths.

### 5. Regression matrix

- For tooltip/menu stories and tests, run:
  - enhancement path (auto/popover-anchor when supported),
  - forced fallback path (absolute).
- Snapshots grouped by mode to detect divergence.

### 6. Documentation/support notes

- Baseline guarantee:
  - core usability/a11y must be preserved without enhancements.
- Enhancement note:
  - refined placement and smoother motion are optional polish.

### Compact support matrix

| Feature | Why used | Detection | Fallback | Unsupported impact | Baseline a11y/usability preserved? |
|---|---|---|---|---|---|
| Popover API | richer overlay lifecycle hooks | `'showPopover' in HTMLElement.prototype` | absolute/manual open-close | less native polish | Yes, because controller + dismiss still handle semantics |
| CSS anchor positioning | better placement fidelity | `CSS.supports('anchor-name: --cv-anchor')` | absolute positioning + viewport clamp | lower placement quality | Yes, keyboard and dismiss unchanged |
| `<dialog>` API | modal semantics | `HTMLDialogElement.prototype.showModal` checks (inventory) | current code assumes support; document Chromium baseline | non-Chromium may need polyfill outside sprint | Yes in Chromium-first baseline |
| `inert` | background interaction blocking (future) | `'inert' in HTMLElement.prototype` | pointer/focus dismiss fallback | possible background focus leaks if relied upon | Yes, if not made mandatory in this phase |

## K. `components` vs `web-components` Boundary Hardening Check

Current workspace mapping: `packages/ui-system/primitives` == components runtime; `packages/ui-system/web-components` == web-components adapter.

| Target | Decision | Rationale |
|---|---|---|
| action-ribbon | stays in current package | orchestration moderate, no Shadow DOM requirement, maintainable in plain DOM.
| alert | stays in current package | simple semantics, no APG complexity beyond live region policy.
| dialog extensions | watchlist | overlay/focus complexity is high; still manageable now, but future nested/dialog composition may pressure adapter abstraction.
| context menu extensions | watchlist | keyboard/APG complexity moderate-high; monitor growth for submenus/virtualization.
| toolbar | stays in current package | plain DOM semantics sufficient; low overlay complexity except overflow menu dependency.
| snackbar | stays in current package | queue orchestration moderate but straightforward; no Shadow DOM requirement.
| tooltip extensions | stays in current package | small scope, informational only; shared overlay controller already centralizes complexity.
| card | stays in current package | low complexity surface component.

Future pressure points:
- If menu introduces nested submenus/typeahead focus grids, consider stronger headless controller extraction.
- If dialog gains complex forms/wizard stacking, evaluate moving more logic to headless/shared overlay layer before any adapter migration.

## L. Testing + Compliance Hardening Plan

### Tactical test plan

- Unit tests:
  - shared helpers: live region, dismiss reasons, overlay restoration fallback.
  - component edge cases: repeated messages, disabled actions, trigger removal during open.
- Interaction tests:
  - keyboard/pointer/touch parity for all actionable surfaces.
  - right-click + ContextMenu key parity for context menu.
- A11y automation:
  - Storybook addon-a11y with `a11y.test='error'` for hardening stories.
- Manual SR verification:
  - alert/snackbar announcement priority and repeat behavior.
  - dialog/context menu title/role/focus behavior.
- Visual regression:
  - state, density, tone, environment matrices.
- E2E smoke flows:
  - integrated enterprise route with alert/snackbar/context menu/dialog/action-ribbon/toolbar/card.
- Timer deterministic tests:
  - snackbar queue, tooltip open/close delays using fake timers.
- Feature-gated path tests:
  - enhancement forced on/off for positioning path.
- Performance sanity:
  - enqueue bursts in snackbar.
  - many cards/toolbars render checks.
  - action-ribbon rapid state updates.

### CI gate proposal

- Must-pass to mark hardened:
  - lint, typecheck, unit tests, enterprise interaction tests, Storybook build, enterprise E2E smoke, critical visual snapshot groups.
- Warn-only initially (first sprint iteration):
  - full matrix visual diffs outside critical groups.
  - extended performance thresholds.
  - manual SR logs (required before release, not PR-blocking initially).
- Flake strategy:
  - deterministic timers + explicit waits.
  - quarantine flaky test with issue + expiry date.
  - retry only for known infra flakes, not semantic failures.

### Compliance checklist

- Native semantics preserved where applicable.
- APG alignment for menu/dialog extensions.
- WCAG 2.2 practical checks (focus visible, keyboard operable, name/role/value).
- Reduced motion honored.
- Forced colors basics pass.
- Live region correctness for alert/snackbar.
- Overlay focus restore + dismiss correctness.
- Disabled-state integrity (no activation).
- Accessible baseline preserved regardless of enhancement support.

## M. Security Hardening Checklist (reusable)

- XSS boundaries:
  - dynamic `message`, `title`, `label`, shortcuts rendered via `textContent` unless trusted sanitized HTML policy exists.
- No unsafe HTML injection patterns:
  - no `innerHTML` for user-provided strings.
- Dynamic action/content safety:
  - alert/snackbar/action-ribbon actions validated and normalized before render.
- Overlay content safety:
  - dialog/menu/tooltip textual content defaults; custom HTMLElement inputs treated as trusted caller boundary.
- Event handling safety:
  - dismiss/activation handlers must check disabled and open/topmost state.
- Focus restoration safety:
  - restore only to connected, visible, enabled targets.
- Disabled/read-only bypass prevention:
  - no action dispatch from disabled UI elements.
- CSP compatibility:
  - no inline scripts/eval; class/data-state based styling only.
- DOM mutation safety in enhancement paths:
  - cleanup listeners/aria links on destroy; no stale references.
- Trusted/untrusted boundaries:
  - document that HTMLElement slot inputs are trusted by host app.
- Security-sensitive tests:
  - verify escaped rendering for message/action labels.
  - verify disabled item click/key events do not fire callbacks.

## N. Milestones and Measurable Checkpoints

### 1-week plan (aggressive)

- Targets:
  - contract normalization doc + live region fixes + overlay dismiss/focus high-risk fixes.
- Artifacts:
  - hardening stories for alert/snackbar and overlay focus/dismiss.
- Gates:
  - unit + interaction + enterprise E2E smoke + critical snapshots.
- Deferred:
  - broader visual polish and non-critical density tuning.
- Release-readiness signal:
  - "Functional/A11y critical path green" memo.

### 2-week plan (recommended)

- Targets:
  - complete A-O matrix coverage across all 8 components, including density/tone/environment parity.
- Artifacts:
  - full story matrices + enterprise showcase route + CI gate doc + report template.
- Gates:
  - all must-pass gates + manual SR checklist completed.
- Deferred:
  - optional API aliasing/deprecation helpers.
- Release-readiness signal:
  - signed release-readiness report with known-risk register.

### 3-week plan (expanded scope contingency)

- Targets:
  - deeper queue semantics, larger context-menu behavior expansion, action-ribbon workflow edge cases.
- Artifacts:
  - extended scenario packs and performance profiling outputs.
- Gates:
  - stricter visual/performance thresholds turned from warn to fail.
- Deferred:
  - architectural migrations outside hardening.
- Release-readiness signal:
  - "hardened + scale confidence" with trend metrics.

## O. Hardening Starter Scaffolds (compact templates)

### 1) Contract audit checklist template

```md
# Contract Audit - <component>
- API options reviewed: [ ]
- Event names/detail schema reviewed: [ ]
- data-state hooks reviewed: [ ]
- aria linkage reviewed: [ ]
- tone/density terminology reviewed: [ ]
- token alias usage reviewed: [ ]
Findings:
- Severity: <high|med|low>
- Issue:
- Safe fix now:
- Breaking? <yes/no>
```

### 2) State matrix story template

```ts
export const StateMatrix = {
  render: () => {
    const root = document.createElement('div');
    root.dataset.matrix = 'state';
    // cells: default, hover, focus-visible, active, disabled, open/closed
    return root;
  }
};
```

### 3) Density + tone matrix story template

```ts
export const DensityToneMatrix = {
  render: () => {
    const root = document.createElement('div');
    // rows: tone, cols: density (default/dense)
    return root;
  }
};
```

### 4) Environment matrix story template

```ts
export const EnvironmentMatrix = {
  parameters: { chromatic: { modes: ['default', 'reduced-motion', 'forced-colors', 'enhancement-off'] } },
  render: () => document.createElement('div')
};
```

### 5) Interaction test template

```ts
it('keeps keyboard/pointer/right-click parity', async () => {
  // arrange
  // pointer path assertion
  // keyboard path assertion
  // context-key/right-click assertion
});
```

### 6) Live region manual verification checklist template

```md
# Live Region Manual Check
- SR/browser:
- Scenario: polite status update
- Expected spoken output:
- Scenario: assertive error
- Expected spoken output:
- Repeat message behavior validated: [ ]
- Double announcement detected: [ ] no
```

### 7) Overlay focus/dismiss manual checklist template

```md
# Overlay Focus/Dismiss Check
- Trigger focused before open: [ ]
- Initial focus after open correct: [ ]
- Escape closes and restores focus: [ ]
- Outside click closes when allowed: [ ]
- Trigger removed fallback focus works: [ ]
```

### 8) Support-path parity test template

```ts
describe.each(['enhanced', 'fallback'])('%s path', (mode) => {
  it('preserves baseline semantics and keyboard usability', () => {
    // stub support mode
    // assert same role/aria and dismiss behavior
  });
});
```

### 9) Visual regression snapshot grouping template

```md
Groups:
1. enterprise-hardening-feedback
2. enterprise-hardening-overlay
3. enterprise-hardening-workflow
4. enterprise-hardening-environment
Rule: one snapshot per matrix panel, not per cell.
```

### 10) Deprecation/migration note template

```md
# Deprecation Note
- API/event/data-hook:
- Current status: stable/deprecated
- Replacement:
- First warned in version:
- Removal target (if any):
- Migration steps:
- Breaking impact:
```

### 11) Release-readiness report template

```md
# Enterprise Hardening Release Readiness
Date:
Scope:

## Gate status
- Lint/typecheck/unit:
- Interaction/a11y:
- Visual baseline:
- E2E enterprise smoke:

## High-risk checks
- Live region correctness:
- Overlay focus restore/dismiss:
- Support-path parity:

## Known issues and waivers
- Issue:
- Severity:
- Owner:
- ETA:

## Signoff
- Engineering:
- Accessibility:
- QA:
- Product:
```

## Execution trade-offs and risk posture

- Prioritize semantic correctness over visual polish.
- Keep APIs stable; prefer additive options and documentation normalization.
- Accept temporary warn-only gates for non-critical visual/perf metrics while critical a11y/focus/live-region gates are strict.
