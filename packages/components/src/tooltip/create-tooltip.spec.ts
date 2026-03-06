import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPrimitiveTooltip } from './create-tooltip';

describe('createPrimitiveTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('links trigger and tooltip via aria-describedby', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);

    const tooltip = createPrimitiveTooltip({
      trigger,
      content: 'Helpful hint'
    });

    expect(trigger.getAttribute('aria-describedby')).toContain(tooltip.element.id);

    tooltip.destroy();
    expect(trigger.hasAttribute('aria-describedby')).toBe(false);
  });

  it('opens on focus and closes on blur with deterministic timers', () => {
    vi.useFakeTimers();

    const trigger = document.createElement('button');
    document.body.append(trigger);

    createPrimitiveTooltip({
      trigger,
      content: 'Keyboard hint',
      openDelayMs: 10,
      closeDelayMs: 5
    });

    trigger.dispatchEvent(new FocusEvent('focusin'));
    vi.advanceTimersByTime(10);

    const tooltip = document.querySelector<HTMLElement>('.cv-tooltip');
    expect(tooltip?.dataset.open).toBe('true');

    trigger.dispatchEvent(new FocusEvent('focusout'));
    vi.advanceTimersByTime(5);

    expect(tooltip?.dataset.open).toBe('false');

    vi.useRealTimers();
  });

  it('clamps delay values and closes on Escape', () => {
    vi.useFakeTimers();

    const trigger = document.createElement('button');
    document.body.append(trigger);

    createPrimitiveTooltip({
      trigger,
      content: 'Esc hint',
      openDelayMs: -10,
      closeDelayMs: 5000
    });

    trigger.dispatchEvent(new FocusEvent('focusin'));
    vi.advanceTimersByTime(0);

    const tooltip = document.querySelector<HTMLElement>('.cv-tooltip');
    expect(tooltip?.dataset.open).toBe('true');

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(tooltip?.dataset.open).toBe('false');

    vi.useRealTimers();
  });
});
