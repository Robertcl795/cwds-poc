# Task 3: POC State Assessment Matrix

Date: 2026-02-28  
Scope: production-readiness assessment for migration-scale adoption.

## Assessment Matrix

| Dimension | Current State | Specific Gaps Found | Priority to Fix Before Full Migration | Recommended Action |
|---|---|---|---|---|
| 1. Token completeness and semantic correctness | Yellow | Token package is CSS-only with no typed manifest; token linting/drift guard is missing. | High | Add token schema validation + naming lint in CI, then publish typed token metadata and change-impact reports.
| 2. Component API surface stability | Yellow | `@ds/primitives` and `@ds/headless` still rely heavily on wildcard barrel exports; no `stable/experimental/internal` export policy is documented in code. | High | Freeze a v1 export map with explicit subpath exports and mark unstable APIs. Block new wildcard exports via lint rule.
| 3. Headless core isolation (no framework leakage) | Green | No framework imports were found in `packages/headless/src`; however utility layering is still ambiguous (`utils-a11y` depends on headless). | Medium | Keep headless framework-free and define a hard layering rule for `utils-*` packages. Either fold headless-dependent utilities into `@ds/headless` or formalize utility tier contracts.
| 4. Accessibility compliance (WCAG 2.1 AA) | Yellow | Storybook global config still has `a11y.test = 'todo'`; no external audit evidence is present; AA acceptance criteria are not mapped per component. | High | Set Storybook global a11y policy to blocking for designated baseline stories and add per-component WCAG checklist docs. Schedule external AA audit before mass migration.
| 5. Keyboard interaction coverage | Yellow | Keyboard tests exist for critical composites but coverage is uneven across all migrated components and edge cases (nested overlays, composite chaining). | High | Publish keyboard contract matrices per component and enforce required keyboard test cases in PR templates. Add focused E2E keyboard journeys for dialog/menu/listbox/tooltip flows.
| 6. Angular 19+ adapter quality (signals, typed forms, OnPush, zoneless) | Red | Adapter currently exposes only a button directive baseline; typed forms bridges and broader component adapters are not implemented. | High | Build adapter parity for input/form-field/checkbox/switch/dialog/menu first, using signal-driven APIs and typed reactive forms contracts. Add zoneless and `OnPush` conformance tests in CI.
| 7. CSS architecture (token discipline, specificity hygiene) | Yellow | CSS layering is now modularized (foundation/components), but stylelint/token enforcement is absent. | High | Introduce stylelint rules for token-only values and selector/specificity limits, then enforce them in CI.
| 8. Storybook story quality and interactivity | Yellow | Story coverage is broad, but it mixes canonical and phase-history narratives; baseline accessibility gating is not strict enough. | Medium | Split Storybook into canonical stories and legacy stories, and gate canonical stories with a11y + interaction smoke checks.
| 9. Test coverage (unit, a11y, visual regression, E2E) | Yellow | Unit tests are strong (`50` spec files) and E2E exists (`7` specs), but there is no visual regression baseline and no coverage threshold policy. | High | Add visual regression (Chromatic/Percy), then define minimum coverage and mandatory test matrix for each component maturity level.
| 10. Migration bridge / facade layer completeness | Red | `@ds/migration-bridge` is placeholder-only (`export {}`); no legacy compatibility APIs are available yet. | High | Implement first bridge facades for top-used legacy components with telemetry and deprecation metadata. Publish migration cookbook examples per legacy component type.
| 11. Documentation completeness | Yellow | Track A/B structure now exists, but adapter conformance docs, API stability tags, and per-component a11y matrices are still missing. | Medium | Add adapter conformance guide, API stability tables, and component-level accessibility/keyboard matrices as required docs before GA.
| 12. Codebase consistency (naming, conventions, patterns) | Yellow | `@ds/*` naming is normalized, but deprecated aliases and phase-era naming remain in some surfaces (for example deprecated web-component alias helpers). | Medium | Remove deprecated aliases after one compatibility window and enforce naming conventions with lint/check scripts.

## Prioritized Top-5 Actions

1. **Ship Angular adapter parity for migration-critical components.**
Implementation steps: define adapter contracts for `text-field`, `form-field`, `checkbox/switch`, `dialog`, and `menu/listbox`; implement signal-first directive/component APIs with typed reactive form bindings; add zoneless + `OnPush` integration tests and require green adapter conformance in CI.

2. **Implement migration bridge v0 with real facades.**
Implementation steps: choose top 5 legacy components by usage, create DS-backed facades in `@ds/migration-bridge`, emit deprecation warnings with removal dates, and add migration telemetry hooks to track consumer adoption.

3. **Freeze v1 public API and export stability policy.**
Implementation steps: replace wildcard barrels with explicit exports, annotate each export as `stable/experimental/internal`, and add a CI rule that rejects unclassified public exports.

4. **Harden accessibility and keyboard gates.**
Implementation steps: switch Storybook global a11y from `todo` to enforced checks for canonical stories, publish component keyboard matrices tied to APG patterns, and add end-to-end keyboard regressions for overlays/dialogs/menus.

5. **Enforce token/style governance in CI.**
Implementation steps: add stylelint + token usage rules, block raw value usage in component CSS, and enforce linting in CI.
