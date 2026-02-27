Assumptions:
1. Target runtime baseline is evergreen Chromium, with a practical minimum of Chromium 135 for full visual parity; lower Chromium versions still get behavior parity.
2. Primitives are plain HTML/CSS/TS modules (no framework runtime in `core`/`components`).
3. Current package namespace stays `@covalent-poc/*`.

## A. Executive architecture summary
Use a 5-layer architecture, with strict dependency direction:

1. `packages/tokens`
- Source of truth for M3-aligned reference/system/component tokens.
- Emits CSS variables only (`--cv-ref-*`, `--cv-sys-*`, `--cv-comp-*`).

2. `packages/core`
- Framework-agnostic behavior controllers and infra.
- Owns keyboard contracts, focus management, roving tabindex, overlay state, ripple logic, feature detection.
- No visual CSS and no framework APIs.

3. `packages/styles`
- Visual skin only.
- Uses tokens + state attributes + pseudo-classes.
- Progressive enhancement via `@supports`/feature classes.

4. `packages/components`
- Semantic DOM factories/binders over native elements (`button`, `input`, `select`, `dialog`).
- Wires element events to `core` controllers.
- No composite orchestration.

5. `packages/web-components`
- Lit wrappers for components when framework ergonomics are needed.
- Must compose `packages/components` contracts without redefining behavior logic.

Why this is viable long-term:
- Native semantics reduce JS footprint and ARIA fragility.
- Browser platform takes more responsibility over time (`dialog`, `popover`, customizable select path), so rewrites decrease.
- Clear boundaries let you swap visual systems (M3 updates) without touching behavior logic.

Where Lit fits:
- `packages/web-components` wraps primitives/composites as ergonomic custom elements.
- Lit layer should not redefine keyboard logic or ARIA contracts; it composes existing contracts and exposes same API/events.

## B. Phased implementation roadmap (core -> complex)
Note: Section D defines the feature gates that phases must use.

### Phase 0 — Foundations
1. Goal  
Establish token system, feature gating, shared infra, and contracts that all components consume.

2. Components included  
`elevation`, `focus-ring`, `icon`, `ripple` infrastructure, shared a11y/keyboard/focus utilities.

3. Why in this phase  
Everything else depends on state conventions, token aliases, and capability detection.

4. Shared infrastructure introduced  
`detectFeatures()`, `press` utilities, focus-visible policy, roving tabindex helper, safe icon rendering contract, state attribute contract.

5. Step-by-step implementation tasks  
1. Freeze token naming and alias map (M3 container/on-container/state-layer/elevation/motion/shape/density).  
2. Add capability registry in `core/feature-detect.ts`.  
3. Add state attribute conventions (`data-state`, `data-disabled`, `data-invalid`, `data-selected`).  
4. Implement focus-ring utility class and forced-colors style path.  
5. Implement elevation utility tokens + utility classes.  
6. Implement ripple engine (pointerdown/keydown driven, reduced-motion aware).  
7. Implement icon contract (trusted SVG map or sanitized URL strategy).  
8. Add infra tests for keyboard/focus/ripple feature gates.  
9. Publish docs for trusted vs untrusted inputs.  
10. Wire Storybook foundation stories.

6. Accessibility requirements (exact)  
- Focus indicator must be visible for keyboard users and >= 3:1 contrast against adjacent colors.  
- No focus suppression except with `:focus:not(:focus-visible)` patterns.  
- `prefers-reduced-motion: reduce` disables ripple animation and non-essential transitions.  
- Forced colors mode retains focus and control boundaries.  
- Icon-only affordances require accessible names in consuming components.

7. Security requirements (exact)  
- No `innerHTML` with untrusted content.  
- Icon rendering accepts only trusted token IDs or sanitized SVG strings.  
- No inline JS handlers.  
- No selector construction from untrusted input.  
- Strict CSP compatibility (`script-src` without `unsafe-inline`).

8. Testing strategy  
- Unit: feature detection branches, ripple lifecycle, focus manager.  
- Interaction: pointer/keyboard parity for press+ripple.  
- A11y: foundational axe checks for focus visibility and naming.  
- Visual regression: token/elevation/focus snapshots.  
- Perf: ripple stress (rapid presses).

9. Acceptance criteria  
- 100% infra unit tests pass.  
- Feature gate helper returns deterministic matrix in CI.  
- Focus ring and reduced-motion behavior validated in Storybook interaction tests.  
- Security checklist passes for icon and DOM mutation paths.

10. Common pitfalls  
- Mixing visual and behavior state in one package.  
- Over-custom icon pipeline with unsafe sanitization assumptions.  
- Missing reduced-motion branch in ripple.

11. Fallback/progressive enhancement  
- If advanced CSS unsupported, keep functional baseline with tokens and simple styles.  
- Ripple becomes no-op visual in reduced support modes.  
- `@scope`/`corner-shape`/`if()` enhancements loaded only in gated stylesheets.

Code scaffold:
```ts
export type FeatureFlags = {
  popover: boolean;
  anchorPositioning: boolean;
  baseSelect: boolean;
  pickerPseudo: boolean;
  cssScope: boolean;
  cssIf: boolean;
  cornerShape: boolean;
  siblingFns: boolean;
  stretch: boolean;
};

export const detectFeatures = (): FeatureFlags => ({ /* CSS.supports + API checks */ });
```

### Phase 1 — Basic form/action primitives
1. Goal  
Ship stable, accessible base controls with native semantics.

2. Components included  
`button`, `icon-button`, `checkbox`, `radio`, `switch`, `divider`, `progress`.

3. Why in this phase  
Low composite complexity; validates core contracts and state styling model.

4. Shared infrastructure introduced  
Press/toggle controller pattern, common disabled contract, form sync helpers.

5. Step-by-step tasks  
1. Implement semantic DOM binders for each primitive.  
2. Reuse shared press/toggle controller where possible.  
3. Apply component alias tokens in `styles/components/*.css`.  
4. Add state layer + ripple hooks to actionable controls.  
5. Implement `switch` using checkbox semantics (`role="switch"` only when needed).  
6. Add `progress` determinate/indeterminate styles.  
7. Add interaction stories with keyboard matrices.  
8. Add unit + interaction + axe tests.

6. Accessibility requirements (exact)  
- Buttons keyboard activatable with Enter/Space (native).  
- Checkbox/radio/switch keep native input for SR + forms.  
- `divider` decorative by default (`aria-hidden="true"`), labeled only when semantic separation is required.  
- `progress` exposes value/min/max or indeterminate semantics.  
- Disabled controls use native `disabled` where possible.

7. Security requirements (exact)  
- Labels/text via `textContent` only.  
- No dynamic style injection from user input.  
- Prevent custom event detail from carrying untrusted HTML payloads.

8. Testing strategy  
- Unit: controller state transitions.  
- Interaction: pointer + keyboard activation parity.  
- A11y: axe + manual SR smoke (NVDA/JAWS + VoiceOver Chromium equivalent).  
- Visual regression: hover/focus/pressed/disabled/error states.

9. Acceptance criteria  
- All controls pass APG/native keyboard expectations.  
- Form submission includes correct values for checkbox/radio/switch.  
- Zero critical axe violations in stories.

10. Common pitfalls  
- Replacing native input with div+ARIA for switch/radio visuals.  
- Missing label for icon-button.  
- Inconsistent disabled behavior between pointer and keyboard.

11. Fallback/progressive enhancement  
- Base controls require no advanced APIs.  
- Ripple/state-layer animations degrade gracefully.

### Phase 2 — Input surfaces and field composition
1. Goal  
Deliver high-value inputs with robust validation and optional enhanced select rendering.

2. Components included  
`text-field`, `chip`, `slider`, `select`, `list` (moved earlier to support menu/select option patterns).

3. Why in this phase  
These components need richer state composition and option semantics used later by menu.

4. Shared infrastructure introduced  
Field controller v2 (value/touched/error/assistive text), option collection utilities, list navigation helpers.

5. Step-by-step tasks  
1. Extend field controller for described-by/error association IDs.  
2. Implement text-field variants (filled/outlined) with supporting/error text slots.  
3. Implement slider using native `input[type=range]` and optional tick marks.  
4. Implement chip variants with native controls (`button` or `input+label`) per type.  
5. Implement list primitive contracts (`ul/li`, optional interactive modes).  
6. Implement select baseline as native `<select>`.  
7. Add PE path for customizable select (`appearance: base-select`, `::picker(select)`, `::picker-icon`, `::checkmark`, `<selectedcontent>`, `:open`) behind gates.  
8. Keep behavior parity identical between enhanced and baseline select.  
9. Add form integration and validation tests.

6. Accessibility requirements (exact)  
- Text-field requires programmatic label and `aria-describedby` for helper/error.  
- Slider must expose name and current value; keyboard increments/decrements.  
- Select remains native first for SR reliability.  
- Chip controls preserve semantic role per variant.  
- List interactive variants define clear role/keyboard model (`listbox`, `navigation`, etc.) only when needed.

7. Security requirements (exact)  
- Option labels via text nodes only.  
- No untrusted HTML in field supporting text unless sanitized externally.  
- Defensive handling of value coercion and ID generation.

8. Testing strategy  
- Unit: validation transitions, option selection logic.  
- Interaction: type/input/blur; range keys; select open/choose flows.  
- A11y: form naming/error association tests + SR walkthrough script.  
- Visual regression: invalid/focused/open/select-enhanced states.  
- Perf: large option list baseline render and open latency.

9. Acceptance criteria  
- Select works fully without enhancement APIs.  
- Enhanced select path activates only when feature gates pass.  
- Field error states announced by SR and visible in UI.  
- Chips meet keyboard + toggle contracts.

10. Common pitfalls  
- Diverging select behavior between native and enhanced paths.  
- Misusing `role="listbox"` on plain lists.  
- Slider value text not surfaced for SR context.

11. Fallback/progressive enhancement  
- Native `<select>` is canonical fallback.  
- If customizable select unsupported, keep browser picker with tokenized outer styling only.  
- Advanced picker pseudo styling is optional polish only.

Code scaffold:
```ts
export function enhanceSelect(el: HTMLSelectElement, f: FeatureFlags) {
  if (!(f.baseSelect && f.pickerPseudo)) return; // keep native behavior
  el.dataset.enhanced = "true";
}
```

### Phase 3 — Structured navigation and action surfaces
1. Goal  
Ship navigation/action primitives that depend on stable focus and list contracts.

2. Components included  
`tabs`, `fab`.

3. Why in this phase  
Tabs need roving tabindex and panel coordination; FAB needs strong state/elevation/motion semantics.

4. Shared infrastructure introduced  
Composite roving controller, orientation-aware keymap, panel activation manager.

5. Step-by-step tasks  
1. Implement tabs with native `button` tab triggers + panel association (`aria-controls`, `aria-labelledby`).  
2. Implement manual/automatic activation modes.  
3. Implement FAB single and extended variants.  
4. Reuse ripple/state-layer/elevation tokens.  
5. Add motion choreography with reduced-motion fallback.  
6. Add docs for touch target minimums.

6. Accessibility requirements (exact)  
- Tabs follow APG tablist pattern keyboard contract.  
- Selected tab has `aria-selected="true"` and one tabbable tab at a time.  
- Panels are reachable and properly labeled.  
- FAB requires accessible name and 44x44 minimum hit area.

7. Security requirements (exact)  
- Tab/panel ID mapping not derived from unsafe user strings without escaping.  
- No HTML injection in tab labels.

8. Testing strategy  
- Unit: roving focus and activation modes.  
- Interaction: Arrow/Home/End and Enter/Space behavior.  
- A11y: SR reading order and selected state announcements.  
- Visual regression: indicator movement and elevation states.

9. Acceptance criteria  
- Tabs APG matrix fully passing.  
- FAB pointer/keyboard parity validated.  
- No a11y regressions in Storybook suite.

10. Common pitfalls  
- Multiple tabbable tabs.  
- Hiding panels with `display:none` without managing accessibility state.  
- FAB lacking label when icon-only.

11. Fallback/progressive enhancement  
- Tabs do not depend on experimental CSS.  
- Any advanced shape/motion enhancements are optional.

### Phase 4 — Overlays and composites
1. Goal  
Ship top-layer overlays with native platform APIs first and safe fallbacks.

2. Components included  
`dialog`, `menu`, tooltip pattern adjunct for menu/fab/icon-button interactions.

3. Why in this phase  
Highest interaction risk: focus trapping, dismissal, layering, anchor behavior, escape routes.

4. Shared infrastructure introduced  
Overlay controller, top-layer stack policy, dismissal reason enum, anchor positioning helper.

5. Step-by-step tasks  
1. Implement `dialog` over native `<dialog>` (`showModal`, `close`, `cancel`).  
2. Add open/close reason events and return-focus policy.  
3. Implement menu with `popover` + anchor positioning when available.  
4. Fallback menu path uses positioned container + outside-click/Escape handling.  
5. Implement menuitem focus loop/typeahead and disabled item behavior.  
6. Add tooltip pattern for concise labels (non-interactive content).  
7. Add overlay integration tests for nested overlays and dismissal.

6. Accessibility requirements (exact)  
- Dialog has accessible name and initial focus target.  
- Escape closes dialog/menu unless explicitly blocked for critical workflows.  
- Focus returns to invoker on close.  
- Menu follows APG menu button pattern (`aria-haspopup`, `aria-expanded`, focus on open).  
- Tooltip not used for essential content and remains keyboard discoverable.

7. Security requirements (exact)  
- Prevent focus trap dead-ends; always provide close route.  
- Guard against click-through/overlay misuse by backing scrim + pointer handling.  
- No untrusted HTML injection inside overlay content by default API.

8. Testing strategy  
- Unit: overlay state machine transitions.  
- Interaction: open/close by pointer, keyboard, programmatic paths.  
- A11y: dialog/menu SR checks and focus return checks.  
- E2E: nested overlay flows.  
- Perf: open latency and reflow budget under repeated open/close.

9. Acceptance criteria  
- Dialog/menu pass APG contracts and automated a11y.  
- Overlay stack handles nested and rapid open/close safely.  
- Fallback path matches behavior parity without popover/anchor APIs.

10. Common pitfalls  
- Custom focus trap fighting native `<dialog>`.  
- Missing `aria-expanded` synchronization on menu button.  
- Positioning logic tightly coupled to one API path.

11. Fallback/progressive enhancement  
- If `popover` unavailable, use controlled positioned element + light-dismiss poly behavior.  
- If anchor positioning unavailable, use JS rect positioning.  
- Keep interaction semantics identical across paths.

## C. Proposed phase grouping (refined)
Recommended ordering:
1. Phase 0: foundations (`elevation`, `focus-ring`, `icon`, `ripple` infra, feature gates, shared utilities).
2. Phase 1: base controls (`button`, `icon-button`, `checkbox`, `radio`, `switch`, `divider`, `progress`).
3. Phase 2: field and option surfaces (`text-field`, `slider`, `select`, `chip`, `list`).
4. Phase 3: structured navigation/action (`tabs`, `fab`).
5. Phase 4: overlays/composites (`dialog`, `menu`, tooltip adjunct pattern).

Refinement from baseline:
- `list` moved into Phase 2 because it is a dependency for robust option/menu modeling and keyboard list navigation utilities.

## D. Support matrix and progressive enhancement plan
As of Friday, February 27, 2026 (Chromium-focused).

| Feature | Chromium status | Category | Detection | Fallback | Parity impact |
|---|---|---|---|---|---|
| `appearance: base-select` + customizable select model | Chromium 135+ | Nice-to-have enhancement | `CSS.supports('appearance: base-select')` | Native `<select>` default UI | Mostly visual parity |
| `::picker(select)` | Chromium 135+ | Nice-to-have enhancement | CSS `@supports selector(::picker(select))` | No picker pseudo styling | Visual parity only |
| `<selectedcontent>` | Chromium 135+ | Nice-to-have enhancement | `'HTMLSelectedContentElement' in window` (or createElement test) | Native selected text rendering | Visual polish |
| `::picker-icon` / `::checkmark` | Chromium 135+ | Nice-to-have enhancement | CSS selector support checks | Keep UA icon/checkmark | Visual polish |
| `:open` | Chromium 133+ | Nice-to-have enhancement | `CSS.supports('selector(:open)')` | Use `[open]`/state classes where possible | Visual + minor state styling |
| Popover API | Chromium 114+ | Must-have for primary overlay path | `'showPopover' in HTMLElement.prototype` | Controlled positioned overlay + dismissal handlers | Behavior parity (with fallback code) |
| CSS Anchor Positioning | Chromium 125+ | Nice-to-have enhancement | `CSS.supports('top: anchor(bottom)')` | JS `getBoundingClientRect` positioning | Mostly visual/positioning parity |
| `@scope` | Chromium 118+ | Nice-to-have enhancement | constructable stylesheet parse test | BEM-like scoped class prefixes | No behavior impact |
| CSS `if()` | Chromium 137+ | Experimental/gated | CSS `@supports` gate only | Precompute variants with vars/media queries | Visual polish only |
| `corner-shape` | Chromium 139+ | Experimental/gated | `CSS.supports('corner-shape: squircle')` | `border-radius` tokens | Visual polish only |
| `sibling-index()` / `sibling-count()` | Chromium 140+ | Experimental/gated | CSS `@supports` gate | JS data attributes or nth-child styling | Visual polish only |
| `stretch` sizing keyword | Chromium-supported | Nice-to-have enhancement | `CSS.supports('width: stretch')` | `width: 100%` / flex rules | Visual/layout polish |

Guidance:
1. Must-have features can be primary in Chromium target, but still keep behavior fallback for testability and resilience.
2. Nice-to-have features must never change interaction semantics; only rendering/positioning.
3. Experimental features stay behind explicit opt-in flag and visual parity fallback.

## E. Component spec template applied to every primitive

1. `button`  
Semantics: native `<button>`; API: `type`, `disabled`, `data-variant`, `data-size`; DOM: button + label/icon slots; States: hover/focus-visible/pressed/disabled/loading; Keyboard: Enter/Space native; SR: accessible name required; Form: optional submit/reset if `type`; Styling hooks: `data-variant`, `data-state`, `:disabled`; Security: text-only labels by default; Tests: press parity, disabled guard, loading state; M3 mapping: container/label/state-layer/elevation(0-1)/shape; Native-only notes: default `type="button"` unless form intent explicit; Lit extension: wrapper forwards props/events only.

2. `icon-button`  
Semantics: `<button>` icon-only or icon+label; API: `aria-label` required when icon-only, `toggle?`; DOM: button > icon slot > ripple layer; States: hover/focus/pressed/selected/disabled; Keyboard: Enter/Space; SR: label announced, pressed state via `aria-pressed` for toggle; Form: none unless inside form button intent; Styling hooks: `data-selected`, `data-variant`; Security: icon source restricted; Tests: label enforcement, toggle announcement; M3 mapping: circular/square shape, state layer, elevation; Native-only: no custom role; Lit: expose `selected` reactive prop.

3. `checkbox`  
Semantics: `<input type="checkbox">` + `<label>`; API: `checked`, `indeterminate`, `disabled`, `required`, `name`, `value`; DOM: input + visual box + label text; States: checked/indeterminate/focus/disabled/error; Keyboard: Space toggles; SR: checked/mixed announced; Form: native participation; Styling hooks: `:checked`, `:indeterminate`, `[data-invalid]`; Security: label text sanitized as text; Tests: form submit values, indeterminate behavior; M3 mapping: container/icon/state-layer; Native-only: keep input in DOM; Lit: wrap with form-associated passthrough.

4. `radio`  
Semantics: `<input type="radio">` group by `name`; API: `checked`, `disabled`, `name`, `value`; DOM: input + visual control + label; States: checked/focus/disabled/error; Keyboard: Arrow behavior native within group; SR: group/option announced; Form: native; Styling hooks: `:checked`, `:focus-visible`; Security: safe label injection; Tests: mutual exclusivity + keyboard group nav; M3 mapping: container/dot/state-layer; Native-only: no custom listbox pattern; Lit: group helpers only.

5. `switch`  
Semantics: checkbox-native (`<input type="checkbox">`) with switch visuals; API: checkbox API + optional `role="switch"` only if needed for AT parity; DOM: input + track + thumb + label; States: on/off/disabled/focus/pressed; Keyboard: Space toggles; SR: on/off announced; Form: native; Styling hooks: `:checked`, `data-state`; Security: no HTML label injection; Tests: toggle parity and form value; M3 mapping: track/thumb/state-layer; Native-only: avoid div role switch replacement; Lit: same underlying input forwarded.

6. `divider`  
Semantics: `<hr>` for thematic break or styled separator element; API: `orientation`, `inset`; DOM: single element; States: none; Keyboard: none; SR: usually hidden unless meaningful; Form: N/A; Styling hooks: `data-orientation`; Security: static content only; Tests: orientation rendering; M3 mapping: outline variant token; Native-only: prefer `<hr>`; Lit: thin wrapper only.

7. `progress`  
Semantics: `<progress>` determinate or indeterminate style wrapper; API: `value`, `max`, `variant`; DOM: progress + optional label text; States: indeterminate/determinate/disabled; Keyboard: none usually; SR: value announcement with label; Form: N/A; Styling hooks: `[value]`, `:indeterminate` (or class fallback); Security: label as text; Tests: value bounds and SR naming; M3 mapping: active track/inactive track/motion; Native-only: keep native element; Lit: property reflection only.

8. `chip`  
Semantics: assist/action chip uses `<button>`; filter chip uses checkbox+label; input chip uses list item + dismiss button; API: `variant`, `selected`, `disabled`, `removable`; DOM: container + leading icon/avatar + label + optional trailing action; States: selected/hover/focus/disabled/pressed; Keyboard: Enter/Space, Delete/Backspace for removable; SR: selected/removable announced; Form: filter chip participates via checkbox path; Styling hooks: `data-variant`, `data-selected`; Security: safe avatar/icon URLs and text labels; Tests: variant keyboard matrix and removal events; M3 mapping: container/label/leading/trailing/state-layer/elevation; Native-only: variant maps to native controls not custom role soup; Lit: ergonomic chip-group wrappers.

9. `text-field`  
Semantics: `<input>` or `<textarea>` with `<label>`; API: `value`, `type`, `required`, `disabled`, `readonly`, `error`, `supporting-text`; DOM: label + control + supporting/error region; States: focus/hover/disabled/error/read-only; Keyboard: native input behavior; SR: label + described-by + error text announced; Form: native validation + submission; Styling hooks: `[data-invalid]`, `[data-focused]`; Security: no HTML in helper/error unless trusted; Tests: labeling, validation, described-by linkage; M3 mapping: filled/outlined container, indicator, supporting text; Native-only: avoid custom contenteditable; Lit: form-associated custom element wrapper optional.

10. `select`  
Semantics: native `<select>` + `<option>`; API: `value`, `disabled`, `required`, `multiple?`, `name`; DOM: label + select + helper/error; States: focus/open/disabled/error/selected-option; Keyboard: native select keyboard; SR: native announcement; Form: native; Styling hooks: base `select` + gated `::picker(select)` path; Security: option labels text-only; Tests: baseline + enhanced path parity, form value, keyboard open/selection; M3 mapping: text field container + state layer + menu elevation; Native-only: baseline always authoritative; Lit: wrapper exposes same value/events, no custom listbox unless explicitly separate component.

11. `slider`  
Semantics: `<input type="range">`; API: `min`, `max`, `step`, `value`, `disabled`; DOM: range input + optional value label; States: hover/focus/active/disabled; Keyboard: Arrow/Page/Home/End native; SR: value and bounds announced; Form: native; Styling hooks: track/thumb pseudo-elements; Security: value text sanitized as text; Tests: keyboard increments and bounds; M3 mapping: active/inactive track, handle, value indicator; Native-only: keep range input; Lit: optional labeled slider wrapper.

12. `list`  
Semantics: default `<ul>/<ol>`; interactive variants only opt into `role=listbox/menu` patterns; API: item registration, selection mode (`none|single|multiple`), orientation; DOM: list root + list item children; States: focus/active/selected/disabled item; Keyboard: Arrow/Home/End/typeahead for interactive modes; SR: role semantics only when interactive; Form: N/A unless paired with hidden input; Styling hooks: `data-active`, `data-selected`; Security: item content safety policy (text by default); Tests: roving tabindex + typeahead; M3 mapping: list item container/headline/supporting/meta; Native-only: keep simple list path zero-JS; Lit: virtualized adapters later.

13. `tabs`  
Semantics: tab buttons + tab panels (`role=tablist/tab/tabpanels`); API: `selectedIndex`, `activationMode`, `orientation`; DOM: tablist > tab buttons + panel region; States: selected/focus/disabled; Keyboard: APG tab keys; SR: selected and panel association; Form: N/A; Styling hooks: `data-selected`, indicator slot; Security: tab label text safe; Tests: full APG keyboard matrix; M3 mapping: active indicator/state layer/container; Native-only: use `<button>` not div tabs; Lit: convenience slot API while preserving IDs/ARIA.

14. `fab`  
Semantics: prominent `<button>`; API: `size`, `variant`, `extended`, `disabled`; DOM: button + icon + optional label; States: hover/focus/pressed/disabled/lowered; Keyboard: Enter/Space; SR: accessible name required; Form: usually none; Styling hooks: `data-extended`, `data-size`; Security: icon/label safety; Tests: motion/elevation states and naming; M3 mapping: container/elevation/state-layer/shape; Native-only: no custom role; Lit: wrapper for icon+label ergonomics.

15. `dialog`  
Semantics: native `<dialog>`; API: `open`, `modal`, `returnValue`, `initialFocus`, `closeOnEsc`; DOM: dialog root + title/content/actions slots; States: open/closed/closing; Keyboard: Escape and Tab cycling per modal policy; SR: name/description, modal context; Form: `method="dialog"` support; Styling hooks: `:open`, `[open]`, `::backdrop`; Security: safe content insertion and explicit close controls; Tests: focus trap/return focus/escape/dismiss reasons; M3 mapping: container/elevation/scrim/shape; Native-only: prefer `showModal`; Lit: wrapper mirrors native methods/events.

16. `menu`  
Semantics: menu button (`button`) + popup (`popover` preferred) + `role=menu` items; API: `open`, `anchor`, `placement`, `typeahead`; DOM: trigger + menu surface + menu items; States: open/closed/active-item/disabled-item; Keyboard: APG menu button pattern; SR: expanded state and item roles announced; Form: N/A; Styling hooks: `[popover]`, `data-open`, `data-active`; Security: item label safety and focus-escape guarantee; Tests: open/close, arrow nav, typeahead, click-outside; M3 mapping: menu container/elevation/state-layer; Native-only: popover first, JS-position fallback; Lit: wrappers for composition only.

17. `icon`  
Semantics: decorative icon `aria-hidden=true`; informative icon uses `role=img` + label; API: `name`, `size`, `aria-label?`; DOM: inline element or safe SVG fragment; States: none; Keyboard: none; SR: hidden unless labeled; Form: N/A; Styling hooks: `data-icon`, size vars; Security: whitelist icon registry or sanitize SVG; Tests: decorative vs informative announcement; M3 mapping: symbol color/size roles; Native-only: no remote arbitrary SVG injection; Lit: registry-based rendering adapter.

18. `focus-ring`  
Semantics: styling utility primitive; API: tokenized ring width/color/offset; DOM: class/attribute on focusable hosts; States: keyboard focus visible; Keyboard: N/A; SR: N/A; Form: N/A; Styling hooks: `.cv-focus-ring`, `:focus-visible`; Security: style-only; Tests: forced-colors and contrast checks; M3 mapping: focus state layer; Native-only: CSS-first; Lit: applies same class in wrappers.

19. `elevation`  
Semantics: styling utility primitive; API: level tokens (`0..5` + overlays); DOM: class/data attr; States: resting/hovered/dragged; Keyboard: N/A; SR: N/A; Form: N/A; Styling hooks: `data-elevation`; Security: style-only; Tests: token snapshot and contrast impact checks; M3 mapping: shadow + surface tint; Native-only: no JS needed; Lit: pass-through.

20. `ripple`  
Semantics: behavior enhancer only; API: `attachRipple(el, options)`; DOM: injected inert ripple container child; States: pressed/released; Keyboard: trigger on key activation same as pointer; SR: no announcement; Form: N/A; Styling hooks: `data-ripple`, CSS vars for duration/opacity; Security: no HTML injection, only element creation; Tests: lifecycle cleanup, reduced-motion bypass, pointer cancellation; M3 mapping: state layer interaction feedback; Native-only: optional enhancement only; Lit: directive wrapper around same utility.

## F. Repository/package scaffolding
Proposed monorepo layout (aligned with your current repo):
```text
packages/
  tokens/
    src/{reference.tokens.json,semantic.tokens.json,component.tokens.json,tokens.css,index.ts}
  core/                     # rename from core when convenient
    src/
      controllers/
      infra/{keyboard.ts,focus.ts,roving.ts,overlay.ts,feature-detect.ts,press.ts,ripple.ts}
      a11y/{ids.ts,labelling.ts,aria-contracts.ts}
      security/{trusted-types.ts,sanitize.ts}
  styles/
    src/
      index.css
      layers/{tokens.css,base.css,components.css,utilities.css}
      components/*.css
      enhancements/{select-pe.css,anchor-pe.css,experimental.css}
  primitives/
    src/{button.ts,checkbox.ts,...}
  composites/
    src/{menu.ts,dialog.ts,tabs.ts,...}
  testing/
    src/{axe.ts,keyboard-harness.ts,sr-checklist.md,visual-baselines.ts}
  web-components/
apps/
  storybook/
  showcase/
docs/
  architecture/
  a11y/
  security/
  components/
```

Naming conventions:
1. Packages: `@covalent-poc/<pkg>`.
2. Files: kebab-case for components (`icon-button.ts`), camelCase only for local helpers where needed.
3. Events: prefer native (`input`, `change`, `click`); custom events use `cv-*` (`cv-open-change`, `cv-value-change`).
4. Data attributes: `data-state="open|closed"`, boolean flags as `data-disabled="true"`.
5. CSS vars:
- Reference: `--cv-ref-*`
- System: `--cv-sys-*`
- Component: `--cv-comp-<component>-*`
- Runtime aliases: `--cv-local-*`
6. Dependency rules:
- `tokens` has no internal deps.
- `core` depends only on TS stdlib.
- `styles` depends on `tokens` output contract only.
- `components` depends on `core` + token/style contracts.
- `web-components` depends on `components`, never the reverse.

## G. Testing and compliance strategy
Phase-by-phase testing:
1. Phase 0  
Unit: feature detection/ripple/focus infra; Interaction: press+ripple parity; A11y: foundational focus checks; Visual: token snapshots; Perf: ripple burst benchmark.

2. Phase 1  
Unit: controllers per control; Interaction: keyboard/pointer parity; A11y: axe + manual control naming; Visual: control state matrix; E2E: form submit smoke.

3. Phase 2  
Unit: field/select/list logic; Interaction: validation/select/slider/chip flows; A11y: error association + select behavior; Visual: open/error/disabled; Perf: select/list with large datasets.

4. Phase 3  
Unit: tab roving + activation; Interaction: APG key matrix; A11y: panel associations; Visual: tab indicator/FAB states; E2E: tab navigation journey.

5. Phase 4  
Unit: overlay state machine; Interaction: dialog/menu open-close + nested overlays; A11y: focus return, escape, announcements; Visual: layering/backdrop; E2E: critical overlay flows; Perf: repeated overlay open-close.

Compliance checklist:
1. WAI-ARIA/APG
- Menu button APG contract.
- Tabs APG contract.
- Dialog APG contract.
- Native semantics preferred before ARIA role overrides.

2. WCAG 2.2 practical checks
- 1.3.1 Info and Relationships.
- 1.4.3 Contrast (minimum).
- 1.4.11 Non-text contrast.
- 2.1.1 Keyboard.
- 2.4.7 Focus Visible.
- 2.5.8 Target Size (minimum) for touch-friendly controls.
- 3.3.x error identification/association for form inputs.

3. Reduced motion / forced colors
- `prefers-reduced-motion` disables decorative motion.
- `forced-colors: active` ensures visible boundaries and focus.

4. Cross-browser sanity (non-primary)
- Smoke test on latest Firefox/Safari for graceful fallback behavior.
- No Chromium-only API should break baseline semantics.

## H. Security checklist (reusable)
1. XSS boundaries  
Accept text or trusted node inputs only; sanitize/escape any external content before insertion.

2. Icon rendering safety  
Use trusted icon registry IDs; block arbitrary SVG/URL injection unless sanitized.

3. Dynamic content/slot safety  
Document trusted vs untrusted slot boundaries; never trust slotted HTML for scriptable behaviors.

4. URL handling  
If components accept URLs (icons/images), validate protocol allowlist (`https:`, optionally `data:` with strict MIME checks).

5. Event spoofing considerations  
Do not treat custom events as trusted user intent unless `isTrusted` checks or explicit policy.

6. Focus trap escape guarantees  
Dialog/menu must always expose Escape/Close path and return focus to invoker.

7. Clickjacking/overlay misuse  
Prevent click-through behind modal scrims; ensure z/top-layer policy and inert background where appropriate.

8. CSP compatibility  
No inline scripts or handlers; avoid style injection that requires `unsafe-inline`; support nonce/hash where needed.

9. DOM clobbering/selector injection  
Avoid selecting by untrusted IDs/selectors; use generated internal IDs and direct refs.

10. Supply-chain and build safety  
Keep sanitizer and parsing libs minimal; lock versions; run dependency auditing in CI.

## I. Implementation output style and execution strategy
Code scaffolding strategy (minimal rewrite path):
1. Build reusable infra first, then bind components.
2. Keep controllers small and explicit; compose via utilities.
3. Keep enhancement code paths additive, never replacing native behavior.

Core abstractions to create first:
```ts
type InputSource = "keyboard" | "pointer" | "programmatic";
type Unsubscribe = () => void;

interface Controller<S> {
  getState(): S;
  destroy?(): void;
}
```

```ts
export function bindPress(el: HTMLButtonElement, onPress: (src: InputSource, ev: Event) => void): Unsubscribe {
  // pointer + keyboard parity, disabled guard, no inline handlers
  return () => {};
}
```

```ts
export function createRovingController(items: HTMLElement[]) {
  // one tabbable item, arrow/home/end/typeahead support
}
```

Trade-off rules:
1. Prefer native feature when it guarantees semantics and reduces JS.
2. Use JS fallback only for behavior parity when native API is missing.
3. Keep experimental CSS (`corner-shape`, `sibling-*`, `if()`) cosmetic only.

### Risk register (top 10)
1. Select enhancement drift from native behavior. Mitigation: native path as source-of-truth + parity tests.  
2. Overlay focus bugs in nested cases. Mitigation: overlay state machine + E2E nested tests.  
3. ARIA overuse replacing native semantics. Mitigation: semantic-first lint/docs gate.  
4. Ripple perf regressions on low-end devices. Mitigation: reduced-motion + capped animations + perf budget.  
5. Token sprawl and naming inconsistency. Mitigation: token schema + CI validation.  
6. Experimental CSS causing visual regressions. Mitigation: explicit feature gates + fallback snapshots.  
7. Icon injection/XSS risk. Mitigation: trusted icon registry + sanitization policy.  
8. Inconsistent keyboard behavior across composites. Mitigation: shared keymap utilities + APG test harness.  
9. CSP incompatibility introduced by convenience APIs. Mitigation: CSP test fixture in CI.  
10. Lit wrappers diverging from primitive contracts. Mitigation: adapter contract tests against primitive fixtures.

### Milestone checklist
1. M0 Foundation freeze: tokens, feature matrix, infra contracts approved.  
2. M1 Base controls complete: Phase 1 components passing unit/interaction/axe suites.  
3. M2 Field/input complete: text-field/select/slider/chip/list with fallback parity validated.  
4. M3 Navigation complete: tabs/fab APG + visual tests green.  
5. M4 Overlay complete: dialog/menu/tooltip flows and focus guarantees green.  
6. M5 Security + compliance gate: checklist signed, CSP and a11y audits passed.  
7. M6 Adapter readiness: Lit wrappers pass contract parity tests.  
8. M7 Release candidate: docs, migration notes, and showcase complete.

Sources used for feature support matrix:
- https://caniuse.com/css-anchor-positioning
- https://caniuse.com/css-if
- https://caniuse.com/css-cascade-scope
- https://caniuse.com/mdn-css_properties_corner-shape
- https://caniuse.com/mdn-css_values_sibling-count
- https://caniuse.com/mdn-css_values_sibling-index
- https://caniuse.com/mdn-css_properties_width_stretch
- https://caniuse.com/mdn-api_htmlselectelement_selectedcontent
- https://caniuse.com/mdn-css_selectors_picker_select
- https://caniuse.com/mdn-css_selectors_picker-icon
- https://caniuse.com/mdn-css_selectors_open
- https://caniuse.com/mdn-html_global_attributes_popover
- https://developer.chrome.com/docs/css-ui/anchor-positioning-api
- https://developer.chrome.com/blog/introducing-popover-api
- https://developer.chrome.com/blog/css-if
- https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select
- https://developer.mozilla.org/en-US/docs/Web/CSS/@scope
