import type { InputSource } from '@covalent-poc/core';

export type PrimitiveTabsOrientation = 'horizontal' | 'vertical';

export type PrimitiveTabsActivation = 'manual';

export interface PrimitiveTabItem {
  id: string;
  label: string;
  panel: HTMLElement;
  disabled?: boolean;
}

export interface PrimitiveTabsOptions {
  id?: string;
  ariaLabel?: string;
  orientation?: PrimitiveTabsOrientation;
  activation?: PrimitiveTabsActivation;
  selectedId?: string;
  tabs: PrimitiveTabItem[];
  onSelectedChange?: (selectedId: string, source: InputSource) => void;
}

export interface PrimitiveTabs {
  element: HTMLElement;
  tabList: HTMLElement;
  tabElements: HTMLButtonElement[];
  panelElements: HTMLElement[];
  selectTab: (id: string, source?: InputSource) => void;
  getSelectedId: () => string | null;
  destroy: () => void;
}
