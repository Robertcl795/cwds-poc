# @ds/lit

## Purpose and boundary

Custom element adapter package for non-Angular integration.
Wraps primitives without redefining behavior contracts.

## Public API surface

- Element APIs from `combobox` and `advanced-select`
- `defineCvWebComponents()` registration helper

## Usage examples

Vanilla:
```ts
import { defineCvWebComponents } from '@ds/lit';
defineCvWebComponents();
```

Angular 19+:
```ts
// Use custom elements via Angular custom element schemas as needed.
```

## Known POC limitations

- Coverage is focused on phase-4 components.
- Form-associated custom element behavior needs broader test depth.

## Future extension points

- Expand element coverage with contract tests tied to primitives.
- Add SSR/hydration integration notes for host frameworks.
