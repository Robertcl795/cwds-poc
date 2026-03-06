# @ds/web-components

Status: `stable`

## Purpose and boundary

Custom element adapter package for behavior-heavy integrations.
It exposes small native custom elements over the primitive/runtime contracts without bringing in Lit or Material runtimes.

## Public API surface

- `cv-combobox`
- `cv-advanced-select`
- `defineCvWebComponents()` registration helper

## Usage examples

Vanilla:
```ts
import { defineCvWebComponents } from '@ds/web-components';

defineCvWebComponents();
```

Angular 19+:
```ts
// Consume as standard custom elements when a framework wrapper is not required.
```

## Migration note

- Legacy `definePhase4WebComponents()` has been removed.
- Use `defineCvWebComponents()` instead.
