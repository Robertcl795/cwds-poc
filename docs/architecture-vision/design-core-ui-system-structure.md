# Design-Core / UI-System / Rules Structure

Date: 2026-03-02

This repo adopts a three-group foundation naming model:

1. `design-core`
   - Visual language and foundational mechanics.
   - Current mapped packages: `@ds/tokens`, `@ds/styles`, `@ds/core`, `@ds/utils-a11y`, `@ds/utils-icons`.
2. `ui-system`
   - Native-first primitives, composed UI APIs, framework adapters.
   - Current mapped packages: `@ds/primitives`, `@ds/web-components`, `@ds/angular`.
3. `rules`
   - Architecture rules, authoring standards, testing rules, release governance.
   - Source-of-truth lives under `/rules`.

## UI-system naming alternatives

Recommended canonical name: `ui-system`.

Alternatives (ordered):
1. `interaction-system` (clear runtime/behavior focus)
2. `component-system` (clear to consumers; slightly narrower)
3. `product-ui` (team-friendly but less design-system precise)

Decision rubric:
- Choose `ui-system` when you want both primitives and adapters represented.
- Choose `interaction-system` when emphasizing runtime mechanics and contracts.
- Avoid generic `components` as a top-level group because it hides adapters/core pattern modules.

## Current baseline

- Package structure is grouped under:
  - `packages/design-core/*`
  - `packages/ui-system/*`
- Governance source-of-truth lives in `/rules/*`.
- Audit automation lives in `/tools/audit/*` and is available via `pnpm audit:*`.
- Compatibility wrappers and placeholder packages are removed; canonical imports are:
  - `@ds/core` (instead of `@ds/headless`)
  - `@ds/web-components` (instead of `@ds/lit`)
