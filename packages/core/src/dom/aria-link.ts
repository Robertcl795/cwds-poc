const attributeNames = ['aria-controls', 'aria-expanded', 'aria-haspopup'] as const;
const sequences = new Map<string, number>();

const nextLinkedId = (prefix: string): string => {
  const next = (sequences.get(prefix) ?? 0) + 1;
  sequences.set(prefix, next);
  return `${prefix}-${next}`;
};

const restoreAttribute = (element: HTMLElement, name: string, value: string | null): void => {
  if (value === null) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
};

export interface AriaPopupLink {
  elementId: string;
  syncExpanded: (open: boolean) => void;
  destroy: () => void;
}

export const createAriaPopupLink = (
  trigger: HTMLElement,
  popup: HTMLElement,
  kind: string,
  idPrefix: string
): AriaPopupLink => {
  const previous = Object.fromEntries(attributeNames.map((name) => [name, trigger.getAttribute(name)]));
  const ownsId = popup.id.length === 0;

  if (ownsId) {
    popup.id = nextLinkedId(idPrefix);
  }

  trigger.setAttribute('aria-controls', popup.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', kind);

  return {
    elementId: popup.id,
    syncExpanded(open): void {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    },
    destroy(): void {
      for (const [name, value] of Object.entries(previous)) {
        restoreAttribute(trigger, name, value);
      }

      if (ownsId) {
        popup.removeAttribute('id');
      }
    }
  };
};
