import { describe, expect, it, vi } from 'vitest';

import { createPrimitiveSelect } from './select';

const demoOptions = [
  { id: 'active', label: 'Active', value: 'active' },
  { id: 'pending', label: 'Pending', value: 'pending' },
  { id: 'archived', label: 'Archived', value: 'archived', disabled: true }
] as const;

describe('select primitive', () => {
  it('renders covalent-like API flags and content slots', () => {
    const select = createPrimitiveSelect({
      id: 'status',
      name: 'status',
      label: 'Status',
      options: [...demoOptions],
      value: 'pending',
      helper: 'Choose one status',
      icon: '⟐',
      outlined: true,
      naturalMenuWidth: true,
      fixedMenuPosition: true
    });

    expect(select.element.dataset.outlined).toBe('true');
    expect(select.element.dataset.hasIcon).toBe('true');
    expect(select.element.dataset.naturalMenuWidth).toBe('true');
    expect(select.element.dataset.fixedMenuPosition).toBe('true');
    expect(select.element.dataset.enhanced).toMatch(/true|false/);
    expect(select.selectElement.value).toBe('pending');
    expect(select.element.querySelector('.cv-select-field__helper')?.textContent).toBe('Choose one status');
  });

  it('shows validationMessage for required empty value', () => {
    const select = createPrimitiveSelect({
      id: 'required-status',
      name: 'required-status',
      label: 'Required status',
      options: [...demoOptions],
      required: true,
      validationMessage: 'Status is required.',
      validateOnInitialRender: true
    });

    expect(select.element.dataset.invalid).toBe('true');
    expect(select.selectElement.getAttribute('aria-invalid')).toBe('true');
    expect(select.element.querySelector('.cv-select-field__helper')?.textContent).toBe('Status is required.');
  });

  it('emits value changes with keyboard or pointer source', () => {
    const onValueChange = vi.fn();
    const select = createPrimitiveSelect({
      id: 'interaction-status',
      name: 'interaction-status',
      label: 'Interaction status',
      options: [...demoOptions],
      value: 'active',
      onValueChange
    });

    select.selectElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    select.selectElement.selectedIndex = 1;
    select.selectElement.dispatchEvent(new Event('change'));

    select.selectElement.dispatchEvent(new Event('pointerdown'));
    select.selectElement.selectedIndex = 0;
    select.selectElement.dispatchEvent(new Event('change'));

    expect(onValueChange).toHaveBeenNthCalledWith(1, 'pending', 'keyboard');
    expect(onValueChange).toHaveBeenNthCalledWith(2, 'active', 'pointer');
  });

  it('allows disabling enhanced select features while preserving native behavior', () => {
    const select = createPrimitiveSelect({
      id: 'baseline-only-status',
      name: 'baseline-only-status',
      label: 'Baseline',
      options: [...demoOptions],
      enhance: false
    });

    expect(select.element.dataset.enhanced).toBe('false');
    expect(select.selectElement.dataset.enhanced).toBe('false');

    select.selectElement.value = 'pending';
    select.selectElement.dispatchEvent(new Event('change'));

    expect(select.selectElement.value).toBe('pending');
  });
});
