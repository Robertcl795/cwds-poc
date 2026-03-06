import { applyRipple, createNoopRippleController, type RippleController } from '@ds/core';

export type OptionalRippleOptions = {
  enabled?: boolean;
};

export function attachOptionalRipple(
  host: HTMLElement,
  options: OptionalRippleOptions = {}
): RippleController {
  if (options.enabled === false) {
    host.dataset.cvRipple = 'off';
    return createNoopRippleController();
  }

  return applyRipple(host, {
    enabled: true,
    styleMutation: 'allow',
    centeredOnKeyboard: true
  });
}
