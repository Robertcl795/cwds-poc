export interface OverlayFeatureSupport {
  dialog: boolean;
  popover: boolean;
  anchorPositioning: boolean;
  inert: boolean;
  openPseudoClass: boolean;
}

const supports = (condition: string): boolean => {
  const css = globalThis.CSS;
  if (!css || typeof css.supports !== 'function') {
    return false;
  }

  try {
    return css.supports(condition);
  } catch {
    return false;
  }
};

const supportsSelector = (selector: string): boolean => supports(`selector(${selector})`);

export const detectOverlayFeatureSupport = (): OverlayFeatureSupport => {
  const dialog =
    typeof HTMLDialogElement !== 'undefined' &&
    typeof HTMLDialogElement.prototype.showModal === 'function' &&
    typeof HTMLDialogElement.prototype.show === 'function';

  const popover = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
  const inert = typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

  return {
    dialog,
    popover,
    anchorPositioning: supports('anchor-name: --cv-anchor'),
    inert,
    openPseudoClass: supportsSelector(':open')
  };
};
