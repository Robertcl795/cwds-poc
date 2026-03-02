import { applyFocusRing } from '@ds/utils-a11y';

import { resolveDisabledState, writeDisabledState } from '../shared/disabled';
import { buildIconButtonContent } from '../shared/icon-button';
import { enhancePressable } from '../shared/interaction';

export type PrimitiveIconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type PrimitiveIconButtonSize = 'sm' | 'md' | 'lg';

export type PrimitiveIconButtonOptions = {
  icon: string | HTMLElement;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: PrimitiveIconButtonVariant;
  size?: PrimitiveIconButtonSize;
  disabled?: boolean;
  selected?: boolean;
  ripple?: boolean;
  onPress?: (source: 'pointer' | 'keyboard' | 'programmatic', event: Event) => void;
};

export function createPrimitiveIconButton(options: PrimitiveIconButtonOptions): HTMLButtonElement {
  const state = resolveDisabledState({ disabled: options.disabled });

  const button = document.createElement('button');
  button.className = 'cv-icon-button cv-focus-ring';
  button.type = options.type ?? 'button';
  button.disabled = state.native;
  button.dataset.variant = options.variant ?? 'standard';
  button.dataset.size = options.size ?? 'md';
  button.dataset.selected = options.selected ? 'true' : 'false';
  button.dataset.pressed = 'false';
  button.setAttribute('aria-label', options.ariaLabel);

  if (options.selected !== undefined) {
    button.setAttribute('aria-pressed', options.selected ? 'true' : 'false');
  }

  writeDisabledState(button, state);
  applyFocusRing(button, 'auto');

  button.append(
    buildIconButtonContent({
      icon: options.icon,
      ariaLabel: options.ariaLabel
    })
  );

  const pressable = enhancePressable(button, {
    disabled: () => button.disabled,
    ripple: options.ripple !== false
  });

  button.addEventListener('click', (event) => {
    if (button.disabled) {
      return;
    }

    options.onPress?.(pressable.getLastSource(), event);
  });

  return button;
}
