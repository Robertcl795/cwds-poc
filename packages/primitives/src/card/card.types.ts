import type { InputSource } from '@ds/headless';

import type { SurfaceAction } from '../shared-actions';

export type PrimitiveCardElement = 'article' | 'section' | 'div';
export type PrimitiveCardVariant = 'outlined' | 'filled' | 'elevated';

export interface PrimitiveCardOptions {
  id?: string;
  as?: PrimitiveCardElement;
  title?: string;
  supportingText?: string;
  body?: string | HTMLElement;
  variant?: PrimitiveCardVariant;
  dense?: boolean;
  interactive?: boolean;
  actions?: SurfaceAction[];
  onAction?: (action: SurfaceAction, source: InputSource) => void;
}

export interface PrimitiveCard {
  element: HTMLElement;
  setVariant: (variant: PrimitiveCardVariant) => void;
  setDense: (dense: boolean) => void;
}
