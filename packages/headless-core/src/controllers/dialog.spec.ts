import { describe, expect, it, vi } from 'vitest';

import { createDialogController } from './dialog';

describe('dialog controller', () => {
  it('tracks open state and emits changes', () => {
    const onOpenChange = vi.fn();
    const dialog = createDialogController({ onOpenChange });

    dialog.open('keyboard');
    expect(dialog.isOpen()).toBe(true);

    dialog.close('pointer');
    expect(dialog.isOpen()).toBe(false);

    expect(onOpenChange).toHaveBeenNthCalledWith(1, true, 'keyboard');
    expect(onOpenChange).toHaveBeenNthCalledWith(2, false, 'pointer');
  });

  it('does not emit when state does not change', () => {
    const onOpenChange = vi.fn();
    const dialog = createDialogController({ defaultOpen: false, onOpenChange });

    dialog.close('programmatic');
    dialog.open('pointer');
    dialog.open('keyboard');

    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(true, 'pointer');
  });
});
