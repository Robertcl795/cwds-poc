import type { InputSource } from '@ds/headless';

export type ContextMenuControlType = 'checkbox' | 'radio' | 'switch';
export type ContextMenuTriggerMode = 'contextmenu' | 'click' | 'both';

export interface ContextMenuActionItem {
  type?: 'item';
  id: string;
  label: string;
  disabled?: boolean;
  shortcut?: string;
  kind?: 'default' | 'danger';
  iconStart?: string | HTMLElement;
  iconEnd?: string | HTMLElement;
  control?: ContextMenuControlType;
  checked?: boolean;
  group?: string;
}

export interface ContextMenuSeparatorItem {
  type: 'separator';
  id: string;
}

export interface ContextMenuLabelItem {
  type: 'label';
  id: string;
  label: string;
}

export type ContextMenuItem = ContextMenuActionItem | ContextMenuSeparatorItem | ContextMenuLabelItem;

export interface PrimitiveContextMenuOptions {
  target: HTMLElement;
  items: ContextMenuItem[];
  id?: string;
  ariaLabel?: string;
  triggerMode?: ContextMenuTriggerMode;
  closeOnOutsidePress?: boolean;
  closeOnSelect?: boolean;
  onAction?: (item: ContextMenuActionItem, source: InputSource) => void;
}

export interface PrimitiveContextMenu {
  element: HTMLElement;
  openAt: (x: number, y: number, source?: InputSource) => void;
  close: (source?: InputSource) => void;
  destroy: () => void;
}
