import type { Meta, StoryObj } from '@storybook/html-vite';

import { setElevation } from '@ds/utils-a11y';

const meta: Meta = {
  title: 'Foundation/Elevation'
};

export default meta;

type Story = StoryObj;

export const Levels: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = 'repeat(3, minmax(120px, 1fr))';
    wrapper.style.gap = '1rem';
    wrapper.style.width = 'min(34rem, 100vw - 2rem)';

    for (const level of [0, 1, 2, 3, 4, 5] as const) {
      const card = document.createElement('div');
      card.style.padding = '0.75rem';
      card.style.borderRadius = '0.75rem';
      card.style.background = 'var(--cv-sys-color-surface)';
      card.style.border = '1px solid var(--cv-sys-color-border)';
      card.textContent = `Level ${level}`;
      setElevation(card, level);
      wrapper.append(card);
    }

    return wrapper;
  }
};
