# Phase 3.5 Contract Audit

## Scope
- list
- tabs
- dialog
- menu (pending primitive implementation in this workspace)
- fab (pending primitive implementation in this workspace)

## Audit Table
| Component | Area | Current | Expected | Non-breaking fix | Breaking risk | Status |
|---|---|---|---|---|---|---|
| list | data-state hooks | `data-selected`, `data-current`, `data-disabled` | same vocabulary across all phase3 surfaces | add missing aliases where needed | low | in-progress |
| tabs | keyboard model | manual activation + roving | APG parity including Home/End + disabled skip | hardening tests + docs | low | in-progress |
| dialog | linkage and ids | generated ids | unique ids + stable aria linkage | hardening patch landed | low | in-progress |
| menu | trigger/surface linkage | n/a (primitive missing) | `aria-controls`, `aria-expanded`, `aria-haspopup` | implement with shared helper | medium | blocked |
| fab | naming/disabled | n/a (primitive missing) | icon-only naming required | enforce runtime guard | low | blocked |

## Normalization Decisions
- Use `selected` for tab/list selection state.
- Use `current` only for location/current-item semantics.
- Use `open` only for overlay state.
- Keep callback source values aligned to `keyboard | pointer | programmatic`.

## Action Checklist
- [ ] Complete menu primitive + hardening tests.
- [ ] Complete fab primitive + hardening tests.
- [ ] Freeze public options + aliases before Phase 4.
- [ ] Update component docs with normalized glossary.
