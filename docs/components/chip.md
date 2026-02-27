# Chip (Phase 2)

## Variants in scope
- Action chip: native `<button type="button">`.
- Filter chip: native `<input type="checkbox">` + visual shell.

## Accessibility
- Action chip exposes a button role natively.
- Filter chip exposes checkbox semantics natively.
- Disabled chips must never dispatch activation callbacks.

## Deferred
- Input chip and combobox-coupled token editing behavior.

## Phase 2.5 hardening notes
- Action chip keeps native button keyboard parity.
- Filter chip keeps native checkbox toggle semantics.
