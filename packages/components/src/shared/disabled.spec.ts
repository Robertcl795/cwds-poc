import { describe, expect, it } from 'vitest';

import { resolveDisabledState } from './disabled';

describe('resolveDisabledState', () => {
  it('maps loading to native disabled', () => {
    const state = resolveDisabledState({ loading: true });

    expect(state.native).toBe(true);
    expect(state.aria).toBe(true);
  });
});
