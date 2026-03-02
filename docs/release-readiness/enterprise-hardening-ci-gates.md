# Enterprise Hardening CI Gates

## Must pass

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- Enterprise hardening unit/interaction suite
- Storybook build (`pnpm storybook:build`)
- Showcase E2E smoke (`pnpm test:e2e`)
- Critical visual groups (feedback, overlay, workflow)

## Warn-only (temporary)

- Non-critical visual matrix drift
- Extended performance thresholds
- Manual SR evidence missing in PR (required for release)

## Flake policy

- Use deterministic timers and explicit state waits.
- Retry only known infra flakes.
- Any quarantined test must include owner + expiry date.
