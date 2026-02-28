import { describe, expect, it } from 'vitest';

import { attachRipple } from './ripple-controller';

describe('attachRipple', () => {
  it('adds and cleans ripple wave', () => {
    const host = document.createElement('button');
    document.body.append(host);

    const controller = attachRipple(host, { styleMutation: 'forbid', durationMs: 10 });

    const PointerCtor = window.PointerEvent ?? window.MouseEvent;
    host.dispatchEvent(new PointerCtor('pointerdown', { button: 0, bubbles: true }));
    expect(host.querySelector('.cv-ripple-layer')).toBeTruthy();

    controller.destroy();
    expect(host.querySelector('.cv-ripple-layer')).toBeNull();
    host.remove();
  });
});
