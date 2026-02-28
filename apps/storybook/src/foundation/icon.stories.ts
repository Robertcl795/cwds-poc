import type { Meta, StoryObj } from '@storybook/html-vite';

import { clearIconRegistry, createIconNode, registerIcons } from '@ds/utils-icons';

const meta: Meta = {
  title: 'Foundation/Icon'
};

export default meta;

type Story = StoryObj;

clearIconRegistry();
registerIcons({
  check: {
    viewBox: '0 0 24 24',
    paths: ['M4 12l5 5 11-11']
  }
});

export const TrustedRegistry: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '0.5rem';

    const icon = createIconNode('check');
    icon.setAttribute('data-size', 'lg');

    const text = document.createElement('span');
    text.textContent = 'Icon from trusted registry';

    row.append(icon, text);
    return row;
  }
};
