import type { Meta, StoryObj } from '@storybook/html-vite';

import { createActionRibbon } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Action Ribbon',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const EnterpriseWorkflow: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.5rem';

    const log = document.createElement('p');
    log.style.margin = '0';
    log.textContent = 'No action selected.';

    const ribbon = createActionRibbon({
      tone: 'warning',
      sticky: true,
      selectionCount: 4,
      message: 'Unsaved table edits pending review.',
      dismissible: true,
      actions: [
        { id: 'save', label: 'Save', kind: 'primary' },
        { id: 'discard', label: 'Discard', kind: 'danger' },
        { id: 'validate', label: 'Validate' }
      ],
      maxVisibleActions: 2,
      onAction(action, source) {
        log.textContent = `Ribbon action: ${action.id} (${source})`;
      }
    });

    wrapper.append(ribbon.element, log);
    return wrapper;
  }
};
