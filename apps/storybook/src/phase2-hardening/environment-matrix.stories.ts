import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveChip, createPrimitiveSelect, createPrimitiveSlider, createPrimitiveTextField } from '@covalent-poc/components';

const meta: Meta = {
  title: 'Primitives/Phase2 Hardening/Environment Matrix',
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj;

const renderStack = (title: string, build: () => HTMLElement[]): HTMLElement => {
  const section = document.createElement('section');
  section.style.display = 'grid';
  section.style.gap = '0.75rem';

  const heading = document.createElement('h3');
  heading.textContent = title;
  heading.style.margin = '0';
  heading.style.fontSize = '0.95rem';

  section.append(heading, ...build());
  return section;
};

export const Matrix: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '1.25rem';
    root.style.inlineSize = '26rem';

    root.append(
      renderStack('Default', () => [
        createPrimitiveTextField({ id: 'env-default-tf', name: 'env-default-tf', label: 'Text field' }).element,
        createPrimitiveChip({ variant: 'action', label: 'Chip action' }).element,
        createPrimitiveSlider({ id: 'env-default-slider', name: 'env-default-slider', label: 'Slider', value: 40 }).element,
        createPrimitiveSelect({
          id: 'env-default-select',
          name: 'env-default-select',
          label: 'Select',
          options: [
            { id: 'a', label: 'A', value: 'a' },
            { id: 'b', label: 'B', value: 'b' }
          ],
          value: 'a',
          enhance: true
        }).element
      ]),
      renderStack('Enhanced Select Off + Ripple Off', () => [
        createPrimitiveTextField({ id: 'env-off-tf', name: 'env-off-tf', label: 'Text field' }).element,
        createPrimitiveChip({ variant: 'action', label: 'Chip action', ripple: false }).element,
        createPrimitiveSlider({ id: 'env-off-slider', name: 'env-off-slider', label: 'Slider', value: 65 }).element,
        createPrimitiveSelect({
          id: 'env-off-select',
          name: 'env-off-select',
          label: 'Select',
          options: [
            { id: 'a', label: 'A', value: 'a' },
            { id: 'b', label: 'B', value: 'b' }
          ],
          value: 'b',
          enhance: false
        }).element
      ])
    );

    return root;
  }
};
