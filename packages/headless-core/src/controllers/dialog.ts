import type { InputSource } from '../types/events';

export interface DialogControllerOptions {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, source: InputSource) => void;
}

export const createDialogController = (options: DialogControllerOptions = {}) => {
  let open = options.defaultOpen ?? false;

  const setOpen = (nextOpen: boolean, source: InputSource): void => {
    if (open === nextOpen) {
      return;
    }

    open = nextOpen;
    options.onOpenChange?.(open, source);
  };

  return {
    isOpen(): boolean {
      return open;
    },
    open(source: InputSource = 'programmatic'): void {
      setOpen(true, source);
    },
    close(source: InputSource = 'programmatic'): void {
      setOpen(false, source);
    },
    toggle(source: InputSource = 'programmatic'): void {
      setOpen(!open, source);
    }
  };
};
