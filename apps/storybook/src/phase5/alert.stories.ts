import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveAlert } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Alert',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const Tones: Story = {
  render: () => {
    const stack = document.createElement('div');
    stack.style.display = 'grid';
    stack.style.gap = '0.75rem';

    const tones: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];

    for (const tone of tones) {
      const alert = createPrimitiveAlert({
        tone,
        variant: 'soft',
        title: `${tone[0]?.toUpperCase()}${tone.slice(1)} status`,
        message: `This is a ${tone} alert for enterprise workflow messaging.`,
        dismissible: true,
        actions: [{ id: `${tone}-action`, label: 'View details' }]
      });

      stack.append(alert.element);
    }

    return stack;
  }
};
