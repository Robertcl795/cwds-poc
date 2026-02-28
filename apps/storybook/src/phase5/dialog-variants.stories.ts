import type { Meta, StoryObj } from '@storybook/html-vite';

import { createAlertDialog, createDestructiveConfirmDialog, createPrimitiveButton } from '@ds/primitives';

const meta: Meta = {
  title: 'Phase5/Dialog Variants',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const ConfirmAndAlert: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '0.5rem';

    const alertTrigger = createPrimitiveButton({ label: 'Open alert dialog' });
    const destructiveTrigger = createPrimitiveButton({ label: 'Open destructive dialog', color: 'negative' });

    const alertDialog = createAlertDialog({
      trigger: alertTrigger,
      title: 'Deployment paused',
      description: 'A policy check requires acknowledgement.'
    });

    const destructiveDialog = createDestructiveConfirmDialog({
      trigger: destructiveTrigger,
      title: 'Delete environment',
      description: 'This action cannot be undone.'
    });

    alertTrigger.addEventListener('click', () => alertDialog.showModal());
    destructiveTrigger.addEventListener('click', () => destructiveDialog.showModal());

    wrapper.append(alertTrigger, destructiveTrigger, alertDialog, destructiveDialog);
    return wrapper;
  }
};
