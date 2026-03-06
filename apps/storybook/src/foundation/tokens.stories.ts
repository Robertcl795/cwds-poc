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
      ['Success', 'var(--cv-sys-color-success)'],
      ['Warning', 'var(--cv-sys-color-warning)'],
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

export const ToneSurfaces: Story = {
  render: () => {
    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    root.style.gap = '0.75rem';
    root.style.width = 'min(64rem, 100vw - 2rem)';

    const tones = [
      ['Neutral', 'var(--cv-sys-color-neutral-surface)', 'var(--cv-sys-color-neutral-border)', 'var(--cv-sys-color-neutral-text)'],
      ['Info', 'var(--cv-sys-color-info-surface)', 'var(--cv-sys-color-info-border)', 'var(--cv-sys-color-info-text)'],
      ['Success', 'var(--cv-sys-color-success-surface)', 'var(--cv-sys-color-success-border)', 'var(--cv-sys-color-success-text)'],
      ['Warning', 'var(--cv-sys-color-warning-surface)', 'var(--cv-sys-color-warning-border)', 'var(--cv-sys-color-warning-text)'],
      ['Danger', 'var(--cv-sys-color-danger-surface)', 'var(--cv-sys-color-danger-border)', 'var(--cv-sys-color-danger-text)']
    ] as const;

    for (const [label, surface, border, text] of tones) {
      const card = document.createElement('section');
      card.style.display = 'grid';
      card.style.gap = '0.5rem';
      card.style.padding = '1rem';
      card.style.border = `1px solid ${border}`;
      card.style.borderRadius = '16px';
      card.style.background = surface;
      card.style.color = text;

      const title = document.createElement('strong');
      title.textContent = label;

      const body = document.createElement('p');
      body.style.margin = '0';
      body.textContent = 'Surface, border, and readable text roles derived from the semantic palette.';

      card.append(title, body);
      root.append(card);
    }

    return root;
  }
};
