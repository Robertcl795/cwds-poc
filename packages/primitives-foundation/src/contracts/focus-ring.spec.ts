import { describe, expect, it } from 'vitest';

import { applyFocusRing } from './focus-ring';

describe('applyFocusRing', () => {
  it('applies focus ring class and mode', () => {
    const button = document.createElement('button');
    applyFocusRing(button, 'always');

    expect(button.classList.contains('cv-focus-ring')).toBe(true);
    expect(button.dataset.cvFocusRing).toBe('always');
  });
});
