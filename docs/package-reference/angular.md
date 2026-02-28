# @ds/angular

## Purpose and boundary

Angular 19+ adapter layer that maps DS contracts to ergonomic Angular APIs.
Must use signals, typed forms, `inject()`, and remain zoneless-ready.

## Public API surface

- `provideCvAngularAdapter(config)` provider
- `CV_ANGULAR_ADAPTER_CONFIG` injection token
- `CvButtonDirective` and typed adapter contracts

## Usage examples

Vanilla:
```txt
N/A (Angular-only package)
```

Angular 19+:
```ts
bootstrapApplication(AppComponent, {
  providers: [provideCvAngularAdapter({ zoneless: true })]
});
```

## Known POC limitations

- Adapter coverage is narrow (button-focused baseline).
- No adapter-level conformance suite across all primitives yet.

## Future extension points

- Add adapters for form-field, dialog, menu/listbox, and overlays.
- Add typed reactive forms bridges and control-value access patterns.
