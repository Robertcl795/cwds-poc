import type { RippleController } from './types';

export function createNoopRippleController(): RippleController {
  return {
    destroy() {
      // no-op
    },
    setDisabled() {
      // no-op
    }
  };
}
