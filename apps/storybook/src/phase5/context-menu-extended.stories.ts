import type { Meta, StoryObj } from '@storybook/html-vite';

import { createContextMenu } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Context Menu Extended',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const SectionsAndShortcuts: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.5rem';

    const target = document.createElement('button');
    target.className = 'cv-button';
    target.type = 'button';
    target.textContent = 'Right-click deployment row';

    const log = document.createElement('p');
    log.style.margin = '0';

    createContextMenu({
      target,
      items: [
        { type: 'label', id: 'row-label', label: 'Row actions' },
        { id: 'open', label: 'Open details', shortcut: 'Alt+O' },
        { id: 'retry', label: 'Retry', shortcut: 'Alt+R' },
        { type: 'separator', id: 'sep-1' },
        { id: 'delete', label: 'Delete', kind: 'danger', shortcut: 'Del' }
      ],
      onAction(item, source) {
        log.textContent = `Action: ${item.id} (${source})`;
      }
    });

    wrapper.append(target, log);
    return wrapper;
  }
};
