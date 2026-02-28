# Task 1: Package Organization Audit (Executed)

Date: 2026-02-27  
Scope: production package topology, package contracts, coupling boundaries, naming normalization, and barrel strategy.

## 1) Final Package Topology

```text
packages/
  tokens/                 # @ds/tokens
  styles/                 # @ds/styles
  headless/               # @ds/headless
  primitives/             # @ds/primitives
  utils-a11y/             # @ds/utils-a11y (internal)
  utils-icons/            # @ds/utils-icons (internal)
  utils-overlay/          # @ds/utils-overlay (internal)
  migration-bridge/       # @ds/migration-bridge
  adapters/
    angular/              # @ds/angular
    lit/                  # @ds/lit

apps/
  storybook/              # @ds/storybook
  ux-showcase/            # @ds/ux-showcase
```

Rationale for deviations from the original POC plan:

1. `adapters/*` subtree was introduced to make framework adapters explicitly separate from core/primitives.
2. `primitives-foundation` was split into `utils-a11y`, `utils-icons`, and `utils-overlay` to isolate release cadence and ownership.
3. `migration-bridge` was added as a dedicated legacy facade boundary rather than leaking migration APIs into primitives.
4. `showcase` was renamed to `ux-showcase` to clarify stakeholder demo intent.

## 2) Package Mission + I/O Contracts

| Package | Mission (one line) | Consumes | Exposes |
|---|---|---|---|
| `@ds/tokens` | Own the semantic token contract for the system. | Token source files + naming conventions. | `tokens.css` token variables and token artifacts. |
| `@ds/styles` | Implement visual styles exclusively from DS tokens + semantic states. | `@ds/tokens` CSS variables and semantic state attributes. | `index.css` and themed style layers. |
| `@ds/headless` | Provide framework-agnostic interaction/state controllers. | DOM APIs, APG interaction rules. | Controllers, infra services, event/interaction types. |
| `@ds/primitives` | Compose native HTML primitives/composites using headless behavior. | `@ds/headless`, internal utility packages. | `createPrimitive*` / `createComposite*` APIs and typed options. |
| `@ds/angular` | Deliver Angular 19+ ergonomics over DS primitives/headless. | `@ds/primitives`, `@ds/headless`, Angular runtime. | Standalone directives/providers, typed adapter contracts. |
| `@ds/lit` | Deliver custom-element adapters for framework-agnostic consumption. | `@ds/primitives`, `@ds/headless` (behavioral imports via primitives). | `define*` registration functions and custom elements. |
| `@ds/migration-bridge` | Provide compatibility facades for staged legacy migration. | `@ds/primitives`, `@ds/angular`, `@ds/lit`. | Legacy-shaped wrapper APIs and migration shims. |
| `@ds/utils-a11y` | Internal focus/ripple/elevation behavior utilities. | `@ds/headless` low-level interaction helpers. | Internal utility functions for primitives and test apps. |
| `@ds/utils-icons` | Internal icon registry and icon node factory. | Trusted icon definitions. | Registry APIs (`register`, `create`, `clear`). |
| `@ds/utils-overlay` | Internal overlay mechanics package boundary (placement/dismiss/focus infra). | `@ds/headless`, DOM APIs. | Overlay utilities for future extraction from primitives. |

## 3) Coupling Violations and Fixes

| Finding | Severity | Evidence | Why it is a violation | Recommended fix |
|---|---|---|---|---|
| Internal utility packages consumed by app shells | Medium | `apps/storybook`, `apps/ux-showcase` depend on `@ds/utils-a11y` / `@ds/utils-icons` | Utilities are internal domains; external consumers should not couple to them. | Keep usage only in internal demo/testing apps. For product apps, expose required behavior via `@ds/primitives` or adapter APIs. |
| `@ds/utils-a11y` depends on `@ds/headless` | Low | `packages/utils-a11y/src/contracts/*.ts` imports from `@ds/headless` | Utility layer is not purely foundational; it sits above headless. | Accept for now (no cycle). In v1 hardening, either: move ripple/focus-visible helpers into `@ds/headless`, or make `utils-a11y` DOM-only. |
| `@ds/migration-bridge` currently placeholder-only | Medium | `packages/migration-bridge/src/index.ts` exports empty module | Bridge exists structurally but not functionally yet. | Add first legacy facades for top migrated components and lock deprecation semantics per adapter. |

## 4) Naming Normalization (`@ds/*`)

All packages are now normalized to the final schema:

- `@ds/tokens`, `@ds/styles`, `@ds/headless`, `@ds/primitives`
- `@ds/utils-a11y`, `@ds/utils-icons`, `@ds/utils-overlay`
- `@ds/angular`, `@ds/lit`, `@ds/migration-bridge`
- `@ds/storybook`, `@ds/ux-showcase`

Legacy `@covalent-poc/*` names and old folder paths (`core`, `components`, `web-components`, `primitives-foundation`, `apps/showcase`) have been removed from active package/config wiring.

## 5) Barrel (`index.ts`) Strategy

<details>
<summary>Public vs Internal export policy by package</summary>

### `@ds/headless`
- Public: controllers, infra services, behavior types needed by adapters/primitives.
- Internal: DOM helper implementation details that do not define stable contracts.

### `@ds/primitives`
- Public: `createPrimitive*` / `createComposite*` and their option/result types.
- Internal: `shared*` implementation folders and orchestration helpers.

### `@ds/angular`
- Public: standalone directives/components, provider factories, typed forms/signal-facing APIs.
- Internal: host wiring and effect glue not intended as stable extension points.

### `@ds/lit`
- Public: element registration helpers and stable element classes.
- Internal: form-association and interaction plumbing helpers.

### `@ds/tokens` and `@ds/styles`
- Public: explicit CSS entrypoints only.
- Internal: generation details and historical phase artifacts.

### `@ds/utils-*`
- Public (workspace-internal): domain utility contracts used by primitives/adapters/tests.
- Internal (consumer-hidden): helpers that are not part of the DS product surface.

### `@ds/migration-bridge`
- Public: intentionally versioned legacy facades.
- Internal: adapter routing and migration telemetry internals.

</details>

## 6) Execution Notes

Completed in this task execution:

1. Workspace and package rename consolidation (`@ds/*`) across package manifests and app manifests.
2. Directory topology finalized (`headless`, `primitives`, `adapters/{angular,lit}`, `ux-showcase`).
3. Utility split wiring completed (`utils-a11y`, `utils-icons`, `utils-overlay`) including build/test config.
4. Storybook/Vite alias maps and TS path maps fixed for new topology.
5. Verification completed:
   - `pnpm -r --if-present typecheck` ✅
   - `pnpm -r --if-present test` ✅
   - `pnpm -r --if-present build` ✅
   - `pnpm -r --if-present lint` ✅
