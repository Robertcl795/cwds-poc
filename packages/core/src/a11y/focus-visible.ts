import { detectFeatures } from '../features/detect-features';

export function supportsNativeFocusVisible(win: Window = window): boolean {
  return detectFeatures(win).focusVisible;
}
