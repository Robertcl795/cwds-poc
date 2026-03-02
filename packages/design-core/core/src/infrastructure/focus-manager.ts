const tabbableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export const getTabbableElements = (root: ParentNode): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(tabbableSelector)).filter(
    (element) => !element.hasAttribute('hidden') && !element.closest('[inert]')
  );

export const trapTabWithin = (container: HTMLElement, event: KeyboardEvent): void => {
  if (event.key !== 'Tab') {
    return;
  }

  const tabbables = getTabbableElements(container);
  if (tabbables.length === 0) {
    event.preventDefault();
    return;
  }

  const first = tabbables[0];
  const last = tabbables[tabbables.length - 1];
  if (!first || !last) {
    return;
  }

  const active = document.activeElement as HTMLElement | null;

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  }
};

export const restoreFocus = (element: HTMLElement | null): void => {
  element?.focus();
};
