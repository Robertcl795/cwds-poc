import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveToolbar } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Toolbar',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const Docs: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.5rem';

    const log = document.createElement('p');
    log.style.margin = '0';
    log.textContent = 'No action selected.';

    const toolbar = createPrimitiveToolbar({
      ariaLabel: 'Release toolbar',
      title: 'Release Controls',
      actions: [
        { id: 'refresh', label: 'Refresh' },
        { id: 'deploy', label: 'Deploy', kind: 'primary' },
        { id: 'archive', label: 'Archive', kind: 'danger' }
      ],
      maxVisibleActions: 2,
      onAction(action, source) {
        log.textContent = `Action: ${action.id} (${source})`;
      }
    });

    wrapper.append(toolbar.element, log);
    return wrapper;
  }
};
