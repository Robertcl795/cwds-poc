import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveChip } from './create-chip';

describe('chip primitive', () => {
  it('renders action chip as native button', () => {
    const pressed = vi.fn();
    const chip = createPrimitiveChip({
      variant: 'action',
      label: 'Deploy',
      iconStart: '🚀',
      onPress: pressed
    });

    expect(chip.button?.tagName).toBe('BUTTON');
    chip.button?.click();
    expect(pressed).toHaveBeenCalledTimes(1);
  });

  it('renders filter chip as native checkbox and updates selected state', () => {
    const changed = vi.fn();
    const chip = createPrimitiveChip({
      variant: 'filter',
      id: 'chip-a',
      name: 'chips',
      value: 'a',
      label: 'Stable',
      selected: false,
      onSelectedChange: changed
    });

    const input = chip.input;
    expect(input?.type).toBe('checkbox');
    expect(chip.element.dataset.selected).toBe('false');

    if (!input) {
      throw new Error('Expected input chip control');
    }

    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(changed).toHaveBeenCalledWith(true, 'programmatic');
    expect(chip.element.dataset.selected).toBe('true');
  });
});
