import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTextField } from '@covalent-poc/components';
import { registerIcons } from '@covalent-poc/primitives-foundation';

const ensureIcons = (): void => {
  try {
    registerIcons({
      add: { viewBox: '0 0 24 24', paths: ['M12 5v14', 'M5 12h14'] },
      user: {
        viewBox: '0 0 24 24',
        paths: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M4 20a8 8 0 0 1 16 0']
      },
      check: { viewBox: '0 0 24 24', paths: ['M4 12l5 5 11-11'] }
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('Icon already registered')) {
      throw error;
    }
  }
};

ensureIcons();

type TextFieldArgs = {
  label: string;
  value: string;
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
  name: string;
  placeholder: string;
  helper: string;
  helperPersistent: boolean;
  outlined: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  dense: boolean;
  prefix: string;
  suffix: string;
  icon: string;
  iconTrailing: string;
  maxLength: number;
  charCounter: boolean;
  autoValidate: boolean;
  validateOnInitialRender: boolean;
  validationMessage: string;
  loading: boolean;
  loaderDensity: 'sm' | 'md' | 'lg';
  tone: 'neutral' | 'negative' | 'positive';
};

const meta: Meta<TextFieldArgs> = {
  title: 'Primitives/Text Field',
  tags: ['autodocs'],
  args: {
    label: 'Email',
    value: '',
    type: 'email',
    name: 'email',
    placeholder: 'team@example.com',
    helper: 'We use this for release notifications.',
    helperPersistent: false,
    outlined: true,
    required: false,
    disabled: false,
    readOnly: false,
    dense: false,
    prefix: '',
    suffix: '',
    icon: '',
    iconTrailing: '',
    maxLength: 32,
    charCounter: false,
    autoValidate: false,
    validateOnInitialRender: false,
    validationMessage: 'Please provide a valid value.',
    loading: false,
    loaderDensity: 'sm',
    tone: 'neutral'
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    type: {
      control: 'select',
      options: [
        'text',
        'search',
        'tel',
        'url',
        'email',
        'password',
        'date',
        'month',
        'week',
        'time',
        'datetime-local',
        'number',
        'color'
      ]
    },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    helper: { control: 'text' },
    helperPersistent: { control: 'boolean' },
    outlined: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    dense: { control: 'boolean' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
    icon: { control: 'text' },
    iconTrailing: { control: 'text' },
    maxLength: { control: { type: 'number', min: 1, max: 256, step: 1 } },
    charCounter: { control: 'boolean' },
    autoValidate: { control: 'boolean' },
    validateOnInitialRender: { control: 'boolean' },
    validationMessage: { control: 'text' },
    loading: { control: 'boolean' },
    loaderDensity: { control: 'radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'radio', options: ['neutral', 'negative', 'positive'] }
  },
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj<TextFieldArgs>;

const renderField = (args: TextFieldArgs): HTMLDivElement => {
  const field = createPrimitiveTextField({
    id: `${args.name}-field`,
    name: args.name,
    label: args.label,
    value: args.value,
    type: args.type,
    placeholder: args.placeholder,
    helper: args.helper,
    helperPersistent: args.helperPersistent,
    outlined: args.outlined,
    required: args.required,
    disabled: args.disabled,
    readOnly: args.readOnly,
    dense: args.dense,
    prefix: args.prefix.trim() ? args.prefix : undefined,
    suffix: args.suffix.trim() ? args.suffix : undefined,
    icon: args.icon.trim() ? args.icon : undefined,
    iconTrailing: args.iconTrailing.trim() ? args.iconTrailing : undefined,
    maxLength: args.maxLength,
    charCounter: args.charCounter,
    autoValidate: args.autoValidate,
    validateOnInitialRender: args.validateOnInitialRender,
    validationMessage: args.validationMessage,
    loading: args.loading,
    loaderDensity: args.loaderDensity,
    tone: args.tone
  });

  field.element.style.minWidth = '22rem';
  return field.element;
};

export const Docs: Story = {
  render: (args) => renderField(args)
};

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '1rem';
    container.style.minWidth = '22rem';

    container.append(
      createPrimitiveTextField({
        id: 'email-standard',
        name: 'email-standard',
        label: 'Email',
        type: 'email',
        placeholder: 'team@example.com',
        helper: 'Used for release notifications.',
        outlined: false
      }).element,
      createPrimitiveTextField({
        id: 'team-outlined',
        name: 'team-outlined',
        label: 'Team id',
        helper: '3-32 chars',
        outlined: true,
        icon: 'user',
        charCounter: true,
        maxLength: 32
      }).element,
      createPrimitiveTextField({
        id: 'loading-field',
        name: 'loading-field',
        label: 'Project name',
        helper: 'Syncing naming policy...',
        outlined: true,
        loading: true,
        loaderDensity: 'md',
        iconTrailing: 'check'
      }).element
    );

    return container;
  }
};
