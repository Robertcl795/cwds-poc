# @ds/storybook

Purpose: living usage contract for the CSS-first design system.

What belongs here:
- component stories
- token and styling demos
- verification stories for supported states and environments

Entry points:
- `pnpm storybook`
- `pnpm storybook:build`

Usage:
```bash
pnpm storybook
```

Styling note:
- stories should consume `@ds/tokens` and `@ds/styles`, not ad hoc component styling.

Migration note:
- deprecated Material-era or migration-era stories should be removed once the supported DS API is in place.
