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
      })
    );

    return container;
  }
};
