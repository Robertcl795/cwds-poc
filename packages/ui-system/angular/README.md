# Angular Adapter (`@ds/angular`)

Angular 19+ adapter package for the headless/primitive system.

## Scope

- Standalone directives/components over the primitive DOM contracts.
- Signals-first API model (`input()`, `signal()`, `effect()`).
- Typed reactive forms compatibility via `FormControl<T>` contracts.
- Zoneless-ready usage by avoiding reliance on `ngZone`.

## Initial Surface

- `provideCvAngularAdapter(config)`
- `CV_ANGULAR_ADAPTER_CONFIG`
- `CvButtonDirective`
- `CvTypedControl<T>`

## Adoption Rules

- Angular apps should consume `@ds/angular` instead of importing primitive internals directly.
- This package owns Angular-specific ergonomics and migration facades.
