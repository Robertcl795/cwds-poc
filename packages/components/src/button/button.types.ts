import type { ButtonControllerOptions } from '@covalent-poc/core';

import type { LoadingDensity } from '../loading';

export type PrimitiveButtonShape = 'contained' | 'outlined' | 'text';
export type PrimitiveButtonColor =
  | 'primary'
  | 'secondary'
  | 'emphasis'
  | 'caution'
  | 'negative'
  | 'positive';

export interface PrimitiveButtonOptions extends ButtonControllerOptions {
  label: string;
  type?: 'button' | 'submit' | 'reset';
  shape?: PrimitiveButtonShape;
  color?: PrimitiveButtonColor;
  iconStart?: string | HTMLElement;
  iconEnd?: string | HTMLElement;
  content?: string | HTMLElement;
  expandContent?: boolean;
  fullWidth?: boolean;
  dense?: boolean;
  raised?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  loadingDensity?: LoadingDensity;
  variant?: 'primary' | 'secondary';
  ripple?: boolean;
}
