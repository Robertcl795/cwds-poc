# Material Web Migration Guide

## Scope

This workspace no longer ships Material Web runtime dependencies.
Migration work should move usage to the native-first design system packages listed below.

## Replacement map

| Material-era intent | Use now | Notes |
| --- | --- | --- |
| Button | `createPrimitiveButton()` or `.cv-button` | keep native `<button>` semantics |
| Icon button | `createPrimitiveIconButton()` | use button semantics with icon-only labeling |
| Text field | `createPrimitiveTextField()` | uses native `<input>` plus form-field shell |
| Select | `createPrimitiveSelect()` | prefer native `<select>` for standard forms |
| Searchable select | `cv-combobox` / `cv-advanced-select` | only when native select is insufficient |
| Checkbox / radio / switch | primitive factories | stay native wherever possible |
| Dialog | `createCompositeDialog()` | based on native `<dialog>` |
| Menu / tooltip | primitive composites | minimal overlay behavior only |
| Card / chip / tabs / snackbar | primitive factories/composites | semantic DOM + tokenized CSS |

## Selection rules

- Prefer plain semantic HTML plus `@ds/tokens` and `@ds/styles` when behavior is already native.
- Use `@ds/primitives` when you want factory-generated DOM with the supported design-system contract.
- Use `@ds/web-components` only for behavior-heavy controls that justify a custom element wrapper.

## Styling model

- Import `@ds/tokens/tokens.css` first.
- Import `@ds/styles/index.css` for the branded layer.
- Use semantic and component tokens instead of hardcoded values.

## API notes

- `definePhase4WebComponents()` has been removed.
- Use `defineCvWebComponents()` instead.
- Angular support remains experimental and is not part of the production-ready migration path today.
