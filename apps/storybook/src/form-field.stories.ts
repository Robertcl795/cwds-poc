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

export const Standard: Story = {
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

export const OutlinedLoading: Story = {
  render: () => {
    const input = createPrimitiveTextInput({
      id: 'project',
      name: 'project'
    });

    const field = createPrimitiveFormField({
      input,
      label: 'Project name',
      variant: 'outlined',
      iconStart: '📦',
      iconEnd: '✓',
      loading: true,
      loadingDensity: 'md',
      helperText: 'Syncing naming policy from server...'
    });

    field.element.style.minWidth = '22rem';
    return field.element;
  }
};

export const RequiredTones: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '1rem';
    container.style.minWidth = '22rem';

    const invalidInput = createPrimitiveTextInput({
      id: 'email-required',
      name: 'email-required',
      required: true
    });
    invalidInput.element.value = 'invalid';

    const invalidField = createPrimitiveFormField({
      input: invalidInput,
      label: 'Recovery email',
      variant: 'outlined',
      tone: 'negative',
      iconStart: '@',
      helperText: 'Required: use a valid email.',
      helperVisibility: 'focus'
    });
    invalidField.element.dataset.focused = 'true';

    const validInput = createPrimitiveTextInput({
      id: 'team-id',
      name: 'team-id'
    });
    validInput.element.value = 'team-core-ui';

    const validField = createPrimitiveFormField({
      input: validInput,
      label: 'Team id',
      variant: 'outlined',
      tone: 'positive',
      iconEnd: '✔',
      helperText: 'Looks good.',
      helperVisibility: 'focus'
    });
    validField.element.dataset.focused = 'true';
    validField.element.dataset.filled = 'true';

    container.append(invalidField.element, validField.element);
    return container;
  }
};
