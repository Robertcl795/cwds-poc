import { describe, expect, it } from 'vitest';

import { createPrimitiveButton } from './button';

describe('button primitive', () => {
  it('applies shape/color variants and icon placement', () => {
    const button = createPrimitiveButton({
      label: 'Deploy',
      shape: 'outlined',
      color: 'emphasis',
      iconStart: '🚀',
      iconEnd: '→'
    });

    expect(button.dataset.shape).toBe('outlined');
    expect(button.dataset.color).toBe('emphasis');
    expect(button.querySelector('.cv-button__icon--start')?.textContent).toBe('🚀');
    expect(button.querySelector('.cv-button__icon--end')?.textContent).toBe('→');
  });

  it('supports raised, dense, full width, and expand content primitives', () => {
    const button = createPrimitiveButton({
      label: 'Deploy',
      iconEnd: '→',
      raised: true,
      dense: true,
      fullWidth: true,
      expandContent: true
    });

    expect(button.dataset.raised).toBe('true');
    expect(button.dataset.dense).toBe('true');
    expect(button.dataset.fullWidth).toBe('true');
    expect(button.dataset.expandContent).toBe('true');
    expect(button.querySelector('.cv-button__slot')).not.toBeNull();
  });

  it('renders loading state with spinner and disabled semantics', () => {
    const button = createPrimitiveButton({ label: 'Save', loading: true, loadingLabel: 'Saving' });

    expect(button.disabled).toBe(true);
    expect(button.dataset.loading).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.cv-loading-indicator')).not.toBeNull();
    expect(button.querySelector('.cv-button__label')?.textContent).toBe('Saving');
  });
});
