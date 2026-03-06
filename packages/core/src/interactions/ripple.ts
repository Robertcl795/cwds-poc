import { createNoopRippleController } from '../ripple/noop';
import { applyRipple } from '../a11y';
import type { RippleController } from '../ripple/types';

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
