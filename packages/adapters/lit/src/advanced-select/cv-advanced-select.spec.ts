import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineCvAdvancedSelect } from './cv-advanced-select';
import { defineCvCombobox } from '../combobox';

type AdvancedSelectElement = HTMLElement & {
  name: string;
  value: string;
  searchable: boolean;
  options: Array<{ value: string; label: string }>;
};

const nextTick = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('CvAdvancedSelect', () => {
  beforeAll(() => {
    defineCvCombobox();
    defineCvAdvancedSelect();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mirrors committed value from inner combobox', async () => {
    const element = document.createElement('cv-advanced-select') as AdvancedSelectElement;
    element.options = [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' }
    ];

    const onChange = vi.fn();
    element.addEventListener('change', onChange);

    document.body.append(element);
    await nextTick();

    const inner = element.shadowRoot?.querySelector('cv-combobox');
    expect(inner).toBeTruthy();

    inner?.dispatchEvent(
      new CustomEvent('cv-value-commit', {
        bubbles: true,
        composed: true,
        detail: {
          value: 'pending',
          source: 'keyboard'
        }
      })
    );

    await nextTick();

    expect(element.value).toBe('pending');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('restores initial value when parent form resets', async () => {
    const form = document.createElement('form');
    const element = document.createElement('cv-advanced-select') as AdvancedSelectElement;
    element.name = 'status';
    element.value = 'active';
    element.options = [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' }
    ];

    form.append(element);
    document.body.append(form);
    await nextTick();

    element.value = 'pending';
    await nextTick();

    form.reset();
    await nextTick();

    expect(element.value).toBe('active');
  });

  it('uses readonly inner combobox when searchable is false', async () => {
    const element = document.createElement('cv-advanced-select') as AdvancedSelectElement;
    element.searchable = false;
    element.options = [{ value: 'active', label: 'Active' }];

    document.body.append(element);
    await nextTick();

    const inner = element.shadowRoot?.querySelector('cv-combobox');
    expect(inner?.hasAttribute('readonly')).toBe(true);
  });
});
