import { createDialogController, trapTabWithin } from '@covalent-poc/core';
import { createPrimitiveButton } from '../button/create-button';

export interface PrimitiveDialogOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export const createCompositeDialog = (options: PrimitiveDialogOptions): HTMLDialogElement => {
  const dialog = document.createElement('dialog');
  dialog.className = 'cv-dialog';
  dialog.setAttribute('aria-labelledby', 'cv-dialog-title');
  dialog.setAttribute('aria-describedby', 'cv-dialog-description');

  const controller = createDialogController();

  const title = document.createElement('h2');
  title.id = 'cv-dialog-title';
  title.textContent = options.title;

  const description = document.createElement('p');
  description.id = 'cv-dialog-description';
  description.textContent = options.description;

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '0.75rem';
  actions.style.justifyContent = 'flex-end';

  const cancelButton = createPrimitiveButton({
    label: options.cancelLabel ?? 'Cancel',
    variant: 'secondary',
    onPress: () => {
      dialog.close();
      controller.close('pointer');
    }
  });

  const confirmButton = createPrimitiveButton({
    label: options.confirmLabel ?? 'Confirm',
    onPress: () => {
      options.onConfirm?.();
      dialog.close();
      controller.close('pointer');
    }
  });

  actions.append(cancelButton, confirmButton);
  dialog.append(title, description, actions);

  dialog.addEventListener('close', () => {
    controller.close('programmatic');
    dialog.dataset.state = 'closed';
  });

  dialog.addEventListener('keydown', (event) => {
    trapTabWithin(dialog, event);
  });

  dialog.dataset.state = 'closed';

  return dialog;
};
