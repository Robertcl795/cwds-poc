# Select (Phase 2)

## Baseline
- Always renders native `<select>`.
- Native form participation and accessibility semantics are preserved.

## Progressive enhancement
- Enhancement is optional and feature-gated (`enhance !== false`).
- Unsupported browsers remain on native baseline path.
- Global kill switch is supported via `globalThis.__CV_DISABLE_SELECT_ENHANCEMENT__ = true`.

## Deferred
- Combobox/autocomplete/tokenized or menu-backed select behavior.

## Phase 2.5 hardening notes
- Baseline native behavior is release-critical and must remain correct.
- Canonical options: `helperText`, `errorText`; aliases remain non-breaking.
