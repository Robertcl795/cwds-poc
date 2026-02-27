import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveButton } from '@covalent-poc/components';

type ButtonDocsArgs = {
  label: string;
  icon: string;
  color: 'primary' | 'secondary' | 'emphasis' | 'caution' | 'negative' | 'positive';
  trailingIcon: boolean;
  raised: boolean;
  outlined: boolean;
  dense: boolean;
  disabled: boolean;
  expanContent: boolean;
  fullWidth: boolean;
};

const meta: Meta<ButtonDocsArgs> = {
  title: 'Primitives/Button',
  tags: ['autodocs'],
  args: {
    label: 'Continue',
    icon: '→',
    color: 'primary',
    trailingIcon: false,
    raised: false,
    outlined: false,
    dense: false,
    disabled: false,
    expanContent: false,
    fullWidth: false
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible button label'
    },
    icon: {
      control: 'text',
      description: 'Icon text/character for start or end placement'
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'emphasis', 'caution', 'negative', 'positive'],
      description: 'Semantic color variant'
    },
    trailingIcon: {
      control: 'boolean',
      description: 'When true, icon renders as icon-end'
    },
    raised: {
      control: 'boolean',
      description: 'Applies elevation shadow'
    },
    outlined: {
      control: 'boolean',
      description: 'Toggles outlined shape variant'
    },
    dense: {
      control: 'boolean',
      description: 'Compacts size and typography'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction'
    },
    expanContent: {
      control: 'boolean',
      description: 'Expands middle content area between label and trailing icon'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Expands button to fill available width'
    }
  },
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj<ButtonDocsArgs>;

const colorVariants = ['primary', 'secondary', 'emphasis', 'caution', 'negative', 'positive'] as const;
const shapeVariants = ['contained', 'outlined', 'text'] as const;

export const Gallery: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '1rem';

    for (const shape of shapeVariants) {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '0.75rem';
      row.style.flexWrap = 'wrap';

      for (const color of colorVariants) {
        row.append(
          createPrimitiveButton({
            label: `${shape} ${color}`,
            shape,
            color
          })
        );
      }

      wrapper.append(row);
    }

    return wrapper;
  }
};

export const IconsAndLoading: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '0.75rem';
    row.style.flexWrap = 'wrap';

    row.append(
      createPrimitiveButton({
        label: 'Run',
        iconStart: '▶',
        color: 'emphasis'
      }),
      createPrimitiveButton({
        label: 'Next',
        iconEnd: '→',
        shape: 'outlined',
        color: 'secondary'
      }),
      createPrimitiveButton({
        label: 'Save',
        loading: true,
        loadingLabel: 'Saving',
        color: 'primary'
      })
    );

    return row;
  }
};

export const Docs: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.width = 'min(100%, 26rem)';
    wrapper.style.padding = '1rem';
    wrapper.style.border = '1px dashed color-mix(in oklab, currentColor 20%, transparent)';
    wrapper.style.borderRadius = '0.75rem';

    const hasIcon = args.icon.trim().length > 0;
    const iconStart = hasIcon && !args.trailingIcon ? args.icon : undefined;
    const iconEnd = hasIcon && args.trailingIcon ? args.icon : undefined;

    wrapper.append(
      createPrimitiveButton({
        label: args.label,
        color: args.color,
        shape: args.outlined ? 'outlined' : 'contained',
        disabled: args.disabled,
        iconStart,
        iconEnd,
        raised: args.raised,
        dense: args.dense,
        fullWidth: args.fullWidth,
        expandContent: args.expanContent,
        content: args.expanContent ? '' : undefined
      })
    );

    return wrapper;
  }
};
