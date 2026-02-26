# Covalent Web Design System POC

Phase 1 scaffolds a framework-agnostic monorepo for semantic/headless UI migration.

## Workspace packages

- `@covalent-poc/tokens`
- `@covalent-poc/styles`
- `@covalent-poc/headless-core`
- `@covalent-poc/primitives`
- `@covalent-poc/composites`
- `@covalent-poc/compat-m2`
- `@covalent-poc/codemods`
- `@covalent-poc/adapter-angular`
- `@covalent-poc/adapter-lit`
- `@covalent-poc/storybook`
- `@covalent-poc/ux-showcase`

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

- Platform-native phased migration guide: `docs/architecture/platform-native-phased-guide.md`
