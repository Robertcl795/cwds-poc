import { createDisposalBin, linkPopup, listen, type InputSource } from '@ds/core';

import type { PrimitiveContextMenu, PrimitiveContextMenuOptions } from './context-menu.types';
import {
  isInside,
  isPopoverOpen,
  nextContextMenuId,
  positionContextMenu,
  supportsPopoverApi,
  type PopoverMenuElement,
  type ToggleEventLike
} from './context-menu.helpers';
import {
  defineInternalContextMenu,
  INTERNAL_CONTEXT_MENU_TAG,
  type ContextMenuActionEventDetail,
  type CvInternalContextMenu
} from './internal-context-menu';

const isContextMenuKey = (event: KeyboardEvent): boolean =>
  event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');

export const createContextMenu = (options: PrimitiveContextMenuOptions): PrimitiveContextMenu => {
  defineInternalContextMenu();

  const triggerMode = options.triggerMode ?? 'contextmenu';
  const closeOnOutsidePress = options.closeOnOutsidePress ?? true;
  const closeOnSelect = options.closeOnSelect ?? true;
  const supportsPopover = supportsPopoverApi();
  const menu = document.createElement(INTERNAL_CONTEXT_MENU_TAG) as CvInternalContextMenu;

  menu.id = options.id ?? nextContextMenuId();
  menu.ariaLabel = options.ariaLabel ?? '';
  menu.hidden = !supportsPopover;
  menu.setMenuItems(options.items);

  if (supportsPopover) {
    menu.setAttribute('popover', closeOnOutsidePress ? 'auto' : 'manual');
  }

  document.body.append(menu);

  const popupLink = linkPopup(options.target, menu, 'menu');
  const cleanup = createDisposalBin();
  const openCleanup = createDisposalBin();
  let usingPopover = supportsPopover;
  let open = false;
  let restoreFocusOnClose = false;
  let lastPosition: { x: number; y: number } | null = null;

  const usesNativeLightDismiss = (): boolean => usingPopover && closeOnOutsidePress;

  const syncOpenListeners = (): void => {
    openCleanup.dispose();
    if (!open || usesNativeLightDismiss()) {
      return;
    }

    openCleanup.add(listen(document, 'pointerdown', onDocumentPointerDown, { capture: true }));
    openCleanup.add(listen(document, 'keydown', onDocumentKeyDown, { capture: true }));
    openCleanup.add(listen(document, 'focusin', onDocumentFocusIn, { capture: true }));
    openCleanup.add(listen(window, 'resize', onWindowChange));
    openCleanup.add(listen(window, 'scroll', onWindowChange, { capture: true }));
  };

  const setOpen = (nextOpen: boolean): void => {
    if (open === nextOpen) {
      return;
    }

    open = nextOpen;
    menu.dataset.open = nextOpen ? 'true' : 'false';

    if (!usingPopover) {
      menu.hidden = !nextOpen;
    }

    popupLink.syncExpanded(nextOpen);
    syncOpenListeners();
  };

  const disableNativePopover = (): void => {
    if (!usingPopover) {
      return;
    }

    usingPopover = false;
    menu.removeAttribute('popover');
    menu.hidden = !open;
    syncOpenListeners();
  };

  const restoreFocusToTrigger = (): void => {
    if (document.activeElement !== options.target) {
      options.target.focus();
    }
  };

  const focusMenu = (): void => {
    queueMicrotask(() => {
      menu.focusFirstEnabled();
    });
  };

  const openMenuAt = (x: number, y: number, _source: InputSource): void => {
    lastPosition = positionContextMenu(menu, x, y);

    if (usingPopover) {
      if (open) {
        menu.focusFirstEnabled();
        return;
      }

      try {
        (menu as PopoverMenuElement).showPopover({ source: options.target });
      } catch {
        disableNativePopover();
      }

      if (usingPopover) {
        if (!open && isPopoverOpen(menu)) {
          setOpen(true);
        }

        if (open) {
          menu.focusFirstEnabled();
          return;
        }

        disableNativePopover();
      }
    }

    setOpen(true);
    menu.focusFirstEnabled();
  };

  function closeMenu(source: InputSource = 'programmatic', restoreFocus = source !== 'pointer'): void {
    if (!open) {
      return;
    }

    if (usingPopover) {
      restoreFocusOnClose = restoreFocus;

      try {
        (menu as PopoverMenuElement).hidePopover();
      } catch {
        disableNativePopover();
      }

      if (usingPopover) {
        return;
      }
    }

    setOpen(false);

    if (restoreFocus) {
      restoreFocusToTrigger();
    }
  }

  const openNearTarget = (source: InputSource): void => {
    const { left, bottom } = options.target.getBoundingClientRect();
    openMenuAt(left, bottom, source);
  };

  const onMenuToggle = (event: Event): void => {
    if (!usingPopover) {
      return;
    }

    const detail = event as ToggleEventLike;
    const nextOpen = detail.newState ? detail.newState === 'open' : isPopoverOpen(menu);
    setOpen(nextOpen);

    if (nextOpen) {
      focusMenu();
      return;
    }

    if (restoreFocusOnClose) {
      restoreFocusOnClose = false;
      restoreFocusToTrigger();
    }
  };

  const onMenuAction = (event: Event): void => {
    const detail = (event as CustomEvent<ContextMenuActionEventDetail>).detail;
    options.onAction?.(detail.item, detail.source);

    if (closeOnSelect) {
      closeMenu(detail.source, true);
    }
  };

  const onDocumentPointerDown = (event: Event): void => {
    if (
      !open ||
      !closeOnOutsidePress ||
      isInside(event.target, menu) ||
      isInside(event.target, options.target)
    ) {
      return;
    }

    closeMenu('pointer', false);
  };

  const onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (!open || event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    closeMenu('keyboard', true);
  };

  const onDocumentFocusIn = (event: Event): void => {
    if (!open || isInside(event.target, menu) || isInside(event.target, options.target)) {
      return;
    }

    closeMenu('programmatic', false);
  };

  const onWindowChange = (): void => {
    if (open && lastPosition) {
      lastPosition = positionContextMenu(menu, lastPosition.x, lastPosition.y);
    }
  };

  const onContextMenu = (event: MouseEvent): void => {
    if (triggerMode === 'click') {
      return;
    }

    event.preventDefault();
    openMenuAt(event.clientX, event.clientY, 'pointer');
  };

  const onTargetClick = (event: MouseEvent): void => {
    if (triggerMode === 'contextmenu') {
      return;
    }

    event.preventDefault();

    if (open) {
      closeMenu('pointer', false);
      return;
    }

    openNearTarget('pointer');
  };

  const onTargetKeyDown = (event: KeyboardEvent): void => {
    if (!isContextMenuKey(event)) {
      return;
    }

    event.preventDefault();

    if (open) {
      closeMenu('keyboard', true);
      return;
    }

    openNearTarget('keyboard');
  };

  cleanup.add(listen(menu, 'cv-menu-action', onMenuAction));
  cleanup.add(listen(options.target, 'contextmenu', onContextMenu));
  cleanup.add(listen(options.target, 'click', onTargetClick));
  cleanup.add(listen(options.target, 'keydown', onTargetKeyDown));

  if (supportsPopover) {
    cleanup.add(listen(menu, 'toggle', onMenuToggle));
  }

  return {
    element: menu,
    openAt(x: number, y: number, source: InputSource = 'programmatic'): void {
      openMenuAt(x, y, source);
    },
    close(source: InputSource = 'programmatic'): void {
      closeMenu(source);
    },
    destroy(): void {
      closeMenu('programmatic', false);
      openCleanup.dispose();
      cleanup.dispose();
      popupLink.destroy();
      menu.remove();
    }
  };
};
