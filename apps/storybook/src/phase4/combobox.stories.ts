import type { Meta, StoryObj } from '@storybook/html-vite';

import { defineCvWebComponents } from '@ds/lit';

defineCvWebComponents();

type ComboboxArgs = {
  label: string;
  placeholder: string;
  readonly: boolean;
  disabled: boolean;
  minChars: number;
};

const meta: Meta<ComboboxArgs> = {
  title: 'Phase4/Combobox',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    label: 'Assignee',
    placeholder: 'Search users',
    readonly: false,
    disabled: false,
    minChars: 0
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    disabled: { control: 'boolean' },
    minChars: { control: 'number' }
  }
};

export default meta;

type Story = StoryObj<ComboboxArgs>;

export const Docs: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';

    const combobox = document.createElement('cv-combobox') as HTMLElement & {
      name: string;
      label: string;
      placeholder: string;
      readonly: boolean;
      disabled: boolean;
      minChars: number;
      options: Array<{ value: string; label: string; disabled?: boolean }>;
    };
    combobox.name = 'assignee';
    combobox.label = args.label;
    combobox.placeholder = args.placeholder;
    combobox.readonly = args.readonly;
    combobox.disabled = args.disabled;
    combobox.minChars = args.minChars;
    combobox.options = [
      { value: 'amy', label: 'Amy Atlas' },
      { value: 'ben', label: 'Ben Burke' },
      { value: 'cal', label: 'Cal Chen' },
      { value: 'drew', label: 'Drew Diaz', disabled: true }
    ];

    const log = document.createElement('p');
    log.style.margin = '0';
    log.style.fontSize = '0.85rem';
    log.style.color = 'var(--cv-sys-color-text-muted)';
    log.textContent = 'Committed value: <none>';

    combobox.addEventListener('cv-value-commit', (event) => {
      const detail = event as CustomEvent<{ value: string }>;
      log.textContent = `Committed value: ${detail.detail.value}`;
    });

    wrapper.append(combobox, log);
    return wrapper;
  }
};
