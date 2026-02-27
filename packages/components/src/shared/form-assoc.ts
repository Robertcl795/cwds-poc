const joinIds = (...values: Array<string | undefined>): string | undefined => {
  const ids = values
    .flatMap((value) => (value ? value.split(/\s+/) : []))
    .map((value) => value.trim())
    .filter((value, index, all) => value.length > 0 && all.indexOf(value) === index);

  return ids.length > 0 ? ids.join(' ') : undefined;
};

export type DescribedByOptions = {
  helpId?: string | undefined;
  errorId?: string | undefined;
  invalid?: boolean | undefined;
};

export function setControlDescription(control: HTMLElement, options: DescribedByOptions = {}): void {
  const describedBy = joinIds(options.helpId, options.invalid ? options.errorId : undefined);

  if (describedBy) {
    control.setAttribute('aria-describedby', describedBy);
  } else {
    control.removeAttribute('aria-describedby');
  }

  if (options.invalid) {
    control.setAttribute('aria-invalid', 'true');
  } else {
    control.removeAttribute('aria-invalid');
  }
}
