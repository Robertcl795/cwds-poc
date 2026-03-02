import { afterEach, describe, expect, it, vi } from 'vitest';

import { detectOverlayFeatureSupport } from './popover-support';

type CssSupportsLike = {
  supports: (condition: string) => boolean;
};

const originalCss = globalThis.CSS as CssSupportsLike | undefined;
const writeCss = (value: CssSupportsLike | undefined): void => {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    writable: true,
    value
  });
};

afterEach(() => {
  writeCss(originalCss);
});

describe('overlay feature detection', () => {
  it('returns conservative defaults when CSS.supports is unavailable', () => {
    writeCss(undefined);

    const support = detectOverlayFeatureSupport();

    expect(support.anchorPositioning).toBe(false);
    expect(support.openPseudoClass).toBe(false);
  });

  it('reads CSS.supports for anchor positioning and :open selector', () => {
    const supports = vi.fn((condition: string) => condition === 'anchor-name: --cv-anchor' || condition === 'selector(:open)');
    writeCss({
      supports
    });

    const support = detectOverlayFeatureSupport();

    expect(support.anchorPositioning).toBe(true);
    expect(support.openPseudoClass).toBe(true);
  });
});
