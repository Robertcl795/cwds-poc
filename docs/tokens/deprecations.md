# Token Deprecations

Deprecated tokens are tracked in `packages/tokens/src/deprecations.json`.

Each entry includes:

- `replacement`
- `since`
- `removeIn`

Build output emits temporary CSS aliases for deprecated keys so migration can happen without hard breaks.
