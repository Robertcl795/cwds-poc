import { describe, expect, it, vi } from 'vitest';

import { createPositioningAdapter } from './positioning';

describe('createPositioningAdapter', () => {
  it('falls back to absolute mode when native support is unavailable', () => {
    const anchor = document.createElement('button');
    const surface = document.createElement('div');

    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue({
      x: 100,
      y: 100,
      width: 80,
      height: 32,
      top: 100,
      left: 100,
      right: 180,
      bottom: 132,
      toJSON: () => ({})
    } as DOMRect);

    vi.spyOn(surface, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 160,
      height: 120,
      top: 0,
      left: 0,
      right: 160,
      bottom: 120,
      toJSON: () => ({})
    } as DOMRect);

    const adapter = createPositioningAdapter({
      anchor,
      surface,
      placement: 'bottom',
      support: {
        dialog: false,
        popover: false,
        anchorPositioning: false,
        inert: false,
        openPseudoClass: false
      }
    });

    adapter.apply();

    expect(adapter.mode).toBe('absolute');
    expect(surface.style.position).toBe('fixed');
    expect(surface.style.top).toBeTruthy();
    expect(surface.style.left).toBeTruthy();

    adapter.cleanup();

    expect(surface.style.position).toBe('');
  });

  it('uses popover-anchor mode when support is available', () => {
    const adapter = createPositioningAdapter({
      anchor: document.createElement('button'),
      surface: document.createElement('div'),
      strategy: 'auto',
      support: {
        dialog: true,
        popover: true,
        anchorPositioning: true,
        inert: true,
        openPseudoClass: true
      }
    });

    expect(adapter.mode).toBe('popover-anchor');
  });
});
