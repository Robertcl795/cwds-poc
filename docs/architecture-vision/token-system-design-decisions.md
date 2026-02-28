# Token System Design Decisions

## Token layers

1. Reference tokens: raw scales and palettes.
2. System tokens: semantic aliasing (surface, content, border, state).
3. Component tokens: narrowly scoped overrides per component role.

## Enforcement decisions

- All component CSS must consume semantic/system tokens, not raw reference values.
- Variant states (`hover`, `focus-visible`, `disabled`, `error`) map to explicit tokens.
- Any new component token requires design + engineering review and naming approval.

## Current gaps

- No automated token linting gate yet.
- Figma-to-token synchronization is not yet defined.
- Dark/high-contrast token parity is partial.
