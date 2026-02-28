export type ControlState = {
  disabled?: boolean | undefined;
  checked?: boolean | undefined;
  indeterminate?: boolean | undefined;
  invalid?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
};

const writeFlag = (element: HTMLElement, name: string, value: boolean | undefined): void => {
  if (value === undefined) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value ? 'true' : 'false');
};

export function writeControlStateAttributes(element: HTMLElement, state: ControlState): void {
  writeFlag(element, 'data-disabled', state.disabled);
  writeFlag(element, 'data-checked', state.checked);
  writeFlag(element, 'data-indeterminate', state.indeterminate);
  writeFlag(element, 'data-invalid', state.invalid);

  if (state.orientation) {
    element.setAttribute('data-orientation', state.orientation);
  } else {
    element.removeAttribute('data-orientation');
  }
}
