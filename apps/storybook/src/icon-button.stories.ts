import type { Meta, StoryObj } from '@storybook/html-vite';

import { clearIconRegistry, registerIcons } from '@covalent-poc/primitives-foundation';
import { createPrimitiveIconButton } from '@covalent-poc/components';

clearIconRegistry();
registerIcons({
  close: { viewBox: '0 0 24 24', paths: ['M6 6L18 18', 'M18 6L6 18'] },
  edit: { viewBox: '0 0 24 24', paths: ['M4 17.25V20h2.75L17.8 8.95l-2.75-2.75L4 17.25z'] }
});

const meta: Meta = {
  title: 'Primitives/Icon Button',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const States: Story = {
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
