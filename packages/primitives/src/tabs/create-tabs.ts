import { createDisposalBin, listen, type InputSource } from '@ds/headless';
import { applyFocusRing } from '@ds/utils-a11y';

import { createRovingTabIndex } from '../shared-navigation';
import type { PrimitiveTabs, PrimitiveTabsOptions } from './tabs.types';

let tabsSequence = 0;

const nextTabsId = (): string => {
  tabsSequence += 1;
  return `cv-tabs-${tabsSequence}`;
};

const firstEnabledTabIndex = (tabs: HTMLButtonElement[]): number => tabs.findIndex((tab) => !tab.disabled);

const resolveInitialSelectedIndex = (tabs: PrimitiveTabsOptions['tabs'], selectedId: string | undefined): number => {
  if (selectedId) {
    const selectedIndex = tabs.findIndex((tab) => tab.id === selectedId && tab.disabled !== true);
    if (selectedIndex !== -1) {
      return selectedIndex;
    }
  }

  const firstEnabledIndex = tabs.findIndex((tab) => tab.disabled !== true);
  return firstEnabledIndex === -1 ? 0 : firstEnabledIndex;
};

export const createPrimitiveTabs = (options: PrimitiveTabsOptions): PrimitiveTabs => {
  const cleanup = createDisposalBin();
  const orientation = options.orientation ?? 'horizontal';
  const baseId = options.id ?? nextTabsId();

  const root = document.createElement('section');
  root.className = 'cv-tabs';
  root.dataset.orientation = orientation;

  const tabList = document.createElement('div');
  tabList.className = 'cv-tabs__tablist';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-orientation', orientation);

  if (options.ariaLabel) {
    tabList.setAttribute('aria-label', options.ariaLabel);
  }

  const panels = document.createElement('div');
  panels.className = 'cv-tabs__panels';

  const tabElements: HTMLButtonElement[] = [];
  const panelElements: HTMLElement[] = [];

  const selectedIndexFromOptions = resolveInitialSelectedIndex(options.tabs, options.selectedId);
  let selectedIndex = selectedIndexFromOptions;

  for (let index = 0; index < options.tabs.length; index += 1) {
    const tab = options.tabs[index];
    if (!tab) {
      continue;
    }

    const tabElement = document.createElement('button');
    tabElement.type = 'button';
    tabElement.className = 'cv-tabs__tab';
    tabElement.setAttribute('role', 'tab');
    tabElement.id = `${baseId}-tab-${tab.id}`;
    tabElement.textContent = tab.label;
    tabElement.disabled = tab.disabled ?? false;

    if (tabElement.disabled) {
      tabElement.dataset.disabled = 'true';
      tabElement.setAttribute('aria-disabled', 'true');
    }

    applyFocusRing(tabElement, 'auto');

    const panel = tab.panel;
    panel.classList.add('cv-tabs__panel');
    panel.setAttribute('role', 'tabpanel');
    panel.id = panel.id || `${baseId}-panel-${tab.id}`;
    panel.setAttribute('aria-labelledby', tabElement.id);

    tabElement.setAttribute('aria-controls', panel.id);

    tabElements.push(tabElement);
    panelElements.push(panel);
    tabList.append(tabElement);
    panels.append(panel);
  }

  const writeState = (nextSelectedIndex: number): void => {
    for (let index = 0; index < tabElements.length; index += 1) {
      const tab = tabElements[index];
      const panel = panelElements[index];
      if (!tab || !panel) {
        continue;
      }

      const selected = index === nextSelectedIndex;
      tab.dataset.selected = selected ? 'true' : 'false';
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
      panel.dataset.selected = selected ? 'true' : 'false';
    }
  };

  writeState(selectedIndex);

  const roving = createRovingTabIndex({
    items: tabElements,
    orientation,
    loop: true,
    initialActiveIndex: selectedIndex,
    isItemDisabled: (item) => item instanceof HTMLButtonElement && item.disabled
  });

  const selectIndex = (nextSelectedIndex: number, source: InputSource, focusTab = false): void => {
    const tab = tabElements[nextSelectedIndex];
    if (!tab || tab.disabled) {
      return;
    }

    if (selectedIndex === nextSelectedIndex) {
      if (focusTab) {
        tab.focus();
      }
      return;
    }

    selectedIndex = nextSelectedIndex;
    writeState(selectedIndex);
    roving.setActiveIndex(selectedIndex, { focus: focusTab });

    const nextTab = options.tabs[selectedIndex];
    if (nextTab) {
      options.onSelectedChange?.(nextTab.id, source);
    }
  };

  for (let index = 0; index < tabElements.length; index += 1) {
    const tab = tabElements[index];
    if (!tab) {
      continue;
    }

    cleanup.add(
      listen(tab, 'click', () => {
        selectIndex(index, 'pointer');
      })
    );

    cleanup.add(
      listen(tab, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          selectIndex(index, 'keyboard', true);
        }
      })
    );

    cleanup.add(
      listen(tab, 'focus', () => {
        roving.setActiveIndex(index);
      })
    );
  }

  cleanup.add(
    listen(tabList, 'keydown', (event) => {
      roving.onKeydown(event);
    })
  );

  root.append(tabList, panels);

  const enabledIndex = firstEnabledTabIndex(tabElements);
  if (enabledIndex !== -1 && tabElements[selectedIndex]?.disabled) {
    selectedIndex = enabledIndex;
    writeState(selectedIndex);
    roving.setActiveIndex(selectedIndex);
  }

  return {
    element: root,
    tabList,
    tabElements,
    panelElements,
    selectTab(id: string, source: InputSource = 'programmatic'): void {
      const index = options.tabs.findIndex((tab) => tab.id === id);
      if (index === -1) {
        return;
      }

      selectIndex(index, source);
    },
    getSelectedId(): string | null {
      const selectedTab = options.tabs[selectedIndex];
      return selectedTab ? selectedTab.id : null;
    },
    destroy(): void {
      cleanup.dispose();
      roving.destroy();
    }
  };
};
