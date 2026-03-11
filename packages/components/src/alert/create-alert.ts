import { createDismissableController, type DismissReason } from '@ds/core';
import { createPrimitiveButton } from '../button/create-button';
import { createSurfaceActionButton, dispatchSurfaceActionEvent } from '../shared-actions/render';
import type { PrimitiveAlert, PrimitiveAlertOptions } from './alert.types';

const resolveRole = (tone: PrimitiveAlertOptions['tone'], priority: PrimitiveAlertOptions['priority']): 'status' | 'alert' => {
  if (priority === 'assertive') {
    return 'alert';
  }

  if (tone === 'error') {
    return 'alert';
  }

  return 'status';
};

const dispatchAlertDismiss = (element: HTMLElement, reason: DismissReason): void => {
  element.dispatchEvent(
    new CustomEvent('cv-alert-dismiss', {
      bubbles: true,
      detail: {
        reason
      }
    })
  );
};

export const createPrimitiveAlert = (options: PrimitiveAlertOptions): PrimitiveAlert => {
  const tone = options.tone ?? 'neutral';
  const priority = options.priority ?? (tone === 'error' ? 'assertive' : 'polite');

  const element = document.createElement('section');
  element.className = 'cv-alert';
  element.dataset.tone = tone;
  element.dataset.variant = options.variant ?? 'soft';
  element.dataset.dense = options.dense ? 'true' : 'false';
  element.dataset.dismissed = 'false';
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', 'true');
  element.setAttribute('role', resolveRole(tone, priority));

  if (options.id) {
    element.id = options.id;
  }

  const content = document.createElement('div');
  content.className = 'cv-alert__content';

  if (options.title) {
    const title = document.createElement('h3');
    title.className = 'cv-alert__title';
    title.textContent = options.title;
    content.append(title);
  }

  const message = document.createElement('p');
  message.className = 'cv-alert__message';
  message.textContent = options.message;
  content.append(message);

  element.append(content);

  const actionsRow = document.createElement('div');
  actionsRow.className = 'cv-alert__actions';

  const dismissable = createDismissableController();
  dismissable.onDismiss((reason) => {
    element.dataset.dismissed = 'true';
    element.hidden = true;
    dispatchAlertDismiss(element, reason);
    options.onDismiss?.(reason);
  });

  for (const action of options.actions ?? []) {
    const button = createSurfaceActionButton({
      action,
      shape: action.kind === 'primary' ? 'contained' : 'text',
      dense: options.dense,
      onAction(resolvedAction, source) {
        dispatchSurfaceActionEvent(element, 'cv-alert-action', resolvedAction, source);
        options.onAction?.(resolvedAction, source);

        if (resolvedAction.dismissOnAction) {
          dismissable.dismiss('action');
        }
      }
    });

    button.dataset.alertAction = action.id;
    actionsRow.append(button);
  }

  if (options.dismissible) {
    const closeButton = createPrimitiveButton({
      label: 'Dismiss',
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      shape: 'text',
      color: 'secondary',
      onPress() {
        dismissable.dismiss('close-button');
      }
    });

    closeButton.classList.add('cv-alert__close');
    actionsRow.append(closeButton);
  }

  if (actionsRow.childElementCount > 0) {
    element.append(actionsRow);
  }

  return {
    element,
    setMessage(nextMessage: string): void {
      message.textContent = nextMessage;
    },
    dismiss(reason = 'programmatic'): void {
      dismissable.dismiss(reason);
    }
  };
};
