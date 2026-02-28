import { createDialogController } from '@ds/headless';
import { createPrimitiveButton } from '../button/create-button';
import { createOverlayController } from '../shared-overlay';

export type PrimitiveDialogVariant = 'default' | 'alert' | 'confirm' | 'destructive-confirm';
export type PrimitiveDialogTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

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
  variant?: PrimitiveDialogVariant;
  tone?: PrimitiveDialogTone;
  actionsLayout?: 'end' | 'space-between';
  showCancel?: boolean;
}

let dialogSequence = 0;

const nextDialogId = (): string => {
  dialogSequence += 1;
  return `cv-composite-dialog-${dialogSequence}`;
};

export const createCompositeDialog = (options: PrimitiveDialogOptions): HTMLDialogElement => {
  const variant = options.variant ?? 'default';
  const tone = options.tone ?? 'neutral';
  const dialogId = options.id ?? nextDialogId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  const dialog = document.createElement('dialog');
  dialog.className = 'cv-dialog';
  dialog.id = dialogId;
  dialog.dataset.variant = variant;
  dialog.dataset.tone = tone;
  dialog.dataset.state = 'closed';
  dialog.setAttribute('aria-labelledby', titleId);
  dialog.setAttribute('aria-describedby', descriptionId);
  if (variant === 'alert' || variant === 'destructive-confirm') {
    dialog.setAttribute('role', 'alertdialog');
  } else {
    dialog.removeAttribute('role');
  }

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
  actions.className = 'cv-dialog__actions';
  actions.dataset.layout = options.actionsLayout ?? 'end';

  const shouldShowCancel = options.showCancel ?? variant !== 'alert';
  const confirmLabel =
    options.confirmLabel ??
    (variant === 'destructive-confirm' ? 'Delete' : variant === 'alert' ? 'Acknowledge' : 'Confirm');
  const confirmColor = variant === 'destructive-confirm' || tone === 'error' ? 'negative' : 'primary';

  const confirmButton = createPrimitiveButton({
    label: confirmLabel,
    color: confirmColor,
    onPress: () => {
      options.onConfirm?.();
      dialog.close();
      controller.close('pointer');
    }
  });

  if (shouldShowCancel) {
    const cancelButton = createPrimitiveButton({
      label: options.cancelLabel ?? 'Cancel',
      color: 'secondary',
      shape: 'text',
      onPress: () => {
        dialog.close();
        controller.close('pointer');
      }
    });

    actions.append(cancelButton);
  }

  actions.append(confirmButton);
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

  return dialog;
};
