import type { Meta, StoryObj } from '@storybook/html-vite';

import {
  createPrimitiveButton,
  createPrimitiveCheckbox,
  createPrimitiveFormField,
  createPrimitiveTextInput
} from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/A11y Checks',
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj;

export const LabeledControls: Story = {
  render: () => {
    const container = document.createElement('section');
    container.style.display = 'grid';
    container.style.gap = '0.75rem';
    container.style.minWidth = '24rem';

    const input = createPrimitiveTextInput({
      id: 'email-a11y',
      name: 'email',
      placeholder: 'team@example.com',
      required: true
    });

    const field = createPrimitiveFormField({
      input,
      label: 'Email',
      helperText: 'Used only for notifications.'
    });

    const checkbox = createPrimitiveCheckbox({
      id: 'alerts-a11y',
      name: 'alerts',
      label: 'Send release alerts'
    });

    const button = createPrimitiveButton({
      label: 'Save preferences'
    });

    container.append(field.element, checkbox, button);
    return container;
  }
};
