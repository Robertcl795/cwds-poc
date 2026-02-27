export interface FieldControllerOptions {
  required?: boolean;
  validate?: (value: string) => string | null;
}

export interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

export const createFieldController = (options: FieldControllerOptions = {}) => {
  const state: FieldState = {
    value: '',
    touched: false,
    error: null
  };

  const runValidation = (): void => {
    if (options.required && state.value.trim().length === 0) {
      state.error = 'This field is required.';
      return;
    }

    state.error = options.validate?.(state.value) ?? null;
  };

  return {
    state,
    onInput(value: string): void {
      state.value = value;
      if (state.touched) {
        runValidation();
      }
    },
    onBlur(): void {
      state.touched = true;
      runValidation();
    },
    getValidationAttrs(): { 'aria-invalid'?: true; 'data-invalid': string } {
      return state.error
        ? {
            'aria-invalid': true,
            'data-invalid': 'true'
          }
        : { 'data-invalid': 'false' };
    }
  };
};
