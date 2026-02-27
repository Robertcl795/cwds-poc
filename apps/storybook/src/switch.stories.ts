import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveSwitch } from '@covalent-poc/components';

const meta: Meta = {
  title: 'Primitives/Switch',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '0.5rem';

    container.append(
      createPrimitiveSwitch({
        id: 'switch-default',
        name: 'switch-default',
        label: 'Enable notifications'
      }),
      createPrimitiveSwitch({
        id: 'switch-enabled',
        name: 'switch-enabled',
        label: 'Auto deploy',
        checked: true
      }),
      createPrimitiveSwitch({
        id: 'switch-disabled',
        name: 'switch-disabled',
        label: 'Disabled setting',
        disabled: true
      })
    );

    return container;
  }
};
