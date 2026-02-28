import type { Meta, StoryObj } from '@storybook/html-vite';

import { applyRipple } from '@ds/utils-a11y';

const meta: Meta = {
  title: 'Foundation/Ripple'
};

export default meta;

type Story = StoryObj;

export const EnabledAndDisabled: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'flex';
    root.style.gap = '0.75rem';

    const enabled = document.createElement('button');
    enabled.className = 'cv-button';
    enabled.textContent = 'Ripple enabled';
    applyRipple(enabled, { styleMutation: 'allow' });

    const disabled = document.createElement('button');
    disabled.className = 'cv-button';
    disabled.textContent = 'Ripple disabled';
    disabled.dataset.cvRipple = 'off';

    root.append(enabled, disabled);
    return root;
  }
};
