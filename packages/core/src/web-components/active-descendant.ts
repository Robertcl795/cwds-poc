import { createActiveDescendantController } from '../collection/active-descendant';

export interface WebActiveDescendantController {
  setActive: (id: string | null) => void;
  clear: () => void;
}

export const createWebActiveDescendantController = (
  input: HTMLElement,
  listbox: HTMLElement,
  getOptionElements: () => HTMLElement[]
): WebActiveDescendantController => {
  const controller = createActiveDescendantController({
    input,
    listbox,
    getItems: getOptionElements
  });

  return {
    setActive(id: string | null): void {
      if (!id || !controller.setActiveById(id)) {
        controller.clear();
      }
    },
    clear(): void {
      controller.clear();
    }
  };
};
