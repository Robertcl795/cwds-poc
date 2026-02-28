import { describe, expect, it } from 'vitest';

import { createRovingTabIndex } from './roving-tabindex';

describe('roving tabindex', () => {
  it('moves to next and previous items', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');
    const third = document.createElement('button');

    document.body.append(first, second, third);

    const roving = createRovingTabIndex({
      items: [first, second, third],
      orientation: 'horizontal',
      initialActiveIndex: 0
    });

    first.focus();

    roving.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(document.activeElement).toBe(second);

    roving.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(document.activeElement).toBe(first);

    roving.destroy();
  });

  it('skips disabled items', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');
    const third = document.createElement('button');

    second.disabled = true;
    document.body.append(first, second, third);

    const roving = createRovingTabIndex({
      items: [first, second, third],
      orientation: 'horizontal',
      initialActiveIndex: 0
    });

    first.focus();
    roving.onKeydown(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(document.activeElement).toBe(third);
    roving.destroy();
  });

  it('supports home and end navigation', () => {
    const first = document.createElement('button');
    const second = document.createElement('button');
    const third = document.createElement('button');

    document.body.append(first, second, third);

    const roving = createRovingTabIndex({
      items: [first, second, third],
      orientation: 'vertical',
      initialActiveIndex: 1
    });

    second.focus();

    roving.onKeydown(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(document.activeElement).toBe(first);

    roving.onKeydown(new KeyboardEvent('keydown', { key: 'End' }));
    expect(document.activeElement).toBe(third);

    roving.destroy();
  });
});
