export type RippleStyleMutationMode = 'allow' | 'forbid';

export type RippleOptions = {
  disabled?: boolean | (() => boolean);
  maxWaves?: number;
  durationMs?: number;
  styleMutation?: RippleStyleMutationMode;
  centeredOnKeyboard?: boolean;
  respectReducedMotion?: boolean;
};

export type RippleController = {
  destroy: () => void;
  setDisabled: (disabled: boolean) => void;
};
