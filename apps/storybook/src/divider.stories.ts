import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveDivider } from '@covalent-poc/components';

const meta: Meta = {
  title: 'Primitives/Divider',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const Orientations: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '1rem';
    container.style.inlineSize = '20rem';

    const h = createPrimitiveDivider();
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'auto 1px auto';
    row.style.alignItems = 'center';
    row.style.blockSize = '2rem';
    row.append('Start', createPrimitiveDivider({ orientation: 'vertical' }), 'End');

    container.append(h, row);
    return container;
  }
};
