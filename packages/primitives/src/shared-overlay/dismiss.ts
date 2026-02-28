import type { InputSource } from '@ds/headless';

import type { OverlayController } from './overlay-controller';

export interface OverlayDismissOptions {
  overlay: HTMLElement;
  controller: Pick<OverlayController, 'isOpen' | 'isTopMost' | 'close'>;
  trigger?: HTMLElement | null;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  closeOnFocusOutside?: boolean;
}

const isOutside = (target: EventTarget | null, overlay: HTMLElement, trigger: HTMLElement | null | undefined): boolean => {
  if (!(target instanceof Node)) {
    return true;
  }

  if (overlay.contains(target)) {
    return false;
  }

  if (trigger && trigger.contains(target)) {
    return false;
  }

  return true;
};

export const bindOverlayDismiss = (options: OverlayDismissOptions): (() => void) => {
  const closeOnEscape = options.closeOnEscape ?? true;
  const closeOnOutsidePress = options.closeOnOutsidePress ?? true;
  const closeOnFocusOutside = options.closeOnFocusOutside ?? false;

  const closeOverlay = (source: InputSource): void => {
    if (!options.controller.isOpen() || !options.controller.isTopMost()) {
      return;
    }

    options.controller.close(source);
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (!closeOnEscape || event.key !== 'Escape') {
      return;
    }

    if (!options.controller.isOpen() || !options.controller.isTopMost()) {
      return;
    }

    event.preventDefault();
    closeOverlay('keyboard');
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (!closeOnOutsidePress || !options.controller.isOpen()) {
      return;
    }

    if (!isOutside(event.target, options.overlay, options.trigger)) {
      return;
    }

    closeOverlay('pointer');
  };

  const onFocusIn = (event: FocusEvent): void => {
    if (!closeOnFocusOutside || !options.controller.isOpen()) {
      return;
    }

    if (!isOutside(event.target, options.overlay, options.trigger)) {
      return;
    }

    closeOverlay('programmatic');
  };

  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('focusin', onFocusIn, true);

  return () => {
    document.removeEventListener('keydown', onKeyDown, true);
    document.removeEventListener('pointerdown', onPointerDown, true);
    document.removeEventListener('focusin', onFocusIn, true);
  };
};
