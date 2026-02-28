import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createContextMenu } from './create-context-menu';

describe('createContextMenu', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('opens on contextmenu event and focuses first enabled item', () => {
    const target = document.createElement('div');
    target.tabIndex = 0;
    document.body.append(target);

    const menu = createContextMenu({
      target,
      items: [
        { id: 'open', label: 'Open' },
        { id: 'disabled', label: 'Disabled', disabled: true }
      ]
    });

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 48, clientY: 72 }));

    expect(menu.element.dataset.open).toBe('true');
    expect(document.activeElement?.textContent).toBe('Open');

    menu.destroy();
  });

  it('does not emit action for disabled items', () => {
    const target = document.createElement('div');
    document.body.append(target);
    const onAction = vi.fn();

    const menu = createContextMenu({
      target,
      onAction,
      items: [{ id: 'disabled', label: 'Disabled', disabled: true }]
    });

    menu.openAt(12, 12, 'programmatic');
    const disabledItem = menu.element.querySelector('button');
    disabledItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onAction).not.toHaveBeenCalled();

    menu.destroy();
  });

  it('supports keyboard context menu invocation', () => {
    const target = document.createElement('button');
    document.body.append(target);

    const menu = createContextMenu({
      target,
      items: [{ id: 'rename', label: 'Rename' }]
    });

    target.dispatchEvent(new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true }));

    expect(menu.element.dataset.open).toBe('true');

    menu.destroy();
  });

  it('renders labels and separators as non-action rows', () => {
    const target = document.createElement('button');
    document.body.append(target);

    const menu = createContextMenu({
      target,
      items: [
        { type: 'label', id: 'context', label: 'Deployment actions' },
        { id: 'retry', label: 'Retry' },
        { type: 'separator', id: 'sep-1' },
        { id: 'delete', label: 'Delete', kind: 'danger' }
      ]
    });

    menu.openAt(10, 10);

    expect(menu.element.querySelectorAll('.cv-context-menu__label').length).toBe(1);
    expect(menu.element.querySelectorAll('[role="separator"]').length).toBe(1);
    expect(menu.element.querySelectorAll('button[role="menuitem"]').length).toBe(2);

    menu.destroy();
  });
});
