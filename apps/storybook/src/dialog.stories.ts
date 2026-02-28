import type { Meta, StoryObj } from '@storybook/html-vite';

import {
  createAlertDialog,
  createCompositeDialog,
  createConfirmDialog,
  createDestructiveConfirmDialog,
  createPrimitiveButton
} from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Dialog',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const BaselineAndConfirm: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '0.5rem';
    wrapper.style.flexWrap = 'wrap';

    const defaultTrigger = createPrimitiveButton({ label: 'Open default dialog' });
    const confirmTrigger = createPrimitiveButton({ label: 'Open confirm dialog' });

    const defaultDialog = createCompositeDialog({
      trigger: defaultTrigger,
      title: 'Publish release notes',
      description: 'Confirm publishing this draft to all users.'
    });

    const confirmDialog = createConfirmDialog({
      trigger: confirmTrigger,
      title: 'Apply rollout policy',
      description: 'This updates all selected environments.'
    });

    defaultTrigger.addEventListener('click', () => defaultDialog.showModal());
    confirmTrigger.addEventListener('click', () => confirmDialog.showModal());

    wrapper.append(defaultTrigger, confirmTrigger, defaultDialog, confirmDialog);
    return wrapper;
  }
};

export const AlertAndDestructive: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.gap = '0.5rem';
    wrapper.style.flexWrap = 'wrap';

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
