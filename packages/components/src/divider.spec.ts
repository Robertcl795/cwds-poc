import { describe, expect, it } from 'vitest';

import { createPrimitiveDivider } from './divider/create-divider';

describe('divider primitive', () => {
  it('creates decorative horizontal divider by default', () => {
    const divider = createPrimitiveDivider();

    expect(divider.tagName).toBe('HR');
    expect(divider.getAttribute('aria-hidden')).toBe('true');
    expect(divider.dataset.orientation).toBe('horizontal');
  });

  it('creates semantic vertical divider', () => {
    const divider = createPrimitiveDivider({
      orientation: 'vertical',
      decorative: false
    });

    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    expect(divider.hasAttribute('aria-hidden')).toBe(false);
  });
});
