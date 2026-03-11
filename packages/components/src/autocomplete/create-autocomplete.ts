import { createTextInputFieldShell } from '../shared/text-input-field';

export interface PrimitiveAutocompleteOption {
  value: string;
  label?: string;
}

export interface PrimitiveAutocompleteOptions {
  id: string;
  name: string;
  label: string;
  options: PrimitiveAutocompleteOption[];
  value?: string;
  placeholder?: string;
  helper?: string;
  helperText?: string;
  validationMessage?: string;
  errorText?: string;
  describedBy?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  outlined?: boolean;
  dense?: boolean;
  icon?: string | HTMLElement;
  iconTrailing?: string | HTMLElement;
  prefix?: string;
  suffix?: string;
  charCounter?: boolean;
  maxLength?: number;
  autoValidate?: boolean;
  validateOnInitialRender?: boolean;
  validate?: (value: string) => string | null;
  autoComplete?: string;
}

export interface PrimitiveAutocomplete {
  element: HTMLDivElement;
  input: HTMLInputElement;
  datalist: HTMLDataListElement;
  getError: () => string | null;
  setOptions: (options: PrimitiveAutocompleteOption[]) => void;
  updateMessage: (text: string, invalid?: boolean) => void;
}

const syncOptions = (datalist: HTMLDataListElement, options: PrimitiveAutocompleteOption[]): void => {
  datalist.replaceChildren();

  for (const option of options) {
    const item = document.createElement('option');
    item.value = option.value;

    if (option.label) {
      item.label = option.label;
      item.textContent = option.label;
    }

    datalist.append(item);
  }
};

export const createPrimitiveAutocomplete = (
  options: PrimitiveAutocompleteOptions
): PrimitiveAutocomplete => {
  const { ids, input, field } = createTextInputFieldShell({
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
      ...(options.placeholder !== undefined ? { placeholder: options.placeholder } : {}),
      ...(options.required !== undefined ? { required: options.required } : {}),
      ...(options.disabled !== undefined ? { disabled: options.disabled } : {}),
      ...(options.readOnly !== undefined ? { readOnly: options.readOnly } : {}),
      ...(options.maxLength !== undefined ? { maxLength: options.maxLength } : {}),
      ...(options.autoValidate !== undefined ? { autoValidate: options.autoValidate } : {}),
      ...(options.validateOnInitialRender !== undefined
        ? { validateOnInitialRender: options.validateOnInitialRender }
        : {}),
      ...(options.validate !== undefined ? { validate: options.validate } : {})
    },
    fieldOptions: {
      outlined: options.outlined ?? true,
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      ...(options.icon !== undefined ? { icon: options.icon } : {}),
      ...(options.iconTrailing !== undefined ? { iconTrailing: options.iconTrailing } : {}),
      ...(options.prefix !== undefined ? { prefix: options.prefix } : {}),
      ...(options.suffix !== undefined ? { suffix: options.suffix } : {}),
      ...(options.charCounter !== undefined ? { charCounter: options.charCounter } : {}),
      ...(options.maxLength !== undefined ? { maxLength: options.maxLength } : {})
    }
  });
  const datalistId = `${ids.controlId}-list`;

  if (options.autoComplete) {
    input.element.setAttribute('autocomplete', options.autoComplete);
  }

  input.element.setAttribute('list', datalistId);

  const datalist = document.createElement('datalist');
  datalist.id = datalistId;
  syncOptions(datalist, options.options);
  field.element.append(datalist);

  return {
    element: field.element,
    input: input.element,
    datalist,
    getError: input.getError,
    setOptions(nextOptions: PrimitiveAutocompleteOption[]): void {
      syncOptions(datalist, nextOptions);
    },
    updateMessage: field.updateMessage
  };
};
