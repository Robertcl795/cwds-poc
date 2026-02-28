import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTooltip } from '@ds/primitives';
import { defineCvWebComponents } from '@ds/lit';

defineCvWebComponents();

const meta: Meta = {
  title: 'Phase4/Environment Matrix',
  parameters: {
    controls: { disable: true },
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const Matrix: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '1rem';

    const defaultRow = document.createElement('section');
    const defaultButton = document.createElement('button');
    defaultButton.className = 'cv-button';
    defaultButton.textContent = 'Tooltip baseline';
    createPrimitiveTooltip({ trigger: defaultButton, content: 'Default motion and color mode' });
    defaultRow.append(defaultButton);

    const comboboxRow = document.createElement('section');
    const combobox = document.createElement('cv-combobox') as HTMLElement & {
      label: string;
      options: Array<{ value: string; label: string }>;
    };
    combobox.label = 'Feature matrix';
    combobox.options = [
      { value: 'popover', label: 'Popover path' },
      { value: 'fallback', label: 'Fallback path' }
    ];
    comboboxRow.append(combobox);

    const selectRow = document.createElement('section');
    const select = document.createElement('cv-advanced-select') as HTMLElement & {
      label: string;
      options: Array<{ value: string; label: string }>;
    };
    select.label = 'Enhancement toggle';
    select.options = [
      { value: 'on', label: 'Enhancement on' },
      { value: 'off', label: 'Enhancement off' }
    ];
    selectRow.append(select);

    root.append(defaultRow, comboboxRow, selectRow);
    return root;
  }
};
