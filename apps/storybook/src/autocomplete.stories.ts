import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveAutocomplete } from '@ds/components';

const meta: Meta = {
  title: 'Primitives/Autocomplete',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const NativeSuggestions: Story = {
  render: () => {
    const autocomplete = createPrimitiveAutocomplete({
      id: 'storybook-autocomplete-owner',
      name: 'owner',
      label: 'Owner',
      helper: 'Native input with datalist suggestions; freeform values still allowed.',
      placeholder: 'Search names',
      options: [
        { value: 'Amy Atlas', label: 'Operations' },
        { value: 'Ben Burke', label: 'Engineering' },
        { value: 'Cal Chen', label: 'Design' }
      ]
    });

    autocomplete.element.style.inlineSize = '22rem';
    return autocomplete.element;
  }
};
