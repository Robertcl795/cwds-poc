import type { PrimitiveTextInput } from './text-input';

export interface PrimitiveFormFieldOptions {
  input: PrimitiveTextInput;
  label: string;
  helperText?: string;
}

export interface PrimitiveFormField {
  element: HTMLDivElement;
  updateMessage: (text: string, invalid?: boolean) => void;
}

export const createPrimitiveFormField = (options: PrimitiveFormFieldOptions): PrimitiveFormField => {
  const wrapper = document.createElement('div');
  wrapper.className = 'cv-form-field';
  wrapper.dataset.invalid = 'false';

  const label = document.createElement('label');
  label.className = 'cv-form-field__label';
  label.textContent = options.label;
  label.htmlFor = options.input.element.id;

  const helper = document.createElement('p');
  helper.className = 'cv-form-field__helper';
  helper.id = `${options.input.element.id}-helper`;
  helper.textContent = options.helperText ?? '';

  options.input.element.setAttribute('aria-describedby', helper.id);

  wrapper.append(label, options.input.element, helper);

  return {
    element: wrapper,
    updateMessage(text: string, invalid = false): void {
      helper.textContent = text;
      wrapper.dataset.invalid = invalid ? 'true' : 'false';
    }
  };
};
