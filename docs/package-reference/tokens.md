# @ds/tokens

Status: `stable`

## Purpose and boundary

Own semantic design token definitions. No component logic, no framework code.

## Public API surface

- CSS entrypoint: `@ds/tokens/tokens.css`
- Optional deep entrypoints:
  - `@ds/tokens/reference.css`
  - `@ds/tokens/semantic.css`
  - `@ds/tokens/components.css`
  - `@ds/tokens/theme.css`
- Exposed artifacts: reference, semantic, and component CSS variables
- Light/dark capable semantic color tokens backed by OKLCH reference values
- Canonical layer contract: `tokens -> base -> foundation -> components -> adapters -> overrides`

## Usage examples

Vanilla:
```css
@import '@ds/tokens/tokens.css';
```

Advanced composition:
```css
@import '@ds/tokens/reference.css' layer(tokens);
@import '@ds/tokens/semantic.css' layer(tokens);
@import '@ds/tokens/components.css' layer(tokens);
```

Angular 19+:
```ts
// angular.json styles
"styles": ["node_modules/@ds/tokens/dist/tokens.css"]
```
