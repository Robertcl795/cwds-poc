# @ds/utils-icons

Status: `internal`

Purpose: workspace-internal icon registration and DOM creation helpers.

What belongs here:
- icon registry contracts
- DOM icon rendering helpers

Public entry point:
- `@ds/utils-icons`

Usage:
```ts
import { registerIcons, createIconNode } from '@ds/utils-icons';
```

Migration note:
- consumers should treat this as an internal helper unless a stable icon contract is formally published.
