import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTooltip } from '@ds/primitives';

type TooltipArgs = {
  content: string;
  placement: 'top' | 'bottom' | 'start' | 'end';
  disabled: boolean;
};

const meta: Meta<TooltipArgs> = {
  title: 'Phase4/Tooltip',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    content: 'Status is calculated from upstream deploy health.',
    placement: 'top',
    disabled: false
  },
  argTypes: {
    content: { control: 'text' },
    placement: { control: 'radio', options: ['top', 'bottom', 'start', 'end'] },
    disabled: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<TooltipArgs>;

export const Docs: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.minHeight = '8rem';
    wrapper.style.display = 'grid';
    wrapper.style.placeItems = 'center';

    const button = document.createElement('button');
    button.className = 'cv-button';
    button.type = 'button';
    button.textContent = 'Hover or focus';

    createPrimitiveTooltip({
      trigger: button,
      content: args.content,
      placement: args.placement,
      disabled: args.disabled
    });

    wrapper.append(button);
    return wrapper;
  }
};
