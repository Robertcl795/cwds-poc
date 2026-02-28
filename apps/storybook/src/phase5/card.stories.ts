import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveCard } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Card',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(16rem, 1fr))';
    grid.style.gap = '0.75rem';

    const outlined = createPrimitiveCard({
      title: 'Outlined card',
      body: 'Use for default enterprise sections.',
      actions: [{ id: 'open', label: 'Open' }]
    });

    const filled = createPrimitiveCard({
      variant: 'filled',
      title: 'Filled card',
      body: 'Use for grouped contextual content.'
    });

    const elevated = createPrimitiveCard({
      variant: 'elevated',
      title: 'Elevated card',
      body: 'Use for prominent dashboard surfaces.',
      dense: true
    });

    grid.append(outlined.element, filled.element, elevated.element);
    return grid;
  }
};
