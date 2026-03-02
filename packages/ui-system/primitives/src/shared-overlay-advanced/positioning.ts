import { detectOverlayFeatureSupport, type OverlayFeatureSupport } from '../shared-overlay/popover-support';

export type OverlayPlacement = 'top' | 'bottom' | 'start' | 'end';
export type OverlayPositionStrategy = 'auto' | 'popover-anchor' | 'absolute';
export type OverlayPositionMode = 'popover-anchor' | 'absolute';

export interface OverlayPositioningOptions {
  anchor: HTMLElement;
  surface: HTMLElement;
  placement?: OverlayPlacement;
  offset?: number;
  strategy?: OverlayPositionStrategy;
  support?: OverlayFeatureSupport;
}

export interface OverlayPositioningAdapter {
  readonly mode: OverlayPositionMode;
  apply: () => void;
  cleanup: () => void;
}

const clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

const supportsAnchorPath = (support: OverlayFeatureSupport): boolean => support.popover && support.anchorPositioning;

const resolveMode = (
  strategy: OverlayPositionStrategy,
  support: OverlayFeatureSupport
): OverlayPositionMode => {
  if (strategy === 'absolute') {
    return 'absolute';
  }

  if (strategy === 'popover-anchor') {
    return supportsAnchorPath(support) ? 'popover-anchor' : 'absolute';
  }

  return supportsAnchorPath(support) ? 'popover-anchor' : 'absolute';
};

const positionAbsolutely = (anchor: HTMLElement, surface: HTMLElement, placement: OverlayPlacement, offset: number): void => {
  const anchorRect = anchor.getBoundingClientRect();
  const surfaceRect = surface.getBoundingClientRect();

  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

  let top = anchorRect.bottom + offset;
  let left = anchorRect.left;

  if (placement === 'top') {
    top = anchorRect.top - surfaceRect.height - offset;
  }

  if (placement === 'start') {
    top = anchorRect.top;
    left = anchorRect.left - surfaceRect.width - offset;
  }

  if (placement === 'end') {
    top = anchorRect.top;
    left = anchorRect.right + offset;
  }

  const clampedLeft = clamp(left, 8, Math.max(8, viewportWidth - surfaceRect.width - 8));
  const clampedTop = clamp(top, 8, Math.max(8, viewportHeight - surfaceRect.height - 8));

  surface.style.position = 'fixed';
  surface.style.inset = 'auto auto auto auto';
  surface.style.top = `${Math.round(clampedTop)}px`;
  surface.style.left = `${Math.round(clampedLeft)}px`;
};

export const createPositioningAdapter = (options: OverlayPositioningOptions): OverlayPositioningAdapter => {
  const placement = options.placement ?? 'bottom';
  const offset = options.offset ?? 8;
  const support = options.support ?? detectOverlayFeatureSupport();
  const strategy = options.strategy ?? 'auto';
  const mode = resolveMode(strategy, support);

  return {
    mode,
    apply(): void {
      options.surface.dataset.positionMode = mode;
      options.surface.dataset.placement = placement;

      if (mode === 'popover-anchor') {
        // Keep anchor metadata even when browser native anchoring is used.
        options.surface.style.setProperty('--cv-overlay-offset', `${offset}px`);
        return;
      }

      positionAbsolutely(options.anchor, options.surface, placement, offset);
    },
    cleanup(): void {
      options.surface.style.removeProperty('--cv-overlay-offset');
      options.surface.style.removeProperty('position');
      options.surface.style.removeProperty('inset');
      options.surface.style.removeProperty('top');
      options.surface.style.removeProperty('left');
      delete options.surface.dataset.positionMode;
      delete options.surface.dataset.placement;
    }
  };
};
