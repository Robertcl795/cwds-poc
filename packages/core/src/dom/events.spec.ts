import { describe, expect, it, vi } from 'vitest';

import { createDisposalBin } from './events';

describe('createDisposalBin', () => {
  it('disposes all listeners once', () => {
    const cleanupOne = vi.fn();
    const cleanupTwo = vi.fn();

    const bin = createDisposalBin();
    bin.add(cleanupOne);
    bin.add(cleanupTwo);

    bin.dispose();
    bin.dispose();

    expect(cleanupOne).toHaveBeenCalledTimes(1);
    expect(cleanupTwo).toHaveBeenCalledTimes(1);
  });
});
