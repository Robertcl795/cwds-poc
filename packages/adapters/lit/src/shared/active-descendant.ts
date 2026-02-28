export interface WebActiveDescendantController {
  setActive: (id: string | null) => void;
  clear: () => void;
}

export const createWebActiveDescendantController = (
  input: HTMLElement,
  listbox: HTMLElement,
  getOptionElements: () => HTMLElement[]
): WebActiveDescendantController => {
  const ensureId = (element: HTMLElement, index: number): string => {
    if (element.id.length > 0) {
      return element.id;
    }

    const listboxId = listbox.id.length > 0 ? listbox.id : 'cv-composite-listbox';
    const generatedId = `${listboxId}-option-${index + 1}`;
    element.id = generatedId;
    return generatedId;
  };

  return {
    setActive(id: string | null): void {
      const options = getOptionElements();
      let activeId: string | null = null;

      options.forEach((option, index) => {
        const optionId = ensureId(option, index);
        const active = id !== null && optionId === id;
        option.dataset.active = active ? 'true' : 'false';
        option.setAttribute('aria-selected', active ? 'true' : 'false');

        if (active) {
          activeId = optionId;
        }
      });

      if (activeId) {
        input.setAttribute('aria-activedescendant', activeId);
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    },
    clear(): void {
      this.setActive(null);
    }
  };
};
