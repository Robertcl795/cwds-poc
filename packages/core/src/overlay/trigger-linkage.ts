import { createAriaPopupLink } from '../dom/aria-link';

export type OverlayLinkKind = 'dialog' | 'menu';

export interface TriggerOverlayLink {
  overlayId: string;
  syncExpanded: (open: boolean) => void;
  destroy: () => void;
}

export const linkTriggerToOverlay = (
  trigger: HTMLElement,
  overlay: HTMLElement,
  kind: OverlayLinkKind
): TriggerOverlayLink => {
  const link = createAriaPopupLink(trigger, overlay, kind, 'cv-surface');
  return { overlayId: link.elementId, syncExpanded: link.syncExpanded, destroy: link.destroy };
};
