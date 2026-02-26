import { createPrimitiveButton } from '@covalent-poc/primitives';
import type { PrimitiveButtonOptions } from '@covalent-poc/primitives';

export interface MwcButtonCompatOptions {
  label: string;
  raised?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const createMwcButtonCompat = (options: MwcButtonCompatOptions): HTMLButtonElement => {
  const buttonOptions: PrimitiveButtonOptions = {
    label: options.label,
    variant: options.raised ? 'primary' : 'secondary',
    onPress: () => options.onClick?.()
  };

  if (typeof options.disabled === 'boolean') {
    buttonOptions.disabled = options.disabled;
  }

  return createPrimitiveButton(buttonOptions);
};
