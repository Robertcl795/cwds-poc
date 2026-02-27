import { describe, expect, it } from 'vitest';

import { createCompositeSelect } from './select';

describe('composite select', () => {
  it('keeps the selected value in a data attribute', () => {
    const select = createCompositeSelect({
      id: 'priority',
      name: 'priority',
      options: [
        { id: 'low', label: 'Low', value: 'low' },
        { id: 'high', label: 'High', value: 'high' }
      ]
    });

    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));

    expect(select.dataset.value).toBe('high');
  });
});
