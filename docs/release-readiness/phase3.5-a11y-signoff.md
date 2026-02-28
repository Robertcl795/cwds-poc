# Phase 3.5 Accessibility Signoff

## Automated Checks
- [ ] `vitest` interaction/a11y suite (including hardening specs)
- [ ] axe validation in Storybook hardening stories
- [ ] showcase E2E keyboard smoke

## Manual SR Checklist
### Tabs
- [ ] Tablist, tab, and tabpanel announcements are correct.
- [ ] Arrow movement does not force selection in manual mode.
- [ ] Enter/Space selection updates panel announcement.

### Dialog
- [ ] Title and description are announced on open.
- [ ] Escape policy matches configured behavior.
- [ ] Focus returns to trigger or valid fallback on close.

### List (action variant)
- [ ] Interactive items are announced correctly as links/buttons.
- [ ] Disabled actions are announced and non-activatable.

### Menu / FAB
- [ ] Pending primitive implementation in this workspace.

## Environment Coverage
- [ ] Reduced motion
- [ ] Forced colors/high contrast
- [ ] Enhancements disabled baseline (if applicable)
