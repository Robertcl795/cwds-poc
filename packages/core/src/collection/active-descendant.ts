export interface ActiveDescendantControllerOptions {
  input: HTMLElement;
  listbox: HTMLElement;
  getItems: () => HTMLElement[];
  isItemDisabled?: (item: HTMLElement) => boolean;
  onActiveChange?: (id: string | null) => void;
  loop?: boolean;
}

export interface ActiveDescendantController {
  getActiveId: () => string | null;
  setActiveById: (id: string) => boolean;
  move: (delta: number) => string | null;
  home: () => string | null;
  end: () => string | null;
  clear: () => void;
}

const defaultIsItemDisabled = (item: HTMLElement): boolean =>
  item.getAttribute('aria-disabled') === 'true' || item.dataset.disabled === 'true';

const ensureId = (item: HTMLElement, index: number, listboxId: string): string => {
  if (item.id.length > 0) {
    return item.id;
  }

  const generated = `${listboxId}-option-${index + 1}`;
  item.id = generated;
  return generated;
};

export const createActiveDescendantController = (
  options: ActiveDescendantControllerOptions
): ActiveDescendantController => {
  const isItemDisabled = options.isItemDisabled ?? defaultIsItemDisabled;
  const loop = options.loop ?? true;

  let activeId: string | null = null;

  const getEnabledItems = (): HTMLElement[] => options.getItems().filter((item) => !isItemDisabled(item));

  const setActive = (item: HTMLElement | null): string | null => {
    const listboxId = options.listbox.id || 'cv-listbox';

    options.getItems().forEach((candidate) => {
      candidate.dataset.active = candidate === item ? 'true' : 'false';
      candidate.setAttribute('aria-selected', candidate === item ? 'true' : 'false');
    });

    activeId = item ? ensureId(item, options.getItems().indexOf(item), listboxId) : null;

    if (activeId) {
      options.input.setAttribute('aria-activedescendant', activeId);
    } else {
      options.input.removeAttribute('aria-activedescendant');
    }

    options.onActiveChange?.(activeId);
    return activeId;
  };

  const moveToIndex = (index: number): string | null => {
    const enabledItems = getEnabledItems();
    if (enabledItems.length === 0) {
      return setActive(null);
    }

    const clamped = loop
      ? ((index % enabledItems.length) + enabledItems.length) % enabledItems.length
      : Math.max(0, Math.min(enabledItems.length - 1, index));

    return setActive(enabledItems[clamped] ?? null);
  };

  return {
    getActiveId(): string | null {
      return activeId;
    },
    setActiveById(id: string): boolean {
      const item = getEnabledItems().find((candidate) => candidate.id === id);
      if (!item) {
        return false;
      }

      setActive(item);
      return true;
    },
    move(delta: number): string | null {
      const enabledItems = getEnabledItems();
      if (enabledItems.length === 0) {
        return setActive(null);
      }

      const currentIndex = activeId
        ? enabledItems.findIndex((item) => item.id === activeId)
        : delta > 0
          ? -1
          : enabledItems.length;

      return moveToIndex(currentIndex + delta);
    },
    home(): string | null {
      return moveToIndex(0);
    },
    end(): string | null {
      const enabledItems = getEnabledItems();
      return moveToIndex(enabledItems.length - 1);
    },
    clear(): void {
      setActive(null);
    }
  };
};
