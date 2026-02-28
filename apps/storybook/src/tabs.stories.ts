import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveTabs, type PrimitiveTabsOrientation } from '@ds/primitives';

type TabsArgs = {
  orientation: PrimitiveTabsOrientation;
};

const panel = (title: string, body: string): HTMLElement => {
  const node = document.createElement('section');

  const heading = document.createElement('h3');
  heading.textContent = title;
  heading.style.margin = '0 0 0.5rem';

  const text = document.createElement('p');
  text.textContent = body;
  text.style.margin = '0';

  node.append(heading, text);
  return node;
};

const meta: Meta<TabsArgs> = {
  title: 'Primitives/Tabs',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    orientation: 'horizontal'
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical']
    }
  }
};

export default meta;

type Story = StoryObj<TabsArgs>;

export const Docs: Story = {
  render: (args) => {
    const tabs = createPrimitiveTabs({
      ariaLabel: 'Phase 3 tabs',
      orientation: args.orientation,
      tabs: [
        {
          id: 'overview',
          label: 'Overview',
          panel: panel('Overview', 'Release summary and quality signals for the current cut.')
        },
        {
          id: 'activity',
          label: 'Activity',
          panel: panel('Activity', 'Recent actions by environment and operator.')
        },
        {
          id: 'settings',
          label: 'Settings',
          panel: panel('Settings', 'Runtime flags and deployment controls.'),
          disabled: true
        }
      ]
    });

    tabs.element.style.inlineSize = args.orientation === 'vertical' ? '40rem' : '30rem';
    return tabs.element;
  }
};

export const ManualActivation: Story = {
  render: () => {
    const info = document.createElement('p');
    info.style.margin = '0';
    info.style.fontSize = '0.85rem';
    info.style.color = 'var(--cv-sys-color-text-muted)';

    const tabs = createPrimitiveTabs({
      selectedId: 'overview',
      onSelectedChange(selectedId, source) {
        info.textContent = `Selected tab: ${selectedId} (${source})`;
      },
      tabs: [
        { id: 'overview', label: 'Overview', panel: panel('Overview', 'Use arrows to move focus.') },
        { id: 'incidents', label: 'Incidents', panel: panel('Incidents', 'Press Enter/Space to activate focused tab.') },
        { id: 'audit', label: 'Audit Log', panel: panel('Audit Log', 'Manual activation avoids accidental panel swaps.') }
      ]
    });

    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '0.75rem';
    wrapper.style.inlineSize = '34rem';

    info.textContent = 'Focus movement is roving; selection is manual.';

    wrapper.append(tabs.element, info);
    return wrapper;
  }
};
