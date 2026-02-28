import type { Meta, StoryObj } from '@storybook/html-vite';

import { applyFocusRing } from '@ds/utils-a11y';

const meta: Meta = {
  title: 'Foundation/Focus Ring'
};

export default meta;

type Story = StoryObj;

export const Modes: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '0.75rem';

    const makeButton = (label: string, mode: 'auto' | 'always' | 'off') => {
      const button = document.createElement('button');
      button.className = 'cv-button';
      button.textContent = label;
      applyFocusRing(button, mode);
      return button;
    };

    wrapper.append(
      makeButton('Auto mode', 'auto'),
      makeButton('Always mode', 'always'),
      makeButton('Off mode', 'off')
    );

    return wrapper;
  }
};
