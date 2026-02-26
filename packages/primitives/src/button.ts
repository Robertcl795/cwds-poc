import { createButtonController, type ButtonControllerOptions } from '@covalent-poc/headless-core';

import { createPrimitiveLoadingIndicator, type LoadingDensity } from './loading';

export type PrimitiveButtonShape = 'contained' | 'outlined' | 'text';
export type PrimitiveButtonColor =
  | 'primary'
  | 'secondary'
  | 'emphasis'
  | 'caution'
  | 'negative'
  | 'positive';

export interface PrimitiveButtonOptions extends ButtonControllerOptions {
  label: string;
  shape?: PrimitiveButtonShape;
  color?: PrimitiveButtonColor;
  iconStart?: string | HTMLElement;
  iconEnd?: string | HTMLElement;
  loading?: boolean;
  loadingLabel?: string;
  loadingDensity?: LoadingDensity;
  variant?: 'primary' | 'secondary';
}

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

const appendRipple = (button: HTMLButtonElement, event: PointerEvent): void => {
  if (button.disabled || button.dataset.disabled === 'true' || button.dataset.loading === 'true') {
    return;
  }

  const rect = button.getBoundingClientRect();
  const maxSide = Math.max(rect.width, rect.height);
  const fallbackX = rect.width / 2;
  const fallbackY = rect.height / 2;
  const left = Number.isFinite(event.clientX) ? event.clientX - rect.left : fallbackX;
  const top = Number.isFinite(event.clientY) ? event.clientY - rect.top : fallbackY;

  const ripple = document.createElement('span');
  ripple.className = 'cv-button__ripple';
  ripple.style.width = `${maxSide * 2.1}px`;
  ripple.style.height = `${maxSide * 2.1}px`;
  ripple.style.left = `${left}px`;
  ripple.style.top = `${top}px`;

  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  button.append(ripple);
};

export const createPrimitiveButton = (options: PrimitiveButtonOptions): HTMLButtonElement => {
  const isLoading = options.loading === true;
  const disabled = options.disabled === true || isLoading;

  const controller = createButtonController({
    ...options,
    disabled
  });

  const element = document.createElement('button');
  const a11yProps = controller.getA11yProps();

  element.type = a11yProps.type;
  if (a11yProps.disabled) {
    element.disabled = true;
    element.setAttribute('aria-disabled', 'true');
    element.dataset.disabled = 'true';
  }

  const color = options.color ?? options.variant ?? 'primary';
  const shape = options.shape ?? 'contained';

  element.className = 'cv-button';
  element.dataset.color = color;
  element.dataset.shape = shape;
  element.dataset.loading = isLoading ? 'true' : 'false';

  if (isLoading) {
    element.setAttribute('aria-busy', 'true');
  }

  const content = document.createElement('span');
  content.className = 'cv-button__content';

  if (isLoading) {
    content.append(
      createPrimitiveLoadingIndicator({
        density: options.loadingDensity ?? 'sm',
        label: options.loadingLabel ?? `Loading ${options.label}`
      })
    );
  } else if (options.iconStart) {
    appendIcon(content, 'start', options.iconStart);
  }

  const label = document.createElement('span');
  label.className = 'cv-button__label';
  label.textContent = isLoading && options.loadingLabel ? options.loadingLabel : options.label;
  content.append(label);

  if (!isLoading && options.iconEnd) {
    appendIcon(content, 'end', options.iconEnd);
  }

  element.append(content);

  element.addEventListener('pointerdown', (event) => appendRipple(element, event));
  element.addEventListener('click', (event) => controller.onClick(event));
  element.addEventListener('keydown', (event) => controller.onKeyDown(event));

  return element;
};
