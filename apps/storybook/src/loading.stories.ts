import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveLoadingIndicator } from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Loading',
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj;

export const Densities: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '1rem';

    row.append(
      createPrimitiveLoadingIndicator({ density: 'sm', label: 'Loading small' }),
      createPrimitiveLoadingIndicator({ density: 'md', label: 'Loading medium' }),
      createPrimitiveLoadingIndicator({ density: 'lg', label: 'Loading large' })
    );

    return row;
  }
};
