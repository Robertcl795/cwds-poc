import { describe, expect, it } from 'vitest';

import { createPrimitiveSelect } from './create-select';

describe('select hardening', () => {
  it('supports helperText/errorText aliases and external describedBy ids', () => {
    const select = createPrimitiveSelect({
      id: 'phase25-select',
      name: 'phase25-select',
      label: 'Status',
      options: [
        { id: 'active', label: 'Active', value: 'active' },
        { id: 'paused', label: 'Paused', value: 'paused' }
      ],
      required: true,
      helperText: 'Preferred helper',
      validationMessage: 'Legacy error',
      errorText: 'Preferred error',
      describedBy: 'external-select-help',
      validateOnInitialRender: true
    });

    expect(select.selectElement.getAttribute('aria-describedby')).toBe(
      'phase25-select-helper external-select-help'
    );
    expect(select.selectElement.getAttribute('aria-invalid')).toBe('true');
    expect(select.element.querySelector('.cv-select-field__helper')?.textContent).toBe('Preferred error');
  });

  it('keeps native select behavior when enhancement is disabled', () => {
    const select = createPrimitiveSelect({
      id: 'phase25-native-select',
      name: 'phase25-native-select',
      label: 'Mode',
      options: [
        { id: 'auto', label: 'Auto', value: 'auto' },
        { id: 'manual', label: 'Manual', value: 'manual' }
      ],
      enhance: false
    });

    expect(select.selectElement.dataset.enhanced).toBe('false');
    select.selectElement.value = 'manual';
    select.selectElement.dispatchEvent(new Event('change'));
    expect(select.selectElement.value).toBe('manual');
  });
});
