import { OverlayStack, type InputSource } from '@covalent-poc/core';

const sharedOverlayStack = new OverlayStack();

let overlaySequence = 0;

const nextOverlayId = (): string => {
  overlaySequence += 1;
  return `cv-overlay-${overlaySequence}`;
};

const isFocusable = (element: HTMLElement): boolean => {
  if (!element.isConnected) {
    return false;
  }

  if (element.hasAttribute('hidden')) {
    return false;
  }

  if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
    return !element.disabled;
  }

  if (element instanceof HTMLAnchorElement) {
    return element.href.length > 0 || element.tabIndex >= 0;
  }

  return element.tabIndex >= 0 || element.hasAttribute('contenteditable');
};

const resolveRestoreTarget = (trigger: HTMLElement | null | undefined): HTMLElement | null => {
  if (trigger) {
    return trigger;
  }

  const activeElement = document.activeElement;
  return activeElement instanceof HTMLElement ? activeElement : null;
};

export interface OverlayControllerOptions {
  overlay: HTMLElement;
  id?: string;
  trigger?: HTMLElement | null;
  modal?: boolean;
  restoreFocus?: boolean;
  onOpenChange?: (open: boolean, source: InputSource) => void;
}

export interface OverlayController {
  readonly id: string;
  readonly overlay: HTMLElement;
  isOpen: () => boolean;
  isTopMost: () => boolean;
  open: (source?: InputSource) => void;
  close: (source?: InputSource) => void;
  toggle: (source?: InputSource) => void;
  dispose: () => void;
}

export const createOverlayController = (options: OverlayControllerOptions): OverlayController => {
  const id = options.id ?? (options.overlay.id || nextOverlayId());
  if (options.overlay.id.length === 0) {
    options.overlay.id = id;
  }

  let open = false;
  let disposed = false;
  let restoreTarget: HTMLElement | null = null;
  const shouldRestoreFocus = options.restoreFocus ?? true;

  const setOpen = (nextOpen: boolean, source: InputSource): void => {
    if (disposed || open === nextOpen) {
      return;
    }

    open = nextOpen;
    options.overlay.dataset.open = open ? 'true' : 'false';

    if (open) {
      restoreTarget = shouldRestoreFocus ? resolveRestoreTarget(options.trigger) : null;
      const entry = options.modal === undefined ? { id } : { id, modal: options.modal };
      sharedOverlayStack.register(entry);
    } else {
      sharedOverlayStack.unregister(id);

      if (shouldRestoreFocus && restoreTarget && isFocusable(restoreTarget)) {
        restoreTarget.focus();
      }
    }

    options.onOpenChange?.(open, source);
  };

  return {
    id,
    overlay: options.overlay,
    isOpen(): boolean {
      return open;
    },
    isTopMost(): boolean {
      return sharedOverlayStack.isTop(id);
    },
    open(source: InputSource = 'programmatic'): void {
      setOpen(true, source);
    },
    close(source: InputSource = 'programmatic'): void {
      setOpen(false, source);
    },
    toggle(source: InputSource = 'programmatic'): void {
      setOpen(!open, source);
    },
    dispose(): void {
      if (disposed) {
        return;
      }

      if (open) {
        setOpen(false, 'programmatic');
      }

      disposed = true;
    }
  };
};
