import { describe, expect, it } from 'vitest';

import { createPrimitiveRadio } from './radio/create-radio';

describe('radio primitive', () => {
  it('creates semantic radio input', () => {
    const radio = createPrimitiveRadio({
      id: 'priority-high',
      name: 'priority',
      value: 'high',
      label: 'High'
    });

    const input = radio.querySelector<HTMLInputElement>('input[type="radio"]');
    expect(input?.name).toBe('priority');
    expect(input?.value).toBe('high');
    expect(radio.dataset.checked).toBe('false');
  });
});
