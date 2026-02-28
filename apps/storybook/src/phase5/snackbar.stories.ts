import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveButton, createPrimitiveSnackbarHost } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Snackbar',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const Queue: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.5rem';

    const host = createPrimitiveSnackbarHost({
      defaultDurationMs: 3500
    });

    const trigger = createPrimitiveButton({
      label: 'Show snackbar sequence',
      onPress() {
        host.enqueue({ message: 'Report generated', tone: 'success', action: { id: 'open', label: 'Open' } });
        host.enqueue({ message: 'Sync in progress', tone: 'info' });
        host.enqueue({ message: 'Archival failed', tone: 'error', priority: 'assertive' });
      }
    });

    wrapper.append(trigger);
    return wrapper;
  }
};
