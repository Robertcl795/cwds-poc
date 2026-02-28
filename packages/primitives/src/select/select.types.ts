import type { InputSource, SelectOption } from '@ds/headless';

export type PrimitiveSelectOption = SelectOption;

export interface PrimitiveSelectOptions {
  id: string;
  name: string;
  label: string;
  options: PrimitiveSelectOption[];
  value?: string;
  validationMessage?: string;
  errorText?: string;
  helper?: string;
  helperText?: string;
  describedBy?: string;
  icon?: string | HTMLElement;
  required?: boolean;
  outlined?: boolean;
  naturalMenuWidth?: boolean;
  fixedMenuPosition?: boolean;
  disabled?: boolean;
  validateOnInitialRender?: boolean;
  enhance?: boolean;
  onValueChange?: (value: string, source: InputSource) => void;
}

export interface PrimitiveSelect {
  element: HTMLDivElement;
  selectElement: HTMLSelectElement;
  setValue: (value: string) => void;
}
