import { createFieldController, type FieldControllerOptions } from '@covalent-poc/headless-core';

export interface PrimitiveTextInputOptions extends FieldControllerOptions {
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
}

export interface PrimitiveTextInput {
  element: HTMLInputElement;
  getError: () => string | null;
}

export const createPrimitiveTextInput = (options: PrimitiveTextInputOptions): PrimitiveTextInput => {
  const controller = createFieldController(options);
  const input = document.createElement('input');

  input.className = 'cv-text-input';
  input.type = 'text';
  input.id = options.id;
  input.name = options.name;
  input.placeholder = options.placeholder ?? '';
  input.value = options.value ?? '';

  input.addEventListener('input', () => {
    controller.onInput(input.value);
    input.dataset.invalid = controller.getValidationAttrs()['data-invalid'];
  });

  input.addEventListener('blur', () => {
    controller.onBlur();
    const attrs = controller.getValidationAttrs();
    input.dataset.invalid = attrs['data-invalid'];
    if (attrs['aria-invalid']) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  });

  return {
    element: input,
    getError: () => controller.state.error
  };
};
