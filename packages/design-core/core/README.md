# @ds/core

Status: `stable`

Purpose: framework-agnostic behavior and interaction contracts.

What belongs here:
- controllers
- focus and keyboard infrastructure
- overlay and feature detection primitives
- runtime behavior without styling concerns

Public entry point:
- `@ds/core`

Usage:
```ts
import { createDialogController } from '@ds/core';
```

Migration note:
- adapters and primitives should consume `@ds/core`; apps should usually consume higher-level packages instead.
