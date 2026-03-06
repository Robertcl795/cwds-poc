import { syncFieldState, type FieldLikeControl, type FieldStateOverrides } from './field-state';

export type AdditionalFieldState = {
  enhanced?: boolean;
  open?: boolean;
};

export function syncFieldDataState(
  host: HTMLElement,
  control: FieldLikeControl,
  overrides: FieldStateOverrides = {},
  extra: AdditionalFieldState = {}
): void {
  syncFieldState(host, control, overrides);

  if (extra.enhanced !== undefined) {
    host.dataset.enhanced = extra.enhanced ? 'true' : 'false';
  }

  if (extra.open !== undefined) {
    host.dataset.open = extra.open ? 'true' : 'false';
  }
}
