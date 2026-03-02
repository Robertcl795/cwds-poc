import { setControlDescription } from '../shared/form-assoc';
import { writeControlStateAttributes } from '../shared/control-hooks';

export type PrimitiveSwitchOptions = {
  id: string;
  name: string;
  label: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  helpId?: string;
  errorId?: string;
};

export function createPrimitiveSwitch(options: PrimitiveSwitchOptions): HTMLLabelElement {
  const wrapper = document.createElement('label');
  wrapper.className = 'cv-switch';

  const input = document.createElement('input');
  input.className = 'cv-switch__control';
  input.type = 'checkbox';
  input.id = options.id;
  input.name = options.name;
  input.checked = options.checked ?? false;
  input.disabled = options.disabled ?? false;
  input.required = options.required ?? false;
  if (options.value !== undefined) {
    input.value = options.value;
  }

  setControlDescription(input, {
    helpId: options.helpId,
    errorId: options.errorId,
    invalid: options.invalid
  });

  const track = document.createElement('span');
  track.className = 'cv-switch__track';
  track.setAttribute('aria-hidden', 'true');

  const thumb = document.createElement('span');
  thumb.className = 'cv-switch__thumb';
  track.append(thumb);

  const text = document.createElement('span');
  text.className = 'cv-switch__label';
  text.textContent = options.label;

  const updateState = (): void => {
    writeControlStateAttributes(wrapper, {
      disabled: input.disabled,
      checked: input.checked,
      invalid: options.invalid
    });
  };

  input.addEventListener('change', updateState);

  wrapper.append(input, track, text);
  updateState();

  return wrapper;
}
