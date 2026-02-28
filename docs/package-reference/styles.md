# @ds/styles

## Purpose and boundary

Implement visual styling from DS tokens. No behavior logic, no framework runtime.

## Public API surface

- CSS entrypoint: `@ds/styles/index.css`
- Optional layered entrypoints:
  - `@ds/styles/foundation.css`
  - `@ds/styles/components.css`
- Semantic class/state styling for DS primitives

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

## Known POC limitations

- CSS linting is not configured yet.
- Component CSS is modularized, but style contract ownership (`stable/experimental/internal`) is not tagged yet.

## Future extension points

- Enforce stylelint and token usage rules.
- Split theme packs (default/high-contrast) with explicit imports.
