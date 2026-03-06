export const comboboxStyles = `
  :host {
    display: inline-grid;
    gap: 0.35rem;
    min-inline-size: 14rem;
    color: var(--cv-sys-color-text, inherit);
    font-family: inherit;
  }

  :host([disabled]) {
    opacity: 0.7;
  }

  .label {
    font-size: var(--cv-sys-typescale-label, 0.78rem);
    color: var(--cv-sys-color-text-muted, currentcolor);
  }

  .field {
    border: 1px solid var(--cv-composite-field-border, currentcolor);
    border-radius: var(--cv-composite-field-radius, 0.75rem);
    background: var(--cv-sys-color-surface, transparent);
    padding: 0.35rem 0.5rem;
    display: grid;
    gap: 0.25rem;
  }

  .field:focus-within {
    border-color: var(--cv-composite-field-focus, Highlight);
    box-shadow: 0 0 0 1px color-mix(in oklab, var(--cv-composite-field-focus, Highlight) 45%, transparent);
  }

  input {
    border: 0;
    outline: none;
    font: inherit;
    background: transparent;
    color: inherit;
  }

  .popup {
    margin: 0;
    padding: 0.3rem;
    list-style: none;
    border-radius: var(--cv-sys-radius-md, 0.875rem);
    border: 1px solid var(--cv-composite-popup-border, currentcolor);
    background: var(--cv-composite-popup-bg, Canvas);
    box-shadow: 0 16px 36px rgb(15 23 42 / 0.22);
    max-block-size: 14rem;
    overflow: auto;
    z-index: var(--cv-composite-popup-z-index, 1200);
  }

  .option {
    border-radius: var(--cv-sys-radius-sm, 0.5rem);
    padding: 0.45rem 0.55rem;
    cursor: pointer;
    line-height: 1.25;
  }

  .option[data-active='true'] {
    background: color-mix(in oklab, var(--cv-sys-color-primary, Highlight) 10%, transparent);
  }

  .option[data-selected='true'] {
    color: var(--cv-sys-color-primary, Highlight);
    font-weight: 600;
  }

  .option[data-disabled='true'] {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .empty {
    padding: 0.45rem 0.55rem;
    color: var(--cv-sys-color-text-muted, currentcolor);
  }

  @media (prefers-reduced-motion: reduce) {
    .field {
      transition: none;
    }
  }

  @media (forced-colors: active) {
    .field,
    .popup {
      border: 1px solid CanvasText;
      box-shadow: none;
    }

    .option[data-active='true'] {
      outline: 1px solid Highlight;
      outline-offset: -1px;
    }
  }
`;
