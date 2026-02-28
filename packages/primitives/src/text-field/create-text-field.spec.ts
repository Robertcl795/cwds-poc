import { describe, expect, it } from 'vitest';

import { createPrimitiveTextField } from './create-text-field';

describe('text-field primitive', () => {
  it('renders label and helper text with native input semantics', () => {
    const field = createPrimitiveTextField({
      id: 'email',
      name: 'email',
      label: 'Email',
      helper: 'Used for notifications'
    });

    expect(field.element.querySelector('label')?.textContent).toBe('Email');
    expect(field.input.tagName).toBe('INPUT');
    expect(field.input.getAttribute('aria-describedby')).toBe('email-helper');
  });

  it('shows validation message when invalid', () => {
    const field = createPrimitiveTextField({
      id: 'team-id',
      name: 'team-id',
      label: 'Team id',
      required: true,
      validateOnInitialRender: true,
      validationMessage: 'Team id required.'
    });

    expect(field.element.dataset.invalid).toBe('true');
    expect(field.element.querySelector('.cv-form-field__helper')?.textContent).toBe('Team id required.');
  });
});
