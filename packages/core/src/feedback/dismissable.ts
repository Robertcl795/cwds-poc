export type DismissReason = 'close-button' | 'timeout' | 'escape' | 'action' | 'programmatic';

export interface DismissableController {
  readonly isDismissed: () => boolean;
  readonly reason: () => DismissReason | null;
  dismiss: (reason?: DismissReason) => boolean;
  reset: () => void;
  onDismiss: (listener: (reason: DismissReason) => void) => () => void;
}

export const createDismissableController = (): DismissableController => {
  let dismissed = false;
  let dismissReason: DismissReason | null = null;
  const listeners = new Set<(reason: DismissReason) => void>();

  return {
    isDismissed(): boolean {
      return dismissed;
    },
    reason(): DismissReason | null {
      return dismissReason;
    },
    dismiss(reason: DismissReason = 'programmatic'): boolean {
      if (dismissed) {
        return false;
      }

      dismissed = true;
      dismissReason = reason;
      for (const listener of listeners) {
        listener(reason);
      }

      return true;
    },
    reset(): void {
      dismissed = false;
      dismissReason = null;
    },
    onDismiss(listener: (reason: DismissReason) => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
};
