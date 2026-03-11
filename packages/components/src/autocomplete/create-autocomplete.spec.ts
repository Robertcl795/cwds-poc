import { describe, expect, it } from 'vitest';

import { createPrimitiveAutocomplete } from './create-autocomplete';

describe('autocomplete primitive', () => {
  it('wires a native datalist to its input', () => {
    const autocomplete = createPrimitiveAutocomplete({
      id: 'owner',
      name: 'owner',
      label: 'Owner',
      options: [
        { value: 'Amy Atlas' },
        { value: 'Ben Burke', label: 'Engineering' }
      ]
    });

    expect(autocomplete.input.getAttribute('list')).toBe('owner-list');
    expect(autocomplete.datalist.querySelectorAll('option').length).toBe(2);
  });

  it('supports updating datalist options', () => {
    const autocomplete = createPrimitiveAutocomplete({
      id: 'environment',
      name: 'environment',
      label: 'Environment',
      options: [{ value: 'Production' }]
    });

    autocomplete.setOptions([
      { value: 'Production' },
      { value: 'Staging' },
      { value: 'QA' }
    ]);

    expect(autocomplete.datalist.querySelectorAll('option').length).toBe(3);
  });
});
