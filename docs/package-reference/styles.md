# @ds/styles

Status: `stable`

## Purpose and boundary

Implement visual styling from DS tokens. No behavior logic, no framework runtime.

## Public API surface

- CSS entrypoint: `@ds/styles/index.css`
- Optional layered entrypoints:
  - `@ds/styles/foundation.css`
  - `@ds/styles/components.css`
- Canonical deep entrypoints:
  - `@ds/styles/foundation/index.css`
  - `@ds/styles/components/index.css`
  - `@ds/styles/components/adapters.css`
- Semantic class/state styling for DS primitives
- Modern CSS foundation: `@layer`, `color-mix()`, `oklch()`, `light-dark()`, `@property`, container queries
- Explicit layer split:
  - `base` for reset/theme
  - `foundation` for shared interaction affordances
  - `components` for primitive/composite styling
  - `adapters` for host hooks on custom elements and wrappers

## Usage examples

Vanilla:
```css
@import '@ds/styles/index.css';
```

Angular 19+:
```ts
// angular.json styles
"styles": ["node_modules/@ds/styles/dist/index.css"]
```
