import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveRadio } from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Radio',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const GroupStates: Story = {
  render: () => {
    const container = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = 'Priority';
    container.append(legend);
    container.style.display = 'grid';
    container.style.gap = '0.5rem';

    container.append(
      createPrimitiveRadio({
        id: 'priority-low',
        name: 'priority',
        value: 'low',
        label: 'Low'
      }),
      createPrimitiveRadio({
        id: 'priority-medium',
        name: 'priority',
        value: 'medium',
        label: 'Medium',
        checked: true
      }),
      createPrimitiveRadio({
        id: 'priority-high',
        name: 'priority',
        value: 'high',
        label: 'High',
        disabled: true
      })
    );

    return container;
  }
};
