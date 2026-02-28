import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTooltip } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Tooltip Hardening',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const DelaysAndMaxWidth: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.minHeight = '8rem';
    wrapper.style.display = 'grid';
    wrapper.style.placeItems = 'center';

    const button = document.createElement('button');
    button.className = 'cv-button';
    button.type = 'button';
    button.textContent = 'Hover for hardened tooltip';

    createPrimitiveTooltip({
      trigger: button,
      content: 'Tooltips remain supplemental and should not carry critical workflow instructions.',
      placement: 'top',
      openDelayMs: 200,
      closeDelayMs: 80,
      maxWidth: '24ch'
    });

    wrapper.append(button);
    return wrapper;
  }
};
