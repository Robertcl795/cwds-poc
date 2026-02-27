import {
  createSelectController,
  type InputSource,
  type SelectControllerOptions,
  type SelectOption
} from '@covalent-poc/core';

export type PrimitiveSelectOption = SelectOption;

export interface PrimitiveSelectOptions {
  id: string;
  name: string;
  label: string;
  options: PrimitiveSelectOption[];
  value?: string;
  validationMessage?: string;
  helper?: string;
  icon?: string | HTMLElement;
  required?: boolean;
  outlined?: boolean;
  naturalMenuWidth?: boolean;
  fixedMenuPosition?: boolean;
  disabled?: boolean;
  validateOnInitialRender?: boolean;
  onValueChange?: (value: string, source: InputSource) => void;
}

export interface PrimitiveSelect {
  element: HTMLDivElement;
  selectElement: HTMLSelectElement;
  setValue: (value: string) => void;
}

const EMPTY_OPTION_ID = '__cv-select-empty-option';

const appendIcon = (control: HTMLElement, iconValue: string | HTMLElement): void => {
  const icon = document.createElement('span');
  icon.className = 'cv-select-field__icon';
  icon.setAttribute('aria-hidden', 'true');

  if (typeof iconValue === 'string') {
    icon.textContent = iconValue;
  } else {
    icon.append(iconValue);
  }

  control.append(icon);
};

export const createPrimitiveSelect = (options: PrimitiveSelectOptions): PrimitiveSelect => {
  const shouldRenderEmptyOption = options.required === true && options.value === undefined;

  const normalizedOptions: PrimitiveSelectOption[] = shouldRenderEmptyOption
    ? [{ id: EMPTY_OPTION_ID, label: '', value: '' }, ...options.options]
    : [...options.options];

  const controllerOptions: SelectControllerOptions = {
    options: normalizedOptions,
    ...(options.value !== undefined ? { value: options.value } : {}),
    ...(options.onValueChange !== undefined ? { onValueChange: options.onValueChange } : {})
  };

  const controller = createSelectController(controllerOptions);

  const wrapper = document.createElement('div');
  wrapper.className = 'cv-select-field';
  wrapper.dataset.outlined = options.outlined === false ? 'false' : 'true';
  wrapper.dataset.disabled = options.disabled ? 'true' : 'false';
  wrapper.dataset.invalid = 'false';
  wrapper.dataset.focused = 'false';
  wrapper.dataset.hasIcon = options.icon ? 'true' : 'false';
  wrapper.dataset.naturalMenuWidth = options.naturalMenuWidth ? 'true' : 'false';
  wrapper.dataset.fixedMenuPosition = options.fixedMenuPosition ? 'true' : 'false';
  wrapper.dataset.filled = controller.getSelectedValue().trim().length > 0 ? 'true' : 'false';

  const label = document.createElement('label');
  label.className = 'cv-select-field__label';
  label.textContent = options.label;
  label.htmlFor = options.id;

  const control = document.createElement('div');
  control.className = 'cv-select-field__control';

  if (options.icon) {
    appendIcon(control, options.icon);
  }

  const select = document.createElement('select');
  select.className = 'cv-select';
  select.id = options.id;
  select.name = options.name;

  if (options.required) {
    select.required = true;
  }

  if (options.disabled) {
    select.disabled = true;
  }

  for (let index = 0; index < normalizedOptions.length; index += 1) {
    const option = normalizedOptions[index];
    if (!option) {
      continue;
    }

    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    optionElement.disabled = option.disabled === true;

    if (shouldRenderEmptyOption && index === 0) {
      optionElement.hidden = true;
    }

    select.append(optionElement);
  }

  select.value = controller.getSelectedValue();

  const helper = document.createElement('p');
  helper.className = 'cv-select-field__helper';
  helper.id = `${options.id}-helper`;
  helper.textContent = options.helper ?? '';

  select.setAttribute('aria-describedby', helper.id);

  const syncValueState = (): void => {
    wrapper.dataset.filled = select.value.trim().length > 0 ? 'true' : 'false';
  };

  const syncValidation = (): void => {
    const isInvalid = options.required === true && select.value.trim().length === 0;
    wrapper.dataset.invalid = isInvalid ? 'true' : 'false';

    if (isInvalid) {
      select.setAttribute('aria-invalid', 'true');
      helper.textContent = options.validationMessage ?? options.helper ?? '';
    } else {
      select.removeAttribute('aria-invalid');
      helper.textContent = options.helper ?? '';
    }
  };

  if (options.validateOnInitialRender) {
    syncValidation();
  }

  let pendingSource: InputSource = 'programmatic';

  select.addEventListener('pointerdown', () => {
    pendingSource = 'pointer';
  });

  select.addEventListener('keydown', () => {
    pendingSource = 'keyboard';
  });

  select.addEventListener('focus', () => {
    wrapper.dataset.focused = 'true';
  });

  select.addEventListener('blur', () => {
    wrapper.dataset.focused = 'false';
    syncValidation();
  });

  select.addEventListener('change', () => {
    controller.selectByIndex(select.selectedIndex, pendingSource);
    pendingSource = 'programmatic';
    syncValueState();
    syncValidation();
  });

  control.append(select);
  wrapper.append(label, control, helper);

  return {
    element: wrapper,
    selectElement: select,
    setValue(value: string): void {
      select.value = value;
      const index = normalizedOptions.findIndex((option) => option.value === value);
      controller.selectByIndex(index);
      syncValueState();
      syncValidation();
    }
  };
};
