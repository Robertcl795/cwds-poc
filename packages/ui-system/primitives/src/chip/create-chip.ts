import { applyFocusRing } from '@ds/utils-a11y';

import { enhancePressable } from '../shared/interaction';
import type {
  PrimitiveActionChipOptions,
  PrimitiveChipHandle,
  PrimitiveChipInputSource,
  PrimitiveChipOptions,
  PrimitiveFilterChipOptions
} from './chip.types';

const appendContent = (host: HTMLElement, className: string, content: string | HTMLElement): void => {
  const node = document.createElement('span');
  node.className = className;
  node.setAttribute('aria-hidden', 'true');

  if (typeof content === 'string') {
    node.textContent = content;
  } else {
    node.append(content);
  }

  host.append(node);
};

const buildActionChip = (options: PrimitiveActionChipOptions): PrimitiveChipHandle => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cv-chip cv-chip--action cv-focus-ring';
  button.disabled = options.disabled ?? false;
  button.dataset.variant = 'action';
  button.dataset.selected = 'false';
  button.dataset.disabled = button.disabled ? 'true' : 'false';

  applyFocusRing(button, 'auto');

  if (options.iconStart) {
    appendContent(button, 'cv-chip__icon cv-chip__icon--start', options.iconStart);
  }

  const label = document.createElement('span');
  label.className = 'cv-chip__label';
  label.textContent = options.label;
  button.append(label);

  if (options.iconEnd) {
    appendContent(button, 'cv-chip__icon cv-chip__icon--end', options.iconEnd);
  }

  const pressable = enhancePressable(button, {
    disabled: () => button.disabled,
    ripple: options.ripple !== false
  });

  button.addEventListener('click', (event) => {
    if (button.disabled) {
      return;
    }

    options.onPress?.(pressable.getLastSource() as PrimitiveChipInputSource, event);
  });

  return {
    element: button,
    button
  };
};

const buildFilterChip = (options: PrimitiveFilterChipOptions): PrimitiveChipHandle => {
  const wrapper = document.createElement('label');
  wrapper.className = 'cv-chip cv-chip--filter';
  wrapper.dataset.variant = 'filter';

  const input = document.createElement('input');
  input.className = 'cv-chip__control';
  input.type = 'checkbox';
  input.id = options.id;
  input.name = options.name;
  input.checked = options.selected ?? false;
  input.disabled = options.disabled ?? false;
  input.required = options.required ?? false;
  if (options.value !== undefined) {
    input.value = options.value;
  }

  const visual = document.createElement('span');
  visual.className = 'cv-chip__surface';

  if (options.iconStart) {
    appendContent(visual, 'cv-chip__icon cv-chip__icon--start', options.iconStart);
  }

  const label = document.createElement('span');
  label.className = 'cv-chip__label';
  label.textContent = options.label;
  visual.append(label);

  if (options.iconEnd) {
    appendContent(visual, 'cv-chip__icon cv-chip__icon--end', options.iconEnd);
  }

  let pendingSource: PrimitiveChipInputSource = 'programmatic';

  const syncState = (): void => {
    wrapper.dataset.selected = input.checked ? 'true' : 'false';
    wrapper.dataset.disabled = input.disabled ? 'true' : 'false';
  };

  input.addEventListener('pointerdown', () => {
    pendingSource = 'pointer';
  });

  input.addEventListener('keydown', () => {
    pendingSource = 'keyboard';
  });

  input.addEventListener('change', () => {
    syncState();
    options.onSelectedChange?.(input.checked, pendingSource);
    pendingSource = 'programmatic';
  });

  wrapper.append(input, visual);
  syncState();

  return {
    element: wrapper,
    input
  };
};

export const createPrimitiveChip = (options: PrimitiveChipOptions): PrimitiveChipHandle => {
  if (options.variant === 'action') {
    return buildActionChip(options);
  }

  return buildFilterChip(options);
};
