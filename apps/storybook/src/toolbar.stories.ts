import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveIconButton, createPrimitiveToolbar } from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Toolbar',
  parameters: { a11y: { test: 'error' } }
};

export default meta;

type Story = StoryObj;

export const Docs: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.5rem';
    wrapper.style.inlineSize = 'min(52rem, 100%)';

    const log = document.createElement('p');
    log.style.margin = '0';
    log.textContent = 'No action selected.';

    const navIcon = document.createElement('span');
    navIcon.textContent = '☰';
    navIcon.setAttribute('aria-hidden', 'true');

    const leadingMenu = createPrimitiveIconButton({
      icon: navIcon,
      ariaLabel: 'Open navigation',
      variant: 'standard'
    });

    const toolbar = createPrimitiveToolbar({
      ariaLabel: 'Release toolbar',
      title: 'Release controls',
      leading: [leadingMenu],
      actions: [
        { id: 'refresh', label: 'Refresh', icon: '↻' },
        { id: 'validate', label: 'Validate', icon: '✓' },
        { id: 'deploy', label: 'Deploy', kind: 'primary', icon: '▲' },
        { id: 'archive', label: 'Archive', kind: 'danger', icon: '🗑' }
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
