import { describe, expect, it, vi } from 'vitest';

import { createCheckboxController } from './checkbox';

describe('checkbox controller', () => {
  it('emits changes with source and supports toggle', () => {
    const onCheckedChange = vi.fn();
    const controller = createCheckboxController({ onCheckedChange });

    expect(controller.isChecked()).toBe(false);

    controller.toggle('keyboard');
    expect(controller.isChecked()).toBe(true);

    controller.setChecked(false, 'pointer');
    expect(controller.isChecked()).toBe(false);

    expect(onCheckedChange).toHaveBeenNthCalledWith(1, true, 'keyboard');
    expect(onCheckedChange).toHaveBeenNthCalledWith(2, false, 'pointer');
  });

  it('does not emit when disabled or unchanged', () => {
    const onCheckedChange = vi.fn();
    const disabledController = createCheckboxController({ checked: true, disabled: true, onCheckedChange });

    disabledController.setChecked(false, 'pointer');
    expect(disabledController.isChecked()).toBe(true);

    const enabledController = createCheckboxController({ checked: true, onCheckedChange });
    enabledController.setChecked(true, 'programmatic');

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
