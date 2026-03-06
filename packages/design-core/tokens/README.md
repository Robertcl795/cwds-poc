# @ds/tokens

Status: `stable`

Purpose: reference, semantic, and component token definitions for the CSS-first design system.

What belongs here:
- palette and semantic variables
- theme-scoped light/dark mappings
- light/dark token mapping
- component token hooks

Public entry point:
- `@ds/tokens/tokens.css`
- Optional deep entry points:
  - `@ds/tokens/reference.css`
  - `@ds/tokens/semantic.css`
  - `@ds/tokens/components.css`
  - `@ds/tokens/theme.css`

Usage:
```css
@import '@ds/tokens/tokens.css';
```

Styling note:
- `tokens.css` is the canonical import and establishes the shared `@layer` order used by the rest of the system.

Migration note:
- replace hardcoded values and legacy theme variables with semantic `--cv-*` tokens.
