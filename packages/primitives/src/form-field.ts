import { createPrimitiveLoadingIndicator, type LoadingDensity } from './loading';
import type { PrimitiveTextInput } from './text-input';

export type PrimitiveFormFieldVariant = 'standard' | 'outlined';
export type PrimitiveFormFieldTone = 'neutral' | 'negative' | 'positive';
export type PrimitiveHelperVisibility = 'always' | 'focus';

export interface PrimitiveFormFieldOptions {
  input: PrimitiveTextInput;
  label: string;
  helperText?: string;
  variant?: PrimitiveFormFieldVariant;
  tone?: PrimitiveFormFieldTone;
  iconStart?: string | HTMLElement;
  iconEnd?: string | HTMLElement;
  helperVisibility?: PrimitiveHelperVisibility;
  loading?: boolean;
  loadingDensity?: LoadingDensity;
}

export interface PrimitiveFormField {
  element: HTMLDivElement;
  updateMessage: (text: string, invalid?: boolean) => void;
}

const appendIcon = (
  control: HTMLElement,
  position: 'start' | 'end',
  iconValue: string | HTMLElement
): void => {
  const icon = document.createElement('span');
  icon.className = `cv-form-field__icon cv-form-field__icon--${position}`;

  if (typeof iconValue === 'string') {
    icon.textContent = iconValue;
  } else {
    icon.append(iconValue);
  }

  control.append(icon);
};

const syncInteractiveState = (wrapper: HTMLDivElement, input: HTMLInputElement): void => {
  wrapper.dataset.focused = document.activeElement === input ? 'true' : 'false';
  wrapper.dataset.filled = input.value.trim().length > 0 ? 'true' : 'false';
};

export const createPrimitiveFormField = (options: PrimitiveFormFieldOptions): PrimitiveFormField => {
  const variant = options.variant ?? 'standard';

  const wrapper = document.createElement('div');
  wrapper.className = 'cv-form-field';
  wrapper.dataset.invalid = 'false';
  wrapper.dataset.variant = variant;
  wrapper.dataset.tone = options.tone ?? 'neutral';
  wrapper.dataset.helperVisibility = options.helperVisibility ?? 'focus';
  wrapper.dataset.loading = options.loading ? 'true' : 'false';
  wrapper.dataset.focused = 'false';
  wrapper.dataset.filled = options.input.element.value.trim().length > 0 ? 'true' : 'false';
  wrapper.dataset.hasIconStart = options.iconStart ? 'true' : 'false';
  wrapper.dataset.hasIconEnd = options.iconEnd ? 'true' : 'false';

  const label = document.createElement('label');
  label.className = 'cv-form-field__label';
  label.textContent = options.label;
  label.htmlFor = options.input.element.id;

  const control = document.createElement('div');
  control.className = 'cv-form-field__control';

  const helper = document.createElement('p');
  helper.className = 'cv-form-field__helper';
  helper.id = `${options.input.element.id}-helper`;
  helper.textContent = options.helperText ?? '';

  options.input.element.setAttribute('aria-describedby', helper.id);

  if (options.iconStart) {
    appendIcon(control, 'start', options.iconStart);
  }

  if (variant === 'outlined') {
    options.input.element.placeholder = ' ';
    control.append(options.input.element, label);
  } else {
    wrapper.append(label);
    control.append(options.input.element);
  }

  if (options.iconEnd) {
    appendIcon(control, 'end', options.iconEnd);
  }

  if (options.loading) {
    const loader = createPrimitiveLoadingIndicator({
      density: options.loadingDensity ?? 'sm',
      label: `Loading ${options.label}`,
      muted: true
    });
    const loaderSlot = document.createElement('span');
    loaderSlot.className = 'cv-form-field__loader';
    loaderSlot.append(loader);
    options.input.element.setAttribute('aria-busy', 'true');
    control.append(loaderSlot);
  }

  const updateState = (): void => syncInteractiveState(wrapper, options.input.element);
  options.input.element.addEventListener('focus', updateState);
  options.input.element.addEventListener('blur', updateState);
  options.input.element.addEventListener('input', updateState);

  wrapper.append(control, helper);

  return {
    element: wrapper,
    updateMessage(text: string, invalid = false): void {
      helper.textContent = text;
      wrapper.dataset.invalid = invalid ? 'true' : 'false';
    }
  };
};
