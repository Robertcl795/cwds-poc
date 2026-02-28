import type { Meta, StoryObj } from '@storybook/html-vite';

import { defineCvWebComponents } from '@ds/lit';

defineCvWebComponents();

type AdvancedSelectArgs = {
  label: string;
  searchable: boolean;
  disabled: boolean;
  required: boolean;
};

const meta: Meta<AdvancedSelectArgs> = {
  title: 'Phase4/Advanced Select',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    label: 'Environment',
    searchable: true,
    disabled: false,
    required: false
  },
  argTypes: {
    label: { control: 'text' },
    searchable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<AdvancedSelectArgs>;

export const Docs: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';

    const advancedSelect = document.createElement('cv-advanced-select') as HTMLElement & {
      name: string;
      label: string;
      searchable: boolean;
      disabled: boolean;
      required: boolean;
      options: Array<{ value: string; label: string }>;
    };
    advancedSelect.name = 'environment';
    advancedSelect.label = args.label;
    advancedSelect.searchable = args.searchable;
    advancedSelect.disabled = args.disabled;
    advancedSelect.required = args.required;
    advancedSelect.options = [
      { value: 'prod', label: 'Production' },
      { value: 'staging', label: 'Staging' },
      { value: 'qa', label: 'QA' }
    ];

    const note = document.createElement('p');
    note.style.margin = '0';
    note.style.fontSize = '0.85rem';
    note.style.color = 'var(--cv-sys-color-text-muted)';
    note.textContent = 'Opt-in advanced behavior. Use native select for simple forms.';

    wrapper.append(advancedSelect, note);
    return wrapper;
  }
};
