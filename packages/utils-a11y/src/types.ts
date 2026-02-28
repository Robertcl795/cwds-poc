import type { RippleOptions } from '@ds/headless';

export type FocusRingMode = 'auto' | 'always' | 'off';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type RippleContractOptions = RippleOptions & {
  enabled?: boolean;
};
