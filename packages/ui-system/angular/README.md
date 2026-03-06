# @ds/angular

Status: `experimental`

Purpose: experimental Angular adapter layer over the design-system primitives.

What belongs here:
- Angular-specific directives and providers
- typed Angular ergonomics over stable primitive contracts

Public entry point:
- `@ds/angular`

Usage:
```ts
import { provideCvAngularAdapter } from '@ds/angular';
```

Styling note:
- Angular consumers still use `@ds/tokens` and `@ds/styles` for visual output.
- Consumers must provide `@angular/core` and `@angular/forms` as peer dependencies.

Migration note:
- this package does not replace Material Web in the production-ready POC today; it remains experimental, peer-dependent on Angular, and outside the hardened stable runtime baseline.
