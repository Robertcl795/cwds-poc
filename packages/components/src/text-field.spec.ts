import { describe, expect, it } from 'vitest';

import { createPrimitiveTextField } from './text-field';

describe('text field primitive', () => {
  it('supports covalent-style density, affix, icon, and counter options', () => {
    const field = createPrimitiveTextField({
      id: 'cost',
      name: 'cost',
      label: 'Cost',
      value: '123',
      dense: true,
      prefix: '$',
      suffix: 'USD',
      icon: '💲',
      iconTrailing: '✓',
      charCounter: true,
      maxLength: 10
    });

    expect(field.element.dataset.dense).toBe('true');
    expect(field.element.dataset.hasPrefix).toBe('true');
    expect(field.element.dataset.hasSuffix).toBe('true');
    expect(field.element.dataset.hasIconStart).toBe('true');
    expect(field.element.dataset.hasIconEnd).toBe('true');
    expect(field.element.querySelector('.cv-form-field__counter')?.textContent).toBe('3/10');
  });

  it('shows validation message when invalid', () => {
    const field = createPrimitiveTextField({
      id: 'required-email',
      name: 'required-email',
      label: 'Recovery email',
      required: true,
      autoValidate: true,
      validationMessage: 'Recovery email is required.',
      helper: 'Provide an email for account recovery.'
    });

    field.input.value = '';
    field.input.dispatchEvent(new Event('input'));

    const helper = field.element.querySelector('.cv-form-field__helper');
    expect(field.element.dataset.invalid).toBe('true');
    expect(helper?.textContent).toBe('Recovery email is required.');
  });
});
