# Phase 0 Foundation Architecture

## Scope

Phase 0 defines shared primitives and contracts only:

- layered tokens (`ref`, `sys`, `comp`, `state`)
- core DOM helpers (feature detection, environment flags, keyboard/focus helpers)
- foundation primitives (`focus-ring`, `elevation`, `icon`, `ripple`)
- testing/compliance/security baseline

## Non-goals

- no framework adapters in this phase
- no component-specific behavior beyond foundation contracts

## Package boundaries

- `@covalent-poc/tokens`: source of truth + generated artifacts
- `@covalent-poc/core`: runtime behavior utilities
- `@covalent-poc/primitives-foundation`: host contracts and safe APIs
- `@covalent-poc/styles`: visual implementation for foundation contracts
- `@covalent-poc/testing`: shared test helpers for CI
