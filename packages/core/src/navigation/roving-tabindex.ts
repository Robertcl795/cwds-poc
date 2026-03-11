import { createDisposalBin, listen } from '../dom/events';

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

const findEnabledIndex = (
  items: HTMLElement[],
  isDisabled: (item: HTMLElement, index: number) => boolean,
  startIndex: number,
  step: -1 | 1,
  options: { loop?: boolean; fallback?: number } = {}
): number => {
  if (items.length === 0) {
    return -1;
  }

  let index = startIndex;

  for (let visited = 0; visited < items.length; visited += 1) {
    if (options.loop) {
      index = (index + items.length) % items.length;
    } else if (index < 0 || index >= items.length) {
      return options.fallback ?? -1;
    }

    const item = items[index];
    if (item && !isDisabled(item, index)) {
      return index;
    }

    index += step;
  }

  return options.fallback ?? -1;
};

export const createRovingTabIndex = (options: RovingTabIndexOptions): RovingTabIndexController => {
  const cleanup = createDisposalBin();
  const orientation = options.orientation ?? 'horizontal';
  const loop = options.loop ?? true;
  const isItemDisabled = options.isItemDisabled ?? defaultDisabled;
  const items = options.items;

  let activeIndex = -1;
  const firstEnabledIndex = (): number => findEnabledIndex(items, isItemDisabled, 0, 1);
  const lastEnabledIndex = (): number => findEnabledIndex(items, isItemDisabled, items.length - 1, -1);
  const syncTabIndexes = (): void =>
    items.forEach((item, index) => {
      if (item) {
        item.tabIndex = !isItemDisabled(item, index) && index === activeIndex ? 0 : -1;
      }
    });

  const resolveInitialIndex = (): number => {
    const preferredIndex = options.initialActiveIndex;
    if (preferredIndex !== undefined) {
      const item = items[preferredIndex];
      if (item && !isItemDisabled(item, preferredIndex)) {
        return preferredIndex;
      }
    }

    return firstEnabledIndex();
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
      const firstEnabled = firstEnabledIndex();
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

  items.forEach((item, index) => {
    if (!item) {
      return;
    }

    cleanup.add(
      listen(item, 'focus', () => {
        if (!isItemDisabled(item, index)) {
          activeIndex = index;
          syncTabIndexes();
        }
      })
    );
  });

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

      const firstEnabled = firstEnabledIndex();
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
        const lastEnabled = lastEnabledIndex();
        if (lastEnabled === -1) {
          return null;
        }

        setActiveIndex(lastEnabled, { focus: true });
        return lastEnabled;
      }

      const nextIndex =
        intent === 'next'
          ? findEnabledIndex(items, isItemDisabled, activeIndex + 1, 1, { loop, fallback: activeIndex })
          : findEnabledIndex(items, isItemDisabled, activeIndex - 1, -1, { loop, fallback: activeIndex });

      setActiveIndex(nextIndex, { focus: true });
      return nextIndex;
    },
    destroy(): void {
      cleanup.dispose();
    }
  };
};
