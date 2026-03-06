# @ds/web-components

Status: `stable`

Purpose: custom element adapters for the small set of behavior-heavy controls that benefit from a packaged element API.

What belongs here:
- custom elements over primitive/core contracts
- form-associated or overlay-heavy behavior that is awkward as plain HTML alone

Public entry point:
- `@ds/web-components`

Usage:
```ts
import { defineCvWebComponents } from '@ds/web-components';

defineCvWebComponents();
```

Migration note:
- `definePhase4WebComponents()` has been removed; use `defineCvWebComponents()`.
