# Phase 2.5 Contract Audit Checklist

## Scope
- text-field
- chip
- slider
- select

## API consistency
- [ ] Canonical naming uses `helperText` and `errorText`
- [ ] Legacy aliases (`helper`, `validationMessage`) remain non-breaking
- [ ] Native events remain primary; callbacks are additive

## Field linkage
- [ ] `<label for>` points to native control id
- [ ] `aria-describedby` ordering is deterministic (`helper -> external`)
- [ ] `aria-invalid` is only present when invalid

## State hooks
- [ ] `data-disabled`
- [ ] `data-read-only`
- [ ] `data-invalid`
- [ ] `data-focused`
- [ ] `data-filled`
- [ ] `data-enhanced` (select only)

## Select enhancement safety
- [ ] `enhance: false` always forces baseline
- [ ] Global kill switch `__CV_DISABLE_SELECT_ENHANCEMENT__` forces baseline
- [ ] Enhanced path never changes form semantics

## Security checks
- [ ] Label/helper/error uses `textContent`
- [ ] Disabled controls do not activate handlers
- [ ] No unsafe HTML injection in chip/select/text-field surfaces

## Result
- Status: In progress
- Owner: Frontend hardening sprint
