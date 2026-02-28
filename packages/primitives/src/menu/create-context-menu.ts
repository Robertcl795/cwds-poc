import type { InputSource } from '@ds/headless';

import { createAdvancedOverlayController } from '../shared-overlay-advanced';
import type {
  ContextMenuActionItem,
  ContextMenuItem,
  PrimitiveContextMenu,
  PrimitiveContextMenuOptions
} from './context-menu.types';

let contextMenuSequence = 0;

const nextContextMenuId = (): string => {
  contextMenuSequence += 1;
  return `cv-context-menu-${contextMenuSequence}`;
};

const isActivationKey = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

const isNavigationKey = (event: KeyboardEvent): boolean =>
  event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End';

const isContextMenuKey = (event: KeyboardEvent): boolean =>
  event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');

const isActionItem = (item: ContextMenuItem): item is ContextMenuActionItem => item.type === undefined || item.type === 'item';

const focusIndex = (items: HTMLButtonElement[], index: number): void => {
  const enabled = items.filter((button) => !button.disabled);
  if (enabled.length === 0) {
    return;
  }

  enabled[index]?.focus();
};

export const createContextMenu = (options: PrimitiveContextMenuOptions): PrimitiveContextMenu => {
  const menu = document.createElement('div');
  menu.className = 'cv-context-menu';
  menu.id = options.id ?? nextContextMenuId();
  menu.role = 'menu';
  menu.tabIndex = -1;
  menu.hidden = true;
  menu.dataset.open = 'false';

  if (options.ariaLabel) {
    menu.setAttribute('aria-label', options.ariaLabel);
  }

  const actionButtons: HTMLButtonElement[] = [];
  const itemsByButton = new Map<HTMLButtonElement, ContextMenuActionItem>();

  const focusFirstEnabled = (): void => {
    focusIndex(actionButtons, 0);
  };

  const focusByOffset = (offset: number): void => {
    const enabled = actionButtons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

    const current = document.activeElement;
    const currentIndex = current instanceof HTMLButtonElement ? enabled.indexOf(current) : -1;
    const nextIndex = ((currentIndex + offset) % enabled.length + enabled.length) % enabled.length;
    enabled[nextIndex]?.focus();
  };

  const focusBoundary = (toEnd: boolean): void => {
    const enabled = actionButtons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

    enabled[toEnd ? enabled.length - 1 : 0]?.focus();
  };

  const controller = createAdvancedOverlayController({
    overlay: menu,
    trigger: options.target,
    role: 'menu',
    enablePositioning: false,
    dismiss: {
      closeOnEscape: true,
      closeOnOutsidePress: options.closeOnOutsidePress ?? true,
      closeOnFocusOutside: true
    },
    onOpenChange(open) {
      menu.hidden = !open;
      menu.dataset.open = open ? 'true' : 'false';

      if (open) {
        focusFirstEnabled();
      }
    }
  });

  const activateItem = (item: ContextMenuActionItem, source: InputSource): void => {
    if (item.disabled) {
      return;
    }

    options.onAction?.(item, source);
    controller.close(source);
  };

  for (const item of options.items) {
    if (!isActionItem(item)) {
      if (item.type === 'separator') {
        const separator = document.createElement('div');
        separator.className = 'cv-context-menu__separator';
        separator.setAttribute('role', 'separator');
        separator.dataset.menuItemType = 'separator';
        menu.append(separator);
      } else {
        const label = document.createElement('div');
        label.className = 'cv-context-menu__label';
        label.dataset.menuItemType = 'label';
        label.textContent = item.label;
        menu.append(label);
      }
      continue;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cv-context-menu__item';
    button.role = 'menuitem';
    button.dataset.kind = item.kind ?? 'default';
    button.disabled = item.disabled ?? false;

    const label = document.createElement('span');
    label.className = 'cv-context-menu__item-label';
    label.textContent = item.label;
    button.append(label);

    if (item.shortcut) {
      const shortcut = document.createElement('span');
      shortcut.className = 'cv-context-menu__item-shortcut';
      shortcut.textContent = item.shortcut;
      shortcut.setAttribute('aria-hidden', 'true');
      button.append(shortcut);
      button.setAttribute('aria-keyshortcuts', item.shortcut);
    }

    button.addEventListener('click', () => {
      activateItem(item, 'pointer');
    });

    button.addEventListener('keydown', (event) => {
      if (isActivationKey(event)) {
        event.preventDefault();
        activateItem(item, 'keyboard');
        return;
      }

      if (!isNavigationKey(event)) {
        return;
      }

      event.preventDefault();
      if (event.key === 'ArrowDown') {
        focusByOffset(1);
      } else if (event.key === 'ArrowUp') {
        focusByOffset(-1);
      } else if (event.key === 'Home') {
        focusBoundary(false);
      } else if (event.key === 'End') {
        focusBoundary(true);
      }
    });

    actionButtons.push(button);
    itemsByButton.set(button, item);
    menu.append(button);
  }

  const openAt = (x: number, y: number, source: InputSource = 'programmatic'): void => {
    menu.style.position = 'fixed';
    menu.style.left = `${Math.round(x)}px`;
    menu.style.top = `${Math.round(y)}px`;

    controller.open(source);
  };

  const onContextMenu = (event: MouseEvent): void => {
    event.preventDefault();
    openAt(event.clientX, event.clientY, 'pointer');
  };

  const onTargetKeyDown = (event: KeyboardEvent): void => {
    if (!isContextMenuKey(event)) {
      return;
    }

    event.preventDefault();
    const rect = options.target.getBoundingClientRect();
    openAt(rect.left, rect.bottom, 'keyboard');
  };

  const onMenuKeyDown = (event: KeyboardEvent): void => {
    if (!isNavigationKey(event)) {
      return;
    }

    if (!(event.target instanceof HTMLButtonElement) || !itemsByButton.has(event.target)) {
      if (event.key === 'Home') {
        focusBoundary(false);
      } else if (event.key === 'End') {
        focusBoundary(true);
      }
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowDown') {
      focusByOffset(1);
    } else if (event.key === 'ArrowUp') {
      focusByOffset(-1);
    } else if (event.key === 'Home') {
      focusBoundary(false);
    } else if (event.key === 'End') {
      focusBoundary(true);
    }
  };

  options.target.addEventListener('contextmenu', onContextMenu);
  options.target.addEventListener('keydown', onTargetKeyDown);
  menu.addEventListener('keydown', onMenuKeyDown);

  document.body.append(menu);

  return {
    element: menu,
    openAt,
    close(source: InputSource = 'programmatic'): void {
      controller.close(source);
    },
    destroy(): void {
      options.target.removeEventListener('contextmenu', onContextMenu);
      options.target.removeEventListener('keydown', onTargetKeyDown);
      menu.removeEventListener('keydown', onMenuKeyDown);
      controller.dispose();
      menu.remove();
    }
  };
};
