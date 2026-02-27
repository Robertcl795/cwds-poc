import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveSlider } from './create-slider';

describe('slider primitive', () => {
  it('renders native range input with label and helper', () => {
    const slider = createPrimitiveSlider({
      id: 'volume',
      name: 'volume',
      label: 'Volume',
      helper: 'Adjust output level'
    });

    expect(slider.input.type).toBe('range');
    expect(slider.element.querySelector('label')?.textContent).toBe('Volume');
    expect(slider.input.getAttribute('aria-describedby')).toBe('volume-helper');
  });

  it('publishes value changes with source tracking', () => {
    const changed = vi.fn();
    const slider = createPrimitiveSlider({
      id: 'opacity',
      name: 'opacity',
      label: 'Opacity',
      showValue: true,
      onValueChange: changed
    });

    slider.input.dispatchEvent(new Event('pointerdown'));
    slider.input.value = '33';
    slider.input.dispatchEvent(new Event('input'));

    expect(changed).toHaveBeenCalledWith(33, 'pointer');
    expect(slider.output?.textContent).toBe('33');
  });
});
