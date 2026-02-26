import type { InputSource } from '../types/events';

export interface CheckboxControllerOptions {
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean, source: InputSource) => void;
}

export const createCheckboxController = (options: CheckboxControllerOptions = {}) => {
  let checked = options.checked ?? false;

  return {
    isChecked(): boolean {
      return checked;
    },
    setChecked(nextChecked: boolean, source: InputSource = 'programmatic'): void {
      if (options.disabled) {
        return;
      }

      checked = nextChecked;
      options.onCheckedChange?.(checked, source);
    },
    toggle(source: InputSource): void {
      this.setChecked(!checked, source);
    }
  };
};
