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
