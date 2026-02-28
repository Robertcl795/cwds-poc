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
  options.findIndex((option) => !option.disabled);

const clampEnabledIndex = (
  options: SelectOption[],
  start: number,
  direction: 1 | -1,
  fallbackIndex: number
): number => {
  const size = options.length;
  if (size === 0 || fallbackIndex === -1) {
    return -1;
  }

  for (let step = 0; step < size; step += 1) {
    const index = (start + step * direction + size) % size;
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return fallbackIndex;
};

export const createSelectController = (config: SelectControllerOptions) => {
  const options = config.options;
  let open = false;
  const fallbackIndex = firstEnabledIndex(options);
  const configuredIndex =
    typeof config.value === 'string' ? options.findIndex((option) => option.value === config.value) : -1;
  const selectedIndex =
    configuredIndex >= 0 && options[configuredIndex] && !options[configuredIndex].disabled
      ? configuredIndex
      : fallbackIndex;

  let activeIndex = selectedIndex;
  let selectedValue = selectedIndex >= 0 ? options[selectedIndex]?.value ?? '' : '';

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
      if (activeIndex === -1) {
        return;
      }

      activeIndex = clampEnabledIndex(options, activeIndex + direction, direction, activeIndex);
    },
    selectByIndex(index: number, source: InputSource = 'programmatic'): void {
      const option = options[index];
      if (!option || option.disabled) {
        return;
      }

      if (selectedValue === option.value) {
        activeIndex = index;
        return;
      }

      activeIndex = index;
      selectedValue = option.value;
      config.onValueChange?.(selectedValue, source);
    }
  };
};
