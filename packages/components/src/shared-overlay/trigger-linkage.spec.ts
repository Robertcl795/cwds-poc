import { describe, expect, it } from 'vitest';

import { linkTriggerToOverlay } from './trigger-linkage';

describe('trigger linkage', () => {
  it('links trigger and overlay with ARIA attributes', () => {
    const trigger = document.createElement('button');
    const overlay = document.createElement('div');

    const link = linkTriggerToOverlay(trigger, overlay, 'menu');

    expect(trigger.getAttribute('aria-controls')).toBe(link.overlayId);
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    link.syncExpanded(true);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('restores original trigger attributes on destroy', () => {
    const trigger = document.createElement('button');
    const overlay = document.createElement('div');

    trigger.setAttribute('aria-controls', 'legacy-controls');
    trigger.setAttribute('aria-expanded', 'mixed');
    trigger.setAttribute('aria-haspopup', 'listbox');

    const link = linkTriggerToOverlay(trigger, overlay, 'dialog');
    link.destroy();

    expect(trigger.getAttribute('aria-controls')).toBe('legacy-controls');
    expect(trigger.getAttribute('aria-expanded')).toBe('mixed');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });
});
