import { createAriaPopupLink } from '../dom/aria-link';

export type PopupKind = 'listbox' | 'menu';

export interface PopupLink {
  popupId: string;
  syncExpanded: (open: boolean) => void;
  destroy: () => void;
}

export const linkPopup = (trigger: HTMLElement, popup: HTMLElement, kind: PopupKind): PopupLink => {
  const link = createAriaPopupLink(trigger, popup, kind, 'cv-popup');
  return { popupId: link.elementId, syncExpanded: link.syncExpanded, destroy: link.destroy };
};
