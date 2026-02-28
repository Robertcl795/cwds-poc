import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveToolbar } from './create-toolbar';

describe('createPrimitiveToolbar', () => {
  it('renders title and action buttons', () => {
    const toolbar = createPrimitiveToolbar({
      title: 'Release actions',
      actions: [
        { id: 'refresh', label: 'Refresh' },
        { id: 'publish', label: 'Publish', kind: 'primary' }
      ]
    });

    expect(toolbar.element.querySelector('.cv-toolbar__title-text')?.textContent).toBe('Release actions');
    expect(toolbar.element.querySelectorAll('button').length).toBe(2);
  });

  it('routes overflow actions through context menu', () => {
    const onAction = vi.fn();
    const toolbar = createPrimitiveToolbar({
      onAction,
      maxVisibleActions: 1,
      actions: [
        { id: 'refresh', label: 'Refresh' },
        { id: 'archive', label: 'Archive' }
      ]
    });

    const overflowTrigger = toolbar.element.querySelector<HTMLButtonElement>('[data-toolbar-overflow="true"]');
    expect(overflowTrigger).toBeTruthy();

    overflowTrigger?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 20, clientY: 20 }));

    const menuItem = toolbar.overflowMenu?.element.querySelector<HTMLButtonElement>('button');
    menuItem?.click();

    expect(onAction).toHaveBeenCalledTimes(1);
    toolbar.destroy();
  });
});
