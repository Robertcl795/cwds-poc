import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveChip } from '@covalent-poc/components';

const meta: Meta = {
  title: 'Primitives/Phase2 Hardening/Chip State Matrix',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const Matrix: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';
    row.style.gap = '0.75rem';

    row.append(
      createPrimitiveChip({ variant: 'action', label: 'Action' }).element,
      createPrimitiveChip({ variant: 'action', label: 'Action Disabled', disabled: true }).element,
      createPrimitiveChip({
        variant: 'filter',
        id: 'hardening-chip-filter-a',
        name: 'hardening-chip-filter',
        label: 'Filter Off'
      }).element,
      createPrimitiveChip({
        variant: 'filter',
        id: 'hardening-chip-filter-b',
        name: 'hardening-chip-filter',
        label: 'Filter On',
        selected: true
      }).element,
      createPrimitiveChip({
        variant: 'filter',
        id: 'hardening-chip-filter-c',
        name: 'hardening-chip-filter',
        label: 'Filter Disabled',
        disabled: true,
        selected: true
      }).element
    );

    return row;
  }
};
