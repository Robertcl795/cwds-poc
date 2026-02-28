# Framework-Agnostic Contract Definition

## Contract boundaries

- `@ds/headless`: interaction state, keyboard logic, environment guards.
- `@ds/primitives`: semantic DOM composition and stable creation APIs.
- Adapters (`@ds/angular`, `@ds/lit`): framework ergonomics over stable primitives.

## Rules

1. `@ds/headless` must not import from styles, adapters, or framework packages.
2. Adapters must not fork behavior; they compose primitives/headless contracts.
3. `@ds/primitives` is the canonical public API for non-framework consumers.

## Angular-specific contract requirements

- Signal-based state exposure.
- `inject()` composition patterns.
- Typed reactive form integration (`FormControl<T>`), `OnPush`, and zoneless compatibility.
