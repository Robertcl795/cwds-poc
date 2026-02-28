import type { InputSource } from '@ds/headless';

import type { DismissReason, FeedbackPriority, FeedbackTone } from '../shared-feedback';

export interface PrimitiveSnackbarAction {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface PrimitiveSnackbarMessage {
  id?: string;
  message: string;
  tone?: FeedbackTone;
  priority?: FeedbackPriority;
  durationMs?: number;
  dismissible?: boolean;
  action?: PrimitiveSnackbarAction;
}

export interface PrimitiveSnackbarHostOptions {
  id?: string;
  root?: HTMLElement;
  defaultDurationMs?: number;
  closeAnimationMs?: number;
}

export interface SnackbarActionEventDetail {
  id: string;
  action: PrimitiveSnackbarAction;
  source: InputSource;
}

export interface SnackbarDismissEventDetail {
  id: string;
  reason: DismissReason;
}

export interface PrimitiveSnackbarHost {
  element: HTMLElement;
  enqueue: (message: PrimitiveSnackbarMessage) => string;
  dismiss: (id?: string, reason?: DismissReason) => void;
  clear: () => void;
  destroy: () => void;
}
