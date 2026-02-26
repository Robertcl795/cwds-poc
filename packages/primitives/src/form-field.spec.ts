import { describe, expect, it } from 'vitest';

import { createPrimitiveFormField } from './form-field';
import { createPrimitiveTextInput } from './text-input';

describe('form field primitive', () => {
  it('wires label and helper text to the input', () => {
    const input = createPrimitiveTextInput({ id: 'name', name: 'name' });
    const field = createPrimitiveFormField({
      input,
      label: 'Name',
      helperText: 'Provide a name'
    });

    const label = field.element.querySelector('label');
    expect(label?.getAttribute('for')).toBe('name');
    expect(input.element.getAttribute('aria-describedby')).toBe('name-helper');
  });

  it('supports outlined loading state with loader density', () => {
    const input = createPrimitiveTextInput({ id: 'project', name: 'project' });
    const field = createPrimitiveFormField({
      input,
      label: 'Project',
      variant: 'outlined',
      loading: true,
      loadingDensity: 'lg'
    });

    expect(field.element.dataset.variant).toBe('outlined');
    expect(field.element.dataset.loading).toBe('true');
    expect(input.element.getAttribute('aria-busy')).toBe('true');
    expect(field.element.querySelector('.cv-loading-indicator')?.getAttribute('data-density')).toBe('lg');
  });
});
