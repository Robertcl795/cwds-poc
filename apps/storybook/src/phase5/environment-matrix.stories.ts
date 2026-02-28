import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Phase5/Environment Matrix',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const CompactMotionContrast: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';

    const notes = [
      'Default: verify surface/elevation hierarchy.',
      'Compact: set data-dense on toolbars/cards/ribbons.',
      'Reduced motion: transitions disabled via media query.',
      'Forced colors: borders/outlines remain visible.'
    ];

    for (const note of notes) {
      const item = document.createElement('p');
      item.style.margin = '0';
      item.textContent = note;
      wrapper.append(item);
    }

    return wrapper;
  }
};
