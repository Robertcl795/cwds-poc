# Phase 2 Architecture Notes

Phase 2 adds input surfaces and field composition primitives in `@covalent-poc/components`:
- text-field
- chip (action/filter)
- slider
- select (native-first + progressive enhancement)

Key constraints:
- native semantics first
- no framework runtime in core/components
- progressive enhancement must never be required for correctness

## Phase 2.5 hardening additions
- contract normalization around `helperText` / `errorText` aliases
- phase2 hardening story matrices and showcase route
- select enhancement kill switch for failure isolation
