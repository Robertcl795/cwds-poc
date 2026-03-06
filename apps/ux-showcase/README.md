# @ds/ux-showcase

Purpose: route-based integration demo for the CSS-first design system.

What belongs here:
- realistic composition demos
- lightweight integration routes
- end-to-end validation targets

Route organization:
- `foundation`: shared token/core/component baseline coverage
- `components/*`: supported component package surfaces grouped by responsibility
- `verification/*`: hardening and regression routes grouped by responsibility

Semantic route ids:
- `#components-primitives`
- `#components-forms`
- `#verification-forms`
- `#components-navigation`
- `#verification-navigation`
- `#components-overlays`
- `#components-workflows`

Compatibility note:
- legacy `#phase1` through `#phase5` hashes remain as temporary aliases so existing links and tests keep working while consumers move to the semantic route ids.

Entry points:
- `pnpm --filter @ds/ux-showcase dev`
- `pnpm --filter @ds/ux-showcase build`
- `pnpm --filter @ds/ux-showcase test:e2e`

Usage:
```bash
pnpm --filter @ds/ux-showcase dev
```

Styling note:
- showcase routes should rely on package styles and only add route-level layout styling where needed.

Migration note:
- this app validates the `@ds/tokens` -> `@ds/core` -> `@ds/components` integration path and is not counted as part of the package architecture.
