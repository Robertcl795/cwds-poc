import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveProgress } from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Progress',
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
    container.style.gap = '0.75rem';
    container.style.inlineSize = '20rem';

    container.append(
      createPrimitiveProgress({ ariaLabel: 'Upload progress', value: 25 }),
      createPrimitiveProgress({ ariaLabel: 'Indexing progress', value: 68, tone: 'secondary' }),
      createPrimitiveProgress({ ariaLabel: 'Indeterminate progress', indeterminate: true })
    );

    return container;
  }
};
