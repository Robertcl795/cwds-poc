import { beforeEach, describe, expect, it } from 'vitest';
import { clearIconRegistry, registerIcons } from '@covalent-poc/primitives-foundation';

import { createPrimitiveTextField } from './create-text-field';

describe('text-field hardening', () => {
  beforeEach(() => {
    clearIconRegistry();
    registerIcons({
      user: {
        viewBox: '0 0 24 24',
        paths: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M4 20a8 8 0 0 1 16 0']
      },
      check: {
        viewBox: '0 0 24 24',
        paths: ['M4 12l5 5 11-11']
      }
    });
  });

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

  it('renders registered icon names as SVG icons', () => {
    const field = createPrimitiveTextField({
      id: 'phase35-user',
      name: 'phase35-user',
      label: 'Assignee',
      icon: 'user'
    });

    expect(field.element.querySelector('.cv-form-field__icon--start .cv-icon')).not.toBeNull();
  });

  it('prefers loading indicator over trailing icon', () => {
    const field = createPrimitiveTextField({
      id: 'phase35-loading',
      name: 'phase35-loading',
      label: 'Project name',
      loading: true,
      iconTrailing: 'check'
    });

    expect(field.element.querySelector('.cv-form-field__loader')).not.toBeNull();
    expect(field.element.querySelector('.cv-form-field__icon--end')).toBeNull();
  });
});
