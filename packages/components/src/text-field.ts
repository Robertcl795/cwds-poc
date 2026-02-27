import type { FieldControllerOptions } from '@covalent-poc/core';

import { createPrimitiveFormField, type PrimitiveFormFieldTone } from './form-field';
import type { LoadingDensity } from './loading';
import { createPrimitiveTextInput, type PrimitiveTextInputType } from './text-input';

export interface PrimitiveTextFieldOptions extends FieldControllerOptions {
  id: string;
  name: string;
  label: string;
  value?: string;
  type?: PrimitiveTextInputType;
  placeholder?: string;
  helper?: string;
  helperPersistent?: boolean;
  outlined?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  prefix?: string;
  suffix?: string;
  pattern?: string;
  min?: string;
  max?: string;
  size?: number;
  step?: number;
  icon?: string | HTMLElement;
  iconTrailing?: string | HTMLElement;
  maxLength?: number;
  charCounter?: boolean;
  autoValidate?: boolean;
  validationMessage?: string;
  validateOnInitialRender?: boolean;
  loading?: boolean;
  loaderDensity?: LoadingDensity;
  tone?: PrimitiveFormFieldTone;
}

export interface PrimitiveTextField {
  element: HTMLDivElement;
  input: HTMLInputElement;
  getError: () => string | null;
  updateMessage: (text: string, invalid?: boolean) => void;
}

export const createPrimitiveTextField = (options: PrimitiveTextFieldOptions): PrimitiveTextField => {
  const input = createPrimitiveTextInput({
    id: options.id,
    name: options.name,
    ...(options.value !== undefined ? { value: options.value } : {}),
    ...(options.type !== undefined ? { type: options.type } : {}),
    ...(options.placeholder !== undefined ? { placeholder: options.placeholder } : {}),
    ...(options.required !== undefined ? { required: options.required } : {}),
    ...(options.disabled !== undefined ? { disabled: options.disabled } : {}),
    ...(options.readOnly !== undefined ? { readOnly: options.readOnly } : {}),
    ...(options.pattern !== undefined ? { pattern: options.pattern } : {}),
    ...(options.min !== undefined ? { min: options.min } : {}),
    ...(options.max !== undefined ? { max: options.max } : {}),
    ...(options.size !== undefined ? { size: options.size } : {}),
    ...(options.step !== undefined ? { step: options.step } : {}),
    ...(options.maxLength !== undefined ? { maxLength: options.maxLength } : {}),
    ...(options.autoValidate !== undefined ? { autoValidate: options.autoValidate } : {}),
    ...(options.validateOnInitialRender !== undefined
      ? { validateOnInitialRender: options.validateOnInitialRender }
      : {}),
    ...(options.validate !== undefined ? { validate: options.validate } : {})
  });

  const baseHelper = options.helper ?? '';
  const field = createPrimitiveFormField({
    input,
    label: options.label,
    helper: baseHelper,
    outlined: options.outlined ?? true,
    ...(options.tone !== undefined ? { tone: options.tone } : {}),
    ...(options.icon !== undefined ? { icon: options.icon } : {}),
    ...(options.iconTrailing !== undefined ? { iconTrailing: options.iconTrailing } : {}),
    ...(options.helperPersistent !== undefined ? { helperPersistent: options.helperPersistent } : {}),
    ...(options.dense !== undefined ? { dense: options.dense } : {}),
    ...(options.prefix !== undefined ? { prefix: options.prefix } : {}),
    ...(options.suffix !== undefined ? { suffix: options.suffix } : {}),
    ...(options.charCounter !== undefined ? { charCounter: options.charCounter } : {}),
    ...(options.maxLength !== undefined ? { maxLength: options.maxLength } : {}),
    ...(options.loading !== undefined ? { loading: options.loading } : {}),
    ...(options.loaderDensity !== undefined ? { loadingDensity: options.loaderDensity } : {})
  });

  const syncValidationMessage = (): void => {
    const isInvalid = input.element.dataset.invalid === 'true';

    if (isInvalid && options.validationMessage) {
      field.updateMessage(options.validationMessage, true);
      return;
    }

    field.updateMessage(baseHelper, false);
  };

  input.element.addEventListener('input', syncValidationMessage);
  input.element.addEventListener('blur', syncValidationMessage);

  if (options.validateOnInitialRender) {
    syncValidationMessage();
  }

  return {
    element: field.element,
    input: input.element,
    getError: input.getError,
    updateMessage: field.updateMessage
  };
};
