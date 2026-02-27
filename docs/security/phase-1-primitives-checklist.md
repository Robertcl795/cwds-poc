# Phase 1 Primitives Security Checklist

- [ ] no `innerHTML` with untrusted content
- [ ] icon-button uses trusted icon registry inputs only
- [ ] disabled/loading states block activation handlers
- [ ] no inline script/event handler patterns
- [ ] no untrusted dynamic selector construction
- [ ] all event listeners are bounded/cleanup-safe
