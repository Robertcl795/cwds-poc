import { createPrimitiveFormField, createPrimitiveTextInput } from '@covalent-poc/primitives';
import type { PrimitiveFormFieldOptions, PrimitiveTextInputOptions } from '@covalent-poc/primitives';

export interface MwcTextfieldCompatOptions {
  id: string;
  name: string;
  label: string;
  helper?: string;
  required?: boolean;
}

export const createMwcTextfieldCompat = (options: MwcTextfieldCompatOptions): HTMLDivElement => {
  const textInputOptions: PrimitiveTextInputOptions = {
    id: options.id,
    name: options.name
  };

  if (typeof options.required === 'boolean') {
    textInputOptions.required = options.required;
  }

  const input = createPrimitiveTextInput(textInputOptions);

  const fieldOptions: PrimitiveFormFieldOptions = {
    input,
    label: options.label
  };

  if (options.helper) {
    fieldOptions.helperText = options.helper;
  }

  const field = createPrimitiveFormField(fieldOptions);

  return field.element;
};
