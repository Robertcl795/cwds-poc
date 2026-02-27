import { createSelectController, type SelectOption } from '@covalent-poc/core';

export interface CompositeSelectOptions {
  id: string;
  name: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export const createCompositeSelect = (config: CompositeSelectOptions): HTMLSelectElement => {
  const select = document.createElement('select');
  select.className = 'cv-select';
  select.id = config.id;
  select.name = config.name;

  const controllerConfig: {
    options: SelectOption[];
    value?: string;
    onValueChange: (value: string) => void;
  } = {
    options: config.options,
    onValueChange: (value) => config.onValueChange?.(value)
  };

  if (typeof config.value === 'string') {
    controllerConfig.value = config.value;
  }

  const controller = createSelectController(controllerConfig);

  for (const option of config.options) {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    optionElement.disabled = option.disabled ?? false;
    optionElement.selected = option.value === controller.getSelectedValue();
    select.append(optionElement);
  }

  select.addEventListener('change', () => {
    const index = select.selectedIndex;
    controller.selectByIndex(index, 'pointer');
    select.dataset.value = controller.getSelectedValue();
  });

  select.dataset.value = controller.getSelectedValue();

  return select;
};
