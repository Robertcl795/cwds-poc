# CSS-First Refactor Audit

Date: 2026-03-06

## Current architecture summary

- `design-core`
  - `@ds/tokens`: reference, semantic, component, and theme token layers.
  - `@ds/styles`: reset, theme, utilities, primitive styles, composite styles, adapter hooks.
  - `@ds/core`: framework-agnostic behavior and interaction controllers.
  - `@ds/utils-a11y`, `@ds/utils-icons`: workspace-internal helpers.
- `ui-system`
  - `@ds/primitives`: native HTML-first factories and composites.
  - `@ds/web-components`: behavior-heavy custom elements for combobox/select patterns.
  - `@ds/angular`: experimental adapter stub.
- apps
  - `@ds/storybook`: living component contract.
  - `@ds/ux-showcase`: route-based integration demo.

## Implemented component inventory

- Foundations
  - tokens
  - global styles
  - focus ring
  - ripple
  - elevation
  - icons
- Primitives and composites
  - button
  - icon button
  - text input
  - text field
  - select
  - checkbox
  - radio
  - switch
  - slider
  - chip
  - progress
  - loading indicator
  - divider
  - list
  - tabs
  - dialog
  - tooltip
  - context menu
  - card
  - toolbar
  - alert
  - snackbar
  - action ribbon
- Web components
  - `cv-combobox`
  - `cv-advanced-select`

## Package ownership

| Package | Owns |
| --- | --- |
| `@ds/tokens` | palette, semantic tokens, component override tokens |
| `@ds/styles` | global CSS layering and branded component styling |
| `@ds/core` | interaction state, feature detection, overlay and focus infrastructure |
| `@ds/utils-a11y` | focus/ripple/elevation helpers over the core contracts |
| `@ds/utils-icons` | icon registration and DOM creation |
| `@ds/primitives` | semantic DOM factories and composite assembly |
| `@ds/web-components` | custom elements where reusable behavior/API packaging adds value |
| `@ds/angular` | experimental adapter stub only |

## Story, test, and docs coverage

- Stories exist for all current primitives/composites plus token/foundation views and web component adapters.
- Unit and hardening tests exist for the core interactive surfaces and shared helpers.
- Docs are organized into architecture, package reference, and release-readiness tracks.

## Material Web and Lit usage

- `@material/web`: no runtime dependency or imports remain.
- `lit`: no runtime dependency or imports remain.
- Remaining migration context is documentation-only.

## Duplicate, deprecated, or obsolete content

- Removed
  - root `Presentation.md` duplicate
  - committed `apps/storybook/storybook-static` build output
  - deprecated `definePhase4WebComponents` export
  - `docs/package-reference/lit.md` in favor of `web-components.md`
  - non-applicable historical docs in `docs/release-readiness/Presentation.md` and `docs/release-readiness/monorepo-foundation-refactor-plan.md`
- Retained intentionally
  - `@ds/angular` as an experimental stub, clearly marked non-production
  - `@ds/styles/foundation.css` and `@ds/styles/components.css` compatibility entrypoints

## Quick wins already identified

- Modernize tokens to OKLCH/light-dark without changing component contracts.
- Rename Storybook taxonomy from migration-era labels to current architecture labels.
- Remove generated and duplicate docs/build artifacts.
- Clarify adapter status so the production-ready path is `tokens -> styles -> primitives -> web-components`.

## Target CSS layering model

1. `tokens`
   - reference, semantic, and component tokens.
2. `base`
   - reset, theme, typography, global selection/focus defaults.
3. `foundation`
   - shared utilities such as focus ring, elevation, ripple, icons.
4. `components`
   - primitive and composite class styling.
5. `adapters`
   - host hooks for custom elements and wrapper surfaces.
6. `overrides`
   - consumer or app-specific adjustments outside the package.

## Current token file structure

- `packages/design-core/tokens/src/reference.css`
  - palette scales, typography, spacing, radii, motion, elevation references
- `packages/design-core/tokens/src/semantic.css`
  - light/dark semantic tokens and tone-specific surface/border/text roles
- `packages/design-core/tokens/src/components.css`
  - component-scoped token hooks consumed by `@ds/styles`
- `packages/design-core/tokens/src/theme.css`
  - `data-theme` color-scheme overrides
- `packages/design-core/tokens/src/tokens.css`
  - canonical import that establishes layer order and imports the token slices

## Migration matrix

| Legacy intent | Current replacement | Runtime model |
| --- | --- | --- |
| Material button | `createPrimitiveButton()` / `.cv-button` | native `<button>` + CSS |
| Material icon button | `createPrimitiveIconButton()` | native `<button>` + CSS |
| Material text field | `createPrimitiveTextField()` | native `<input>` + CSS |
| Material select | `createPrimitiveSelect()` | native `<select>` + CSS |
| Search/select combo | `cv-combobox` | custom element for behavior-heavy interaction |
| Advanced searchable select | `cv-advanced-select` | custom element wrapper over combobox |
| Material checkbox/radio/switch | primitive factories | native form controls + CSS |
| Material dialog | `createCompositeDialog()` | native `<dialog>` + minimal behavior |
| Material menu/tooltip | primitive composites | minimal JS for overlays/focus |
| Material card/chip/tabs/snackbar | primitive factories/composites | semantic DOM + CSS |

## Current file -> target file map

| Current | Target |
| --- | --- |
| `packages/design-core/tokens/src/tokens.css` | keep as canonical token entrypoint |
| `packages/design-core/tokens/src/reference.css` | canonical reference token slice |
| `packages/design-core/tokens/src/semantic.css` | canonical semantic token slice |
| `packages/design-core/tokens/src/components.css` | canonical component token slice |
| `packages/design-core/tokens/src/theme.css` | canonical theme override slice |
| `packages/design-core/styles/src/foundation/*` | keep as canonical base/foundation layer |
| `packages/design-core/styles/src/components/*` | keep as canonical component layer |
| `docs/package-reference/lit.md` | `docs/package-reference/web-components.md` |
| `apps/storybook/storybook-static` | removed, generated only |
| root `Presentation.md` | removed |

## Minimum viable migration path

- Keep the current package topology.
- Treat primitives as the production runtime surface.
- Use web components only for the small set of behavior-heavy controls.
- Keep Angular out of the production-ready promise until it has real coverage and dependency wiring.
- Continue removing migration-era wording and deprecated aliases rather than introducing another compatibility layer.
