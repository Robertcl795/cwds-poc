# Phase 3.5 Overlay Robustness Report

## Scope
- dialog overlay lifecycle hardening
- menu overlay lifecycle hardening (pending primitive implementation)

## Lifecycle Checks
| Case | Expected | Status | Notes |
|---|---|---|---|
| trigger -> open -> focus placement | deterministic focus target | in-progress | |
| close -> focus restoration | restore trigger or safe fallback | in-progress | |
| repeated cycles | no focus drift / no stale listeners | in-progress | |

## Dismiss Matrix
| Dismiss Vector | Dialog | Menu | Status |
|---|---|---|---|
| Escape | configurable via `closeOnEscape` | pending | in-progress |
| outside pointer | configurable via `closeOnOutsidePress` | pending | in-progress |
| trigger toggle | n/a | pending | blocked |
| action selection | confirm/cancel paths close | pending | in-progress |

## Risk Register
- Menu overlay behaviors blocked until menu primitive lands.
- Stacked/nested overlay policy remains defer-only for Phase 3.5.

## Exit Criteria
- [ ] All overlay hardening tests green.
- [ ] E2E focus restoration assertions green.
- [ ] Manual keyboard-only and SR checks complete.
