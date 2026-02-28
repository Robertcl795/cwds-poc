import type { InputSource } from '@ds/headless';

export type PrimitiveListOrientation = 'horizontal' | 'vertical';

export type PrimitiveListVariant = 'content' | 'action';

export interface PrimitiveListItem {
  id: string;
  headline: string;
  supportingText?: string;
  leading?: string | HTMLElement;
  trailing?: string | HTMLElement;
  href?: string;
  disabled?: boolean;
  selected?: boolean;
  current?: boolean;
}

export interface PrimitiveListOptions {
  id?: string;
  ordered?: boolean;
  ariaLabel?: string;
  orientation?: PrimitiveListOrientation;
  variant?: PrimitiveListVariant;
  managedFocus?: boolean;
  ripple?: boolean;
  items: PrimitiveListItem[];
  onAction?: (item: PrimitiveListItem, source: InputSource) => void;
}

export interface PrimitiveList {
  element: HTMLOListElement | HTMLUListElement;
  focusItem: (id: string) => void;
  setCurrent: (id: string | null) => void;
}
