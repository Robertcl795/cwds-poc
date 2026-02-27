# Text Field (Phase 2)

## API
- `createPrimitiveTextField(options)`
- Native input semantics are preserved.

## Accessibility
- Uses native `<label for>` + `<input>` linkage.
- Helper text id is attached via `aria-describedby`.
- Validation states set `aria-invalid` on the input only when invalid.
- `describedBy` may append external ids non-destructively.

## Scope
- Single-line text input variants.
- Textarea support is deferred.

## Phase 2.5 hardening notes
- Canonical options: `helperText`, `errorText`.
- Backward-compatible aliases: `helper`, `validationMessage`.
