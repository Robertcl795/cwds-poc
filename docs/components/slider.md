# Slider (Phase 2)

## API
- `createPrimitiveSlider(options)`
- Uses native `<input type="range">` with optional value output.

## Accessibility
- Native keyboard behavior preserved (arrows/home/end/page keys).
- Label and helper text are linked through native attributes.

## Phase 2.5 hardening notes
- Canonical options: `helperText`, `errorText`.
- Backward-compatible aliases: `helper`, `validationMessage`.
- External `describedBy` ids can be appended safely.
