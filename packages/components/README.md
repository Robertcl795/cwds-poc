# @ds/components

Status: `stable`

Purpose: reusable visual component APIs for the design system.

What belongs here:
- DOM-factory component APIs
- higher-level reusable assemblies
- component CSS and component-scoped styling contracts
- custom elements under `@ds/components/web-components`

Public entry points:
- `@ds/components`
- `@ds/components/web-components`
- `@ds/components/index.css`

Usage:
```ts
import { createPrimitiveButton, createPrimitiveTextField } from '@ds/components';
```

Migration note:
- the old `@ds/primitives` and `@ds/web-components` package names have been removed in favor of `@ds/components`.
