export type FieldMessageOptions = {
  helper?: string;
  helperText?: string;
  validationMessage?: string;
  errorText?: string;
};

export type ResolvedFieldMessages = {
  helperText: string;
  errorText: string;
};

export function resolveFieldMessages(options: FieldMessageOptions): ResolvedFieldMessages {
  return {
    helperText: options.helperText ?? options.helper ?? '',
    errorText: options.errorText ?? options.validationMessage ?? ''
  };
}
