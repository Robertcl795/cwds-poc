import type { InputSource } from '@ds/core';

import { createPrimitiveButton } from '../button/create-button';
import type { PrimitiveButtonShape } from '../button/button.types';
import { createPrimitiveIconButton } from '../icon-button/create-icon-button';
import { createContextMenu, type PrimitiveContextMenu } from '../menu';
import type { SurfaceAction } from './action.types';

const createOverflowIcon = (): HTMLSpanElement => {
  const icon = document.createElement('span');
  icon.textContent = '⋮';
  icon.setAttribute('aria-hidden', 'true');
  return icon;
};

export const toSurfaceActionButtonColor = (action: SurfaceAction): 'primary' | 'secondary' | 'negative' => {
  if (action.kind === 'primary') {
    return 'primary';
  }

  if (action.kind === 'danger') {
    return 'negative';
  }

  return 'secondary';
};

export const dispatchSurfaceActionEvent = <T extends SurfaceAction>(
  element: HTMLElement,
  eventName: string,
  action: T,
  source: InputSource
): void => {
  element.dispatchEvent(
    new CustomEvent(eventName, {
      bubbles: true,
      detail: {
        action,
        source
      }
    })
  );
};

type SurfaceActionButtonOptions<T extends SurfaceAction> = {
  action: T;
  shape: PrimitiveButtonShape;
  dense?: boolean | undefined;
  includeIcon?: boolean | undefined;
  onAction: (action: T, source: InputSource) => void;
};

export const createSurfaceActionButton = <T extends SurfaceAction>(
  options: SurfaceActionButtonOptions<T>
): HTMLButtonElement =>
  createPrimitiveButton({
    label: options.action.label,
    shape: options.shape,
    color: toSurfaceActionButtonColor(options.action),
    ...(options.includeIcon && options.action.icon !== undefined ? { iconStart: options.action.icon } : {}),
    ...(options.dense !== undefined ? { dense: options.dense } : {}),
    ...(options.action.disabled !== undefined ? { disabled: options.action.disabled } : {}),
    onPress(source) {
      options.onAction(options.action, source);
    }
  });

type SurfaceOverflowMenuOptions<T extends SurfaceAction> = {
  actions: T[];
  dense?: boolean | undefined;
  ariaLabel: string;
  onAction: (action: T, source: InputSource) => void;
};

export const createSurfaceOverflowMenu = <T extends SurfaceAction>(
  options: SurfaceOverflowMenuOptions<T>
): { trigger: HTMLButtonElement; menu: PrimitiveContextMenu } | null => {
  if (options.actions.length === 0) {
    return null;
  }

  const actionsById = new Map(options.actions.map((action) => [action.id, action] as const));
  const trigger = createPrimitiveIconButton({
    icon: createOverflowIcon(),
    ariaLabel: 'More actions',
    variant: 'standard',
    size: options.dense ? 'sm' : 'md'
  });
  const menu = createContextMenu({
    target: trigger,
    triggerMode: 'click',
    ariaLabel: options.ariaLabel,
    items: options.actions.map((action) => ({
      ...{
        id: action.id,
        label: action.label,
        kind: action.kind === 'danger' ? 'danger' : 'default'
      },
      ...(action.icon !== undefined ? { iconStart: action.icon } : {}),
      ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
      ...(action.shortcut !== undefined ? { shortcut: action.shortcut } : {})
    })),
    onAction(action, source) {
      const resolvedAction = actionsById.get(action.id);
      if (!resolvedAction) {
        return;
      }

      options.onAction(resolvedAction, source);
    }
  });

  return {
    trigger,
    menu
  };
};
