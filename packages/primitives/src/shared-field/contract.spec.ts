import { describe, expect, it } from 'vitest';

import { resolveFieldMessages } from './contract';

describe('shared-field contract helpers', () => {
  it('normalizes helperText and errorText aliases', () => {
    expect(
      resolveFieldMessages({
        helper: 'Legacy helper',
        helperText: 'Preferred helper',
        validationMessage: 'Legacy error',
        errorText: 'Preferred error'
      })
    ).toEqual({
      helperText: 'Preferred helper',
      errorText: 'Preferred error'
    });
  });

  it('falls back to legacy names when preferred names are absent', () => {
    expect(
      resolveFieldMessages({
        helper: 'Legacy helper',
        validationMessage: 'Legacy error'
      })
    ).toEqual({
      helperText: 'Legacy helper',
      errorText: 'Legacy error'
    });
  });
});
