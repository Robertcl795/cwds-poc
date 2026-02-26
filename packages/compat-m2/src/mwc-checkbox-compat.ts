import { createPrimitiveCheckbox } from '@covalent-poc/primitives';

export interface MwcCheckboxCompatOptions {
  id: string;
  name: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
}

export const createMwcCheckboxCompat = (options: MwcCheckboxCompatOptions): HTMLLabelElement =>
  createPrimitiveCheckbox(options);
