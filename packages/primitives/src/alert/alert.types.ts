import type { InputSource } from '@ds/headless';

import type { DismissReason, FeedbackPriority, FeedbackTone } from '../shared-feedback';
import type { SurfaceAction } from '../shared-actions';

export type PrimitiveAlertVariant = 'soft' | 'outlined' | 'filled';

export interface PrimitiveAlertAction extends SurfaceAction {
  dismissOnAction?: boolean;
}

export interface PrimitiveAlertOptions {
  id?: string;
  title?: string;
  message: string;
  tone?: FeedbackTone;
  priority?: FeedbackPriority;
  variant?: PrimitiveAlertVariant;
  dense?: boolean;
  dismissible?: boolean;
  actions?: PrimitiveAlertAction[];
  onAction?: (action: PrimitiveAlertAction, source: InputSource) => void;
  onDismiss?: (reason: DismissReason) => void;
}

export interface PrimitiveAlert {
  element: HTMLElement;
  setMessage: (message: string) => void;
  dismiss: (reason?: DismissReason) => void;
}
