export interface SelectionOption {
  id: string;
  value: string;
  disabled?: boolean;
}

export interface SelectionState {
  highlightedId: string | null;
  committedValue: string;
}

export interface SelectionModel {
  getState: () => SelectionState;
  highlight: (id: string | null) => void;
  commitById: (id: string) => string | null;
  commitByValue: (value: string) => string | null;
  clearHighlight: () => void;
}

export interface SelectionModelOptions {
  getOptions: () => SelectionOption[];
  initialValue?: string;
}

export const createSelectionModel = (options: SelectionModelOptions): SelectionModel => {
  let highlightedId: string | null = null;
  let committedValue = options.initialValue ?? '';

  const resolveOptionById = (id: string): SelectionOption | null =>
    options.getOptions().find((option) => option.id === id && !option.disabled) ?? null;

  const resolveOptionByValue = (value: string): SelectionOption | null =>
    options.getOptions().find((option) => option.value === value && !option.disabled) ?? null;

  return {
    getState(): SelectionState {
      return {
        highlightedId,
        committedValue
      };
    },
    highlight(id: string | null): void {
      highlightedId = id;
    },
    commitById(id: string): string | null {
      const option = resolveOptionById(id);
      if (!option) {
        return null;
      }

      committedValue = option.value;
      highlightedId = option.id;
      return committedValue;
    },
    commitByValue(value: string): string | null {
      const option = resolveOptionByValue(value);
      if (!option) {
        return null;
      }

      committedValue = option.value;
      highlightedId = option.id;
      return committedValue;
    },
    clearHighlight(): void {
      highlightedId = null;
    }
  };
};
