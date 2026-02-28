export type FieldLikeControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type FieldStateOverrides = {
  invalid?: boolean;
};

const isFieldFilled = (control: FieldLikeControl): boolean => {
  if (control instanceof HTMLInputElement && control.type === 'checkbox') {
    return control.checked;
  }

  return control.value.trim().length > 0;
};

export function syncFieldState(
  host: HTMLElement,
  control: FieldLikeControl,
  overrides: FieldStateOverrides = {}
): void {
  host.dataset.disabled = control.disabled ? 'true' : 'false';
  host.dataset.readOnly = 'readOnly' in control && control.readOnly ? 'true' : 'false';
  host.dataset.filled = isFieldFilled(control) ? 'true' : 'false';
  host.dataset.focused = document.activeElement === control ? 'true' : 'false';

  const invalid = overrides.invalid ?? control.matches(':invalid');
  host.dataset.invalid = invalid ? 'true' : 'false';
}
