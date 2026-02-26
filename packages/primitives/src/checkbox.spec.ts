import { describe, expect, it } from 'vitest';

import { createPrimitiveCheckbox } from './checkbox';

describe('checkbox primitive', () => {
  it('supports indeterminate state and clears marker on change', () => {
    const checkbox = createPrimitiveCheckbox({
      id: 'partial',
      name: 'partial',
      label: 'Partially selected',
      indeterminate: true
    });

    const input = checkbox.querySelector<HTMLInputElement>('input');
    expect(input?.indeterminate).toBe(true);
    expect(checkbox.dataset.indeterminate).toBe('true');

    if (!input) {
      throw new Error('missing checkbox input');
    }

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(checkbox.dataset.indeterminate).toBe('false');
  });

  it('supports reduced touch target density mode', () => {
    const checkbox = createPrimitiveCheckbox({
      id: 'dense',
      name: 'dense',
      label: 'Compact mode',
      reducedTouchTarget: true
    });

    expect(checkbox.dataset.reducedTouchTarget).toBe('true');
  });
});
