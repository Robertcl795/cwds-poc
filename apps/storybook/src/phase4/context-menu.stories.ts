import type { Meta, StoryObj } from '@storybook/html-vite';

import { createContextMenu } from '@ds/primitives';

type ContextMenuArgs = {
  disabledArchive: boolean;
};

const meta: Meta<ContextMenuArgs> = {
  title: 'Phase4/Context Menu',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    disabledArchive: true
  },
  argTypes: {
    disabledArchive: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<ContextMenuArgs>;

export const Docs: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';
    wrapper.style.inlineSize = '26rem';

    const target = document.createElement('button');
    target.className = 'cv-button';
    target.type = 'button';
    target.textContent = 'Open context menu (right click or Shift+F10)';

    const log = document.createElement('p');
    log.style.margin = '0';
    log.style.fontSize = '0.85rem';
    log.style.color = 'var(--cv-sys-color-text-muted)';
    log.textContent = 'No action selected.';

    createContextMenu({
      target,
      items: [
        { id: 'rename', label: 'Rename' },
        { id: 'duplicate', label: 'Duplicate' },
        { id: 'archive', label: 'Archive', disabled: args.disabledArchive }
      ],
      onAction(item, source) {
        log.textContent = `Action: ${item.id} (${source})`;
      }
    });

    wrapper.append(target, log);
    return wrapper;
  }
};
