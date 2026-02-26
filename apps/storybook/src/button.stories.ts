import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveButton } from '@covalent-poc/primitives';

const meta: Meta = {
  title: 'Primitives/Button',
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj;

export const Primary: Story = {
  render: () => createPrimitiveButton({ label: 'Save changes' })
};

export const Secondary: Story = {
  render: () => createPrimitiveButton({ label: 'Cancel', variant: 'secondary' })
};
