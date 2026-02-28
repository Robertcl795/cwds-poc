# @ds/headless

## Purpose and boundary

Provide framework-agnostic interaction/state controllers and infrastructure.
Must stay independent from styles and framework adapters.

## Public API surface

- Controllers: button, checkbox, dialog, field, select
- Infra: focus manager, keyboard, overlay stack
- Utilities: feature/environment detection, ripple/focus helpers

## Usage examples

Vanilla:
```ts
import { createDialogController } from '@ds/headless';
```

Angular 19+:
```ts
import { createDialogController } from '@ds/headless';
// Use inside adapter/service, not directly in templates.
```

## Known POC limitations

- Some controller contracts are still broad (`export *` heavy index surface).
- API stability labels (stable/experimental) are not documented yet.

## Future extension points

- Add explicit subpath exports and stability tiers.
- Add contract tests per controller for adapter parity.
