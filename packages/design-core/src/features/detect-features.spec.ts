import { describe, expect, it } from 'vitest';

import { detectFeatures } from './detect-features';

describe('detectFeatures', () => {
  it('returns supported booleans', () => {
    const flags = detectFeatures(window);
    expect(typeof flags.focusVisible).toBe('boolean');
    expect(typeof flags.overflowClip).toBe('boolean');
    expect(typeof flags.cssHas).toBe('boolean');
  });
});
