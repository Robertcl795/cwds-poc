# @ds/angular

Status: `experimental`

## Purpose and boundary

Angular 19+ adapter layer that maps DS contracts to ergonomic Angular APIs.
Must use signals, typed forms, `inject()`, and remain zoneless-ready.

Status: experimental. This package is not part of the production-ready POC surface today.

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
