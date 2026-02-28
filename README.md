# Covalent Web Design System POC

Phase 1 scaffolds a framework-agnostic monorepo for semantic/headless UI migration.

## Workspace packages

- `@ds/tokens`
- `@ds/styles`
- `@ds/headless`
- `@ds/utils-a11y`
- `@ds/primitives`
- `@ds/angular`
- `@ds/lit`
- `@ds/storybook`
- `@ds/ux-showcase`

## Commands

- `pnpm install`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm storybook`

### Storybook troubleshooting

- If `pnpm storybook` cannot use port `6006`, it now exits immediately instead of hanging.
- Run Storybook on another port with:
  - `pnpm --filter @ds/storybook exec storybook dev -p 7007 -c .storybook --ci --no-open --exact-port --disable-telemetry --no-version-updates`

## Guides

- Documentation entrypoint: `docs/README.md`
- Track A (Architecture & Vision): `docs/architecture-vision/README.md`
- Track B (Package Reference): `docs/package-reference/README.md`
- Executive summary (Tasks 1-5): `docs/architecture-vision/executive-summary-tasks1-5.md`
