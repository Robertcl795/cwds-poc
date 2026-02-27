import { writeControlStateAttributes } from '../shared/control-hooks';

export type PrimitiveDividerOptions = {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  inset?: 'none' | 'start' | 'end' | 'middle';
};

export function createPrimitiveDivider(options: PrimitiveDividerOptions = {}): HTMLElement {
  const orientation = options.orientation ?? 'horizontal';
  const decorative = options.decorative ?? true;

  const divider = orientation === 'horizontal' ? document.createElement('hr') : document.createElement('div');
  divider.className = 'cv-divider';
  divider.setAttribute('data-inset', options.inset ?? 'none');

  writeControlStateAttributes(divider, {
    orientation
  });

  if (orientation === 'vertical') {
    divider.setAttribute('role', 'separator');
    divider.setAttribute('aria-orientation', 'vertical');
  }

  if (decorative) {
    divider.setAttribute('aria-hidden', 'true');
  }

  return divider;
}
