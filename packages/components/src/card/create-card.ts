import { createSurfaceActionButton, dispatchSurfaceActionEvent } from '../shared-actions/render';
import type { PrimitiveCard, PrimitiveCardOptions, PrimitiveCardVariant } from './card.types';

export const createPrimitiveCard = (options: PrimitiveCardOptions = {}): PrimitiveCard => {
  const tagName = options.as ?? 'article';
  const element = document.createElement(tagName);
  element.className = 'cv-card';
  element.dataset.variant = options.variant ?? 'outlined';
  element.dataset.dense = options.dense ? 'true' : 'false';
  element.dataset.interactive = options.interactive ? 'true' : 'false';

  if (options.id) {
    element.id = options.id;
  }

  if (options.title || options.supportingText) {
    const header = document.createElement('header');
    header.className = 'cv-card__header';

    if (options.title) {
      const title = document.createElement('h3');
      title.className = 'cv-card__title';
      title.textContent = options.title;
      header.append(title);
    }

    if (options.supportingText) {
      const supporting = document.createElement('p');
      supporting.className = 'cv-card__supporting';
      supporting.textContent = options.supportingText;
      header.append(supporting);
    }

    element.append(header);
  }

  if (options.body) {
    const content = document.createElement('div');
    content.className = 'cv-card__body';

    if (typeof options.body === 'string') {
      const paragraph = document.createElement('p');
      paragraph.textContent = options.body;
      content.append(paragraph);
    } else {
      content.append(options.body);
    }

    element.append(content);
  }

  if (options.actions && options.actions.length > 0) {
    const actions = document.createElement('footer');
    actions.className = 'cv-card__actions';

    for (const action of options.actions) {
      const button = createSurfaceActionButton({
        action,
        shape: action.kind === 'primary' ? 'contained' : 'text',
        dense: options.dense,
        onAction(resolvedAction, source) {
          dispatchSurfaceActionEvent(element, 'cv-card-action', resolvedAction, source);
          options.onAction?.(resolvedAction, source);
        }
      });

      button.dataset.cardAction = action.id;
      actions.append(button);
    }

    element.append(actions);
  }

  return {
    element,
    setVariant(variant: PrimitiveCardVariant): void {
      element.dataset.variant = variant;
    },
    setDense(dense: boolean): void {
      element.dataset.dense = dense ? 'true' : 'false';
    }
  };
};
