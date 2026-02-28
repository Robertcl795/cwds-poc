# System Philosophy

## Position

The design system is `headless-first`, `native HTML-first`, and `token-driven`.
Behavior belongs in reusable state/interaction controllers, visuals belong in CSS tokens and semantic classes, and framework adapters are delivery layers.

## Principles

1. Prefer semantic HTML before custom roles.
2. Keep behavior framework-agnostic by default (`@ds/headless`).
3. Keep visuals tokenized (`@ds/tokens` + `@ds/styles`) and avoid hard-coded values.
4. Expose stable APIs from `@ds/primitives`; keep helper internals private.
5. Optimize Angular adapter APIs for signals, `inject()`, typed forms, `OnPush`, and zoneless execution.

## Non-goals

- Recreating Material Web runtime behavior in DS runtime.
- Coupling visual implementation with adapter frameworks.
- Allowing consumer apps to rely on internal utility packages.
