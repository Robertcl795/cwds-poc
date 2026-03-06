export type PopupKind = 'listbox' | 'menu';

export interface PopupLink {
  popupId: string;
  syncExpanded: (open: boolean) => void;
  destroy: () => void;
}

let popupSequence = 0;

const nextPopupId = (): string => {
  popupSequence += 1;
  return `cv-popup-${popupSequence}`;
};

const writeMaybeAttribute = (element: HTMLElement, name: string, value: string | null): void => {
  if (value === null) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
};

export const linkPopup = (trigger: HTMLElement, popup: HTMLElement, kind: PopupKind): PopupLink => {
  const previousControls = trigger.getAttribute('aria-controls');
  const previousExpanded = trigger.getAttribute('aria-expanded');
  const previousHasPopup = trigger.getAttribute('aria-haspopup');

  const hadPopupId = popup.id.length > 0;
  if (!hadPopupId) {
    popup.id = nextPopupId();
  }

  trigger.setAttribute('aria-controls', popup.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', kind);

  return {
    popupId: popup.id,
    syncExpanded(open: boolean): void {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    },
    destroy(): void {
      writeMaybeAttribute(trigger, 'aria-controls', previousControls);
      writeMaybeAttribute(trigger, 'aria-expanded', previousExpanded);
      writeMaybeAttribute(trigger, 'aria-haspopup', previousHasPopup);

      if (!hadPopupId) {
        popup.removeAttribute('id');
      }
    }
  };
};
