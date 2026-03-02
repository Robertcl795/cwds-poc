# Enterprise Component Hardening Checklists

## Contract checklist

- Naming consistency (`tone`, `dense`, `dismissible`, `closeOn*`)
- Event payload shape consistency
- `data-*` hook consistency
- Trigger/surface aria linkage consistency
- Token alias usage (`--cv-comp-*`)

## Accessibility checklist

- Correct role + live-region policy
- Focus visible at all interactive points
- Keyboard parity with pointer interactions
- Dialog/menu/tooltip focus and dismissal correctness

## Visual checklist

- Density parity
- Tone/status parity
- Forced-colors and reduced-motion behavior
- Focus/ripple/elevation layering

## Security checklist

- No unsafe HTML injection for dynamic content
- Disabled states prevent activation
- Focus restoration avoids disconnected targets
- Overlay dismiss handling cannot be bypassed
