import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveSlider } from '@covalent-poc/components';

type SliderArgs = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  helper: string;
  disabled: boolean;
  showValue: boolean;
};

const meta: Meta<SliderArgs> = {
  title: 'Primitives/Slider',
  tags: ['autodocs'],
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    step: 1,
    value: 45,
    helper: 'Use arrow keys for fine adjustment',
    disabled: false,
    showValue: true
  },
  argTypes: {
    label: { control: 'text' },
    min: { control: { type: 'number', min: 0, max: 100 } },
    max: { control: { type: 'number', min: 1, max: 1000 } },
    step: { control: { type: 'number', min: 1, max: 100 } },
    value: { control: { type: 'number', min: 0, max: 1000 } },
    helper: { control: 'text' },
    disabled: { control: 'boolean' },
    showValue: { control: 'boolean' }
  },
  parameters: {
    a11y: {
      test: 'error'
    }
  }
};

export default meta;

type Story = StoryObj<SliderArgs>;

export const Docs: Story = {
  render: (args) =>
    createPrimitiveSlider({
      id: 'volume-slider',
      name: 'volume',
      label: args.label,
      min: args.min,
      max: args.max,
      step: args.step,
      value: args.value,
      helper: args.helper,
      disabled: args.disabled,
      showValue: args.showValue
    }).element
};

export const States: Story = {
  render: () => {
    const col = document.createElement('div');
    col.style.display = 'grid';
    col.style.gap = '1rem';
    col.style.inlineSize = '24rem';

    col.append(
      createPrimitiveSlider({
        id: 'slider-default',
        name: 'slider-default',
        label: 'Default',
        helper: 'Pointer + keyboard friendly',
        showValue: true,
        value: 40
      }).element,
      createPrimitiveSlider({
        id: 'slider-step',
        name: 'slider-step',
        label: 'Stepped',
        min: 0,
        max: 10,
        step: 2,
        showValue: true,
        value: 6
      }).element,
      createPrimitiveSlider({
        id: 'slider-disabled',
        name: 'slider-disabled',
        label: 'Disabled',
        value: 30,
        disabled: true,
        helper: 'Locked by policy'
      }).element
    );

    return col;
  }
};
