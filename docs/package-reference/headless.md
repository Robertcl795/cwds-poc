# @ds/core

Status: `stable`

## Purpose and boundary

Provide framework-agnostic interaction/state controllers and infrastructure.
Must stay independent from styles and framework adapters.

## Public API surface

- Controllers: button, checkbox, dialog, field, select
- Infra: focus manager, keyboard, overlay stack
- Utilities: feature/environment detection, ripple/focus helpers
- No dependency on Material Web, Lit, or framework runtimes

## Usage examples

Vanilla:
```ts
import { createDialogController } from '@ds/core';
```

Angular 19+:
```ts
import { createDialogController } from '@ds/core';
// Use inside adapter/service, not directly in templates.
```
