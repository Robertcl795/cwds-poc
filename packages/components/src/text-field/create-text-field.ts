import { createTextInputFieldShell } from '../shared/text-input-field';
import type { PrimitiveTextField, PrimitiveTextFieldOptions } from './text-field.types';

export const createPrimitiveTextField = (options: PrimitiveTextFieldOptions): PrimitiveTextField => {
  const { input, field } = createTextInputFieldShell({
    id: options.id,
    label: options.label,
    helper: options.helper,
    helperText: options.helperText,
    validationMessage: options.validationMessage,
    errorText: options.errorText,
    describedBy: options.describedBy,
    validateOnInitialRender: options.validateOnInitialRender,
    inputOptions: {
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
    },
    fieldOptions: {
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
    }
  });

  return {
    element: field.element,
    input: input.element,
    getError: input.getError,
    updateMessage: field.updateMessage
  };
};
