import type { InputSource } from '../types/events';

export interface CheckboxControllerOptions {
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean, source: InputSource) => void;
}

export const createCheckboxController = (options: CheckboxControllerOptions = {}) => {
  let checked = options.checked ?? false;

  const setChecked = (nextChecked: boolean, source: InputSource = 'programmatic'): void => {
    if (options.disabled || checked === nextChecked) {
      return;
    }

    checked = nextChecked;
    options.onCheckedChange?.(checked, source);
  };

  return {
    isChecked(): boolean {
      return checked;
    },
    setChecked,
    toggle(source: InputSource): void {
      setChecked(!checked, source);
    }
  };
};
