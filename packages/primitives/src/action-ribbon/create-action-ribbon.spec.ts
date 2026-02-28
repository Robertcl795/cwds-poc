import { describe, expect, it, vi } from 'vitest';

import { createActionRibbon } from './create-action-ribbon';

describe('createActionRibbon', () => {
  it('renders status text with selection summary', () => {
    const ribbon = createActionRibbon({
      message: 'Items ready for approval',
      selectionCount: 3
    });

    expect(ribbon.element.textContent).toContain('3 selected');
  });

  it('dispatches action callbacks', () => {
    const onAction = vi.fn();
    const ribbon = createActionRibbon({
      message: 'Review changes',
      onAction,
      actions: [{ id: 'approve', label: 'Approve', kind: 'primary' }]
    });

    const actionButton = ribbon.element.querySelector<HTMLButtonElement>('[data-ribbon-action="approve"]');
    actionButton?.click();

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('supports dismissal', () => {
    const onDismiss = vi.fn();
    const ribbon = createActionRibbon({
      message: 'Unsaved changes',
      dismissible: true,
      onDismiss
    });

    ribbon.dismiss('programmatic');

    expect(ribbon.element.hidden).toBe(true);
    expect(onDismiss).toHaveBeenCalledWith('programmatic');
  });
});
