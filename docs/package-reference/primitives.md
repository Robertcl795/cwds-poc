# @ds/primitives

Status: `stable`

## Purpose and boundary

Expose semantic, native HTML-first primitive/composite creation APIs.
Consumes framework-agnostic controllers and internal utilities; this is the primary public JS API for production-ready DOM primitives.

## Public API surface

- Primitive factories: button, text-field, checkbox, switch, list, tabs, etc.
- Composites: dialog, select, tooltip, menu, snackbar, card, toolbar, alert, action-ribbon
- Typed option/result contracts
- Native HTML first: generated markup is plain semantic DOM styled by `@ds/styles`

## Usage examples

Vanilla:
```ts
import { createPrimitiveButton } from '@ds/primitives';
const button = createPrimitiveButton({ label: 'Save' });
```

Angular 19+:
```ts
import { CvButtonDirective } from '@ds/angular';
// Prefer adapter directives/components over direct primitive calls.
```
