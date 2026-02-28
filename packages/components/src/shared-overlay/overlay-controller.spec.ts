import { describe, expect, it, vi } from 'vitest';

import { createOverlayController } from './overlay-controller';

describe('overlay controller', () => {
  it('tracks open state and emits changes', () => {
    const overlay = document.createElement('div');
    document.body.append(overlay);

    const onOpenChange = vi.fn();
    const controller = createOverlayController({
      overlay,
      onOpenChange
    });

    controller.open('pointer');
    expect(controller.isOpen()).toBe(true);
    expect(overlay.dataset.open).toBe('true');

    controller.close('keyboard');
    expect(controller.isOpen()).toBe(false);
    expect(overlay.dataset.open).toBe('false');
    expect(onOpenChange).toHaveBeenNthCalledWith(1, true, 'pointer');
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false, 'keyboard');
  });

  it('restores focus to trigger when closed', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'open';
    const overlay = document.createElement('div');
    const inside = document.createElement('button');
    inside.textContent = 'inside';

    overlay.append(inside);
    document.body.append(trigger, overlay);

    trigger.focus();

    const controller = createOverlayController({
      overlay,
      trigger
    });

    controller.open('pointer');
    inside.focus();

    controller.close('programmatic');
    expect(document.activeElement).toBe(trigger);
  });

  it('marks only the last opened overlay as top-most', () => {
    const overlayA = document.createElement('div');
    const overlayB = document.createElement('div');
    document.body.append(overlayA, overlayB);

    const first = createOverlayController({ overlay: overlayA });
    const second = createOverlayController({ overlay: overlayB });

    first.open();
    second.open();

    expect(first.isTopMost()).toBe(false);
    expect(second.isTopMost()).toBe(true);

    second.close();
    expect(first.isTopMost()).toBe(true);
  });
});
