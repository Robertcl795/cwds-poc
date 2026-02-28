import { describe, expect, it } from 'vitest';

import { createActiveDescendantController } from './active-descendant';

const createOptions = (): [HTMLUListElement, HTMLLIElement, HTMLLIElement, HTMLLIElement] => {
  const listbox = document.createElement('ul');

  const first = document.createElement('li');
  first.id = 'opt-1';
  first.textContent = 'One';

  const second = document.createElement('li');
  second.id = 'opt-2';
  second.textContent = 'Two';
  second.dataset.disabled = 'true';

  const third = document.createElement('li');
  third.id = 'opt-3';
  third.textContent = 'Three';

  listbox.append(first, second, third);
  return [listbox, first, second, third];
};

describe('createActiveDescendantController', () => {
  it('skips disabled items and writes aria-activedescendant', () => {
    const [listbox] = createOptions();
    const input = document.createElement('input');

    const controller = createActiveDescendantController({
      input,
      listbox,
      getItems: () => Array.from(listbox.querySelectorAll('li'))
    });

    expect(controller.move(1)).toBe('opt-1');
    expect(controller.move(1)).toBe('opt-3');
    expect(input.getAttribute('aria-activedescendant')).toBe('opt-3');
  });

  it('supports home/end and clear', () => {
    const [listbox] = createOptions();
    const input = document.createElement('input');

    const controller = createActiveDescendantController({
      input,
      listbox,
      getItems: () => Array.from(listbox.querySelectorAll('li'))
    });

    controller.end();
    expect(controller.getActiveId()).toBe('opt-3');
    controller.home();
    expect(controller.getActiveId()).toBe('opt-1');

    controller.clear();
    expect(controller.getActiveId()).toBeNull();
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
  });
});
