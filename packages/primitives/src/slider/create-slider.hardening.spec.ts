import { describe, expect, it } from 'vitest';

import { createPrimitiveSlider } from './create-slider';

describe('slider hardening', () => {
  it('supports helperText/errorText aliases and custom describedBy', () => {
    const slider = createPrimitiveSlider({
      id: 'phase25-slider',
      name: 'phase25-slider',
      label: 'Volume',
      helperText: 'Preferred helper',
      validationMessage: 'Legacy error',
      errorText: 'Preferred error',
      invalid: true,
      describedBy: 'external-slider-help'
    });

    expect(slider.element.dataset.invalid).toBe('true');
    expect(slider.input.getAttribute('aria-describedby')).toBe('phase25-slider-helper external-slider-help');
    expect(slider.input.getAttribute('aria-invalid')).toBe('true');
    expect(slider.element.querySelector('.cv-slider-field__helper')?.textContent).toBe('Preferred error');
  });

  it('uses native keyboard behavior without JS remapping', () => {
    const slider = createPrimitiveSlider({
      id: 'phase25-native-slider',
      name: 'phase25-native-slider',
      label: 'Native'
    });

    slider.input.value = '10';
    slider.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    slider.input.dispatchEvent(new Event('input'));

    expect(slider.input.type).toBe('range');
  });
});
