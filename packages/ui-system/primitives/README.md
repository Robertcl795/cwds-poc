# @ds/primitives

Status: `stable`

Purpose: native HTML-first factories and composites for the design system.

What belongs here:
- semantic DOM factories
- minimal composite assembly
- contracts used by stories, demos, and future framework wrappers

Public entry point:
- `@ds/primitives`

Usage:
```ts
import { createPrimitiveButton, createPrimitiveTextField } from '@ds/primitives';
```

Migration note:
- this is the primary production-ready runtime API; prefer native controls and minimal JS.
