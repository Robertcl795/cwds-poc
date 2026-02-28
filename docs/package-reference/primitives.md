# @ds/primitives

## Purpose and boundary

Expose semantic, native HTML-first primitive/composite creation APIs.
Consumes headless contracts and internal utilities; this is the primary public JS API.

## Public API surface

- Primitive factories: button, text-field, checkbox, switch, list, tabs, etc.
- Composites: dialog, select, tooltip, menu, snackbar, card, toolbar, alert
- Typed option/result contracts

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

## Known POC limitations

- Some internal `shared*` patterns are not yet fully hidden from future API churn.
- Component maturity levels are not tagged.

## Future extension points

- Publish component stability map and deprecation policy.
- Narrow exports to explicit component modules over wildcard exports.
