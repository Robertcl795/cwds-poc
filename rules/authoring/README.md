# Authoring Rules

## Component API rules

- Use stable option naming: `tone`, `dense`, `dismissible`, `closeOn*`.
- Keep custom event naming consistent: `cv-<component>-<event>`.
- Preserve `data-*` state hooks for style/test contracts.

## Accessibility rules

- Native semantics first.
- Explicit role/name/linkage rules for overlays and feedback components.
- Visible focus is mandatory.

## Token usage rules

- Prefer component aliases (`--cv-comp-*`) over raw values in component-level styling.
- Reduced motion and forced colors support required for interactive surfaces.

## Story requirements

- Canonical story + state matrix for medium/high-risk components.
- Environment matrix (reduced-motion, forced-colors, enhancement off/on) for high-risk components.
