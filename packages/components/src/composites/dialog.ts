import { createDialogController } from '@covalent-poc/core';
import { createPrimitiveButton } from '../button/create-button';
import { createOverlayController } from '../shared-overlay';

export interface PrimitiveDialogOptions {
  id?: string;
  trigger?: HTMLElement | null;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  closeOnEscape?: boolean;
  closeOnOutsidePress?: boolean;
  onConfirm?: () => void;
}

let dialogSequence = 0;

const nextDialogId = (): string => {
  dialogSequence += 1;
  return `cv-composite-dialog-${dialogSequence}`;
};

export const createCompositeDialog = (options: PrimitiveDialogOptions): HTMLDialogElement => {
  const dialogId = options.id ?? nextDialogId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  const dialog = document.createElement('dialog');
  dialog.className = 'cv-dialog';
  dialog.id = dialogId;
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.setAttribute('aria-describedby', descriptionId);

  const controller = createDialogController();
  const overlayController = createOverlayController({
    overlay: dialog,
    trigger: options.trigger ?? null
  });

  const title = document.createElement('h2');
  title.id = titleId;
  title.textContent = options.title;

  const description = document.createElement('p');
  description.id = descriptionId;
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
    overlayController.close('programmatic');
    dialog.dataset.state = 'closed';
  });

  dialog.addEventListener('cancel', (event) => {
    if (options.closeOnEscape === false) {
      event.preventDefault();
    }
  });

  if (options.closeOnOutsidePress === true) {
    dialog.addEventListener('pointerdown', (event) => {
      if (event.target === dialog) {
        dialog.close('dismiss-outside');
      }
    });
  }

  const observer = new MutationObserver(() => {
    if (dialog.hasAttribute('open')) {
      controller.open('programmatic');
      overlayController.open('programmatic');
      dialog.dataset.state = 'open';
      return;
    }

    controller.close('programmatic');
    overlayController.close('programmatic');
    dialog.dataset.state = 'closed';
  });

  observer.observe(dialog, {
    attributes: true,
    attributeFilter: ['open']
  });

  dialog.dataset.state = 'closed';

  return dialog;
};
