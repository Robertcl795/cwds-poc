# Accessibility Authoring Principles

## Baseline

The system targets WCAG 2.1 AA and WAI-ARIA APG interaction patterns.
Native semantics are required where available; ARIA is additive, never a semantic replacement.

## Authoring rules

1. Keyboard interaction patterns must be documented and tested per component.
2. Focus behavior must be deterministic for overlay, menu, dialog, and listbox flows.
3. Accessible name/description contracts are part of API design, not optional docs.
4. Axe and keyboard tests are mandatory for Storybook and CI baselines.

## POC constraints

- External accessibility audit has not yet been completed.
- Some complex composite patterns still need exhaustive keyboard matrices.
