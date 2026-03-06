# @ds/utils-a11y

Status: `internal`

Purpose: workspace-internal accessibility helpers layered over `@ds/core`.

What belongs here:
- focus-ring helpers
- ripple hooks
- elevation helpers

Public entry point:
- `@ds/utils-a11y`

Usage:
```ts
import { applyFocusRing } from '@ds/utils-a11y';
```

Migration note:
- prefer `@ds/primitives` or `@ds/web-components` in app code; this package is internal-facing.
