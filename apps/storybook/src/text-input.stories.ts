import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTextInput } from '@ds/primitives';

type TextInputArgs = {
  type:
    | 'text'
    | 'search'
    | 'tel'
    | 'url'
    | 'email'
    | 'password'
    | 'date'
    | 'month'
    | 'week'
    | 'time'
    | 'datetime-local'
    | 'number'
    | 'color';
  placeholder: string;
  required: boolean;
  autoValidate: boolean;
};

const meta: Meta<TextInputArgs> = {
  title: 'Primitives/Text Input',
  args: {
    type: 'email',
    placeholder: 'team@example.com',
    required: true,
    autoValidate: true
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'search', 'tel', 'url', 'email', 'password', 'date', 'month', 'week', 'time', 'datetime-local', 'number', 'color']
    },
    placeholder: { control: 'text' },
    required: { control: 'boolean' },
    autoValidate: { control: 'boolean' }
  },
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj<TextInputArgs>;

export const Docs: Story = {
  render: (args) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '0.5rem';
    container.style.minWidth = '22rem';

    const label = document.createElement('label');
    label.htmlFor = 'storybook-text-input';
    label.textContent = 'Raw text input';
    label.className = 'cv-form-field__label';

    const input = createPrimitiveTextInput({
      id: 'storybook-text-input',
      name: 'storybook-text-input',
      type: args.type,
      placeholder: args.placeholder,
      required: args.required,
      autoValidate: args.autoValidate,
      validate(value) {
        if (!args.required || value.trim().length > 0) {
          return null;
        }

        return 'Value is required.';
      }
    });

    const helper = document.createElement('p');
    helper.className = 'cv-form-field__helper';
    helper.textContent = 'Validation state is driven by headless field controller.';

    input.element.addEventListener('input', () => {
      const error = input.getError();
      helper.textContent = error ?? 'Validation state is driven by headless field controller.';
    });

    container.append(label, input.element, helper);
    return container;
  }
};
