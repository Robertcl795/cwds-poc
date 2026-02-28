import { describe, expect, it } from 'vitest';

import { bindOverlayDismiss } from './dismiss';
import { createOverlayController } from './overlay-controller';

describe('overlay dismiss hardening', () => {
  it('does not close when escape is pressed for a non-top overlay', () => {
    const overlayA = document.createElement('div');
    const overlayB = document.createElement('div');

    document.body.append(overlayA, overlayB);

    const first = createOverlayController({ overlay: overlayA });
    const second = createOverlayController({ overlay: overlayB });

    first.open();
    second.open();

    const cleanup = bindOverlayDismiss({
      overlay: overlayA,
      controller: first
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(first.isOpen()).toBe(true);
    expect(second.isOpen()).toBe(true);

    cleanup();
  });

  it('respects closeOnFocusOutside policy', () => {
    const overlay = document.createElement('div');
    const trigger = document.createElement('button');
    const outside = document.createElement('button');

    document.body.append(trigger, overlay, outside);

    const controller = createOverlayController({ overlay, trigger });
    controller.open();

    const cleanup = bindOverlayDismiss({
      overlay,
      controller,
      trigger,
      closeOnFocusOutside: true
    });

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(controller.isOpen()).toBe(false);
    cleanup();
  });
});
