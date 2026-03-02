# Architecture Rules

## Package groups (target taxonomy)

- `design-core`: visual language and foundational runtime mechanics.
- `ui-system`: native-first primitives, composed components, framework adapters.
- `rules`: governance and process.

Current physical layout:
- `packages/design-core/*`
- `packages/ui-system/*`

## Dependency constraints

- `design-core` must not depend on `ui-system`.
- `ui-system` may depend on `design-core`.
- Runtime code must not import from `rules`.

## Naming note

The monorepo avoids the term `pillar` in package organization. Use group names:
- `design-core`
- `ui-system`
- `rules`

Alternative names for `ui-system`:
- `interaction-system`
- `component-system`
