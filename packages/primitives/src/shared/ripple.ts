import { createNoopRippleController, type RippleController } from '@ds/headless';
import { applyRipple } from '@ds/utils-a11y';

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
