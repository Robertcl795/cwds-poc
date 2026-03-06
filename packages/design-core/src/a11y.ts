import { supportsNativeFocusVisible } from './a11y/focus-visible';
import { createNoopRippleController } from './ripple/noop';
import { attachRipple, type RippleController, type RippleOptions } from './ripple/ripple-controller';

export type FocusRingMode = 'auto' | 'always' | 'off';
export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type RippleContractOptions = RippleOptions & {
  enabled?: boolean;
};

export const CV_CLASSES = {
  focusRing: 'cv-focus-ring',
  icon: 'cv-icon',
  rippleHost: 'cv-ripple-host'
} as const;

export const CV_DATA_ATTRS = {
  focusRing: 'data-cv-focus-ring',
  elevation: 'data-cv-elevation',
  ripple: 'data-cv-ripple'
} as const;

const ELEVATION_LEVELS: readonly ElevationLevel[] = [0, 1, 2, 3, 4, 5];

export function applyFocusRing(element: HTMLElement, mode: FocusRingMode = 'auto'): void {
  element.classList.add(CV_CLASSES.focusRing);
  element.dataset.cvFocusRing = mode;

  if (!supportsNativeFocusVisible()) {
    element.classList.add('cv-focus-ring--polyfill');
  }
}

export function setElevation(element: HTMLElement, level: ElevationLevel): void {
  if (!ELEVATION_LEVELS.includes(level)) {
    throw new Error(`Unsupported elevation level: ${level}`);
  }

  element.dataset.cvElevation = String(level);
}

export function applyRipple(host: HTMLElement, options: RippleContractOptions = {}): RippleController {
  if (options.enabled === false || host.dataset.cvRipple === 'off') {
    return createNoopRippleController();
  }

  host.dataset.cvRipple = 'on';
  return attachRipple(host, options);
}
