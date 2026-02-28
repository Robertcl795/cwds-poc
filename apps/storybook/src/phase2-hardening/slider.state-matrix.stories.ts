import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveSlider } from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Phase2 Hardening/Slider State Matrix',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

export const Matrix: Story = {
  render: () => {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gap = '1rem';
    grid.style.inlineSize = '24rem';

    grid.append(
      createPrimitiveSlider({
        id: 'hardening-slider-default',
        name: 'hardening-slider-default',
        label: 'Default',
        value: 25,
        helperText: 'Pointer + keyboard',
        showValue: true
      }).element,
      createPrimitiveSlider({
        id: 'hardening-slider-invalid',
        name: 'hardening-slider-invalid',
        label: 'Invalid',
        value: 10,
        invalid: true,
        errorText: 'Selection out of range',
        helperText: 'Will be replaced by error',
        showValue: true
      }).element,
      createPrimitiveSlider({
        id: 'hardening-slider-disabled',
        name: 'hardening-slider-disabled',
        label: 'Disabled',
        value: 60,
        disabled: true,
        helperText: 'Locked by policy',
        showValue: true
      }).element
    );

    return grid;
  }
};
