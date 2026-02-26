import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveCheckbox } from '@covalent-poc/primitives';

const meta: Meta = {
  title: 'Primitives/Checkbox',
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => createPrimitiveCheckbox({ id: 'notify', name: 'notify', label: 'Enable notifications' })
};

export const Checked: Story = {
  render: () =>
    createPrimitiveCheckbox({
      id: 'auto-remediate',
      name: 'auto-remediate',
      label: 'Enable auto remediation',
      checked: true
    })
};

export const Disabled: Story = {
  render: () =>
    createPrimitiveCheckbox({
      id: 'disabled-opt',
      name: 'disabled-opt',
      label: 'Disabled setting',
      disabled: true
    })
};
