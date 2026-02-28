# Migration Rationale

## Why move away from legacy M2 stack

The previous model mixed Angular components, Lit wrappers, and deprecated Material 2 web components.
That created duplicate behavior logic, higher maintenance cost, and uneven accessibility quality.

## Why now

1. Deprecation pressure is already impacting roadmap predictability.
2. Existing migration work proved core controls can run without `@material/web` runtime.
3. Team maturity (Angular 19+, signals, typing discipline) is strong enough for platform-style ownership.

## Decision

Adopt DS architecture as the default path for all net-new components and all touched legacy components.
Legacy components remain supported only through explicit migration bridge facades.
