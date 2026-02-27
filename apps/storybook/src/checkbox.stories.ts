import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveCheckbox } from '@covalent-poc/components';

type CheckboxArgs = {
  label: string;
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  reducedTouchTarget: boolean;
};

const meta: Meta<CheckboxArgs> = {
  title: 'Primitives/Checkbox',
  tags: ['autodocs'],
  args: {
    label: 'Receive product updates',
    checked: false,
    indeterminate: false,
    disabled: false,
    reducedTouchTarget: false
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Checkbox label'
    },
    checked: {
      control: 'boolean',
      description: 'Initial checked state'
    },
    indeterminate: {
      control: 'boolean',
      description: 'Initial partial state'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction'
    },
    reducedTouchTarget: {
      control: 'boolean',
      description:
        'Reduces touch target and increases density. Warning: this does not meet touch accessibility guidance.'
    }
  },
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj<CheckboxArgs>;

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '0.75rem';

    container.append(
      createPrimitiveCheckbox({ id: 'notify', name: 'notify', label: 'Enable notifications' }),
      createPrimitiveCheckbox({
        id: 'auto-remediate',
        name: 'auto-remediate',
        label: 'Enable auto remediation',
        checked: true
      }),
      createPrimitiveCheckbox({
        id: 'partial',
        name: 'partial',
        label: 'Partially selected state',
        indeterminate: true
      }),
      createPrimitiveCheckbox({
        id: 'disabled-opt',
        name: 'disabled-opt',
        label: 'Disabled setting',
        disabled: true
      }),
      createPrimitiveCheckbox({
        id: 'compact-opt',
        name: 'compact-opt',
        label: 'Reduced touch target (dense)',
        reducedTouchTarget: true
      })
    );

    return container;
  }
};

export const Docs: Story = {
  render: (args) =>
    createPrimitiveCheckbox({
      id: 'docs-checkbox',
      name: 'docs-checkbox',
      label: args.label,
      checked: args.indeterminate ? false : args.checked,
      indeterminate: args.indeterminate,
      disabled: args.disabled,
      reducedTouchTarget: args.reducedTouchTarget
    })
};
