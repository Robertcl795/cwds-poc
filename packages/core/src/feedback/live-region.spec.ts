import { describe, expect, it } from 'vitest';

import { createLiveRegion } from './live-region';

describe('createLiveRegion', () => {
  it('creates status region by default', () => {
    const region = createLiveRegion();

    expect(region.element.getAttribute('role')).toBe('status');
    expect(region.element.getAttribute('aria-live')).toBe('polite');

    region.dispose();
  });

  it('announces text updates', async () => {
    const region = createLiveRegion({ priority: 'assertive' });

    region.announce('Deployment failed');
    await Promise.resolve();

    expect(region.element.textContent).toBe('Deployment failed');
    expect(region.element.getAttribute('role')).toBe('alert');

    region.dispose();
  });
});
