# Architecture Rules

## Package groups

- `design-system`: `@ds/tokens`, `@ds/core`, and `@ds/components`
- `apps`: Storybook and showcase integration surfaces
- `rules`: governance and process

## Dependency constraints

- `@ds/tokens` must not import from other design-system packages.
- `@ds/core` must not import from `@ds/components`.
- `@ds/components` may depend only on `@ds/core` and `@ds/tokens`.
- Runtime code must not import from `rules`.
