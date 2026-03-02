# Testing Rules

## Risk tiers

- Low: unit + story render checks.
- Medium: unit + interaction + a11y automation.
- High: unit + interaction + E2E smoke + visual regression group.
- Critical: includes manual SR checklist evidence.

## Mandatory gates

- Lint
- Typecheck
- Unit tests
- Storybook build
- E2E smoke

Visual regression and governance checks can start warn-only and move to fail-fast once baselined.
