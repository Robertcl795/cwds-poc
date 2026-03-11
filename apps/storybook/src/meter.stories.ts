import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveMeter } from '@ds/components';

const meta: Meta = {
  title: 'Primitives/Meter',
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
    container.style.gap = '1rem';
    container.style.inlineSize = '22rem';

    container.append(
      createPrimitiveMeter({
        label: 'Deployment readiness',
        helper: 'Low/high/optimum drive native meter semantics',
        value: 72,
        low: 40,
        high: 80,
        optimum: 90
      }).element,
      createPrimitiveMeter({
        label: 'Index quality',
        value: 38,
        low: 30,
        high: 70,
        optimum: 85,
        size: 'sm'
      }).element
    );

    return container;
  }
};
