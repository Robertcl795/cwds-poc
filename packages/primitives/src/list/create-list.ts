import type { InputSource } from '@ds/headless';
import { applyFocusRing, applyRipple } from '@ds/utils-a11y';

import { createRovingTabIndex } from '../shared-navigation';
import type { PrimitiveList, PrimitiveListItem, PrimitiveListOptions } from './list.types';

const appendAdornment = (container: HTMLElement, value: string | HTMLElement, className: string): void => {
  const adornment = document.createElement('span');
  adornment.className = className;

  if (typeof value === 'string') {
    adornment.textContent = value;
  } else {
    adornment.append(value);
  }

  container.append(adornment);
};

const createListContent = (item: PrimitiveListItem): HTMLElement => {
  const content = document.createElement('span');
  content.className = 'cv-list__content';

  const headline = document.createElement('span');
  headline.className = 'cv-list__headline';
  headline.textContent = item.headline;
  content.append(headline);

  if (item.supportingText) {
    const supporting = document.createElement('span');
    supporting.className = 'cv-list__supporting';
    supporting.textContent = item.supportingText;
    content.append(supporting);
  }

  return content;
};

const isAnchorElement = (element: HTMLElement): element is HTMLAnchorElement => element instanceof HTMLAnchorElement;

const isDisabledActionElement = (element: HTMLElement): boolean => {
  if (element instanceof HTMLButtonElement) {
    return element.disabled;
  }

  return element.getAttribute('aria-disabled') === 'true' || element.dataset.disabled === 'true';
};

export const createPrimitiveList = (options: PrimitiveListOptions): PrimitiveList => {
  const variant = options.variant ?? 'content';
  const orientation = options.orientation ?? 'vertical';
  const managedFocus = options.managedFocus ?? false;

  const list = document.createElement(options.ordered ? 'ol' : 'ul');
  list.className = 'cv-list';
  list.dataset.variant = variant;
  list.dataset.orientation = orientation;
  list.dataset.interactive = variant === 'action' ? 'true' : 'false';

  if (options.id) {
    list.id = options.id;
  }

  if (options.ariaLabel) {
    list.setAttribute('aria-label', options.ariaLabel);
  }

  const actionControls: HTMLElement[] = [];
  const listItemsById = new Map<string, HTMLLIElement>();
  const controlsById = new Map<string, HTMLElement>();

  for (const item of options.items) {
    const row = document.createElement('li');
    row.className = 'cv-list__item';
    row.dataset.disabled = item.disabled ? 'true' : 'false';
    row.dataset.selected = item.selected ? 'true' : 'false';
    row.dataset.current = item.current ? 'true' : 'false';

    if (variant === 'action') {
      const control = item.href ? document.createElement('a') : document.createElement('button');
      control.className = 'cv-list__action';

      if (isAnchorElement(control) && item.href) {
        control.href = item.href;
      }

      if (control instanceof HTMLButtonElement) {
        control.type = 'button';
      }

      if (item.disabled) {
        if (control instanceof HTMLButtonElement) {
          control.disabled = true;
        } else {
          control.setAttribute('aria-disabled', 'true');
          control.dataset.disabled = 'true';
          control.tabIndex = -1;
        }
      }

      if (item.current) {
        control.setAttribute('aria-current', 'true');
      }

      applyFocusRing(control, 'auto');

      if (options.ripple !== false) {
        applyRipple(control, { styleMutation: 'allow' });
      }

      let pendingSource: InputSource = 'programmatic';

      control.addEventListener('pointerdown', () => {
        pendingSource = 'pointer';
      });

      control.addEventListener('keydown', (event) => {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          pendingSource = 'keyboard';
        }
      });

      control.addEventListener('click', (event) => {
        if (isDisabledActionElement(control)) {
          event.preventDefault();
          return;
        }

        options.onAction?.(item, pendingSource);
        pendingSource = 'programmatic';
      });

      if (item.leading) {
        appendAdornment(control, item.leading, 'cv-list__leading');
      }

      control.append(createListContent(item));

      if (item.trailing) {
        appendAdornment(control, item.trailing, 'cv-list__trailing');
      }

      row.append(control);
      controlsById.set(item.id, control);

      if (!item.disabled) {
        actionControls.push(control);
      }
    } else {
      const content = document.createElement('div');
      content.className = 'cv-list__row';

      if (item.leading) {
        appendAdornment(content, item.leading, 'cv-list__leading');
      }

      content.append(createListContent(item));

      if (item.trailing) {
        appendAdornment(content, item.trailing, 'cv-list__trailing');
      }

      row.append(content);
    }

    listItemsById.set(item.id, row);
    list.append(row);
  }

  const roving =
    variant === 'action' && managedFocus && actionControls.length > 0
      ? createRovingTabIndex({
          items: actionControls,
          orientation,
          loop: true,
          initialActiveIndex: 0
        })
      : null;

  if (roving) {
    list.addEventListener('keydown', (event) => {
      if (!(event instanceof KeyboardEvent) || !(event.target instanceof HTMLElement)) {
        return;
      }

      if (!actionControls.includes(event.target)) {
        return;
      }

      roving.onKeydown(event);
    });
  }

  return {
    element: list,
    focusItem(id: string): void {
      const control = controlsById.get(id);
      if (control) {
        control.focus();
        return;
      }

      const row = listItemsById.get(id);
      row?.focus();
    },
    setCurrent(id: string | null): void {
      for (const [itemId, row] of listItemsById.entries()) {
        const isCurrent = id !== null && itemId === id;
        row.dataset.current = isCurrent ? 'true' : 'false';

        const control = controlsById.get(itemId);
        if (control) {
          if (isCurrent) {
            control.setAttribute('aria-current', 'true');
          } else {
            control.removeAttribute('aria-current');
          }
        }
      }
    }
  };
};
