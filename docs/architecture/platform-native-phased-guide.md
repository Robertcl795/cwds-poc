# Platform-Native Design System Guide (Phased)

This guide updates the Covalent POC direction toward a native-platform-first architecture: semantic HTML, CSS platform features, and isolated JavaScript only where the platform still has real gaps.

## Why This Direction

- Native primitives now cover most interaction needs (`<dialog>`, `popover`, `inert`, native validation).
- CSS can now express complex system behavior (`@layer`, `:has()`, container queries, anchor positioning, `@starting-style`).
- Tokens can be authored and derived directly in CSS (`oklch`, `color-mix`) with fewer build-time dependencies.
- Long-term maintenance risk is lower than dependency-heavy headless stacks.

## Platform Capability Snapshot (Use by Default)

### Structure and interaction

- `<dialog>` for modal/non-modal workflows, Escape handling, and backdrop.
- `popover` for top-layer overlays with light-dismiss.
- `<details>/<summary>` for disclosure patterns.
- Native validation (`required`, `pattern`, `setCustomValidity()`).
- `inert` for temporarily disabling non-active UI regions.

### CSS platform

- `@layer` for predictable cascade and consumer overrides.
- `:has()`, `:is()`, `:where()` to reduce JS state plumbing.
- Anchor positioning for trigger-tethered overlays.
- Container queries for component-level responsiveness.
- `@starting-style` for entry animations from hidden state.
- `oklch` + `color-mix` for token derivation.

## [x] Phase 1 - Foundation Baseline (POC Week 1)

- [x] Define and freeze token architecture (`--cv-ref-*`, `--cv-sys-*`, `--cv-comp-*`).
- [x] Add CSS cascade contract:
  - [x] `@layer tokens, base, components, variants, overrides;`
- [x] Document semantic-first authoring standard:
  - [x] native element first
  - [x] ARIA only when native semantics are insufficient
- [x] Confirm Storybook and UX showcase build from platform-first packages.

### Deliverables

- `packages/tokens` emits consumable CSS variables.
- `packages/styles` enforces token usage and shared layers.
- Architecture docs include platform-first rationale and constraints.

## [x] Phase 2 - Native Primitives First (POC Week 1-2)

- [x] Build primitives around semantic HTML before custom wrappers:
  - [x] button
  - [x] text input
  - [x] form field
  - [x] checkbox
- [x] Use native validation and states rather than custom validation engines.
- [x] Add controller tests that validate behavior contracts and idempotent events.
- [x] Add Storybook stories with accessibility checks enabled by default.
- [x] Add a shared loading primitive (`spinner`) consumable by button and form-field/input.

### Deliverables

- Stable primitive APIs in `packages/components`.
- Headless logic contracts in `packages/core` fully unit tested.
- Shared loading indicator primitive with density support (`sm`, `md`, `lg`) and aria labeling.

## [ ] Phase 3 - Native Overlays and Top-Layer Patterns (POC Week 3)

- [ ] Implement dialog using native `<dialog>` first.
- [ ] Implement dropdown/menu using `popover` first.
- [ ] Use anchor-positioning where browser support is acceptable; provide fallback styles otherwise.
- [ ] Replace legacy z-index stack patterns with top-layer semantics.

### Reference implementation pattern

```css
@layer tokens, base, components, variants, overrides;

[popovertarget] { anchor-name: --dropdown-trigger; }

[popover] {
  position-anchor: --dropdown-trigger;
  top: anchor(bottom);
  left: anchor(left);
}
```

### Deliverables

- `dialog` and `select/dropdown` composites aligned with platform behavior.
- Overlay docs explicitly define top-layer and light-dismiss behavior.

## [ ] Phase 4 - JS-Only-Where-Needed Components (POC Week 4)

- [ ] Keep JS-heavy features isolated and explicit:
  - [ ] combobox/autocomplete
  - [ ] date picker
  - [ ] toast queue management
  - [ ] virtualization
- [ ] Record these as intentional exceptions in architecture docs.
- [ ] Ensure each exception has a strict scope and test matrix.

### Deliverables

- Gap component backlog with owner, scope, and fallback strategy.
- Clear separation between platform-native features and JS exception islands.

## [ ] Phase 5 - Compatibility and Migration Bridge

- [ ] Keep migration wrappers minimal and temporary for phased rollout.
- [ ] Map legacy APIs to semantic/native targets.
- [ ] Use targeted manual migration for this POC cleanup.
- [ ] Add deprecation logging and migration telemetry.

### Deliverables

- Updated mapping matrix in `docs/migration/api-mapping.md`.
- Manual migration checklist for low-risk updates.

## [ ] Phase 6 - Adoption and Governance

- [ ] Publish style override contract for consumers using `@layer overrides`.
- [ ] Publish browser support policy for advanced CSS features.
- [ ] Add release checklist covering accessibility, keyboard flows, visual regression, and migration safety.
- [ ] Define go/no-go gate for 6-month full migration.

### Deliverables

- Versioned authoring conventions.
- Release governance checklist tied to CI quality gates.

## Token Pattern (Pure CSS Derivation)

```css
@layer tokens {
  :root {
    --brand-hue: 250;
    --brand-chroma: 0.18;

    --color-primary: oklch(55% var(--brand-chroma) var(--brand-hue));
    --color-primary-subtle: oklch(92% calc(var(--brand-chroma) * 0.4) var(--brand-hue));
    --color-primary-emphasis: oklch(40% var(--brand-chroma) var(--brand-hue));
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --color-primary: oklch(70% var(--brand-chroma) var(--brand-hue));
    }
  }
}
```

## Native Dialog Pattern (Reference)

```ts
// Keep framework wrapper thin; native dialog owns modal behavior.
// Sync wrapper state to .showModal()/.close() and listen to close events.
```

## Known Gaps (Intentional JS Scope)

- Combobox/autocomplete still requires custom filtering/rendering logic.
- Date picker requires custom UI for consistent styling/UX.
- Toast stack requires queue and placement orchestration.
- Virtualized lists require observer/measurement logic.

## Exit Criteria for This Guide

- [ ] All phases have explicit owners and timelines.
- [ ] Every completed phase checkbox is reflected by code and tests in repo.
- [ ] Consumer teams can override styles without specificity conflicts.
- [ ] Migration can proceed without framework lock-in.
