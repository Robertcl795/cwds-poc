import type { DismissReason } from '../shared-feedback';
import { createPrimitiveButton } from '../button/create-button';
import { createSnackbarQueue, type SnackbarQueueItem } from './snackbar-queue';
import type {
  PrimitiveSnackbarHost,
  PrimitiveSnackbarHostOptions,
  PrimitiveSnackbarMessage,
  SnackbarActionEventDetail,
  SnackbarDismissEventDetail
} from './snackbar.types';

let snackbarSequence = 0;

const nextSnackbarId = (): string => {
  snackbarSequence += 1;
  return `cv-snackbar-${snackbarSequence}`;
};

const prefersReducedMotion = (): boolean => {
  const media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  return media?.matches === true;
};

const dispatchDismissEvent = (host: HTMLElement, detail: SnackbarDismissEventDetail): void => {
  host.dispatchEvent(
    new CustomEvent('cv-snackbar-dismiss', {
      bubbles: true,
      detail
    })
  );
};

const dispatchActionEvent = (host: HTMLElement, detail: SnackbarActionEventDetail): void => {
  host.dispatchEvent(
    new CustomEvent('cv-snackbar-action', {
      bubbles: true,
      detail
    })
  );
};

export const createPrimitiveSnackbarHost = (options: PrimitiveSnackbarHostOptions = {}): PrimitiveSnackbarHost => {
  const host = document.createElement('div');
  host.className = 'cv-snackbar-host';

  if (options.id) {
    host.id = options.id;
  }

  const root = options.root ?? document.body;
  root.append(host);

  const queue = createSnackbarQueue();
  const defaultDurationMs = Math.max(0, options.defaultDurationMs ?? 5000);
  const closeAnimationMs = Math.max(0, options.closeAnimationMs ?? 120);

  let active: SnackbarQueueItem | null = null;
  let activeElement: HTMLElement | null = null;
  let activeTimer: number | null = null;
  let disposed = false;

  const clearTimer = (): void => {
    if (activeTimer === null) {
      return;
    }

    window.clearTimeout(activeTimer);
    activeTimer = null;
  };

  const showNext = (): void => {
    if (disposed || active !== null) {
      return;
    }

    const next = queue.dequeue();
    if (!next) {
      return;
    }

    active = next;

    const snackbar = document.createElement('section');
    snackbar.className = 'cv-snackbar';
    snackbar.dataset.tone = next.tone ?? 'neutral';
    snackbar.dataset.state = 'open';
    const priority = next.priority ?? (next.tone === 'error' ? 'assertive' : 'polite');
    snackbar.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    snackbar.setAttribute('aria-live', priority);

    const message = document.createElement('p');
    message.className = 'cv-snackbar__message';
    message.textContent = next.message;
    snackbar.append(message);

    const actions = document.createElement('div');
    actions.className = 'cv-snackbar__actions';

    const action = next.action;
    if (action) {
      const actionButton = createPrimitiveButton({
        label: action.label,
        shape: 'text',
        color: 'primary',
        dense: true,
        ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
        onPress(source) {
          dispatchActionEvent(host, {
            id: next.id,
            action,
            source
          });
          dismissCurrent('action');
        }
      });

      actionButton.dataset.snackbarAction = action.id;
      actions.append(actionButton);
    }

    const dismissible = next.dismissible ?? true;
    if (dismissible) {
      const dismissButton = createPrimitiveButton({
        label: 'Dismiss',
        shape: 'text',
        color: 'secondary',
        dense: true,
        onPress() {
          dismissCurrent('close-button');
        }
      });

      dismissButton.classList.add('cv-snackbar__dismiss');
      actions.append(dismissButton);
    }

    if (actions.childElementCount > 0) {
      snackbar.append(actions);
    }

    const queueDurationMs = Math.max(0, next.durationMs ?? defaultDurationMs);

    const scheduleAutoDismiss = (): void => {
      clearTimer();

      if (queueDurationMs === 0) {
        return;
      }

      activeTimer = window.setTimeout(() => {
        activeTimer = null;
        dismissCurrent('timeout');
      }, queueDurationMs);
    };

    snackbar.addEventListener('pointerenter', () => {
      clearTimer();
    });
    snackbar.addEventListener('pointerleave', () => {
      scheduleAutoDismiss();
    });
    snackbar.addEventListener('focusin', () => {
      clearTimer();
    });
    snackbar.addEventListener('focusout', () => {
      scheduleAutoDismiss();
    });

    host.append(snackbar);
    host.dispatchEvent(
      new CustomEvent('cv-snackbar-show', {
        bubbles: true,
        detail: {
          id: next.id
        }
      })
    );

    activeElement = snackbar;
    scheduleAutoDismiss();
  };

  const dismissCurrent = (reason: DismissReason): void => {
    if (!active || !activeElement) {
      return;
    }

    clearTimer();

    const dismissedId = active.id;
    const node = activeElement;
    node.dataset.state = 'closing';

    const removeAndContinue = (): void => {
      node.remove();
      active = null;
      activeElement = null;

      dispatchDismissEvent(host, {
        id: dismissedId,
        reason
      });

      showNext();
    };

    if (prefersReducedMotion() || closeAnimationMs === 0) {
      removeAndContinue();
      return;
    }

    window.setTimeout(removeAndContinue, closeAnimationMs);
  };

  return {
    element: host,
    enqueue(message: PrimitiveSnackbarMessage): string {
      const id = message.id ?? nextSnackbarId();
      queue.enqueue({
        ...message,
        id
      });
      showNext();
      return id;
    },
    dismiss(id?: string, reason: DismissReason = 'programmatic'): void {
      if (!id) {
        dismissCurrent(reason);
        return;
      }

      if (active?.id === id) {
        dismissCurrent(reason);
        return;
      }

      queue.remove(id);
    },
    clear(): void {
      queue.clear();
      dismissCurrent('programmatic');
    },
    destroy(): void {
      disposed = true;
      clearTimer();
      queue.clear();
      active = null;
      activeElement?.remove();
      activeElement = null;
      host.remove();
    }
  };
};
