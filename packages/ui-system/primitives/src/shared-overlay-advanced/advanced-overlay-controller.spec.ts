import { describe, expect, it } from 'vitest';

import { createAdvancedOverlayController } from './advanced-overlay-controller';

describe('createAdvancedOverlayController', () => {
  it('syncs trigger aria linkage for menu/listbox roles', () => {
    const trigger = document.createElement('button');
    const overlay = document.createElement('div');
    overlay.id = 'menu-surface';

    const controller = createAdvancedOverlayController({
      overlay,
      trigger,
      role: 'menu'
    });

    controller.open('pointer');

    expect(trigger.getAttribute('aria-controls')).toBe('menu-surface');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');

    controller.close('pointer');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    controller.dispose();
  });

  it('restores focus to trigger when closing non-tooltip overlays', () => {
    const trigger = document.createElement('button');
    const overlay = document.createElement('div');
    const child = document.createElement('button');
    overlay.append(child);

    document.body.append(trigger, overlay);
    trigger.focus();

    const controller = createAdvancedOverlayController({
      overlay,
      trigger,
      role: 'menu'
    });

    controller.open('programmatic');
    child.focus();
    controller.close('programmatic');

    expect(document.activeElement).toBe(trigger);
    controller.dispose();
  });
});
