# @ds/utils-a11y

## Purpose and boundary

Workspace-internal accessibility utility package for primitives/adapters.
Not intended as a stable consumer-facing package.

## Public API surface

- `applyFocusRing`, `applyRipple`, `setElevation`
- CSS hook constants (`CV_CLASSES`, `CV_DATA_ATTRS`)

## Usage examples

Vanilla:
```ts
import { applyFocusRing } from '@ds/utils-a11y';
```

Angular 19+:
```ts
// Use through adapters/primitives; avoid app-level direct imports.
```

## Known POC limitations

- Depends on `@ds/headless` for some behavior paths.
- API stability policy not formally defined.

## Future extension points

- Either fold headless-dependent utilities into `@ds/headless` or formalize this layer.
- Mark utility APIs as `@internal` in generated docs.
