import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveList, type PrimitiveListVariant } from '@covalent-poc/components';

type ListArgs = {
  variant: PrimitiveListVariant;
  ordered: boolean;
  managedFocus: boolean;
};

const meta: Meta<ListArgs> = {
  title: 'Primitives/List',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    variant: 'content',
    ordered: false,
    managedFocus: false
  },
  argTypes: {
    variant: { control: 'radio', options: ['content', 'action'] },
    ordered: { control: 'boolean' },
    managedFocus: { control: 'boolean' }
  }
};

export default meta;

type Story = StoryObj<ListArgs>;

export const Docs: Story = {
  render: (args) => {
    const list = createPrimitiveList({
      variant: args.variant,
      ordered: args.ordered,
      managedFocus: args.managedFocus,
      items: [
        {
          id: 'release-notes',
          headline: 'Release notes',
          supportingText: 'Published 2h ago',
          leading: '📝',
          trailing: 'v3.0.0'
        },
        {
          id: 'storybook',
          headline: 'Storybook build',
          supportingText: 'Ready to deploy',
          leading: '📦',
          trailing: 'Success',
          current: true
        },
        {
          id: 'security-review',
          headline: 'Security review',
          supportingText: 'Waiting for approval',
          leading: '🔐',
          trailing: 'Pending',
          disabled: args.variant === 'action'
        }
      ]
    });

    list.element.style.inlineSize = '22rem';
    return list.element;
  }
};

export const Action: Story = {
  args: {
    variant: 'action',
    managedFocus: true
  },
  render: () => {
    const eventLog = document.createElement('p');
    eventLog.style.margin = '0';
    eventLog.style.fontSize = '0.85rem';
    eventLog.style.color = 'var(--cv-sys-color-text-muted)';

    const list = createPrimitiveList({
      variant: 'action',
      managedFocus: true,
      onAction(item, source) {
        eventLog.textContent = `Last action: ${item.id} (${source})`;
      },
      items: [
        { id: 'open', headline: 'Open release dashboard', leading: '🚀', trailing: '↗', href: '#open' },
        { id: 'duplicate', headline: 'Duplicate workflow', leading: '📄' },
        { id: 'archive', headline: 'Archive branch', leading: '🗃', trailing: 'Disabled', disabled: true }
      ]
    });

    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';
    wrapper.style.inlineSize = '24rem';

    eventLog.textContent = 'Activate an item to inspect callback source.';
    wrapper.append(list.element, eventLog);
    return wrapper;
  }
};
