# @ds/utils-icons

## Purpose and boundary

Workspace-internal icon registry and DOM icon node factory.
Not intended as a stable public API for product teams.

## Public API surface

- `registerIcons`, `createIconNode`, `clearIconRegistry`
- `IconDefinition` type

## Usage examples

Vanilla:
```ts
registerIcons({ check: { viewBox: '0 0 24 24', paths: ['M4 12l5 5 11-11'] } });
```

Angular 19+:
```ts
// Register via bootstrap initializer in adapter package later.
```

## Known POC limitations

- Global registry strategy is process-wide and simplistic.
- No lazy icon loading strategy yet.

## Future extension points

- Add namespace support and async icon loaders.
- Add trusted-source policy validation hooks.
