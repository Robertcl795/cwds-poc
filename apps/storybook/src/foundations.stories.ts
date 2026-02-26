import type { Meta, StoryObj } from '@storybook/html-vite';

const meta: Meta = {
  title: 'Foundations/Colors'
};

export default meta;

type Story = StoryObj;

export const Palette: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = 'repeat(3, minmax(140px, 1fr))';
    wrapper.style.gap = '1rem';
    wrapper.style.width = 'min(42rem, 100vw - 2rem)';

    const colors = [
      ['Primary', 'var(--cv-sys-color-primary)'],
      ['Surface', 'var(--cv-sys-color-surface)'],
      ['Text', 'var(--cv-sys-color-text)'],
      ['Border', 'var(--cv-sys-color-border)'],
      ['Danger', 'var(--cv-sys-color-danger)'],
      ['Success', 'var(--cv-sys-color-success)']
    ];

    for (const [name, color] of colors) {
      const card = document.createElement('div');
      card.style.border = '1px solid var(--cv-sys-color-border)';
      card.style.borderRadius = '0.75rem';
      card.style.overflow = 'hidden';

      const swatch = document.createElement('div');
      swatch.style.height = '4rem';
      swatch.style.background = color;

      const label = document.createElement('div');
      label.style.padding = '0.5rem 0.75rem';
      label.textContent = name;

      card.append(swatch, label);
      wrapper.append(card);
    }

    return wrapper;
  }
};
