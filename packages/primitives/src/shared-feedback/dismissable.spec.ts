import { describe, expect, it, vi } from 'vitest';

import { createDismissableController } from './dismissable';

describe('createDismissableController', () => {
  it('notifies listeners once with reason', () => {
    const dismissable = createDismissableController();
    const listener = vi.fn();

    dismissable.onDismiss(listener);

    expect(dismissable.dismiss('timeout')).toBe(true);
    expect(dismissable.dismiss('programmatic')).toBe(false);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('timeout');
  });

  it('resets dismissal state', () => {
    const dismissable = createDismissableController();

    dismissable.dismiss('escape');
    expect(dismissable.isDismissed()).toBe(true);

    dismissable.reset();

    expect(dismissable.isDismissed()).toBe(false);
    expect(dismissable.reason()).toBeNull();
  });
});
