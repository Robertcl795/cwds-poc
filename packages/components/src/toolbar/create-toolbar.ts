import { partitionActions } from '../shared-actions';
import {
  createSurfaceActionButton,
  createSurfaceOverflowMenu,
  dispatchSurfaceActionEvent
} from '../shared-actions/render';
import type { PrimitiveContextMenu } from '../menu';
import type { PrimitiveToolbar, PrimitiveToolbarOptions } from './toolbar.types';

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
    const button = createSurfaceActionButton({
      action,
      shape: 'text',
      dense: options.dense,
      includeIcon: true,
      onAction(resolvedAction, source) {
        dispatchSurfaceActionEvent(element, 'cv-toolbar-action', resolvedAction, source);
        options.onAction?.(resolvedAction, source);
      }
    });

    button.dataset.toolbarAction = action.id;
    leading.append(button);
  }

  for (const action of partitioned.trailing) {
    const button = createSurfaceActionButton({
      action,
      shape: action.kind === 'primary' ? 'contained' : 'text',
      dense: options.dense,
      includeIcon: true,
      onAction(resolvedAction, source) {
        dispatchSurfaceActionEvent(element, 'cv-toolbar-action', resolvedAction, source);
        options.onAction?.(resolvedAction, source);
      }
    });

    button.dataset.toolbarAction = action.id;
    actions.append(button);
  }

  for (const node of options.trailing ?? []) {
    actions.append(node);
  }

  let overflowMenu: PrimitiveContextMenu | null = null;

  if (options.enableOverflowMenu ?? true) {
    const overflowControls = createSurfaceOverflowMenu({
      actions: partitioned.overflow,
      dense: options.dense,
      ariaLabel: options.ariaLabel ? `${options.ariaLabel} overflow actions` : 'Toolbar overflow actions',
      onAction(resolvedAction, source) {
        dispatchSurfaceActionEvent(element, 'cv-toolbar-action', resolvedAction, source);
        options.onAction?.(resolvedAction, source);
      }
    });

    if (overflowControls) {
      const { trigger: overflowTrigger, menu } = overflowControls;
      overflowTrigger.dataset.toolbarOverflow = 'true';
      overflowTrigger.classList.add('cv-toolbar__overflow-trigger');
      overflow.append(overflowTrigger);
      overflowMenu = menu;
    }
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
