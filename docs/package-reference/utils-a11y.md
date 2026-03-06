# @ds/utils-a11y

Status: `internal`

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
