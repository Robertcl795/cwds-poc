import type { InputSource } from '@ds/headless';

import { bindOverlayDismiss } from '../shared-overlay/dismiss';
import { createOverlayController, type OverlayController } from '../shared-overlay/overlay-controller';
import { createPositioningAdapter, type OverlayPlacement, type OverlayPositionStrategy } from './positioning';

export type OverlayRole = 'tooltip' | 'menu' | 'listbox';

export interface AdvancedOverlayDismissOptions {
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  closeOnFocusOutside?: boolean;
}

export interface AdvancedOverlayControllerOptions {
  overlay: HTMLElement;
  trigger?: HTMLElement | null;
  role: OverlayRole;
  restoreFocus?: boolean;
  placement?: OverlayPlacement;
  offset?: number;
  positionStrategy?: OverlayPositionStrategy;
  enablePositioning?: boolean;
  dismiss?: AdvancedOverlayDismissOptions;
  onOpenChange?: (open: boolean, source: InputSource) => void;
}

export interface AdvancedOverlayController {
  readonly overlay: HTMLElement;
  isOpen: () => boolean;
  isTopMost: () => boolean;
  open: (source?: InputSource) => void;
  close: (source?: InputSource) => void;
  toggle: (source?: InputSource) => void;
  updatePosition: () => void;
  dispose: () => void;
}

const syncTriggerState = (trigger: HTMLElement | null | undefined, overlayId: string, role: OverlayRole, open: boolean): void => {
  if (!trigger) {
    return;
  }

  if (role !== 'tooltip') {
    trigger.setAttribute('aria-controls', overlayId);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    trigger.setAttribute('aria-haspopup', role === 'menu' ? 'menu' : 'listbox');
  }
};

export const createAdvancedOverlayController = (
  options: AdvancedOverlayControllerOptions
): AdvancedOverlayController => {
  const baseController: OverlayController = createOverlayController({
    overlay: options.overlay,
    trigger: options.trigger ?? null,
    restoreFocus: options.restoreFocus ?? options.role !== 'tooltip',
    onOpenChange(open, source) {
      options.overlay.dataset.open = open ? 'true' : 'false';
      syncTriggerState(options.trigger, options.overlay.id, options.role, open);
      options.onOpenChange?.(open, source);
    }
  });

  const usePositioning = options.enablePositioning ?? true;
  const positioner =
    usePositioning && options.trigger
      ? createPositioningAdapter({
          anchor: options.trigger,
          surface: options.overlay,
          ...(options.placement !== undefined ? { placement: options.placement } : {}),
          ...(options.offset !== undefined ? { offset: options.offset } : {}),
          ...(options.positionStrategy !== undefined ? { strategy: options.positionStrategy } : {})
        })
      : null;

  const unbindDismiss = bindOverlayDismiss({
    overlay: options.overlay,
    ...(options.trigger !== undefined ? { trigger: options.trigger } : {}),
    controller: baseController,
    closeOnEscape: options.dismiss?.closeOnEscape ?? true,
    closeOnOutsidePress: options.dismiss?.closeOnOutsidePress ?? options.role !== 'tooltip',
    closeOnFocusOutside: options.dismiss?.closeOnFocusOutside ?? options.role === 'listbox'
  });

  const onWindowChange = (): void => {
    if (!baseController.isOpen()) {
      return;
    }

    positioner?.apply();
  };

  window.addEventListener('resize', onWindowChange);
  window.addEventListener('scroll', onWindowChange, true);

  return {
    overlay: options.overlay,
    isOpen: baseController.isOpen,
    isTopMost: baseController.isTopMost,
    open(source: InputSource = 'programmatic'): void {
      baseController.open(source);
      positioner?.apply();
    },
    close(source: InputSource = 'programmatic'): void {
      baseController.close(source);
    },
    toggle(source: InputSource = 'programmatic'): void {
      if (baseController.isOpen()) {
        baseController.close(source);
        return;
      }

      baseController.open(source);
      positioner?.apply();
    },
    updatePosition(): void {
      positioner?.apply();
    },
    dispose(): void {
      unbindDismiss();
      window.removeEventListener('resize', onWindowChange);
      window.removeEventListener('scroll', onWindowChange, true);
      positioner?.cleanup();
      baseController.dispose();

      if (options.trigger && options.role !== 'tooltip') {
        options.trigger.removeAttribute('aria-controls');
        options.trigger.removeAttribute('aria-expanded');
        options.trigger.removeAttribute('aria-haspopup');
      }
    }
  };
};
