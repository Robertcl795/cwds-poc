import { createDismissableController, createLiveRegion, type DismissReason, type FeedbackTone } from '@ds/core';
import { partitionActions } from '../shared-actions';
import {
  createSurfaceActionButton,
  createSurfaceOverflowMenu,
  dispatchSurfaceActionEvent
} from '../shared-actions/render';
import type { PrimitiveContextMenu } from '../menu';
import type { PrimitiveActionRibbon, PrimitiveActionRibbonOptions } from './action-ribbon.types';

const formatStatusText = (message: string, selectionCount: number | null): string => {
  if (selectionCount === null || selectionCount <= 0) {
    return message;
  }

  return `${selectionCount} selected. ${message}`;
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
  status.setAttribute('aria-atomic', 'true');

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
    const button = createSurfaceActionButton({
      action,
      shape: action.kind === 'primary' ? 'contained' : 'text',
      dense: options.dense,
      includeIcon: true,
      onAction(resolvedAction, source) {
        dispatchSurfaceActionEvent(element, 'cv-action-ribbon-action', resolvedAction, source);
        options.onAction?.(resolvedAction, source);
      }
    });

    button.dataset.ribbonAction = action.id;
    actions.append(button);
  }

  let overflowMenu: PrimitiveContextMenu | null = null;

  const overflowControls = createSurfaceOverflowMenu({
    actions: partitioned.overflow,
    dense: options.dense,
    ariaLabel: 'Action ribbon overflow actions',
    onAction(resolvedAction, source) {
      dispatchSurfaceActionEvent(element, 'cv-action-ribbon-action', resolvedAction, source);
      options.onAction?.(resolvedAction, source);
    }
  });

  if (overflowControls) {
    const { trigger: overflowTrigger, menu } = overflowControls;
    overflowTrigger.dataset.ribbonOverflow = 'true';
    overflowTrigger.classList.add('cv-action-ribbon__overflow-trigger');
    actions.append(overflowTrigger);
    overflowMenu = menu;
  }

  if (options.dismissible) {
    const dismissButton = createSurfaceActionButton({
      action: {
        id: '__dismiss__',
        label: 'Dismiss'
      },
      shape: 'text',
      dense: options.dense,
      onAction() {
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
