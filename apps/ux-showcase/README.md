# @ds/ux-showcase

Purpose: route-based integration demo for the CSS-first design system.

What belongs here:
- realistic composition demos
- lightweight integration routes
- end-to-end validation targets

Entry points:
- `pnpm --filter @ds/ux-showcase dev`
- `pnpm --filter @ds/ux-showcase build`
- `pnpm --filter @ds/ux-showcase test:e2e`

Usage:
```bash
pnpm --filter @ds/ux-showcase dev
```

Styling note:
- showcase routes should rely on package styles and only add route-level layout styling where needed.

Migration note:
- this app exists to validate the replacement system, not to preserve legacy Material Web demos.
