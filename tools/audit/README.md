# Foundation Audit Scripts

These scripts provide repeatable, CI-friendly audits for the monorepo foundation refactor.

Run all checks:
- `pnpm audit:foundation`

Scripts:
- `inventory.mjs`: package/app/docs inventory with design-core/ui-system/rules classification.
- `import-graph.mjs`: `@ds/*` import graph for packages/apps/docs.
- `duplicate-files.mjs`: duplicate content clusters (excluding `dist`/`node_modules`).
- `check-boundaries.mjs`: dependency boundary checks for `design-core` vs `ui-system`.
- `check-token-governance.mjs`: token/raw-value governance warnings (or strict fail).

Outputs are written to `reports/`.
