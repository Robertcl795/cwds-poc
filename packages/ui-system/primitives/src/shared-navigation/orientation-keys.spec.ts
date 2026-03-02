import { describe, expect, it } from 'vitest';

import { resolveOrientationNavigationIntent } from './orientation-keys';

describe('orientation key mapping', () => {
  it('maps horizontal keys', () => {
    expect(resolveOrientationNavigationIntent('ArrowRight', 'horizontal')).toBe('next');
    expect(resolveOrientationNavigationIntent('ArrowLeft', 'horizontal')).toBe('prev');
    expect(resolveOrientationNavigationIntent('ArrowDown', 'horizontal')).toBeNull();
  });

  it('maps vertical keys', () => {
    expect(resolveOrientationNavigationIntent('ArrowDown', 'vertical')).toBe('next');
    expect(resolveOrientationNavigationIntent('ArrowUp', 'vertical')).toBe('prev');
    expect(resolveOrientationNavigationIntent('ArrowRight', 'vertical')).toBeNull();
  });

  it('maps home and end for both orientations', () => {
    expect(resolveOrientationNavigationIntent('Home', 'horizontal')).toBe('first');
    expect(resolveOrientationNavigationIntent('End', 'vertical')).toBe('last');
  });
});
