export type PrimitiveSliderInputSource = 'pointer' | 'keyboard' | 'programmatic';

export interface PrimitiveSliderOptions {
  id: string;
  name: string;
  label: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  helperText?: string;
  validationMessage?: string;
  errorText?: string;
  describedBy?: string;
  invalid?: boolean;
  showValue?: boolean;
  onValueChange?: (value: number, source: PrimitiveSliderInputSource) => void;
}

export interface PrimitiveSlider {
  element: HTMLDivElement;
  input: HTMLInputElement;
  output?: HTMLOutputElement;
  setValue: (value: number) => void;
}
