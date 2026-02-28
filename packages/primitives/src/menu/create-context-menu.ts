import type { InputSource } from '@ds/headless';

import { createAdvancedOverlayController } from '../shared-overlay-advanced';
import type {
  ContextMenuActionItem,
  ContextMenuControlType,
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

const resolveRole = (item: ContextMenuActionItem): 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' => {
  if (item.control === 'checkbox' || item.control === 'switch') {
    return 'menuitemcheckbox';
  }

  if (item.control === 'radio') {
    return 'menuitemradio';
  }

  return 'menuitem';
};

const createIcon = (value: string | HTMLElement, className: string): HTMLElement => {
  const icon = document.createElement('span');
  icon.className = className;
  icon.setAttribute('aria-hidden', 'true');

  if (typeof value === 'string') {
    icon.textContent = value;
  } else {
    icon.append(value);
  }

  return icon;
};

type MenuItemState = {
  item: ContextMenuActionItem;
  control: ContextMenuControlType | null;
  checked: boolean;
  group: string | null;
  indicator: HTMLElement | null;
};

const formatControlIndicator = (control: ContextMenuControlType, checked: boolean): string => {
  if (control === 'radio') {
    return checked ? '●' : '○';
  }

  if (control === 'switch') {
    return checked ? 'On' : 'Off';
  }

  return checked ? '✓' : '';
};

const syncItemState = (button: HTMLButtonElement, state: MenuItemState): void => {
  if (!state.control) {
    return;
  }

  button.setAttribute('aria-checked', state.checked ? 'true' : 'false');
  button.dataset.checked = state.checked ? 'true' : 'false';

  if (!state.indicator) {
    return;
  }

  state.indicator.textContent = formatControlIndicator(state.control, state.checked);
  state.indicator.dataset.checked = state.checked ? 'true' : 'false';
};

const focusIndex = (items: HTMLButtonElement[], index: number): void => {
  const enabled = items.filter((button) => !button.disabled);
  if (enabled.length === 0) {
    return;
  }

  enabled[index]?.focus();
};

export const createContextMenu = (options: PrimitiveContextMenuOptions): PrimitiveContextMenu => {
  const triggerMode = options.triggerMode ?? 'contextmenu';
  const closeOnSelect = options.closeOnSelect ?? true;

  const menu = document.createElement('div');
  menu.className = 'cv-context-menu';
  menu.id = options.id ?? nextContextMenuId();
  menu.role = 'menu';
  menu.tabIndex = -1;
  menu.hidden = true;
  menu.dataset.open = 'false';
  menu.dataset.triggerMode = triggerMode;

  if (options.ariaLabel) {
    menu.setAttribute('aria-label', options.ariaLabel);
  }

  const actionButtons: HTMLButtonElement[] = [];
  const statesByButton = new Map<HTMLButtonElement, MenuItemState>();

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

  const activateItem = (button: HTMLButtonElement, source: InputSource): void => {
    const state = statesByButton.get(button);
    if (!state || state.item.disabled) {
      return;
    }

    if (state.control === 'checkbox' || state.control === 'switch') {
      state.checked = !state.checked;
      syncItemState(button, state);
    } else if (state.control === 'radio') {
      if (!state.checked) {
        for (const [candidateButton, candidateState] of statesByButton.entries()) {
          if (candidateState.control !== 'radio') {
            continue;
          }

          if (candidateState.group !== state.group) {
            continue;
          }

          candidateState.checked = candidateButton === button;
          syncItemState(candidateButton, candidateState);
        }
      }
    }

    const payload =
      state.control === null
        ? state.item
        : {
            ...state.item,
            checked: state.checked
          };

    options.onAction?.(payload, source);

    if (closeOnSelect) {
      controller.close(source);
    }
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
    button.role = resolveRole(item);
    button.dataset.kind = item.kind ?? 'default';
    button.dataset.control = item.control ?? 'none';
    button.disabled = item.disabled ?? false;

    const leading = document.createElement('span');
    leading.className = 'cv-context-menu__item-leading';

    let indicator: HTMLElement | null = null;
    if (item.control) {
      indicator = document.createElement('span');
      indicator.className = 'cv-context-menu__item-control';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.dataset.control = item.control;
      leading.append(indicator);
    }

    if (item.iconStart) {
      leading.append(createIcon(item.iconStart, 'cv-context-menu__item-icon cv-context-menu__item-icon--start'));
    }

    if (leading.childElementCount > 0) {
      button.append(leading);
    }

    const label = document.createElement('span');
    label.className = 'cv-context-menu__item-label';
    label.textContent = item.label;
    button.append(label);

    const trailing = document.createElement('span');
    trailing.className = 'cv-context-menu__item-trailing';

    if (item.shortcut || item.iconEnd) {
      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.className = 'cv-context-menu__item-shortcut';
        shortcut.textContent = item.shortcut;
        shortcut.setAttribute('aria-hidden', 'true');
        trailing.append(shortcut);
        button.setAttribute('aria-keyshortcuts', item.shortcut);
      }

      if (item.iconEnd) {
        trailing.append(createIcon(item.iconEnd, 'cv-context-menu__item-icon cv-context-menu__item-icon--end'));
      }

      button.append(trailing);
    }

    const state: MenuItemState = {
      item,
      control: item.control ?? null,
      checked: item.checked === true,
      group: item.group ?? '__default__',
      indicator
    };
    syncItemState(button, state);

    if (item.control === 'radio' && !item.group) {
      button.dataset.group = '__default__';
    } else if (item.group) {
      button.dataset.group = item.group;
    }

    button.addEventListener('click', () => {
      activateItem(button, 'pointer');
    });

    button.addEventListener('keydown', (event) => {
      if (isActivationKey(event)) {
        event.preventDefault();
        activateItem(button, 'keyboard');
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
    statesByButton.set(button, state);
    menu.append(button);
  }

  const openAt = (x: number, y: number, source: InputSource = 'programmatic'): void => {
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

    const previousHidden = menu.hidden;
    if (previousHidden) {
      menu.hidden = false;
      menu.style.visibility = 'hidden';
    }

    const rect = menu.getBoundingClientRect();
    const width = Math.max(rect.width, 192);
    const height = Math.max(rect.height, 48);

    if (previousHidden) {
      menu.hidden = true;
      menu.style.removeProperty('visibility');
    }

    const clampedX = Math.min(Math.max(8, x), Math.max(8, viewportWidth - width - 8));
    const clampedY = Math.min(Math.max(8, y), Math.max(8, viewportHeight - height - 8));

    menu.style.position = 'fixed';
    menu.style.left = `${Math.round(clampedX)}px`;
    menu.style.top = `${Math.round(clampedY)}px`;

    controller.open(source);
  };

  const openNearTarget = (source: InputSource): void => {
    const rect = options.target.getBoundingClientRect();
    openAt(rect.left, rect.bottom, source);
  };

  const onContextMenu = (event: MouseEvent): void => {
    if (triggerMode !== 'contextmenu' && triggerMode !== 'both') {
      return;
    }

    event.preventDefault();

    if (controller.isOpen() && triggerMode === 'contextmenu') {
      controller.close('pointer');
      return;
    }

    openAt(event.clientX, event.clientY, 'pointer');
  };

  const onTargetClick = (event: MouseEvent): void => {
    if (triggerMode !== 'click' && triggerMode !== 'both') {
      return;
    }

    event.preventDefault();
    if (controller.isOpen()) {
      controller.close('pointer');
      return;
    }

    openNearTarget('pointer');
  };

  const onTargetPointerDown = (event: PointerEvent): void => {
    if (triggerMode !== 'contextmenu') {
      return;
    }

    if (!controller.isOpen()) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    controller.close('pointer');
  };

  const onTargetKeyDown = (event: KeyboardEvent): void => {
    const supportsKeyboardTrigger = triggerMode === 'contextmenu' || triggerMode === 'both' || triggerMode === 'click';
    if (!supportsKeyboardTrigger || !isContextMenuKey(event)) {
      return;
    }

    event.preventDefault();
    if (controller.isOpen()) {
      controller.close('keyboard');
      return;
    }

    openNearTarget('keyboard');
  };

  const onMenuKeyDown = (event: KeyboardEvent): void => {
    if (!isNavigationKey(event)) {
      return;
    }

    if (!(event.target instanceof HTMLButtonElement) || !statesByButton.has(event.target)) {
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
  options.target.addEventListener('click', onTargetClick);
  options.target.addEventListener('pointerdown', onTargetPointerDown);
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
      options.target.removeEventListener('click', onTargetClick);
      options.target.removeEventListener('pointerdown', onTargetPointerDown);
      options.target.removeEventListener('keydown', onTargetKeyDown);
      menu.removeEventListener('keydown', onMenuKeyDown);
      controller.dispose();
      menu.remove();
    }
  };
};
