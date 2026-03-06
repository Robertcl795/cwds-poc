# Covalent Design System POC

This workspace is organized around two foundation packages:

- `@ds/core`: shared runtime helpers, controllers, a11y contracts, icon helpers, and small Lit-oriented composition utilities
- `@ds/styles`: tokens, layers, shared CSS primitives, and component/adaptor styling

The public consumer surface remains:

- `@ds/primitives`
- `@ds/web-components`
- `@ds/angular` (experimental)
- `@ds/storybook`
- `@ds/ux-showcase`

## Package model

`@ds/core` owns runtime behavior only. It should stay small and focused on reusable interaction logic.

`@ds/styles` owns all CSS concerns: tokens, reset/theme/motion, shared utilities, component styling, and CSS QA.

`@ds/primitives` and `@ds/web-components` are the compatibility surface exercised by Storybook. Existing stories are the usage contract for this repo.

## Commands

- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm storybook`
- `pnpm storybook:build`
- `pnpm audit:foundation`
