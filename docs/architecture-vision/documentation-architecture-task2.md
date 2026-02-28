# Task 2: Documentation Architecture (Executed)

Date: 2026-02-28  
Goal: reorganize documentation into two canonical tracks with production-ready contributor/consumer guidance.

## 1) Recommended `docs/` Tree

```text
docs/
  README.md
  architecture-vision/                   # Track A (WHY + WHAT)
    README.md
    system-philosophy.md
    migration-rationale.md
    token-system-design-decisions.md
    accessibility-authoring-principles.md
    framework-agnostic-contracts.md
    documentation-architecture-task2.md
  package-reference/                     # Track B (HOW)
    README.md
    tokens.md
    styles.md
    headless.md
    primitives.md
    angular.md
    lit.md
    migration-bridge.md
    utils-a11y.md
    utils-icons.md
    utils-overlay.md
```

## 2) Doc Inventory (Filename, Track, Audience, Description)

<details>
<summary>Canonical Track Files</summary>

| Filename | Track | Audience | Description |
|---|---|---|---|
| `docs/README.md` | A+B | Contributor + Consumer | Defines the two-track doc model.<br>Sets canonical entrypoints and reading order.<br>Marks non-track docs as historical/non-authoritative. |
| `docs/architecture-vision/README.md` | A | Contributor + Consumer | Index for architecture/vision narratives.<br>Points to required decision docs.<br>Acts as the source-of-truth TOC for Track A. |
| `docs/architecture-vision/system-philosophy.md` | A | Contributor | States headless-first + native HTML + token-driven position.<br>Documents non-negotiable architectural principles.<br>Defines explicit non-goals to prevent scope drift. |
| `docs/architecture-vision/migration-rationale.md` | A | Stakeholder + Contributor | Explains why deprecated M2 stack is being replaced now.<br>Connects migration urgency to engineering risk/cost.<br>Defines adoption decision for net-new and touched components. |
| `docs/architecture-vision/token-system-design-decisions.md` | A | Designer + Contributor | Defines reference/system/component token layering.<br>Documents enforcement rules for token usage.<br>Calls out token pipeline gaps that block scale. |
| `docs/architecture-vision/accessibility-authoring-principles.md` | A | Contributor | Sets WCAG 2.1 AA/APG baseline and authoring rules.<br>Defines keyboard/focus/a11y naming requirements.<br>Records current POC constraints and audit gaps. |
| `docs/architecture-vision/framework-agnostic-contracts.md` | A | Contributor | Defines `headless -> primitives -> adapters` boundaries.<br>Documents forbidden dependency directions.<br>Captures Angular 19+ adapter constraints (signals/typed forms/zoneless). |
| `docs/architecture-vision/documentation-architecture-task2.md` | A | Contributor + Stakeholder | Captures Task 2 structure and rationale.<br>Inventories canonical files by audience and purpose.<br>Flags missing/misleading documentation risks. |
| `docs/package-reference/README.md` | B | Consumer + Contributor | Entrypoint for package-level usage docs.<br>Separates core, adapters, and internal utility references.<br>Clarifies internal-only packages. |
| `docs/package-reference/tokens.md` | B | Consumer | Defines token package scope and import contract.<br>Shows vanilla and Angular style inclusion patterns.<br>Identifies token typing and linting gaps. |
| `docs/package-reference/styles.md` | B | Consumer | Documents style-layer boundaries and CSS entrypoints.<br>Shows consumption from vanilla and Angular apps.<br>Calls out missing stylelint/token enforcement. |
| `docs/package-reference/headless.md` | B | Contributor | Documents framework-agnostic controller surface.<br>Provides adapter-consumption guidance.<br>Flags export stability and contract testing needs. |
| `docs/package-reference/primitives.md` | B | Consumer + Contributor | Defines primary DS runtime API surface.<br>Shows vanilla usage and Angular adapter preference.<br>Notes export-hardening and maturity labeling gaps. |
| `docs/package-reference/angular.md` | B | Angular Consumer + Contributor | Documents Angular 19+ adapter APIs and boundaries.<br>Shows provider-based bootstrap usage.<br>Calls out missing adapter coverage/conformance suite. |
| `docs/package-reference/lit.md` | B | Consumer + Contributor | Documents custom-element adapter surface.<br>Shows registration flow for host apps.<br>Identifies phase-4 scope and test depth gaps. |
| `docs/package-reference/migration-bridge.md` | B | Consumer + Migration Owner | Defines migration facade intent and boundary.<br>States current placeholder status explicitly.<br>Sets expected deprecation/telemetry extension path. |
| `docs/package-reference/utils-a11y.md` | B | Contributor | Marks package as workspace-internal utility.<br>Lists current APIs used by primitives/adapters.<br>Highlights layering decision still to be finalized. |
| `docs/package-reference/utils-icons.md` | B | Contributor | Marks package as workspace-internal utility.<br>Documents icon registry and icon node contracts.<br>Calls out global-registry and lazy-loading gaps. |
| `docs/package-reference/utils-overlay.md` | B | Contributor | Defines planned boundary for overlay extraction.<br>States package is currently placeholder-only.<br>Documents expected future contracts and tests. |

</details>

## 3) Tooling Recommendation

Recommended: **VitePress with Markdown-in-repo**.

Trade-off rationale:

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| Plain Markdown only | Lowest setup cost, zero infra changes | Weak nav/search/versioning; hard to scale contributor onboarding | Not sufficient beyond POC |
| Astro docs | Strong flexibility and design control | Higher implementation/maintenance overhead | Overkill for current DS maturity |
| VitePress | Fast setup, excellent nav/search, versioning-friendly, MD-native | Theming is less flexible than Astro by default | **Choose this now** |

Implementation guidance:

1. Keep docs source in this repo (same PR as code changes).
2. Generate docs site in CI on merge to main.
3. Add docs lint/check links gate for any public API change in `@ds/*` packages.

## 4) Missing or Misleading Documentation (Blockers)

| Area | Severity | Status | Why this misleads contributors | Action |
|---|---|---|---|---|
| Legacy phase docs currently outnumber canonical docs | High | Resolved | New contributors may follow outdated phase guidance instead of final architecture | Removed legacy phase/history docs from repository and retained only canonical Track A/B docs. |
| Migration bridge docs describe intent but package is placeholder-only | High | Open | Consumers may assume migration facade exists and plan against non-existent APIs | Add explicit "Not Implemented" status badge and target milestone in package docs. |
| Adapter docs are thin compared to Angular 19+ standards | High | Open | Teams can miss constraints for signals, typed forms, zoneless and `OnPush` behavior | Add adapter conformance guide + examples for typed reactive form controls. |
| API stability levels are undocumented | Medium | Open | Consumers cannot assess risk of using specific exports | Add `stable/experimental/internal` tags per package export list. |
| Accessibility docs lack component-by-component keyboard matrices | Medium | Open | Teams may overestimate WCAG/APG readiness | Link each package doc to concrete keyboard and axe coverage matrix. |

## 5) Execution Notes

Completed in this task execution:

1. Created canonical Track A and Track B directory structure.
2. Added foundational Track A strategy docs.
3. Added package-level reference docs for all current `@ds/*` packages.
4. Added documentation architecture inventory, tooling recommendation, and blocker analysis.
5. Removed legacy phase/history docs so only canonical Track A/B docs remain.
