import type { InputSource } from '@ds/headless';

import type { PrimitiveContextMenu } from '../menu';
import type { SurfaceAction } from '../shared-actions';

export interface PrimitiveToolbarOptions {
  id?: string;
  ariaLabel?: string;
  title?: string;
  dense?: boolean;
  leading?: HTMLElement[];
  trailing?: HTMLElement[];
  actions?: SurfaceAction[];
  maxVisibleActions?: number;
  enableOverflowMenu?: boolean;
  onAction?: (action: SurfaceAction, source: InputSource) => void;
}

export interface PrimitiveToolbar {
  element: HTMLElement;
  overflowMenu: PrimitiveContextMenu | null;
  destroy: () => void;
}
