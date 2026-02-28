import type { CheckboxControllerOptions } from '@ds/headless';

import { setControlDescription } from '../shared/form-assoc';
import { writeControlStateAttributes } from '../shared/control-hooks';

export interface PrimitiveCheckboxOptions extends CheckboxControllerOptions {
  id: string;
  name: string;
  label: string;
  value?: string;
  required?: boolean;
  helpId?: string;
  errorId?: string;
  invalid?: boolean;
  indeterminate?: boolean;
  reducedTouchTarget?: boolean;
}

export const createPrimitiveCheckbox = (options: PrimitiveCheckboxOptions): HTMLLabelElement => {
  const wrapper = document.createElement('label');
  wrapper.className = 'cv-checkbox';
  wrapper.dataset.reducedTouchTarget = options.reducedTouchTarget ? 'true' : 'false';

  const input = document.createElement('input');
  input.className = 'cv-checkbox__control';
  input.type = 'checkbox';
  input.id = options.id;
  input.name = options.name;
  input.checked = options.checked ?? false;
  input.disabled = options.disabled ?? false;
  input.indeterminate = options.indeterminate ?? false;
  input.required = options.required ?? false;
  if (options.value !== undefined) {
    input.value = options.value;
  }

  setControlDescription(input, {
    helpId: options.helpId,
    errorId: options.errorId,
    invalid: options.invalid
  });

  const icon = document.createElement('span');
  icon.className = 'cv-checkbox__icon';
  icon.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.className = 'cv-checkbox__label';
  text.textContent = options.label;

  const updateState = (): void => {
    writeControlStateAttributes(wrapper, {
      disabled: input.disabled,
      checked: input.checked,
      indeterminate: input.indeterminate,
      invalid: options.invalid
    });
  };

  input.addEventListener('change', () => {
    if (input.indeterminate) {
      input.indeterminate = false;
    }

    updateState();
    options.onCheckedChange?.(input.checked, 'pointer');
  });

  wrapper.append(input, icon, text);
  updateState();

  return wrapper;
};
