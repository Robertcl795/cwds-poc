import { beforeEach, describe, expect, it } from 'vitest';

import { clearIconRegistry, registerIcons } from '@covalent-poc/primitives-foundation';

import { createPrimitiveIconButton } from './icon-button/create-icon-button';

describe('icon-button primitive', () => {
  beforeEach(() => {
    clearIconRegistry();
    registerIcons({
      close: {
        viewBox: '0 0 24 24',
        paths: ['M6 6L18 18', 'M18 6L6 18']
      }
    });
  });

  it('requires aria label', () => {
    expect(() =>
      createPrimitiveIconButton({
        icon: 'close',
        ariaLabel: ''
      })
    ).toThrowError(/accessible name/i);
  });

  it('creates icon button with selected state', () => {
    const button = createPrimitiveIconButton({
      icon: 'close',
      ariaLabel: 'Close dialog',
      variant: 'outlined',
      selected: true
    });

    expect(button.getAttribute('aria-label')).toBe('Close dialog');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.dataset.variant).toBe('outlined');
    expect(button.querySelector('.cv-icon-button__icon .cv-icon')).not.toBeNull();
  });
});
