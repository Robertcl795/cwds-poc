import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundation/Tokens'
};

export default meta;

type Story = StoryObj;

export const CoreRoles: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
    root.style.gap = '0.75rem';
    root.style.width = 'min(48rem, 100vw - 2rem)';

    const items = [
      ['Surface', 'var(--cv-sys-color-surface)'],
      ['Text', 'var(--cv-sys-color-text)'],
      ['Primary', 'var(--cv-sys-color-primary)'],
      ['Danger', 'var(--cv-sys-color-danger)'],
      ['Focus Ring', 'var(--cv-comp-focus-ring-color)'],
      ['Ripple', 'var(--cv-comp-ripple-color)']
    ];

    for (const [label, color] of items) {
      const card = document.createElement('div');
      card.style.border = '1px solid var(--cv-sys-color-border)';
      card.style.borderRadius = '12px';
      card.style.overflow = 'hidden';

      const swatch = document.createElement('div');
      swatch.style.height = '3rem';
      swatch.style.background = color;

      const title = document.createElement('div');
      title.style.padding = '0.5rem 0.75rem';
      title.textContent = label;

      card.append(swatch, title);
      root.append(card);
    }

    return root;
  }
};
