import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveChip } from './create-chip';

describe('chip hardening', () => {
  it('does not invoke action chip onPress while disabled', () => {
    const onPress = vi.fn();
    const chip = createPrimitiveChip({
      variant: 'action',
      label: 'Deploy',
      disabled: true,
      onPress
    });

    chip.button?.click();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reports keyboard source for filter chip toggles', () => {
    const onSelectedChange = vi.fn();
    const chip = createPrimitiveChip({
      variant: 'filter',
      id: 'phase25-filter',
      name: 'phase25-filter',
      label: 'Stable',
      onSelectedChange
    });

    const input = chip.input;
    if (!input) {
      throw new Error('Expected filter chip input');
    }

    input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(onSelectedChange).toHaveBeenCalledWith(true, 'keyboard');
  });
});
