import { describe, expect, it } from 'vitest';

import { applyFieldLinkage } from './linkage';

describe('shared-field linkage helpers', () => {
  it('applies ordered aria-describedby and invalid state', () => {
    const input = document.createElement('input');

    applyFieldLinkage(input, {
      helpId: 'help-id',
      errorId: 'error-id',
      describedBy: 'external-id',
      invalid: true
    });

    expect(input.getAttribute('aria-describedby')).toBe('help-id error-id external-id');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('removes error linkage when not invalid', () => {
    const input = document.createElement('input');

    applyFieldLinkage(input, {
      helpId: 'help-id',
      errorId: 'error-id',
      invalid: false
    });

    expect(input.getAttribute('aria-describedby')).toBe('help-id');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });
});
