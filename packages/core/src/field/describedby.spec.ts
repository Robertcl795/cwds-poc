import { describe, expect, it } from 'vitest';

import { applyDescribedBy, applyInvalidState } from './describedby';

describe('shared-field describedby helpers', () => {
  it('joins and de-duplicates ids', () => {
    const input = document.createElement('input');
    applyDescribedBy(input, ['help-id error-id', 'help-id', undefined, null]);
    expect(input.getAttribute('aria-describedby')).toBe('help-id error-id');
  });

  it('clears aria-describedby when no ids are provided', () => {
    const input = document.createElement('input');
    input.setAttribute('aria-describedby', 'some-id');
    applyDescribedBy(input, []);
    expect(input.hasAttribute('aria-describedby')).toBe(false);
  });

  it('sets and clears aria-invalid', () => {
    const input = document.createElement('input');
    applyInvalidState(input, true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    applyInvalidState(input, false);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });
});
