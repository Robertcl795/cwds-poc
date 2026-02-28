import { describe, expect, it } from 'vitest';

import { bindOverlayDismiss } from './dismiss';
import { createOverlayController } from './overlay-controller';

describe('overlay dismiss interactions', () => {
  it('closes on escape when top-most', () => {
    const overlay = document.createElement('div');
    document.body.append(overlay);

    const controller = createOverlayController({ overlay });
    controller.open();

    const cleanup = bindOverlayDismiss({
      overlay,
      controller
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(controller.isOpen()).toBe(false);
    cleanup();
  });

  it('closes on outside press and ignores inside press', () => {
    const trigger = document.createElement('button');
    const overlay = document.createElement('div');
    const inside = document.createElement('button');
    inside.textContent = 'inside';

    overlay.append(inside);
    document.body.append(trigger, overlay);

    const controller = createOverlayController({ overlay, trigger });
    controller.open();

    const cleanup = bindOverlayDismiss({
      overlay,
      trigger,
      controller,
      closeOnOutsidePress: true
    });

    inside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(controller.isOpen()).toBe(true);

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(controller.isOpen()).toBe(false);
    cleanup();
  });
});
