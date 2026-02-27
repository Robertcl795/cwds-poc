import { attachRipple, createNoopRippleController, type RippleController } from '@covalent-poc/core';

import type { RippleContractOptions } from '../types';

export function applyRipple(host: HTMLElement, options: RippleContractOptions = {}): RippleController {
  if (options.enabled === false || host.dataset.cvRipple === 'off') {
    return createNoopRippleController();
  }

  host.dataset.cvRipple = 'on';
  return attachRipple(host, options);
}
