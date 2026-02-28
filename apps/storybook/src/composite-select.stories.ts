import type { Meta, StoryObj } from '@storybook/html-vite';

import { createCompositeSelect } from '@ds/primitives';

type CompositeSelectArgs = {
  value: '' | 'active' | 'pending' | 'archived';
  disabledArchived: boolean;
};

const meta: Meta<CompositeSelectArgs> = {
  title: 'Primitives/Composite Select',
  args: {
    value: 'pending',
    disabledArchived: true
  },
  argTypes: {
    value: { control: 'select', options: ['', 'active', 'pending', 'archived'] },
    disabledArchived: { control: 'boolean' }
  },
  parameters: {
    a11y: { test: 'error' }
  }
};

export default meta;

type Story = StoryObj<CompositeSelectArgs>;

export const Docs: Story = {
  render: (args) => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '0.5rem';
    container.style.minWidth = '20rem';

    const options = [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'archived', label: 'Archived', disabled: args.disabledArchived }
    ];

    const select = createCompositeSelect({
      id: 'composite-status',
      name: 'composite-status',
      options,
      ...(args.value ? { value: args.value } : {})
    });

    const label = document.createElement('label');
    label.htmlFor = select.id;
    label.className = 'cv-select-field__label';
    label.textContent = 'Composite status';

    const helper = document.createElement('p');
    helper.className = 'cv-select-field__helper';
    helper.textContent = 'Headless controller + native select composition.';

    select.classList.add('cv-select');
    select.style.minWidth = '20rem';

    container.append(label, select, helper);
    return container;
  }
};
