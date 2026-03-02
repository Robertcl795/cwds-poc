import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveAlert } from './create-alert';

describe('createPrimitiveAlert', () => {
  it('uses assertive role for error tone by default', () => {
    const alert = createPrimitiveAlert({
      tone: 'error',
      message: 'Failed to deploy.'
    });

    expect(alert.element.getAttribute('role')).toBe('alert');
    expect(alert.element.getAttribute('aria-live')).toBe('assertive');
  });

  it('dispatches action callbacks', () => {
    const onAction = vi.fn();
    const alert = createPrimitiveAlert({
      message: 'Updated',
      actions: [{ id: 'undo', label: 'Undo', dismissOnAction: true }],
      onAction
    });

    const button = alert.element.querySelector<HTMLButtonElement>('[data-alert-action="undo"]');
    button?.click();

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('hides when dismissed', () => {
    const onDismiss = vi.fn();
    const alert = createPrimitiveAlert({
      message: 'Saved',
      dismissible: true,
      onDismiss
    });

    alert.dismiss('programmatic');

    expect(alert.element.hidden).toBe(true);
    expect(onDismiss).toHaveBeenCalledWith('programmatic');
  });
});
