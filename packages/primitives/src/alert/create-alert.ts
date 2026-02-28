import type { InputSource } from '@ds/headless';

import { createPrimitiveButton } from '../button/create-button';
import { createDismissableController, type DismissReason } from '../shared-feedback';
import type { PrimitiveAlert, PrimitiveAlertAction, PrimitiveAlertOptions } from './alert.types';

const resolveRole = (tone: PrimitiveAlertOptions['tone'], priority: PrimitiveAlertOptions['priority']): 'status' | 'alert' => {
  if (priority === 'assertive') {
    return 'alert';
  }

  if (tone === 'error') {
    return 'alert';
  }

  return 'status';
};

const toButtonColor = (action: PrimitiveAlertAction): 'primary' | 'secondary' | 'negative' => {
  if (action.kind === 'primary') {
    return 'primary';
  }

  if (action.kind === 'danger') {
    return 'negative';
  }

  return 'secondary';
};

const dispatchAlertAction = (element: HTMLElement, action: PrimitiveAlertAction, source: InputSource): void => {
  element.dispatchEvent(
    new CustomEvent('cv-alert-action', {
      bubbles: true,
      detail: {
        action,
        source
      }
    })
  );
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
    const button = createPrimitiveButton({
      label: action.label,
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      shape: action.kind === 'primary' ? 'contained' : 'text',
      color: toButtonColor(action),
      ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
      onPress(source) {
        dispatchAlertAction(element, action, source);
        options.onAction?.(action, source);

        if (action.dismissOnAction) {
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
