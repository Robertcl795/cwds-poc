import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTextField } from '@ds/primitives';

const meta: Meta = {
  title: 'Primitives/Phase2 Hardening/Text Field State Matrix',
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

    const empty = createPrimitiveTextField({
      id: 'hardening-tf-empty',
      name: 'hardening-tf-empty',
      label: 'Empty',
      helperText: 'Supporting text'
    });

    const filled = createPrimitiveTextField({
      id: 'hardening-tf-filled',
      name: 'hardening-tf-filled',
      label: 'Filled',
      value: 'team-alpha',
      helperText: 'Value present'
    });

    const invalid = createPrimitiveTextField({
      id: 'hardening-tf-invalid',
      name: 'hardening-tf-invalid',
      label: 'Invalid',
      required: true,
      helperText: 'Will be replaced by error',
      errorText: 'This field is required',
      validateOnInitialRender: true
    });

    const readonly = createPrimitiveTextField({
      id: 'hardening-tf-readonly',
      name: 'hardening-tf-readonly',
      label: 'Readonly',
      value: 'locked value',
      readOnly: true,
      helperText: 'Readonly state'
    });

    const disabled = createPrimitiveTextField({
      id: 'hardening-tf-disabled',
      name: 'hardening-tf-disabled',
      label: 'Disabled',
      value: 'disabled value',
      disabled: true,
      helperText: 'Disabled state'
    });

    grid.append(empty.element, filled.element, invalid.element, readonly.element, disabled.element);
    return grid;
  }
};
