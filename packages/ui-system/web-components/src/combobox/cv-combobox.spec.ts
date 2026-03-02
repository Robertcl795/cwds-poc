import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineCvCombobox } from './cv-combobox';
import type { CvCombobox } from './cv-combobox';

const nextTick = async (): Promise<void> => {
  await Promise.resolve();
};

describe('CvCombobox', () => {
  beforeAll(() => {
    defineCvCombobox();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const createCombobox = async (): Promise<CvCombobox> => {
    const combobox = document.createElement('cv-combobox') as CvCombobox;
    combobox.name = 'status';
    combobox.options = [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'archived', label: 'Archived', disabled: true }
    ];

    document.body.append(combobox);
    await nextTick();
    return combobox;
  };

  it('commits highlighted option with keyboard', async () => {
    const combobox = await createCombobox();
    const onChange = vi.fn();
    combobox.addEventListener('change', onChange);

    const input = combobox.shadowRoot?.querySelector<HTMLInputElement>('input[part="input"]');
    expect(input).toBeTruthy();

    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(combobox.value).toBe('active');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('filters options from input text', async () => {
    const combobox = await createCombobox();
    const input = combobox.shadowRoot?.querySelector<HTMLInputElement>('input[part="input"]');
    expect(input).toBeTruthy();

    if (!input) {
      return;
    }

    input.value = 'pend';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    const visibleOptions = Array.from(combobox.shadowRoot?.querySelectorAll('[data-option-id]') ?? []).map((node) =>
      node.textContent?.trim()
    );

    expect(visibleOptions).toContain('Pending');
    expect(visibleOptions).not.toContain('Active');
  });

  it('restores initial value when parent form resets', async () => {
    const form = document.createElement('form');
    const combobox = document.createElement('cv-combobox') as CvCombobox;
    combobox.name = 'status';
    combobox.value = 'pending';
    combobox.options = [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' }
    ];

    form.append(combobox);
    document.body.append(form);
    await nextTick();

    combobox.value = 'active';
    form.reset();

    expect(combobox.value).toBe('pending');
  });
});
