# @ds/tokens

## Purpose and boundary

Own semantic design token definitions. No component logic, no framework code.

## Public API surface

- CSS entrypoint: `@ds/tokens/tokens.css`
- Exposed artifacts: token CSS variables

## Usage examples

Vanilla:
```css
@import '@ds/tokens/tokens.css';
```

Angular 19+:
```ts
// angular.json styles
"styles": ["node_modules/@ds/tokens/dist/tokens.css"]
```

## Known POC limitations

- CSS-only package; no typed token manifest export.
- No CI token linting or token drift detection.

## Future extension points

- Add generated TypeScript token typings.
- Add design-token pipeline with validation and changelog impact labeling.
