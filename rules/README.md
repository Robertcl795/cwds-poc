# Rules

This directory is the governance source-of-truth for the design system foundation refactor.

Structure:
- `architecture/`: package boundaries, import layering, ADRs.
- `authoring/`: component API, accessibility, token usage, story requirements.
- `testing/`: risk-tier testing expectations and quality gates.
- `release/`: hardening checklists and release-readiness templates.
- `contribution/`: PR slicing, deprecation workflow, and contribution standards.

Runtime packages must not import from `rules/`.
