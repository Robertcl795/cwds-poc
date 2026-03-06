# Current State and Priorities

Date: 2026-03-06

## Current state

1. Monorepo is grouped by `design-core`, `ui-system`, and `rules`.
2. Canonical runtime package boundaries are active:
   - `@ds/core` for framework-agnostic behavior
   - `@ds/primitives` for native-first component APIs
   - `@ds/web-components` for behavior-heavy custom element delivery
   - `@ds/angular` is currently an experimental adapter stub, not part of the production-ready surface
3. Compatibility wrappers and placeholder packages have been removed.
4. Runtime components ship without `@material/web` or Lit dependencies.
5. Documentation is consolidated to current source-of-truth guidance.

## Migration rationale (current)

1. The legacy M2-era mix increased duplicated behavior and inconsistent accessibility.
2. The DS runtime now supports native-first primitives without `@material/web` or Lit runtime dependency.
3. Net-new and touched legacy work should converge on DS packages to reduce migration debt.

## Active priorities

1. Harden accessibility gates: WCAG/APG coverage, keyboard matrices, overlay focus/dismiss tests.
2. Strengthen the CSS-first token foundation: OKLCH palettes, semantic theming, and clearer brand direction.
3. Freeze API stability tags (`stable`, `experimental`, `internal`) with explicit export maps.
4. Improve migration enablement via playbooks and deprecation metadata per component family.
5. Keep Storybook and showcase parity during internal refactors.

## Explicitly out of scope in docs track

1. Task-by-task execution transcripts.
2. Historical phase planning content already implemented.
3. Presentation-only narrative artifacts not needed for contributor operations.
