export type PrimitiveChipVariant = 'action' | 'filter';

export type PrimitiveChipInputSource = 'pointer' | 'keyboard' | 'programmatic';

export interface PrimitiveChipBaseOptions {
  variant: PrimitiveChipVariant;
  label: string;
  disabled?: boolean;
  iconStart?: string | HTMLElement;
  iconEnd?: string | HTMLElement;
}

export interface PrimitiveActionChipOptions extends PrimitiveChipBaseOptions {
  variant: 'action';
  ripple?: boolean;
  onPress?: (source: PrimitiveChipInputSource, event: MouseEvent) => void;
}

export interface PrimitiveFilterChipOptions extends PrimitiveChipBaseOptions {
  variant: 'filter';
  id: string;
  name: string;
  value?: string;
  selected?: boolean;
  required?: boolean;
  onSelectedChange?: (checked: boolean, source: PrimitiveChipInputSource) => void;
}

export type PrimitiveChipOptions = PrimitiveActionChipOptions | PrimitiveFilterChipOptions;

export interface PrimitiveChipHandle {
  element: HTMLElement;
  button?: HTMLButtonElement;
  input?: HTMLInputElement;
}
