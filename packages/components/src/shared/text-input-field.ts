import {
  applyDescribedBy,
  createFieldIds,
  resolveFieldMessages,
  type FieldIds
} from '@ds/core';

import { createPrimitiveFormField, type PrimitiveFormField, type PrimitiveFormFieldOptions } from '../form-field';
import { createPrimitiveTextInput, type PrimitiveTextInput, type PrimitiveTextInputOptions } from '../text-input';

type TextInputFieldShellOptions = {
  id: string;
  label: string;
  helper?: string | undefined;
  helperText?: string | undefined;
  validationMessage?: string | undefined;
  errorText?: string | undefined;
  describedBy?: string | undefined;
  validateOnInitialRender?: boolean | undefined;
  inputOptions: Omit<PrimitiveTextInputOptions, 'id'>;
  fieldOptions?: Omit<PrimitiveFormFieldOptions, 'input' | 'label' | 'helper' | 'helperText'> | undefined;
};

type TextInputFieldShell = {
  ids: FieldIds;
  input: PrimitiveTextInput;
  field: PrimitiveFormField;
};

export const createTextInputFieldShell = (options: TextInputFieldShellOptions): TextInputFieldShell => {
  const ids = createFieldIds(options.id);
  const input = createPrimitiveTextInput({
    id: ids.controlId,
    ...options.inputOptions
  });
  const messages = resolveFieldMessages({
    ...(options.helper !== undefined ? { helper: options.helper } : {}),
    ...(options.helperText !== undefined ? { helperText: options.helperText } : {}),
    ...(options.validationMessage !== undefined ? { validationMessage: options.validationMessage } : {}),
    ...(options.errorText !== undefined ? { errorText: options.errorText } : {})
  });
  const baseHelper = messages.helperText;
  const field = createPrimitiveFormField({
    input,
    label: options.label,
    helper: baseHelper,
    ...options.fieldOptions
  });

  const syncValidationMessage = (): void => {
    const isInvalid = input.element.getAttribute('aria-invalid') === 'true';

    if (isInvalid && messages.errorText) {
      field.updateMessage(messages.errorText, true);
      return;
    }

    field.updateMessage(baseHelper, false);
  };

  if (options.describedBy) {
    applyDescribedBy(input.element, [input.element.getAttribute('aria-describedby'), options.describedBy]);
  }

  input.element.addEventListener('input', syncValidationMessage);
  input.element.addEventListener('blur', syncValidationMessage);

  if (options.validateOnInitialRender) {
    syncValidationMessage();
  }

  return {
    ids,
    input,
    field
  };
};
