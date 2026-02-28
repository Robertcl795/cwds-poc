import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveChip, type PrimitiveChipOptions } from '@ds/primitives';

type ChipArgs = {
  variant: 'action' | 'filter';
  label: string;
  selected: boolean;
  disabled: boolean;
  iconStart: string;
  iconEnd: string;
};

const meta: Meta<ChipArgs> = {
  title: 'Primitives/Chip',
  tags: ['autodocs'],
  args: {
    variant: 'action',
    label: 'Deploy',
    selected: false,
    disabled: false,
    iconStart: '',
    iconEnd: ''
  },
  argTypes: {
    variant: { control: 'radio', options: ['action', 'filter'] },
    label: { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconStart: { control: 'text' },
    iconEnd: { control: 'text' }
  },
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj<ChipArgs>;

export const Docs: Story = {
  render: (args) => {
    const options: PrimitiveChipOptions =
      args.variant === 'action'
        ? {
            variant: 'action',
            label: args.label,
            disabled: args.disabled,
            ...(args.iconStart.trim() ? { iconStart: args.iconStart } : {}),
            ...(args.iconEnd.trim() ? { iconEnd: args.iconEnd } : {})
          }
        : {
            variant: 'filter',
            id: 'filter-chip-docs',
            name: 'docs-filters',
            label: args.label,
            selected: args.selected,
            disabled: args.disabled,
            ...(args.iconStart.trim() ? { iconStart: args.iconStart } : {}),
            ...(args.iconEnd.trim() ? { iconEnd: args.iconEnd } : {})
          };

    return createPrimitiveChip(options).element;
  }
};

export const States: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';
    row.style.gap = '0.75rem';

    row.append(
      createPrimitiveChip({
        variant: 'action',
        label: 'Deploy',
        iconStart: '🚀'
      }).element,
      createPrimitiveChip({
        variant: 'action',
        label: 'Disabled',
        disabled: true
      }).element,
      createPrimitiveChip({
        variant: 'filter',
        id: 'chip-stable',
        name: 'release-state',
        value: 'stable',
        label: 'Stable',
        selected: true
      }).element,
      createPrimitiveChip({
        variant: 'filter',
        id: 'chip-beta',
        name: 'release-state',
        value: 'beta',
        label: 'Beta'
      }).element
    );

    return row;
  }
};
