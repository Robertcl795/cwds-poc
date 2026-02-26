import { createCheckboxController, type CheckboxControllerOptions } from '@covalent-poc/headless-core';

export interface PrimitiveCheckboxOptions extends CheckboxControllerOptions {
  id: string;
  name: string;
  label: string;
  indeterminate?: boolean;
  reducedTouchTarget?: boolean;
}

export const createPrimitiveCheckbox = (options: PrimitiveCheckboxOptions): HTMLLabelElement => {
  const controller = createCheckboxController(options);

  const wrapper = document.createElement('label');
  wrapper.className = 'cv-checkbox';
  wrapper.dataset.indeterminate = options.indeterminate ? 'true' : 'false';
  wrapper.dataset.reducedTouchTarget = options.reducedTouchTarget ? 'true' : 'false';

  const input = document.createElement('input');
  input.className = 'cv-checkbox__control';
  input.type = 'checkbox';
  input.id = options.id;
  input.name = options.name;
  input.checked = controller.isChecked();
  input.indeterminate = options.indeterminate ?? false;

  if (options.disabled) {
    input.disabled = true;
    wrapper.dataset.disabled = 'true';
  }

  input.addEventListener('change', () => {
    wrapper.dataset.indeterminate = 'false';
    controller.setChecked(input.checked, 'pointer');
  });

  const icon = document.createElement('span');
  icon.className = 'cv-checkbox__icon';
  icon.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.className = 'cv-checkbox__label';
  text.textContent = options.label;

  wrapper.append(input, icon, text);

  return wrapper;
};
