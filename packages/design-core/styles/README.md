# @ds/styles

Status: `stable`

Purpose: branded CSS layers for the design system runtime.

What belongs here:
- reset and theme rules
- foundation utilities such as focus, ripple, elevation
- primitive and composite component styling
- adapter host hooks

Public entry points:
- `@ds/styles/index.css`
- `@ds/styles/foundation.css`
- `@ds/styles/components.css`
- Canonical deep entry points:
  - `@ds/styles/foundation/index.css`
  - `@ds/styles/components/index.css`
  - `@ds/styles/components/adapters.css`

Usage:
```css
@import '@ds/tokens/tokens.css';
@import '@ds/styles/index.css';
```

Migration note:
- consumers should prefer these layered entrypoints over copying Storybook demo styles; adapter hooks now live in a separate `adapters` layer instead of being mixed into the core component layer.
