import { describe, expect, it } from 'vitest';

import { getEnvironmentFlags } from './environment';

describe('getEnvironmentFlags', () => {
  it('falls back when matchMedia is not available', () => {
    const mockWindow = {
      matchMedia: undefined
    } as unknown as Window;

    expect(getEnvironmentFlags(mockWindow)).toEqual({
      reducedMotion: false,
      forcedColors: false
    });
  });
});
