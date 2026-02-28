# Task 4: Stakeholder Presentation Guide

Date: 2026-02-28  
Audience: engineering leadership, design leadership, product stakeholders, platform governance  
Target length: 30 minutes (20 min presentation + 10 min decision Q&A)

## Presentation Objective

Secure a **go** decision to treat the POC as the production foundation for migration from legacy Material 2-era component stacks.

## Narrative Arc

1. The current mixed stack is expensive and risky to sustain.
2. The team has built a viable architecture foundation in 4 weeks.
3. Accessibility and framework portability are now first-class concerns.
4. Migration can be done in controlled phases with measurable outcomes.
5. A clear resource ask and go/no-go gate is defined.

---

## Slide 1 - The Problem We're Solving

### Content outline

- Legacy UI stack combines three paradigms:
  - Angular components
  - Lit/custom element wrappers
  - Deprecated Material 2 web component patterns
- Impact today:
  - duplicated behavior logic across stacks
  - inconsistent accessibility quality
  - framework coupling and migration friction
- Risk of continuing as-is:
  - rising maintenance load per feature
  - slower release velocity due to compatibility fixes
  - compounding accessibility debt and deprecation risk

### Speaker notes (2-4 sentences)

We are paying a tax for each component change because behavior is implemented in multiple places. The mixed stack hides risk until late QA, especially around keyboard behavior and focus management. Every quarter we defer migration, we increase rewrite cost and reduce roadmap predictability. This program is a risk-reduction initiative as much as a UI modernization initiative.

### Recommended visual aid

- Visual: stacked bar chart showing defect/maintenance effort split by stack type (Angular/Lit/legacy M2)
- Backup visual: architecture debt heatmap (component count x stack type)

---

## Slide 2 - Our Philosophy

### Content outline

- Native HTML first for semantics and browser leverage
- Headless behavior + token-driven visuals
- Framework-agnostic core with Angular-optimized adapter
- Explicit influence set:
  - Radix UI
  - Headless UI
  - Shoelace
  - Adobe Spectrum
  - Covalent (Teradata)

### Speaker notes (2-4 sentences)

We intentionally decouple behavior from rendering and styling from behavior. This keeps the system portable and lowers framework lock-in risk while preserving design consistency through tokens. Angular remains a first-class citizen through a dedicated adapter, not an afterthought wrapper. The goal is Covalent-level system discipline, not a one-off component rewrite.

### Recommended visual aid

- Visual: principle wheel with five principles and one anti-goal ring ("no framework lock-in")

---

## Slide 3 - Architecture Overview

### Content outline

- Layered architecture:
  - `@ds/tokens` -> `@ds/styles` -> `@ds/headless` -> `@ds/primitives` -> adapters (`@ds/angular`, `@ds/lit`) -> consuming apps
- Clear separation of concerns:
  - state/interaction in headless layer
  - semantic composition in primitives
  - framework ergonomics in adapters
- What is intentionally absent:
  - no Material Web runtime dependency
  - no single-framework lock-in

### Speaker notes (2-4 sentences)

This architecture gives us a stable behavioral core and multiple delivery adapters without behavior drift. The migration cost shifts from repeated rewrites to controlled adapter work and token governance. The absence of Material runtime dependencies is deliberate and removes a major long-term external constraint. The design also supports future adapters, including React, without recoding behavior contracts.

### Recommended visual aid

- Visual: layered dependency diagram (left-to-right)
- Optional diagram snippet (for slide build):

```mermaid
flowchart LR
  T[@ds/tokens] --> S[@ds/styles]
  H[@ds/headless] --> P[@ds/primitives]
  T --> P
  S --> P
  P --> A[@ds/angular]
  P --> L[@ds/lit]
  A --> C[Consumer Apps]
  L --> C
```

---

## Slide 4 - What We Built in 4 Weeks

### Content outline

- Package inventory delivered:
  - 10 DS packages + 2 apps (`@ds/storybook`, `@ds/ux-showcase`)
- Core component scope delivered:
  - button
  - text input + form-field
  - checkbox + switch
  - dialog
  - menu/listbox/select patterns
  - overlay + focus infrastructure
- Delivery evidence:
  - 40 Storybook stories
  - 50 unit spec files
  - 7 Playwright E2E specs
  - workspace build/typecheck/test/lint all green

### Speaker notes (2-4 sentences)

This is not a toy prototype; it is already package-structured and test-backed. We validated the architecture with real components and shared interaction infrastructure instead of isolated demos. The test and story footprint gives us a measurable baseline for scaling. The next phase is hardening and migration throughput, not starting architecture from zero.

### Recommended visual aid

- Visual: package map + KPI tiles (stories/tests/e2e/CI status)

---

## Slide 5 - Accessibility Is a First-Class Citizen

### Content outline

- Accessibility decisions already embodied in contracts:
  - roving tabindex patterns for composite navigation
  - deterministic focus restoration for dialog/overlay close
  - keyboard interaction handling (Escape, Arrow keys, Enter/Space)
  - semantic roles in composites (e.g., tablist/tab/tabpanel)
- Current state:
  - a11y addon is integrated in Storybook
  - keyboard-focused unit tests exist for core composites
- Known gap:
  - canonical per-component WCAG matrix and external audit are not complete

### Speaker notes (2-4 sentences)

Accessibility moved upstream into component contract design instead of downstream QA patching. We have real keyboard and focus behavior tests proving this direction. The remaining work is formalizing coverage and adding external validation before full migration scale. This is a manageable hardening gap, not a foundational gap.

### Recommended visual aid

- Visual: WCAG checklist table (Implemented / In progress / Missing)
- Optional: screenshot of Storybook a11y panel plus keyboard test summary

---

## Slide 6 - Live Demo Flows

### Content outline

1. Form interaction flow:
  - text input + checkbox + validation states
  - show semantic error/help wiring and keyboard behavior
2. Dialog/overlay flow:
  - open dialog
  - trap/contain focus while open
  - close via action/Escape
  - restore focus to trigger
3. Theme switching flow:
  - token swap (light/dark or brand variant)
  - verify component visual consistency without behavior changes

### Speaker notes (2-4 sentences)

This demo sequence is designed to prove interaction reliability, not just visual polish. Each flow should emphasize contract behavior that historically regressed in the mixed stack. Keep the demo deterministic and rehearse fallback clips in case of runtime issues. End by showing that theme changes do not require component logic changes.

### Recommended visual aid

- Visual: live demo (primary) + backup recorded clips + flow checklist overlay

---

## Slide 7 - Migration Realism

### Content outline

- Planning assumption (explicit): legacy library scope is ~60 components (mixed Angular + Lit + M2-era wrappers)
- Six-month phased migration plan:
  - Month 1: API freeze, token finalization, CI hardening
  - Months 2-3: top 10 high-usage components + migration bridge v0
  - Months 4-5: remaining high-value component groups + adapter parity
  - Month 6: stabilization, deprecations, rollout gates
- Effort model (T-shirt sizing by category) + risks/mitigations

### Speaker notes (2-4 sentences)

We are not proposing a big-bang rewrite. The plan prioritizes highest-usage components and migration bridge compatibility to protect delivery timelines. The estimate is intentionally explicit about assumptions so we can re-baseline with real inventory data in week one. This gives leadership a realistic path to value with controlled risk.

### Recommended visual aid

- Visual: high-level Gantt + effort table

Effort breakdown (initial):

| Category | Example components | Estimated count | Size | Notes |
|---|---|---:|---|---|
| Base controls | button, checkbox, switch, input | 12 | S-M | Mostly adapter and API hardening |
| Selection/composites | select, menu, listbox, tabs | 14 | M-L | Higher keyboard/overlay complexity |
| Overlay surfaces | dialog, tooltip, snackbar, context menu | 10 | M-L | Focus and dismissal behavior critical |
| Enterprise composites | data-heavy interaction patterns | 12 | L | Requires product-team pairing |
| Utility/foundation surfaces | icons, form infra, bridge facades | 12 | M | Enables migration throughput |

Risks and mitigations:

| Risk | Impact | Mitigation |
|---|---|---|
| Adapter parity lags primitives | Migration stalls for Angular apps | Prioritize Angular adapter sprint in months 2-3 |
| Migration bridge remains placeholder | Teams cannot incrementally adopt | Ship bridge v0 with top legacy facades first |
| Accessibility gaps discovered late | Rework and delayed rollout | Enforce keyboard + a11y gates in CI and Storybook |

---

## Slide 8 - What "Done" Looks Like

### Content outline

- Definition of done for migration program:
  - top 10 most-used legacy components migrated and adopted
  - bridge facades available for legacy compatibility during transition
  - public API stability policy documented and enforced
  - accessibility and keyboard gates active in CI
- Success metrics (proposed targets):
  - bundle size for migrated surfaces reduced by >=20%
  - critical accessibility violations in canonical stories = 0
  - DS adoption in >=3 production apps by end of month 6
  - legacy component API surface reduced by >=30%

### Speaker notes (2-4 sentences)

Done is defined by measurable platform outcomes, not by number of rewritten files. These metrics align engineering effort to reliability, performance, and adoption. If we hit these targets, we have evidence that the system is ready for broad product use. If we miss them, we pause rollout and resolve gaps before expanding scope.

### Recommended visual aid

- Visual: KPI scorecard (baseline vs target vs current)

---

## Slide 9 - Team Ask

### Content outline

- Required capacity (6-month program):
  - 2 DS core engineers (headless/primitives)
  - 1 Angular adapter engineer
  - 1 design systems engineer (tokens/styles/docs)
  - 0.5 QA automation (a11y + visual regression)
  - 0.5 Design lead (token governance + component review)
- Tooling ask:
  - visual regression service (Chromatic or Percy)
  - docs hosting pipeline (VitePress + CI publish)
  - changeset/release automation hardening
- Go/no-go decision criteria:
  - **Go** if adapter parity + bridge v0 + a11y gates are funded
  - **No-go** if program is treated as side-project without dedicated ownership

### Speaker notes (2-4 sentences)

The main risk is under-resourcing a platform initiative and expecting product-level outcomes. This ask is intentionally lean but dedicated enough to sustain migration velocity and quality gates. The go/no-go criteria prevent ambiguous commitment and reduce delivery thrash. Leadership should decide based on whether they want controlled migration now or higher-risk migration debt later.

### Recommended visual aid

- Visual: resource table + go/no-go decision matrix

---

## Presenter Prep Checklist

1. Pre-record backup clips for all 3 demo flows.
2. Bring baseline metrics for one candidate production app (bundle, a11y, defect rate).
3. Confirm top-10 legacy component usage ranking before the meeting.
4. Align Design + Engineering speakers on token and accessibility narrative.
5. End with explicit decision request and next-step date.
