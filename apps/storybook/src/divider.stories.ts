import type { Meta, StoryObj } from '@storybook/html-vite';

import { createPrimitiveDivider, type PrimitiveDividerOptions } from '@ds/primitives';

type DividerArgs = Required<PrimitiveDividerOptions>;

const meta: Meta<DividerArgs> = {
  title: 'Primitives/Divider',
  parameters: {
    a11y: { test: 'error' }
  },
  args: {
    orientation: 'horizontal',
    decorative: true,
    inset: 'none'
  },
  argTypes: {
    orientation: { control: 'radio', options: ['horizontal', 'vertical'] },
    decorative: { control: 'boolean' },
    inset: { control: 'radio', options: ['none', 'start', 'end', 'middle'] }
  }
};

export default meta;

type Story = StoryObj<DividerArgs>;

export const Playground: Story = {
  render: (args) => {
    const frame = document.createElement('div');
    frame.style.display = 'grid';
    frame.style.gap = '0.75rem';
    frame.style.inlineSize = args.orientation === 'horizontal' ? '22rem' : '10rem';

    const start = document.createElement('span');
    start.textContent = 'Start content';

    const end = document.createElement('span');
    end.textContent = 'End content';

    const divider = createPrimitiveDivider(args);

    if (args.orientation === 'horizontal') {
      frame.append(start, divider, end);
      return frame;
    }

    const row = document.createElement('div');
    row.style.display = 'inline-grid';
    row.style.gridAutoFlow = 'column';
    row.style.alignItems = 'center';
    row.style.columnGap = '0.5rem';
    row.style.blockSize = '2.5rem';
    row.append(start, divider, end);

    frame.append(row);
    return frame;
  }
};

export const InsetMatrix: Story = {
  render: () => {
    const section = document.createElement('div');
    section.style.display = 'grid';
    section.style.gap = '0.75rem';
    section.style.inlineSize = '24rem';

    const buildRow = (label: string, inset: DividerArgs['inset']): HTMLElement => {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gap = '0.35rem';

      const heading = document.createElement('span');
      heading.style.fontSize = '0.8rem';
      heading.style.color = 'var(--cv-sys-color-text-muted)';
      heading.textContent = label;

      row.append(heading, createPrimitiveDivider({ inset }));
      return row;
    };

    section.append(
      buildRow('Inset: none', 'none'),
      buildRow('Inset: start', 'start'),
      buildRow('Inset: end', 'end'),
      buildRow('Inset: middle', 'middle')
    );

    return section;
  }
};

export const VerticalFlow: Story = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'inline-grid';
    row.style.gridAutoFlow = 'column';
    row.style.alignItems = 'center';
    row.style.columnGap = '0.625rem';
    row.style.blockSize = '2.75rem';

    const left = document.createElement('span');
    left.textContent = 'Project';

    const right = document.createElement('span');
    right.textContent = 'Settings';

    row.append(left, createPrimitiveDivider({ orientation: 'vertical' }), right);
    return row;
  }
};
