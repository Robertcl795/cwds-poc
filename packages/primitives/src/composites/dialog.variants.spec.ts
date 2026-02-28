import { describe, expect, it } from 'vitest';

import { createAlertDialog, createDestructiveConfirmDialog } from './dialog-variants';

describe('dialog variants', () => {
  it('creates alert dialog without cancel action', () => {
    const dialog = createAlertDialog({
      title: 'Alert',
      description: 'Acknowledge this warning.'
    });

    expect(dialog.dataset.variant).toBe('alert');
    expect(dialog.getAttribute('role')).toBe('alertdialog');
    expect(dialog.querySelectorAll('button').length).toBe(1);
  });

  it('creates destructive variant with default delete label', () => {
    const dialog = createDestructiveConfirmDialog({
      title: 'Delete build',
      description: 'This cannot be undone.'
    });

    expect(dialog.dataset.variant).toBe('destructive-confirm');
    expect(dialog.textContent).toContain('Delete');
  });
});
