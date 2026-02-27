import { applyFocusRing } from '@covalent-poc/primitives-foundation';

import { createPrimitiveLoadingIndicator } from '../loading';
import { resolveDisabledState, writeDisabledState } from '../shared/disabled';
import { enhancePressable } from '../shared/interaction';
import type { PrimitiveButtonOptions } from './button.types';

const appendIcon = (
  content: HTMLElement,
  position: 'start' | 'end',
  iconValue: string | HTMLElement
): void => {
  const icon = document.createElement('span');
  icon.className = `cv-button__icon cv-button__icon--${position}`;

  if (typeof iconValue === 'string') {
    icon.textContent = iconValue;
  } else {
    icon.append(iconValue);
  }

  content.append(icon);
};

export const createPrimitiveButton = (options: PrimitiveButtonOptions): HTMLButtonElement => {
  const state = resolveDisabledState({
    disabled: options.disabled,
    loading: options.loading
  });

  const button = document.createElement('button');
  button.className = 'cv-button cv-focus-ring';
  button.type = options.type ?? 'button';
  button.disabled = state.native;
  writeDisabledState(button, state);

  const color = options.color ?? options.variant ?? 'primary';
  const shape = options.shape ?? 'contained';
  const isLoading = options.loading === true;
  const loadingLabel = options.loadingLabel ?? `Loading ${options.label}`;

  button.dataset.color = color;
  button.dataset.shape = shape;
  button.dataset.loading = isLoading ? 'true' : 'false';
  button.dataset.raised = options.raised ? 'true' : 'false';
  button.dataset.dense = options.dense ? 'true' : 'false';
  button.dataset.expandContent = options.expandContent ? 'true' : 'false';
  button.dataset.fullWidth = options.fullWidth ? 'true' : 'false';
  button.dataset.pressed = 'false';

  if (isLoading) {
    button.setAttribute('aria-busy', 'true');
  }

  applyFocusRing(button, 'auto');

  const content = document.createElement('span');
  content.className = 'cv-button__content';

  if (isLoading) {
    content.append(
      createPrimitiveLoadingIndicator({
        density: options.loadingDensity ?? 'sm',
        label: loadingLabel
      })
    );
  } else if (options.iconStart) {
    appendIcon(content, 'start', options.iconStart);
  }

  const label = document.createElement('span');
  label.className = 'cv-button__label';
  label.textContent = isLoading && options.loadingLabel ? options.loadingLabel : options.label;
  content.append(label);

  if (!isLoading && (options.expandContent || options.content !== undefined)) {
    const slot = document.createElement('span');
    slot.className = 'cv-button__slot';

    if (typeof options.content === 'string') {
      slot.textContent = options.content;
    } else if (options.content) {
      slot.append(options.content);
    }

    content.append(slot);
  }

  if (!isLoading && options.iconEnd) {
    appendIcon(content, 'end', options.iconEnd);
  }

  button.append(content);

  const pressable = enhancePressable(button, {
    disabled: () => button.disabled || button.dataset.loading === 'true',
    ripple: options.ripple !== false
  });

  button.addEventListener('click', (event) => {
    if (button.disabled) {
      return;
    }

    options.onPress?.(pressable.getLastSource(), event);
  });

  return button;
};
