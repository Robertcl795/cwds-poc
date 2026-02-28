interface FormValueAdapter {
  setName: (name: string) => void;
  setDisabled: (disabled: boolean) => void;
  setRequired: (required: boolean) => void;
  setValue: (value: string) => void;
  onFormReset: (callback: () => void) => () => void;
  dispose: () => void;
}

const createHiddenInput = (host: HTMLElement): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.dataset.cvFormProxy = 'true';
  host.append(input);
  return input;
};

const toFormAssociatedElement = (host: HTMLElement): HTMLElement & {
  attachInternals?: () => ElementInternals;
} => host as HTMLElement & { attachInternals?: () => ElementInternals };

export const createFormValueAdapter = (host: HTMLElement): FormValueAdapter => {
  const attachedInternals = toFormAssociatedElement(host).attachInternals?.();
  const internals =
    attachedInternals && typeof attachedInternals.setFormValue === 'function' ? attachedInternals : null;
  let hiddenInput: HTMLInputElement | null = null;

  let name = '';
  let value = '';
  let isDisabled = false;
  let isRequired = false;

  const ensureHiddenInput = (): HTMLInputElement | null => {
    if (internals) {
      return null;
    }

    if (!hiddenInput && host.isConnected) {
      hiddenInput = createHiddenInput(host);
      hiddenInput.name = name;
      hiddenInput.value = value;
      hiddenInput.disabled = isDisabled;
      hiddenInput.required = isRequired;
    }

    return hiddenInput;
  };

  const syncHiddenInput = (): void => {
    const input = ensureHiddenInput();
    if (!input) {
      return;
    }

    input.name = name;
    input.value = value;
  };

  return {
    setName(nextName: string): void {
      name = nextName;
      syncHiddenInput();
    },
    setDisabled(disabled: boolean): void {
      isDisabled = disabled;
      if (hiddenInput) {
        hiddenInput.disabled = disabled;
      }
    },
    setRequired(required: boolean): void {
      isRequired = required;
      if (hiddenInput) {
        hiddenInput.required = required;
      }
    },
    setValue(nextValue: string): void {
      value = nextValue;

      if (internals) {
        internals.setFormValue(nextValue);
      }

      syncHiddenInput();
    },
    onFormReset(callback: () => void): () => void {
      const form = host.closest('form');
      if (!form) {
        return () => undefined;
      }

      const listener = (): void => {
        callback();
      };

      form.addEventListener('reset', listener);
      return () => {
        form.removeEventListener('reset', listener);
      };
    },
    dispose(): void {
      hiddenInput?.remove();
    }
  };
};
