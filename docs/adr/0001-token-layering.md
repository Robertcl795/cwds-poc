# ADR 0001: Token Layering

## Decision

Use three token layers:

1. `--cv-ref-*` reference tokens
2. `--cv-sys-*` semantic tokens
3. `--cv-comp-*` component tokens

## Context

This structure enables design consistency and long-term migration flexibility while keeping CSS runtime framework-agnostic.
