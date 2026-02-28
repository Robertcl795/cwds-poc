import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveIconButton, type PrimitiveIconButtonSize, type PrimitiveIconButtonVariant } from '@ds/primitives';
import { registerIcons } from '@ds/utils-icons';

const ensureIcons = (): void => {
  try {
    registerIcons({
      close: { viewBox: '0 0 24 24', paths: ['M6 6L18 18', 'M18 6L6 18'] },
      edit: { viewBox: '0 0 24 24', paths: ['M4 17.25V20h2.75L17.8 8.95l-2.75-2.75L4 17.25z'] },
      add: { viewBox: '0 0 24 24', paths: ['M12 5v14', 'M5 12h14'] },
      user: {
        viewBox: '0 0 24 24',
        paths: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M4 20a8 8 0 0 1 16 0']
      }
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('Icon already registered')) {
      throw error;
    }
  }
};

ensureIcons();

type IconButtonArgs = {
  icon: 'edit' | 'close' | 'add' | 'user';
  ariaLabel: string;
  variant: PrimitiveIconButtonVariant;
  size: PrimitiveIconButtonSize;
  selected: boolean;
  disabled: boolean;
  ripple: boolean;
};

const meta: Meta<IconButtonArgs> = {
  title: 'Primitives/Icon Button',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    icon: 'edit',
    ariaLabel: 'Edit item',
    variant: 'standard',
    size: 'md',
    selected: false,
    disabled: false,
    ripple: true
  },
  argTypes: {
    icon: { control: 'radio', options: ['edit', 'close', 'add', 'user'] },
    ariaLabel: { control: 'text' },
    variant: { control: 'radio', options: ['standard', 'filled', 'tonal', 'outlined'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    ripple: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<IconButtonArgs>;

export const Playground: Story = {
  render: (args) =>
    createPrimitiveIconButton({
      icon: args.icon,
      ariaLabel: args.ariaLabel,
      variant: args.variant,
      size: args.size,
      selected: args.selected,
      disabled: args.disabled,
      ripple: args.ripple
    })
};

export const VariantMatrix: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '0.75rem';
    row.style.flexWrap = 'wrap';

    row.append(
      createPrimitiveIconButton({ icon: 'edit', ariaLabel: 'Edit', variant: 'standard' }),
      createPrimitiveIconButton({ icon: 'edit', ariaLabel: 'Edit', variant: 'filled' }),
      createPrimitiveIconButton({ icon: 'edit', ariaLabel: 'Edit', variant: 'tonal' }),
      createPrimitiveIconButton({ icon: 'edit', ariaLabel: 'Edit', variant: 'outlined' }),
      createPrimitiveIconButton({ icon: 'close', ariaLabel: 'Close', disabled: true })
    );

    return row;
  }
};
