import { describe, expect, it, vi } from 'vitest';

import { createSelectController } from './select';

describe('select controller', () => {
  it('initializes to the first enabled option when value is missing', () => {
    const controller = createSelectController({
      options: [
        { id: 'archived', label: 'Archived', value: 'archived', disabled: true },
        { id: 'active', label: 'Active', value: 'active' },
        { id: 'pending', label: 'Pending', value: 'pending' }
      ]
    });

    expect(controller.getActiveIndex()).toBe(1);
    expect(controller.getSelectedValue()).toBe('active');
  });

  it('supports wraparound navigation while skipping disabled options', () => {
    const controller = createSelectController({
      value: 'pending',
      options: [
        { id: 'active', label: 'Active', value: 'active' },
        { id: 'archived', label: 'Archived', value: 'archived', disabled: true },
        { id: 'pending', label: 'Pending', value: 'pending' }
      ]
    });

    controller.moveActive(1);
    expect(controller.getActiveIndex()).toBe(0);

    controller.moveActive(-1);
    expect(controller.getActiveIndex()).toBe(2);
  });

  it('emits value changes only when selection changes', () => {
    const onValueChange = vi.fn();
    const controller = createSelectController({
      value: 'active',
      options: [
        { id: 'active', label: 'Active', value: 'active' },
        { id: 'pending', label: 'Pending', value: 'pending' }
      ],
      onValueChange
    });

    controller.selectByIndex(0, 'keyboard');
    controller.selectByIndex(1, 'keyboard');

    expect(controller.getSelectedValue()).toBe('pending');
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('pending', 'keyboard');
  });

  it('handles all-disabled options safely', () => {
    const controller = createSelectController({
      options: [
        { id: 'one', label: 'One', value: 'one', disabled: true },
        { id: 'two', label: 'Two', value: 'two', disabled: true }
      ]
    });

    expect(controller.getActiveIndex()).toBe(-1);
    expect(controller.getSelectedValue()).toBe('');

    controller.moveActive(1);
    controller.selectByIndex(0, 'pointer');

    expect(controller.getActiveIndex()).toBe(-1);
    expect(controller.getSelectedValue()).toBe('');
  });
});
