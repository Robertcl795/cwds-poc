import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveSelect } from '@covalent-poc/components';

const options = [
  { id: 'stable', label: 'Stable', value: 'stable' },
  { id: 'beta', label: 'Beta', value: 'beta' },
  { id: 'canary', label: 'Canary', value: 'canary' }
];

const meta: Meta = {
  title: 'Primitives/Phase2 Hardening/Select Baseline vs Enhanced',
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
      createPrimitiveSelect({
        id: 'hardening-select-baseline',
        name: 'hardening-select-baseline',
        label: 'Baseline (enhance off)',
        options,
        helperText: 'Native baseline path',
        enhance: false
      }).element,
      createPrimitiveSelect({
        id: 'hardening-select-enhanced',
        name: 'hardening-select-enhanced',
        label: 'Enhanced (if supported)',
        options,
        value: 'beta',
        helperText: 'Progressive enhancement path',
        enhance: true
      }).element,
      createPrimitiveSelect({
        id: 'hardening-select-invalid',
        name: 'hardening-select-invalid',
        label: 'Invalid required',
        options,
        required: true,
        helperText: 'Will be replaced by error',
        errorText: 'Selection is required',
        validateOnInitialRender: true,
        enhance: true
      }).element
    );

    return grid;
  }
};
