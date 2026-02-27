import type { RippleOptions } from '@covalent-poc/core';

export type FocusRingMode = 'auto' | 'always' | 'off';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type IconDefinition = {
  viewBox: string;
  paths: readonly string[];
};

export type RippleContractOptions = RippleOptions & {
  enabled?: boolean;
};
