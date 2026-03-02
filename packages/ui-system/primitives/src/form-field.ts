import { createIconNode } from '@ds/utils-icons';

import { createPrimitiveLoadingIndicator, type LoadingDensity } from './loading';
import type { PrimitiveTextInput } from './text-input';

export type PrimitiveFormFieldVariant = 'standard' | 'outlined';
export type PrimitiveFormFieldTone = 'neutral' | 'negative' | 'positive';
export type PrimitiveHelperVisibility = 'always' | 'focus';

export interface PrimitiveFormFieldOptions {
  input: PrimitiveTextInput;
  label: string;
  helperText?: string;
  helper?: string;
  variant?: PrimitiveFormFieldVariant;
  outlined?: boolean;
  tone?: PrimitiveFormFieldTone;
  iconStart?: string | HTMLElement;
  iconEnd?: string | HTMLElement;
  icon?: string | HTMLElement;
  iconTrailing?: string | HTMLElement;
  prefix?: string;
  suffix?: string;
  dense?: boolean;
  helperPersistent?: boolean;
  charCounter?: boolean;
  maxLength?: number;
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
    try {
      icon.append(createIconNode(iconValue));
    } catch {
      icon.textContent = iconValue;
    }
  } else {
    icon.append(iconValue);
  }

  control.append(icon);
};

const appendAffix = (control: HTMLElement, position: 'start' | 'end', text: string): void => {
  const affix = document.createElement('span');
  affix.className = `cv-form-field__affix cv-form-field__affix--${position}`;
  affix.textContent = text;
  control.append(affix);
};

const syncInteractiveState = (wrapper: HTMLDivElement, input: HTMLInputElement): void => {
  wrapper.dataset.focused = document.activeElement === input ? 'true' : 'false';
  wrapper.dataset.filled = input.value.trim().length > 0 ? 'true' : 'false';
  wrapper.dataset.invalid = input.dataset.invalid === 'true' ? 'true' : 'false';
};

export const createPrimitiveFormField = (options: PrimitiveFormFieldOptions): PrimitiveFormField => {
  const variant =
    options.variant ??
    (options.outlined === true ? 'outlined' : options.outlined === false ? 'standard' : 'standard');
  const iconStart = options.iconStart ?? options.icon;
  const iconEnd = options.iconEnd ?? options.iconTrailing;
  const resolvedIconEnd = options.loading ? undefined : iconEnd;

  const wrapper = document.createElement('div');
  wrapper.className = 'cv-form-field';
  wrapper.dataset.invalid = options.input.element.dataset.invalid === 'true' ? 'true' : 'false';
  wrapper.dataset.variant = variant;
  wrapper.dataset.tone = options.tone ?? 'neutral';
  wrapper.dataset.helperVisibility =
    options.helperVisibility ?? (options.helperPersistent ? 'always' : 'focus');
  wrapper.dataset.loading = options.loading ? 'true' : 'false';
  wrapper.dataset.focused = 'false';
  wrapper.dataset.filled = options.input.element.value.trim().length > 0 ? 'true' : 'false';
  wrapper.dataset.hasIconStart = iconStart ? 'true' : 'false';
  wrapper.dataset.hasIconEnd = resolvedIconEnd ? 'true' : 'false';
  wrapper.dataset.hasPrefix = options.prefix ? 'true' : 'false';
  wrapper.dataset.hasSuffix = options.suffix ? 'true' : 'false';
  wrapper.dataset.dense = options.dense ? 'true' : 'false';
  wrapper.dataset.hasCounter = options.charCounter ? 'true' : 'false';

  if (options.input.element.disabled) {
    wrapper.dataset.disabled = 'true';
  }

  if (options.input.element.readOnly) {
    wrapper.dataset.readOnly = 'true';
  }

  const label = document.createElement('label');
  label.className = 'cv-form-field__label';
  label.textContent = options.label;
  label.htmlFor = options.input.element.id;

  const control = document.createElement('div');
  control.className = 'cv-form-field__control';

  const helper = document.createElement('p');
  helper.className = 'cv-form-field__helper';
  helper.id = `${options.input.element.id}-helper`;
  helper.textContent = options.helperText ?? options.helper ?? '';

  options.input.element.setAttribute('aria-describedby', helper.id);

  if (iconStart) {
    appendIcon(control, 'start', iconStart);
  }

  if (options.prefix) {
    appendAffix(control, 'start', options.prefix);
  }

  if (variant === 'outlined') {
    options.input.element.placeholder = ' ';
    control.append(options.input.element, label);
  } else {
    wrapper.append(label);
    control.append(options.input.element);
  }

  if (options.suffix) {
    appendAffix(control, 'end', options.suffix);
  }

  if (resolvedIconEnd) {
    appendIcon(control, 'end', resolvedIconEnd);
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

  const counter = document.createElement('span');
  counter.className = 'cv-form-field__counter';

  const updateCounter = (): void => {
    if (!options.charCounter) {
      counter.textContent = '';
      return;
    }

    const maxLength = options.maxLength ?? options.input.element.maxLength;
    if (maxLength > -1) {
      counter.textContent = `${options.input.element.value.length}/${maxLength}`;
      return;
    }

    counter.textContent = String(options.input.element.value.length);
  };

  updateCounter();

  const meta = document.createElement('div');
  meta.className = 'cv-form-field__meta';
  meta.append(helper, counter);

  const updateState = (): void => syncInteractiveState(wrapper, options.input.element);
  const onInput = (): void => {
    updateState();
    updateCounter();
  };
  options.input.element.addEventListener('focus', updateState);
  options.input.element.addEventListener('blur', updateState);
  options.input.element.addEventListener('input', onInput);

  wrapper.append(control, meta);

  return {
    element: wrapper,
    updateMessage(text: string, invalid = false): void {
      helper.textContent = text;
      wrapper.dataset.invalid = invalid ? 'true' : 'false';
    }
  };
};
