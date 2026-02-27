import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveSelect, type PrimitiveSelectOption } from '@covalent-poc/components';

type SelectArgs = {
  label: string;
  value: '' | 'active' | 'pending' | 'archived';
  validationMessage: string;
  helper: string;
  icon: string;
  required: boolean;
  outlined: boolean;
  naturalMenuWidth: boolean;
  fixedMenuPosition: boolean;
  disabled: boolean;
  validateOnInitialRender: boolean;
};

const demoOptions: PrimitiveSelectOption[] = [
  { id: 'active', label: 'Active', value: 'active' },
  { id: 'pending', label: 'Pending', value: 'pending' },
  { id: 'archived', label: 'Archived', value: 'archived', disabled: true }
];

const meta: Meta<SelectArgs> = {
  title: 'Primitives/Select',
  tags: ['autodocs'],
  args: {
    label: 'Status',
    value: '',
    validationMessage: 'Status is required.',
    helper: 'Choose lifecycle status',
    icon: '',
    required: false,
    outlined: true,
    naturalMenuWidth: false,
    fixedMenuPosition: false,
    disabled: false,
    validateOnInitialRender: false
  },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'select', options: ['', 'active', 'pending', 'archived'] },
    validationMessage: { control: 'text' },
    helper: { control: 'text' },
    icon: { control: 'text' },
    required: { control: 'boolean' },
    outlined: { control: 'boolean' },
    naturalMenuWidth: { control: 'boolean' },
    fixedMenuPosition: { control: 'boolean' },
    disabled: { control: 'boolean' },
    validateOnInitialRender: { control: 'boolean' }
  },
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj<SelectArgs>;

export const Docs: Story = {
  render: (args) => {
    const value = args.value === '' ? undefined : args.value;
    const select = createPrimitiveSelect({
      id: 'status-select',
      name: 'status',
      label: args.label,
      options: demoOptions,
      ...(value !== undefined ? { value } : {}),
      validationMessage: args.validationMessage,
      helper: args.helper,
      ...(args.icon.trim().length > 0 ? { icon: args.icon } : {}),
      required: args.required,
      outlined: args.outlined,
      naturalMenuWidth: args.naturalMenuWidth,
      fixedMenuPosition: args.fixedMenuPosition,
      disabled: args.disabled,
      validateOnInitialRender: args.validateOnInitialRender
    });

    select.element.style.minWidth = '22rem';
    return select.element;
  }
};

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '1rem';
    container.style.minWidth = '22rem';

    container.append(
      createPrimitiveSelect({
        id: 'standard-status',
        name: 'standard-status',
        label: 'Status',
        options: demoOptions,
        helper: 'Standard outlined select'
      }).element,
      createPrimitiveSelect({
        id: 'required-status',
        name: 'required-status',
        label: 'Required status',
        options: demoOptions,
        required: true,
        helper: 'This is required',
        validationMessage: 'Status is required.',
        validateOnInitialRender: true,
        icon: '⟐'
      }).element,
      createPrimitiveSelect({
        id: 'disabled-status',
        name: 'disabled-status',
        label: 'Disabled status',
        options: demoOptions,
        value: 'pending',
        helper: 'Locked by workflow state',
        disabled: true
      }).element
    );

    return container;
  }
};
