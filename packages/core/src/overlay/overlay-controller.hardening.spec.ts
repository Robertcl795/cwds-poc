import { describe, expect, it } from 'vitest';

import { createOverlayController } from './overlay-controller';

describe('overlay controller hardening', () => {
  it('does not throw when restoration target is removed before close', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'open';

    const overlay = document.createElement('div');
    document.body.append(trigger, overlay);

    const controller = createOverlayController({
      overlay,
      trigger
    });

    trigger.focus();
    controller.open('pointer');

    trigger.remove();

    expect(() => controller.close('programmatic')).not.toThrow();
  });

  it('does not allow non-top overlay to close a top overlay through outside dismiss flows', () => {
    const overlayA = document.createElement('div');
    const overlayB = document.createElement('div');
    document.body.append(overlayA, overlayB);

    const first = createOverlayController({ overlay: overlayA });
    const second = createOverlayController({ overlay: overlayB });

    first.open();
    second.open();

    expect(first.isTopMost()).toBe(false);
    expect(second.isTopMost()).toBe(true);

    first.close('pointer');

    expect(second.isOpen()).toBe(true);
    expect(second.isTopMost()).toBe(true);
  });
});
