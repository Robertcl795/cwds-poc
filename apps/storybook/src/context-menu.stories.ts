import type { Meta, StoryObj } from '@storybook/html-vite';

import { createContextMenu, createPrimitiveIconButton } from '@ds/primitives';

type ContextMenuArgs = {
  disabledArchive: boolean;
};

const meta: Meta<ContextMenuArgs> = {
  title: 'Primitives/Context Menu',
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

const createKebabIcon = (): HTMLElement => {
  const icon = document.createElement('span');
  icon.textContent = '⋮';
  icon.style.fontSize = '1.1rem';
  icon.setAttribute('aria-hidden', 'true');
  return icon;
};

export const Baseline: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';
    wrapper.style.inlineSize = '30rem';

    const triggerRow = document.createElement('div');
    triggerRow.style.display = 'flex';
    triggerRow.style.alignItems = 'center';
    triggerRow.style.justifyContent = 'space-between';
    triggerRow.style.border = '1px solid var(--cv-sys-color-border)';
    triggerRow.style.borderRadius = '0.5rem';
    triggerRow.style.padding = '0.5rem 0.625rem';

    const rowLabel = document.createElement('span');
    rowLabel.textContent = 'Deployment row';

    const target = createPrimitiveIconButton({
      icon: createKebabIcon(),
      ariaLabel: 'Open row actions',
      variant: 'standard'
    });
    target.dataset.contextMenuTrigger = 'true';

    const log = document.createElement('p');
    log.style.margin = '0';
    log.style.fontSize = '0.85rem';
    log.style.color = 'var(--cv-sys-color-text-muted)';
    log.textContent = 'No action selected.';

    createContextMenu({
      target,
      triggerMode: 'click',
      items: [
        { type: 'label', id: 'section-edit', label: 'Row actions' },
        { id: 'edit', label: 'Edit', iconStart: '✎', shortcut: 'E' },
        { id: 'duplicate', label: 'Duplicate', iconStart: '⎘', shortcut: 'D' },
        { id: 'archive', label: 'Archive', iconStart: '🗄', disabled: args.disabledArchive },
        { type: 'separator', id: 'section-display-separator' },
        { id: 'compact', label: 'Compact density', control: 'checkbox', checked: true, iconStart: '☰' },
        { id: 'sort-newest', label: 'Sort by newest', control: 'radio', group: 'sort', checked: true },
        { id: 'sort-name', label: 'Sort by name', control: 'radio', group: 'sort' },
        { id: 'mute-alerts', label: 'Mute alerts', control: 'switch', checked: false },
        { type: 'separator', id: 'section-danger-separator' },
        { id: 'delete', label: 'Delete row', iconStart: '🗑', kind: 'danger', shortcut: 'Del' }
      ],
      onAction(item, source) {
        const checkedInfo = item.control ? ` checked=${item.checked ? 'true' : 'false'}` : '';
        log.textContent = `Action: ${item.id}${checkedInfo} (${source})`;
      }
    });

    triggerRow.append(rowLabel, target);
    wrapper.append(triggerRow, log);
    return wrapper;
  }
};

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
      triggerMode: 'contextmenu',
      items: [
        { type: 'label', id: 'row-label', label: 'Row actions' },
        { id: 'open', label: 'Open details', iconStart: '↗', shortcut: 'Alt+O' },
        { id: 'retry', label: 'Retry', iconStart: '↻', shortcut: 'Alt+R' },
        { type: 'separator', id: 'sep-1' },
        { id: 'delete', label: 'Delete', iconStart: '🗑', kind: 'danger', shortcut: 'Del' }
      ],
      onAction(item, source) {
        log.textContent = `Action: ${item.id} (${source})`;
      }
    });

    wrapper.append(target, log);
    return wrapper;
  }
};
