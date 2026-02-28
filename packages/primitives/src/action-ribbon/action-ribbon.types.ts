import type { InputSource } from '@ds/headless';

import type { DismissReason, FeedbackTone } from '../shared-feedback';
import type { SurfaceAction } from '../shared-actions';

export interface PrimitiveActionRibbonOptions {
  id?: string;
  ariaLabel?: string;
  message: string;
  selectionCount?: number;
  tone?: FeedbackTone;
  dense?: boolean;
  sticky?: boolean;
  dismissible?: boolean;
  actions?: SurfaceAction[];
  maxVisibleActions?: number;
  announceChanges?: boolean;
  onAction?: (action: SurfaceAction, source: InputSource) => void;
  onDismiss?: (reason: DismissReason) => void;
}

export interface PrimitiveActionRibbon {
  element: HTMLElement;
  setTone: (tone: FeedbackTone) => void;
  setMessage: (message: string) => void;
  setSelectionCount: (count: number | null) => void;
  dismiss: (reason?: DismissReason) => void;
  destroy: () => void;
}
