import type { InputSource } from '../types/events';

export interface SelectOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectControllerOptions {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string, source: InputSource) => void;
}

const firstEnabledIndex = (options: SelectOption[]): number =>
  Math.max(
    0,
    options.findIndex((option) => !option.disabled)
  );

const clampEnabledIndex = (options: SelectOption[], start: number, direction: 1 | -1): number => {
  const size = options.length;
  for (let step = 0; step < size; step += 1) {
    const index = (start + step * direction + size) % size;
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return start;
};

export const createSelectController = (config: SelectControllerOptions) => {
  const options = config.options;
  let open = false;
  let activeIndex = firstEnabledIndex(options);
  let selectedValue = config.value ?? options[activeIndex]?.value ?? '';

  return {
    isOpen(): boolean {
      return open;
    },
    getActiveIndex(): number {
      return activeIndex;
    },
    getSelectedValue(): string {
      return selectedValue;
    },
    open(): void {
      open = true;
    },
    close(): void {
      open = false;
    },
    moveActive(direction: 1 | -1): void {
      activeIndex = clampEnabledIndex(options, activeIndex + direction, direction);
    },
    selectByIndex(index: number, source: InputSource = 'programmatic'): void {
      const option = options[index];
      if (!option || option.disabled) {
        return;
      }

      activeIndex = index;
      selectedValue = option.value;
      config.onValueChange?.(selectedValue, source);
    }
  };
};
