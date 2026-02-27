# Token Naming Standard

## Grammar

`<layer>.<category>.<role>[.<variant>][.<state>]`

Examples:

- `ref.color.gray.50`
- `sys.color.primary`
- `comp.focus-ring.color`
- `state.interaction.pressed-opacity`

## Rules

- `ref` tokens never alias other layers.
- `sys` aliases `ref` only.
- `comp` aliases `sys` first; direct `ref` only when semantically justified.
- `state` aliases `sys`/`ref`, never component-specific aliases.
- every token must include `$description`.
