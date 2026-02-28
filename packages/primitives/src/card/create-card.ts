import type { InputSource } from '@ds/headless';

import { createPrimitiveButton } from '../button/create-button';
import type { SurfaceAction } from '../shared-actions';
import type { PrimitiveCard, PrimitiveCardOptions, PrimitiveCardVariant } from './card.types';

const toButtonColor = (action: SurfaceAction): 'primary' | 'secondary' | 'negative' => {
  if (action.kind === 'primary') {
    return 'primary';
  }

  if (action.kind === 'danger') {
    return 'negative';
  }

  return 'secondary';
};

const dispatchAction = (element: HTMLElement, action: SurfaceAction, source: InputSource): void => {
  element.dispatchEvent(
    new CustomEvent('cv-card-action', {
      bubbles: true,
      detail: {
        action,
        source
      }
    })
  );
};

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
      const button = createPrimitiveButton({
        label: action.label,
        shape: action.kind === 'primary' ? 'contained' : 'text',
        color: toButtonColor(action),
        ...(options.dense !== undefined ? { dense: options.dense } : {}),
        ...(action.disabled !== undefined ? { disabled: action.disabled } : {}),
        onPress(source) {
          dispatchAction(element, action, source);
          options.onAction?.(action, source);
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
