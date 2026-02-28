import { createCompositeDialog, type PrimitiveDialogOptions } from './dialog';

export interface ConfirmDialogOptions
  extends Pick<PrimitiveDialogOptions, 'id' | 'trigger' | 'title' | 'description' | 'closeOnEscape' | 'closeOnOutsidePress' | 'onConfirm'> {
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface DestructiveDialogOptions extends ConfirmDialogOptions {
  confirmLabel?: string;
}

export interface AlertDialogOptions
  extends Pick<PrimitiveDialogOptions, 'id' | 'trigger' | 'title' | 'description' | 'closeOnEscape' | 'closeOnOutsidePress' | 'onConfirm'> {
  acknowledgeLabel?: string;
}

export const createConfirmDialog = (options: ConfirmDialogOptions): HTMLDialogElement =>
  createCompositeDialog({
    ...options,
    variant: 'confirm',
    ...(options.confirmLabel !== undefined ? { confirmLabel: options.confirmLabel } : {}),
    ...(options.cancelLabel !== undefined ? { cancelLabel: options.cancelLabel } : {})
  });

export const createDestructiveConfirmDialog = (options: DestructiveDialogOptions): HTMLDialogElement =>
  createCompositeDialog({
    ...options,
    variant: 'destructive-confirm',
    tone: 'error',
    confirmLabel: options.confirmLabel ?? 'Delete',
    ...(options.cancelLabel !== undefined ? { cancelLabel: options.cancelLabel } : {})
  });

export const createAlertDialog = (options: AlertDialogOptions): HTMLDialogElement =>
  createCompositeDialog({
    ...options,
    variant: 'alert',
    showCancel: false,
    confirmLabel: options.acknowledgeLabel ?? 'Acknowledge'
  });
