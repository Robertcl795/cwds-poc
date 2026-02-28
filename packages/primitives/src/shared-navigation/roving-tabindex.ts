import { createDisposalBin, listen } from '@ds/headless';

import { type NavigationOrientation, resolveOrientationNavigationIntent } from './orientation-keys';

export interface RovingTabIndexOptions {
  items: HTMLElement[];
  orientation?: NavigationOrientation;
  loop?: boolean;
  isItemDisabled?: (item: HTMLElement, index: number) => boolean;
  initialActiveIndex?: number;
}

export interface RovingTabIndexController {
  getActiveIndex: () => number;
  setActiveIndex: (index: number, options?: { focus?: boolean }) => boolean;
  focusActive: () => void;
  refresh: () => void;
  onKeydown: (event: KeyboardEvent) => number | null;
  destroy: () => void;
}

const defaultDisabled = (item: HTMLElement): boolean => {
  if (item instanceof HTMLButtonElement || item instanceof HTMLInputElement || item instanceof HTMLSelectElement || item instanceof HTMLTextAreaElement) {
    return item.disabled;
  }

  return item.getAttribute('aria-disabled') === 'true' || item.dataset.disabled === 'true';
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

const findFirstEnabledIndex = (
  items: HTMLElement[],
  isDisabled: (item: HTMLElement, index: number) => boolean
): number => items.findIndex((item, index) => !isDisabled(item, index));

const findLastEnabledIndex = (
  items: HTMLElement[],
  isDisabled: (item: HTMLElement, index: number) => boolean
): number => {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    const item = items[index];
    if (item && !isDisabled(item, index)) {
      return index;
    }
  }

  return -1;
};

const findNextEnabledIndex = (
  items: HTMLElement[],
  isDisabled: (item: HTMLElement, index: number) => boolean,
  currentIndex: number,
  step: -1 | 1,
  loop: boolean
): number => {
  if (items.length === 0) {
    return -1;
  }

  const maxIndex = items.length - 1;
  let cursor = currentIndex;
  let visited = 0;

  while (visited <= maxIndex) {
    cursor += step;

    if (cursor > maxIndex) {
      if (!loop) {
        return currentIndex;
      }
      cursor = 0;
    }

    if (cursor < 0) {
      if (!loop) {
        return currentIndex;
      }
      cursor = maxIndex;
    }

    const item = items[cursor];
    if (item && !isDisabled(item, cursor)) {
      return cursor;
    }

    visited += 1;
  }

  return currentIndex;
};

export const createRovingTabIndex = (options: RovingTabIndexOptions): RovingTabIndexController => {
  const cleanup = createDisposalBin();
  const orientation = options.orientation ?? 'horizontal';
  const loop = options.loop ?? true;
  const isItemDisabled = options.isItemDisabled ?? defaultDisabled;
  const items = options.items;

  let activeIndex = -1;

  const syncTabIndexes = (): void => {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (!item) {
        continue;
      }

      if (isItemDisabled(item, index)) {
        item.tabIndex = -1;
        continue;
      }

      item.tabIndex = index === activeIndex ? 0 : -1;
    }
  };

  const resolveInitialIndex = (): number => {
    const preferredIndex = options.initialActiveIndex;
    if (preferredIndex !== undefined) {
      const item = items[preferredIndex];
      if (item && !isItemDisabled(item, preferredIndex)) {
        return preferredIndex;
      }
    }

    return findFirstEnabledIndex(items, isItemDisabled);
  };

  const setActiveIndex = (index: number, state?: { focus?: boolean }): boolean => {
    if (items.length === 0) {
      activeIndex = -1;
      return false;
    }

    const maxIndex = items.length - 1;
    let nextIndex = clamp(index, 0, maxIndex);
    const nextItem = items[nextIndex];

    if (!nextItem || isItemDisabled(nextItem, nextIndex)) {
      const firstEnabled = findFirstEnabledIndex(items, isItemDisabled);
      if (firstEnabled === -1) {
        activeIndex = -1;
        syncTabIndexes();
        return false;
      }
      nextIndex = firstEnabled;
    }

    activeIndex = nextIndex;
    syncTabIndexes();

    if (state?.focus) {
      items[activeIndex]?.focus();
    }

    return true;
  };

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item) {
      continue;
    }

    cleanup.add(
      listen(item, 'focus', () => {
        if (!isItemDisabled(item, index)) {
          activeIndex = index;
          syncTabIndexes();
        }
      })
    );
  }

  setActiveIndex(resolveInitialIndex());

  return {
    getActiveIndex: () => activeIndex,
    setActiveIndex,
    focusActive(): void {
      if (activeIndex < 0) {
        return;
      }

      items[activeIndex]?.focus();
    },
    refresh(): void {
      if (activeIndex < 0) {
        setActiveIndex(resolveInitialIndex());
        return;
      }

      const currentItem = items[activeIndex];
      if (!currentItem || isItemDisabled(currentItem, activeIndex)) {
        setActiveIndex(resolveInitialIndex());
        return;
      }

      syncTabIndexes();
    },
    onKeydown(event: KeyboardEvent): number | null {
      const intent = resolveOrientationNavigationIntent(event.key, orientation);
      if (!intent) {
        return null;
      }

      const firstEnabled = findFirstEnabledIndex(items, isItemDisabled);
      if (firstEnabled === -1) {
        return null;
      }

      event.preventDefault();

      if (activeIndex < 0) {
        setActiveIndex(firstEnabled, { focus: true });
        return firstEnabled;
      }

      if (intent === 'first') {
        setActiveIndex(firstEnabled, { focus: true });
        return firstEnabled;
      }

      if (intent === 'last') {
        const lastEnabled = findLastEnabledIndex(items, isItemDisabled);
        if (lastEnabled === -1) {
          return null;
        }

        setActiveIndex(lastEnabled, { focus: true });
        return lastEnabled;
      }

      const nextIndex =
        intent === 'next'
          ? findNextEnabledIndex(items, isItemDisabled, activeIndex, 1, loop)
          : findNextEnabledIndex(items, isItemDisabled, activeIndex, -1, loop);

      setActiveIndex(nextIndex, { focus: true });
      return nextIndex;
    },
    destroy(): void {
      cleanup.dispose();
    }
  };
};
