import { createButtonController, type ButtonControllerOptions } from '@covalent-poc/headless-core';

export interface PrimitiveButtonOptions extends ButtonControllerOptions {
  label: string;
  variant?: 'primary' | 'secondary';
}

export const createPrimitiveButton = (options: PrimitiveButtonOptions): HTMLButtonElement => {
  const controller = createButtonController(options);
  const element = document.createElement('button');
  const a11yProps = controller.getA11yProps();

  element.type = a11yProps.type;
  if (a11yProps.disabled) {
    element.disabled = true;
    element.setAttribute('aria-disabled', 'true');
    element.dataset.disabled = 'true';
  }

  element.className = 'cv-button';
  element.dataset.variant = options.variant ?? 'primary';
  element.textContent = options.label;

  element.addEventListener('click', (event) => controller.onClick(event));
  element.addEventListener('keydown', (event) => controller.onKeyDown(event));

  return element;
};
