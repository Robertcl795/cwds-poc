import { createDisposalBin, listen, type RippleController } from '@covalent-poc/core';

import { attachOptionalRipple } from './ripple';

export type PressSource = 'pointer' | 'keyboard' | 'programmatic';

export type PressableOptions = {
  disabled?: () => boolean;
  ripple?: boolean;
  onPressSourceChange?: (source: PressSource) => void;
};

export type PressableController = {
  getLastSource: () => PressSource;
  destroy: () => void;
};

export function enhancePressable(host: HTMLElement, options: PressableOptions = {}): PressableController {
  const cleanup = createDisposalBin();
  const isDisabled = options.disabled ?? (() => false);
  let lastSource: PressSource = 'programmatic';
  let rippleController: RippleController | null = null;

  const setPressed = (pressed: boolean): void => {
    host.dataset.pressed = pressed ? 'true' : 'false';
  };

  const setSource = (source: PressSource): void => {
    lastSource = source;
    options.onPressSourceChange?.(source);
  };

  if (options.ripple !== false) {
    rippleController = attachOptionalRipple(host, {
      enabled: !isDisabled()
    });
  }

  cleanup.add(
    listen(host, 'pointerdown', (event) => {
      if (event.button !== 0 || isDisabled()) {
        return;
      }

      setSource('pointer');
      setPressed(true);
    })
  );
  cleanup.add(listen(host, 'pointerup', () => setPressed(false)));
  cleanup.add(listen(host, 'pointercancel', () => setPressed(false)));
  cleanup.add(
    listen(host, 'keydown', (event) => {
      if (isDisabled()) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        setSource('keyboard');
        setPressed(true);
      }
    })
  );
  cleanup.add(
    listen(host, 'keyup', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        setPressed(false);
      }
    })
  );
  cleanup.add(listen(host, 'blur', () => setPressed(false)));

  return {
    getLastSource: () => lastSource,
    destroy() {
      cleanup.dispose();
      rippleController?.destroy();
      host.dataset.pressed = 'false';
    }
  };
}
