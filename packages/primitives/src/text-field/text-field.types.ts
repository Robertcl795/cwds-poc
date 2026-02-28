import type { FieldControllerOptions } from '@ds/headless';

import type { PrimitiveFormFieldTone } from '../form-field';
import type { LoadingDensity } from '../loading';
import type { PrimitiveTextInputType } from '../text-input';

export interface PrimitiveTextFieldOptions extends FieldControllerOptions {
  id: string;
  name: string;
  label: string;
  value?: string;
  type?: PrimitiveTextInputType;
  placeholder?: string;
  helper?: string;
  helperText?: string;
  helperPersistent?: boolean;
  outlined?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  dense?: boolean;
  prefix?: string;
  suffix?: string;
  pattern?: string;
  min?: string;
  max?: string;
  size?: number;
  step?: number;
  icon?: string | HTMLElement;
  iconTrailing?: string | HTMLElement;
  maxLength?: number;
  charCounter?: boolean;
  autoValidate?: boolean;
  validationMessage?: string;
  errorText?: string;
  describedBy?: string;
  validateOnInitialRender?: boolean;
  loading?: boolean;
  loaderDensity?: LoadingDensity;
  tone?: PrimitiveFormFieldTone;
}

export interface PrimitiveTextField {
  element: HTMLDivElement;
  input: HTMLInputElement;
  getError: () => string | null;
  updateMessage: (text: string, invalid?: boolean) => void;
}
