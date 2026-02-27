import { describe, expect, it, vi } from 'vitest';

import { createButtonController } from './button';

describe('button controller', () => {
  it('fires onPress for pointer and activation keys', () => {
    const onPress = vi.fn();
    const controller = createButtonController({ onPress });

    controller.onClick(new MouseEvent('click'));
    controller.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));
    controller.onKeyDown(new KeyboardEvent('keydown', { key: ' ' }));
    controller.onKeyDown(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(onPress).toHaveBeenCalledTimes(3);
    expect(onPress).toHaveBeenNthCalledWith(1, 'pointer', expect.any(MouseEvent));
    expect(onPress).toHaveBeenNthCalledWith(2, 'keyboard', expect.any(KeyboardEvent));
    expect(onPress).toHaveBeenNthCalledWith(3, 'keyboard', expect.any(KeyboardEvent));
  });

  it('does not fire when disabled', () => {
    const onPress = vi.fn();
    const controller = createButtonController({ onPress, disabled: true });

    controller.onClick(new MouseEvent('click'));
    controller.onKeyDown(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(controller.getA11yProps()).toEqual({
      type: 'button',
      disabled: true,
      'aria-disabled': true
    });
    expect(onPress).not.toHaveBeenCalled();
  });
});
