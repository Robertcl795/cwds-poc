import { describe, expect, it } from 'vitest';

import { createCompositeDialog } from './dialog';

describe('composite dialog hardening', () => {
  it('generates unique ids and aria linkage per instance', () => {
    const first = createCompositeDialog({
      title: 'First dialog',
      description: 'First description'
    });

    const second = createCompositeDialog({
      title: 'Second dialog',
      description: 'Second description'
    });

    expect(first.id).not.toBe(second.id);

    const firstTitleId = first.getAttribute('aria-labelledby');
    const secondTitleId = second.getAttribute('aria-labelledby');

    expect(firstTitleId).toBeTruthy();
    expect(secondTitleId).toBeTruthy();
    expect(firstTitleId).not.toBe(secondTitleId);
  });

  it('restores focus to trigger when open attribute is removed', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open hardening dialog';
    document.body.append(trigger);

    const dialog = createCompositeDialog({
      trigger,
      title: 'Focus test',
      description: 'Ensures focus restoration.'
    });

    const inside = dialog.querySelector('button');
    if (!inside) {
      throw new Error('Expected dialog action button');
    }

    document.body.append(dialog);

    trigger.focus();
    dialog.setAttribute('open', '');
    await Promise.resolve();

    inside.focus();
    expect(document.activeElement).toBe(inside);

    dialog.removeAttribute('open');
    await Promise.resolve();

    expect(document.activeElement).toBe(trigger);
  });

  it('prevents escape dismiss when closeOnEscape is false', () => {
    const dialog = createCompositeDialog({
      title: 'Escape policy',
      description: 'Escape should be blocked.',
      closeOnEscape: false
    });

    const cancelEvent = new Event('cancel', {
      bubbles: true,
      cancelable: true
    });

    dialog.dispatchEvent(cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
  });
});
