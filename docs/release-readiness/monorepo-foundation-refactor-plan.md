# Monorepo Foundation Refactor Plan

Date: 2026-03-02

## Naming model (no "pillar" terminology)

- `design-core`
- `ui-system`
- `rules`

## UI-system alternative names

1. `ui-system` (recommended)
2. `interaction-system`
3. `component-system`

## Implementation status

Completed in this slice:
- Added governance source structure under `rules/*`.
- Added repeatable audit tooling under `tools/audit/*`.
- Added root audit scripts (`pnpm audit:foundation`).
- Added structure docs for `design-core`/`ui-system` naming.
- Added templates for migration matrix, PR slices, Storybook invariance, and stabilization report.
- Physically regrouped runtime packages into:
  - `packages/design-core/*`
  - `packages/ui-system/*`
- Updated workspace globs, TS/Vite/Vitest/Storybook alias paths to match new structure.
- Migrated primary package names:
  - `@ds/core`
  - `@ds/web-components`
- Removed compatibility wrappers and placeholder packages:
  - removed `@ds/headless`
  - removed `@ds/lit`
  - removed `@ds/utils-overlay`
  - removed `@ds/migration-bridge`

Deferred to next slices:
- remove stale historical docs that still mention removed placeholder packages
