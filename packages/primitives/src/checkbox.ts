import { createCheckboxController, type CheckboxControllerOptions } from '@covalent-poc/headless-core';

export interface PrimitiveCheckboxOptions extends CheckboxControllerOptions {
  id: string;
  name: string;
  label: string;
}

export const createPrimitiveCheckbox = (options: PrimitiveCheckboxOptions): HTMLLabelElement => {
  const controller = createCheckboxController(options);

  const wrapper = document.createElement('label');
  wrapper.className = 'cv-checkbox';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = options.id;
  input.name = options.name;
  input.checked = controller.isChecked();

  if (options.disabled) {
    input.disabled = true;
    wrapper.dataset.disabled = 'true';
  }

  input.addEventListener('change', () => {
    controller.setChecked(input.checked, 'pointer');
  });

  const text = document.createElement('span');
  text.textContent = options.label;

  wrapper.append(input, text);

  return wrapper;
};
