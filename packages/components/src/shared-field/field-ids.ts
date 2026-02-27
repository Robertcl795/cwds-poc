export type FieldIds = {
  controlId: string;
  labelId: string;
  helpId: string;
  errorId: string;
};

export type FieldIdOverrides = Partial<FieldIds>;

export function createFieldIds(baseId: string, overrides: FieldIdOverrides = {}): FieldIds {
  return {
    controlId: overrides.controlId ?? baseId,
    labelId: overrides.labelId ?? `${baseId}-label`,
    helpId: overrides.helpId ?? `${baseId}-helper`,
    errorId: overrides.errorId ?? `${baseId}-error`
  };
}
