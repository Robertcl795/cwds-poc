# Covalent Design System POC

This workspace is organized around three design-system packages:

- `@ds/tokens`: CSS-only primitive and semantic token source of truth
- `@ds/core`: nonvisual runtime helpers, a11y contracts, infrastructure, and base CSS
- `@ds/components`: reusable visual component APIs and component CSS

The main integration surfaces are:

- `@ds/storybook`
- `@ds/ux-showcase`

## Package model

`@ds/tokens` owns token definitions and theme-level token overrides only.

`@ds/core` owns nonvisual runtime behavior and cross-cutting base CSS only.

`@ds/components` owns the reusable visual surface, including the DOM-factory APIs and the `@ds/components/web-components` entry point.

Dependency direction:

- `@ds/tokens` has no design-system runtime dependency
- `@ds/core` must not import from `@ds/components`
- `@ds/components` may depend on `@ds/core` and `@ds/tokens`

## Commands

- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm storybook`
- `pnpm storybook:build`
- `pnpm audit:foundation`
