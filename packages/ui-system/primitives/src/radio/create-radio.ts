import { setControlDescription } from '../shared/form-assoc';
import { writeControlStateAttributes } from '../shared/control-hooks';

export type PrimitiveRadioOptions = {
  id: string;
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  helpId?: string;
  errorId?: string;
};

export function createPrimitiveRadio(options: PrimitiveRadioOptions): HTMLLabelElement {
  const wrapper = document.createElement('label');
  wrapper.className = 'cv-radio';

  const input = document.createElement('input');
  input.className = 'cv-radio__control';
  input.type = 'radio';
  input.id = options.id;
  input.name = options.name;
  input.value = options.value;
  input.checked = options.checked ?? false;
  input.disabled = options.disabled ?? false;
  input.required = options.required ?? false;

  setControlDescription(input, {
    helpId: options.helpId,
    errorId: options.errorId,
    invalid: options.invalid
  });

  const icon = document.createElement('span');
  icon.className = 'cv-radio__icon';
  icon.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.className = 'cv-radio__label';
  text.textContent = options.label;

  const updateState = (): void => {
    writeControlStateAttributes(wrapper, {
      disabled: input.disabled,
      checked: input.checked,
      invalid: options.invalid
    });
  };

  input.addEventListener('change', updateState);

  wrapper.append(input, icon, text);
  updateState();

  return wrapper;
}
