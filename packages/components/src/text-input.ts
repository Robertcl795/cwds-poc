import { createFieldController, type FieldControllerOptions } from '@covalent-poc/core';

export type PrimitiveTextInputType =
  | 'text'
  | 'search'
  | 'tel'
  | 'url'
  | 'email'
  | 'password'
  | 'date'
  | 'month'
  | 'week'
  | 'time'
  | 'datetime-local'
  | 'number'
  | 'color';

export interface PrimitiveTextInputOptions extends FieldControllerOptions {
  id: string;
  name: string;
  type?: PrimitiveTextInputType;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  pattern?: string;
  min?: string;
  max?: string;
  size?: number;
  step?: number;
  maxLength?: number;
  autoValidate?: boolean;
  validateOnInitialRender?: boolean;
}

export interface PrimitiveTextInput {
  element: HTMLInputElement;
  getError: () => string | null;
}

export const createPrimitiveTextInput = (options: PrimitiveTextInputOptions): PrimitiveTextInput => {
  const controller = createFieldController(options);
  const input = document.createElement('input');

  input.className = 'cv-text-input';
  input.type = options.type ?? 'text';
  input.id = options.id;
  input.name = options.name;
  input.placeholder = options.placeholder ?? '';
  input.value = options.value ?? '';
  input.dataset.invalid = 'false';

  if (options.disabled) {
    input.disabled = true;
  }

  if (options.readOnly) {
    input.readOnly = true;
  }

  if (options.pattern) {
    input.pattern = options.pattern;
  }

  if (options.min) {
    input.min = options.min;
  }

  if (options.max) {
    input.max = options.max;
  }

  if (options.size !== undefined) {
    input.size = options.size;
  }

  if (options.step !== undefined) {
    input.step = String(options.step);
  }

  if (options.maxLength !== undefined) {
    input.maxLength = options.maxLength;
  }

  const syncValidationState = (): void => {
    const attrs = controller.getValidationAttrs();
    input.dataset.invalid = attrs['data-invalid'];

    if (attrs['aria-invalid']) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  };

  if (input.value.length > 0) {
    controller.onInput(input.value);
  }

  if (options.validateOnInitialRender) {
    controller.onBlur();
    syncValidationState();
  }

  input.addEventListener('input', () => {
    controller.onInput(input.value);

    if (options.autoValidate) {
      controller.onBlur();
    }

    syncValidationState();
  });

  input.addEventListener('blur', () => {
    controller.onBlur();
    syncValidationState();
  });

  return {
    element: input,
    getError: () => controller.state.error
  };
};
