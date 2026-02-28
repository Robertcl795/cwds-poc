# Phase 3.5 Overlay Security Checklist

## Content Safety
- [ ] No untrusted `innerHTML` in dialog/list/tabs/menu content.
- [ ] Label/content APIs use text nodes or trusted elements only.

## Event Safety
- [ ] Escape dismiss only affects top-most intended overlay.
- [ ] Outside click logic verifies target containment.
- [ ] Disabled controls cannot trigger actions by pointer or keyboard.

## Focus Safety
- [ ] Focus restoration validates connected and focusable target.
- [ ] No focus restoration to hidden/disconnected elements.

## CSP + Mutation Safety
- [ ] No inline script handlers.
- [ ] Overlay behavior remains correct if DOM mutates between open and close.

## Tests
- [ ] Include regression test for removed trigger before close.
- [ ] Include regression test for disabled activation bypass attempt.
