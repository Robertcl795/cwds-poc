import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveCard } from './create-card';

describe('createPrimitiveCard', () => {
  it('renders title, supporting text, and body content', () => {
    const card = createPrimitiveCard({
      title: 'Deploy status',
      supportingText: 'Last updated 2m ago',
      body: 'Everything is healthy.'
    });

    expect(card.element.querySelector('.cv-card__title')?.textContent).toBe('Deploy status');
    expect(card.element.querySelector('.cv-card__supporting')?.textContent).toContain('Last updated');
    expect(card.element.querySelector('.cv-card__body')?.textContent).toContain('Everything is healthy');
  });

  it('emits action callbacks and custom events', () => {
    const onAction = vi.fn();
    const card = createPrimitiveCard({
      actions: [{ id: 'open', label: 'Open', kind: 'primary' }],
      onAction
    });

    const eventListener = vi.fn();
    card.element.addEventListener('cv-card-action', eventListener);

    const button = card.element.querySelector<HTMLButtonElement>('button');
    button?.click();

    expect(onAction).toHaveBeenCalledTimes(1);
    expect(eventListener).toHaveBeenCalledTimes(1);
  });
});
