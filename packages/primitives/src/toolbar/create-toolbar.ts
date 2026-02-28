import type { InputSource } from '@ds/headless';

import { createPrimitiveButton } from '../button/create-button';
import { createContextMenu, type PrimitiveContextMenu } from '../menu';
import { partitionActions, type SurfaceAction } from '../shared-actions';
import type { PrimitiveToolbar, PrimitiveToolbarOptions } from './toolbar.types';

const dispatchToolbarAction = (element: HTMLElement, action: SurfaceAction, source: InputSource): void => {
  element.dispatchEvent(
    new CustomEvent('cv-toolbar-action', {
      bubbles: true,
      detail: {
        action,
        source
      }
    })
  );
};

const toButtonColor = (action: SurfaceAction): 'primary' | 'secondary' | 'negative' => {
  if (action.kind === 'primary') {
    return 'primary';
  }

  if (action.kind === 'danger') {
    return 'negative';
  }

  return 'secondary';
};

export const createPrimitiveToolbar = (options: PrimitiveToolbarOptions = {}): PrimitiveToolbar => {
  const element = document.createElement('div');
  element.className = 'cv-toolbar';
  element.dataset.dense = options.dense ? 'true' : 'false';

  if (options.id) {
    element.id = options.id;
  }

  if (options.ariaLabel) {
    element.setAttribute('aria-label', options.ariaLabel);
  }

  element.setAttribute('role', 'toolbar');

  const leading = document.createElement('div');
  leading.className = 'cv-toolbar__leading';

  const title = document.createElement('div');
  title.className = 'cv-toolbar__title';

  const actions = document.createElement('div');
  actions.className = 'cv-toolbar__actions';

  const overflow = document.createElement('div');
  overflow.className = 'cv-toolbar__overflow';

  if (options.title) {
    const titleText = document.createElement('h2');
    titleText.className = 'cv-toolbar__title-text';
    titleText.textContent = options.title;
    title.append(titleText);
  }

  for (const node of options.leading ?? []) {
    leading.append(node);
  }

  const partitioned = partitionActions(options.actions ?? [], options.maxVisibleActions ?? 3);

  for (const action of partitioned.leading) {
    const button = createPrimitiveButton({
      label: action.label,
      shape: 'text',
      color: toButtonColor(action),
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
      onPress(source) {
        dispatchToolbarAction(element, action, source);
        options.onAction?.(action, source);
      }
    });

    button.dataset.toolbarAction = action.id;
    leading.append(button);
  }

  for (const action of partitioned.trailing) {
    const button = createPrimitiveButton({
      label: action.label,
      shape: action.kind === 'primary' ? 'contained' : 'text',
      color: toButtonColor(action),
      ...(options.dense !== undefined ? { dense: options.dense } : {}),
      ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
      onPress(source) {
        dispatchToolbarAction(element, action, source);
        options.onAction?.(action, source);
      }
    });

    button.dataset.toolbarAction = action.id;
    actions.append(button);
  }

  for (const node of options.trailing ?? []) {
    actions.append(node);
  }

  let overflowMenu: PrimitiveContextMenu | null = null;

  if ((options.enableOverflowMenu ?? true) && partitioned.overflow.length > 0) {
    const overflowActionsById = new Map(partitioned.overflow.map((action) => [action.id, action] as const));
    const overflowTrigger = createPrimitiveButton({
      label: 'More',
      shape: 'text',
      color: 'secondary',
      ...(options.dense !== undefined ? { dense: options.dense } : {})
    });

    overflowTrigger.dataset.toolbarOverflow = 'true';
    overflow.append(overflowTrigger);

    overflowMenu = createContextMenu({
      target: overflowTrigger,
      ariaLabel: options.ariaLabel ? `${options.ariaLabel} overflow actions` : 'Toolbar overflow actions',
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

        dispatchToolbarAction(element, resolvedAction, source);
        options.onAction?.(resolvedAction, source);
      }
    });
  }

  element.append(leading, title, actions, overflow);

  return {
    element,
    overflowMenu,
    destroy(): void {
      overflowMenu?.destroy();
      overflowMenu = null;
    }
  };
};
