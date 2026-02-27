import { describe, expect, it } from 'vitest';

import { syncFieldState } from './field-state';

describe('shared-field state sync', () => {
  it('reflects disabled, readonly, filled, and invalid states', () => {
    const host = document.createElement('div');
    const input = document.createElement('input');
    input.value = 'hello';
    input.readOnly = true;
    input.disabled = true;

    syncFieldState(host, input, { invalid: true });

    expect(host.dataset.disabled).toBe('true');
    expect(host.dataset.readOnly).toBe('true');
    expect(host.dataset.filled).toBe('true');
    expect(host.dataset.invalid).toBe('true');
  });
});
