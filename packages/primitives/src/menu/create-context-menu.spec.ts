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

  it('supports click trigger mode with toggle behavior', () => {
    const target = document.createElement('button');
    document.body.append(target);

    const menu = createContextMenu({
      target,
      triggerMode: 'click',
      items: [{ id: 'rename', label: 'Rename' }]
    });

    target.click();
    expect(menu.element.dataset.open).toBe('true');

    target.click();
    expect(menu.element.dataset.open).toBe('false');

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

  it('dismisses on outside press and Escape', () => {
    const target = document.createElement('button');
    document.body.append(target);

    const menu = createContextMenu({
      target,
      items: [{ id: 'retry', label: 'Retry' }]
    });

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 32, clientY: 32 }));
    expect(menu.element.dataset.open).toBe('true');

    const outsidePressEvent =
      typeof PointerEvent === 'function'
        ? new PointerEvent('pointerdown', { bubbles: true })
        : new MouseEvent('pointerdown', { bubbles: true });
    document.body.dispatchEvent(outsidePressEvent);
    expect(menu.element.dataset.open).toBe('false');

    target.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 40, clientY: 40 }));
    expect(menu.element.dataset.open).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(menu.element.dataset.open).toBe('false');

    menu.destroy();
  });

  it('supports icons and control states', () => {
    const target = document.createElement('button');
    document.body.append(target);
    const onAction = vi.fn();

    const menu = createContextMenu({
      target,
      triggerMode: 'click',
      onAction,
      items: [
        { id: 'compact', label: 'Compact rows', control: 'checkbox', checked: false, iconStart: '☰' },
        { id: 'alpha', label: 'Sort by alpha', control: 'radio', group: 'sort', checked: true },
        { id: 'recent', label: 'Sort by recent', control: 'radio', group: 'sort', checked: false }
      ]
    });

    target.click();

    const buttons = menu.element.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0]?.getAttribute('role')).toBe('menuitemcheckbox');
    expect(buttons[0]?.getAttribute('aria-checked')).toBe('false');
    expect(buttons[0]?.querySelector('.cv-context-menu__item-icon--start')).toBeTruthy();

    buttons[0]?.click();
    expect(buttons[0]?.getAttribute('aria-checked')).toBe('true');

    target.click();
    const refreshedButtons = menu.element.querySelectorAll<HTMLButtonElement>('button');
    refreshedButtons[2]?.click();
    expect(refreshedButtons[1]?.getAttribute('aria-checked')).toBe('false');
    expect(refreshedButtons[2]?.getAttribute('aria-checked')).toBe('true');
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ id: 'recent', checked: true }), 'pointer');

    menu.destroy();
  });
});
