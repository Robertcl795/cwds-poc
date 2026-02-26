import { createCompositeDialog } from '@covalent-poc/composites';
import type { PrimitiveDialogOptions } from '@covalent-poc/composites';

export interface MwcDialogCompatOptions {
  heading: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export const createMwcDialogCompat = (options: MwcDialogCompatOptions): HTMLDialogElement => {
  const dialogOptions: PrimitiveDialogOptions = {
    title: options.heading,
    description: options.description
  };

  if (options.primaryActionLabel) {
    dialogOptions.confirmLabel = options.primaryActionLabel;
  }

  if (options.secondaryActionLabel) {
    dialogOptions.cancelLabel = options.secondaryActionLabel;
  }

  if (options.onPrimaryAction) {
    dialogOptions.onConfirm = options.onPrimaryAction;
  }

  return createCompositeDialog(dialogOptions);
};
