import type { InputSource } from '@ds/headless';

import { createPrimitiveButton } from '../button/create-button';
import { createContextMenu, type PrimitiveContextMenu } from '../menu';
import { createDismissableController, createLiveRegion, type DismissReason, type FeedbackTone } from '../shared-feedback';
import { partitionActions, type SurfaceAction } from '../shared-actions';
import type { PrimitiveActionRibbon, PrimitiveActionRibbonOptions } from './action-ribbon.types';

const toButtonColor = (action: SurfaceAction): 'primary' | 'secondary' | 'negative' => {
  if (action.kind === 'primary') {
    return 'primary';
  }

  if (action.kind === 'danger') {
    return 'negative';
  }

  return 'secondary';
};

const formatStatusText = (message: string, selectionCount: number | null): string => {
  if (selectionCount === null || selectionCount <= 0) {
    return message;
  }

  return `${selectionCount} selected. ${message}`;
};

const dispatchAction = (element: HTMLElement, action: SurfaceAction, source: InputSource): void => {
  element.dispatchEvent(
    new CustomEvent('cv-action-ribbon-action', {
      bubbles: true,
      detail: {
        action,
        source
      }
    })
  );
};

const dispatchDismiss = (element: HTMLElement, reason: DismissReason): void => {
  element.dispatchEvent(
    new CustomEvent('cv-action-ribbon-dismiss', {
      bubbles: true,
      detail: {
        reason
      }
    })
  );
};

export const createActionRibbon = (options: PrimitiveActionRibbonOptions): PrimitiveActionRibbon => {
  const element = document.createElement('section');
  element.className = 'cv-action-ribbon';
  element.dataset.tone = options.tone ?? 'neutral';
  element.dataset.sticky = options.sticky ? 'true' : 'false';
  element.dataset.dense = options.dense ? 'true' : 'false';
  element.dataset.dismissed = 'false';
  element.setAttribute('aria-label', options.ariaLabel ?? 'Workflow action ribbon');

  if (options.id) {
    element.id = options.id;
  }

  const status = document.createElement('div');
  status.className = 'cv-action-ribbon__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', options.tone === 'error' ? 'assertive' : 'polite');

  const statusText = document.createElement('p');
  statusText.className = 'cv-action-ribbon__status-text';

  const actions = document.createElement('div');
  actions.className = 'cv-action-ribbon__actions';

  const liveRegion = options.announceChanges ? createLiveRegion({ priority: 'polite' }) : null;
  let selectionCount: number | null = options.selectionCount ?? null;
  let message = options.message;

  const updateStatus = (): void => {
    const nextText = formatStatusText(message, selectionCount);
    statusText.textContent = nextText;
    element.dataset.hasSelection = selectionCount && selectionCount > 0 ? 'true' : 'false';
    liveRegion?.announce(nextText);
  };

  updateStatus();
  status.append(statusText);

  const dismissable = createDismissableController();
  dismissable.onDismiss((reason) => {
    element.hidden = true;
    element.dataset.dismissed = 'true';
    dispatchDismiss(element, reason);
    options.onDismiss?.(reason);
  });

  const partitioned = partitionActions(options.actions ?? [], options.maxVisibleActions ?? 2);

  for (const action of [...partitioned.leading, ...partitioned.trailing]) {
    const button = createPrimitiveButton({
      label: action.label,
      color: toButtonColor(action),
      shape: action.kind === 'primary' ? 'contained' : 'text',
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
      onPress(source) {
        dispatchAction(element, action, source);
        options.onAction?.(action, source);
      }
    });

    button.dataset.ribbonAction = action.id;
    actions.append(button);
  }

  let overflowMenu: PrimitiveContextMenu | null = null;

  if (partitioned.overflow.length > 0) {
    const overflowActionsById = new Map(partitioned.overflow.map((action) => [action.id, action] as const));
    const overflowTrigger = createPrimitiveButton({
      label: 'More',
      shape: 'text',
      color: 'secondary',
      ...(options.dense !== undefined ? { dense: options.dense } : {})
    });

    overflowTrigger.dataset.ribbonOverflow = 'true';
    actions.append(overflowTrigger);

    overflowMenu = createContextMenu({
      target: overflowTrigger,
      ariaLabel: 'Action ribbon overflow actions',
      items: partitioned.overflow.map((action) => ({
        ...{
          id: action.id,
          label: action.label,
          kind: action.kind === 'danger' ? 'danger' : 'default'
        },
        ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
        ...(action.shortcut !== undefined ? { shortcut: action.shortcut } : {})
      })),
      onAction(action, source) {
        const resolvedAction = overflowActionsById.get(action.id);
        if (!resolvedAction) {
          return;
        }

        dispatchAction(element, resolvedAction, source);
        options.onAction?.(resolvedAction, source);
      }
    });
  }

  if (options.dismissible) {
    const dismissButton = createPrimitiveButton({
      label: 'Dismiss',
      shape: 'text',
      color: 'secondary',
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      onPress() {
        dismissable.dismiss('close-button');
      }
    });

    dismissButton.classList.add('cv-action-ribbon__dismiss');
    actions.append(dismissButton);
  }

  element.append(status, actions);

  return {
    element,
    setTone(tone: FeedbackTone): void {
      element.dataset.tone = tone;
      status.setAttribute('aria-live', tone === 'error' ? 'assertive' : 'polite');
    },
    setMessage(nextMessage: string): void {
      message = nextMessage;
      updateStatus();
    },
    setSelectionCount(count: number | null): void {
      selectionCount = count;
      updateStatus();
    },
    dismiss(reason: DismissReason = 'programmatic'): void {
      dismissable.dismiss(reason);
    },
    destroy(): void {
      overflowMenu?.destroy();
      overflowMenu = null;
      liveRegion?.dispose();
      element.remove();
    }
  };
};
