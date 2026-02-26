import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveFormField, createPrimitiveTextInput } from '@covalent-poc/primitives';

const meta: Meta = {
  title: 'Primitives/Form Field',
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj;

export const TextInput: Story = {
  render: () => {
    const input = createPrimitiveTextInput({
      id: 'email',
      name: 'email',
      placeholder: 'team@example.com',
      required: true
    });

    const field = createPrimitiveFormField({
      input,
      label: 'Email',
      helperText: 'We use this for release notifications.'
    });

    field.element.style.minWidth = '22rem';
    return field.element;
  }
};
