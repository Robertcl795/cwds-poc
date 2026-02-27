import { describe, expect, it } from 'vitest';

import { createPrimitiveTextField } from './create-text-field';

describe('text-field hardening', () => {
  it('prefers helperText/errorText aliases and keeps legacy props compatible', () => {
    const field = createPrimitiveTextField({
      id: 'phase25-email',
      name: 'phase25-email',
      label: 'Email',
      required: true,
      helper: 'Legacy helper',
      helperText: 'Preferred helper',
      validationMessage: 'Legacy error',
      errorText: 'Preferred error',
      validateOnInitialRender: true
    });

    expect(field.element.querySelector('.cv-form-field__helper')?.textContent).toBe('Preferred error');
  });

  it('appends consumer describedBy ids without replacing helper linkage', () => {
    const field = createPrimitiveTextField({
      id: 'phase25-team',
      name: 'phase25-team',
      label: 'Team',
      helperText: 'Your team id',
      describedBy: 'external-help'
    });

    expect(field.input.getAttribute('aria-describedby')).toBe('phase25-team-helper external-help');
  });
});
