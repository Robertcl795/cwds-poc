import { supportsNativeFocusVisible } from '@ds/headless';

import type { FocusRingMode } from '../types';
import { CV_CLASSES } from './css-hooks';

export function applyFocusRing(element: HTMLElement, mode: FocusRingMode = 'auto'): void {
  element.classList.add(CV_CLASSES.focusRing);
  element.dataset.cvFocusRing = mode;

  if (!supportsNativeFocusVisible()) {
    element.classList.add('cv-focus-ring--polyfill');
  }
}
