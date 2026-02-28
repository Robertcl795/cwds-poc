import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveList } from './create-list';

describe('list primitive', () => {
  it('renders semantic list elements for content variant', () => {
    document.body.innerHTML = '';

    const list = createPrimitiveList({
      items: [
        { id: 'one', headline: 'Release docs' },
        { id: 'two', headline: 'Ship storybook' }
      ]
    });

    expect(list.element.tagName).toBe('UL');
    expect(list.element.querySelectorAll('li')).toHaveLength(2);
    expect(list.element.getAttribute('role')).toBeNull();
  });

  it('emits action callback with source tracking', () => {
    document.body.innerHTML = '';

    const onAction = vi.fn();
    const list = createPrimitiveList({
      variant: 'action',
      items: [{ id: 'deploy', headline: 'Deploy build' }],
      onAction
    });
    document.body.append(list.element);

    const action = list.element.querySelector<HTMLElement>('.cv-list__action');
    if (!action) {
      throw new Error('Expected action element');
    }

    action.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    action.click();

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'deploy', headline: 'Deploy build' }),
      'pointer'
    );
  });

  it('prevents disabled actions from firing callbacks', () => {
    document.body.innerHTML = '';

    const onAction = vi.fn();
    const list = createPrimitiveList({
      variant: 'action',
      items: [{ id: 'blocked', headline: 'Blocked action', disabled: true }],
      onAction
    });
    document.body.append(list.element);

    const action = list.element.querySelector<HTMLButtonElement>('.cv-list__action');
    if (!action) {
      throw new Error('Expected action button');
    }

    action.click();
    expect(onAction).not.toHaveBeenCalled();
  });

  it('supports managed focus with arrow keys', () => {
    document.body.innerHTML = '';

    const list = createPrimitiveList({
      variant: 'action',
      managedFocus: true,
      orientation: 'vertical',
      items: [
        { id: 'one', headline: 'One' },
        { id: 'two', headline: 'Two' }
      ]
    });
    document.body.append(list.element);

    const actions = Array.from(list.element.querySelectorAll<HTMLElement>('.cv-list__action'));
    const first = actions[0];
    const second = actions[1];

    if (!first || !second) {
      throw new Error('Expected two actions');
    }

    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

    expect(document.activeElement).toBe(second);
  });
});
