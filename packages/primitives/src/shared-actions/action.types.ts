import type { InputSource } from '@ds/headless';

export type SurfaceActionKind = 'primary' | 'secondary' | 'danger';
export type SurfaceActionGroup = 'leading' | 'trailing' | 'overflow';

export interface SurfaceAction {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: SurfaceActionKind;
  shortcut?: string;
  group?: SurfaceActionGroup;
}

export interface SurfaceActionEventDetail {
  action: SurfaceAction;
  source: InputSource;
}
