export const ActivationKeys = new Set(['Enter', ' ']);
export const CloseKeys = new Set(['Escape']);

export const isActivationKey = (key: string): boolean => ActivationKeys.has(key);
export const isCloseKey = (key: string): boolean => CloseKeys.has(key);
