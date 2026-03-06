import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveSnackbarHost } from './create-snackbar';

describe('createPrimitiveSnackbarHost', () => {
  it('shows and auto-dismisses snackbar messages', () => {
    vi.useFakeTimers();

    const host = createPrimitiveSnackbarHost({
      defaultDurationMs: 10,
      closeAnimationMs: 0
    });

    host.enqueue({ message: 'Saved' });

    const snackbar = host.element.querySelector('.cv-snackbar');
    expect(snackbar).toBeTruthy();

    vi.advanceTimersByTime(10);

    expect(host.element.querySelector('.cv-snackbar')).toBeNull();

    host.destroy();
    vi.useRealTimers();
  });

  it('uses atomic live-region semantics for announced messages', () => {
    const host = createPrimitiveSnackbarHost({
      defaultDurationMs: 0,
      closeAnimationMs: 0
    });

    host.enqueue({ message: 'Saved', tone: 'error' });

    const snackbar = host.element.querySelector<HTMLElement>('.cv-snackbar');
    expect(snackbar?.getAttribute('role')).toBe('alert');
    expect(snackbar?.getAttribute('aria-live')).toBe('assertive');
    expect(snackbar?.getAttribute('aria-atomic')).toBe('true');

    host.destroy();
  });

  it('supports queued messages in order', () => {
    vi.useFakeTimers();

    const host = createPrimitiveSnackbarHost({
      defaultDurationMs: 10,
      closeAnimationMs: 0
    });

    host.enqueue({ id: 'first', message: 'First' });
    host.enqueue({ id: 'second', message: 'Second' });

    expect(host.element.textContent).toContain('First');

    vi.advanceTimersByTime(10);

    expect(host.element.textContent).toContain('Second');

    host.destroy();
    vi.useRealTimers();
  });

  it('emits action events', () => {
    const host = createPrimitiveSnackbarHost({
      defaultDurationMs: 0,
      closeAnimationMs: 0
    });

    const actionListener = vi.fn();
    host.element.addEventListener('cv-snackbar-action', actionListener);

    host.enqueue({
      id: 'undo-item',
      message: 'Archived',
      action: {
        id: 'undo',
        label: 'Undo'
      }
    });

    const actionButton = host.element.querySelector<HTMLButtonElement>('[data-snackbar-action="undo"]');
    actionButton?.click();

    expect(actionListener).toHaveBeenCalledTimes(1);

    host.destroy();
  });
});
