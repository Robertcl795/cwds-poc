import { describe, expect, it } from 'vitest';

import { createPrimitiveSwitch } from './switch/create-switch';

describe('switch primitive', () => {
  it('uses native checkbox semantics', () => {
    const control = createPrimitiveSwitch({
      id: 'auto-apply',
      name: 'auto-apply',
      label: 'Enable auto apply',
      checked: true
    });

    const input = control.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(input?.checked).toBe(true);
    expect(control.dataset.checked).toBe('true');
  });
});
