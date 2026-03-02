export type OverlayLinkKind = 'dialog' | 'menu';

export interface TriggerOverlayLink {
  overlayId: string;
  syncExpanded: (open: boolean) => void;
  destroy: () => void;
}

let overlayLinkSequence = 0;

const nextOverlayId = (): string => {
  overlayLinkSequence += 1;
  return `cv-surface-${overlayLinkSequence}`;
};

const writeAttribute = (element: HTMLElement, name: string, value: string | null): void => {
  if (value === null) {
    element.removeAttribute(name);
    return;
  }

  element.setAttribute(name, value);
};

export const linkTriggerToOverlay = (
  trigger: HTMLElement,
  overlay: HTMLElement,
  kind: OverlayLinkKind
): TriggerOverlayLink => {
  const previousControls = trigger.getAttribute('aria-controls');
  const previousExpanded = trigger.getAttribute('aria-expanded');
  const previousHasPopup = trigger.getAttribute('aria-haspopup');
  const hadOverlayId = overlay.id.length > 0;

  if (!hadOverlayId) {
    overlay.id = nextOverlayId();
  }

  trigger.setAttribute('aria-controls', overlay.id);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', kind);

  return {
    overlayId: overlay.id,
    syncExpanded(open: boolean): void {
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    },
    destroy(): void {
      writeAttribute(trigger, 'aria-controls', previousControls);
      writeAttribute(trigger, 'aria-expanded', previousExpanded);
      writeAttribute(trigger, 'aria-haspopup', previousHasPopup);

      if (!hadOverlayId) {
        overlay.removeAttribute('id');
      }
    }
  };
};
