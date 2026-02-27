# Foundation Security Checklist

- [ ] no `innerHTML` with untrusted input
- [ ] icon registry only accepts trusted pre-validated icon definitions
- [ ] icon names validated by strict allowlist
- [ ] no dynamic script/style injection in core utilities
- [ ] event listeners are cleaned up to avoid unbounded growth
- [ ] ripple wave count is capped per host
- [ ] trusted/untrusted boundaries documented for consumer integration
