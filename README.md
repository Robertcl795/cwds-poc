# Covalent Web Design System POC

Phase 1 scaffolds a framework-agnostic monorepo for semantic/headless UI migration.

## Workspace packages

- `@covalent-poc/tokens`
- `@covalent-poc/styles`
- `@covalent-poc/core`
- `@covalent-poc/primitives-foundation`
- `@covalent-poc/components`
- `@covalent-poc/web-components`
- `@covalent-poc/storybook`
- `@covalent-poc/showcase`

## Commands

- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm storybook`

### Storybook troubleshooting

- If `pnpm storybook` cannot use port `6006`, it now exits immediately instead of hanging.
- Run Storybook on another port with:
  - `pnpm --filter @covalent-poc/storybook exec storybook dev -p 7007 -c .storybook --ci --no-open --exact-port --disable-telemetry --no-version-updates`

## Guides

- Platform-native phased migration guide: `docs/architecture/GUIDE_PHASED.md`
