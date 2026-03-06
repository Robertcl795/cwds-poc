const normalizeIds = (values: Array<string | undefined | null>): string[] => {
  const set = new Set<string>();

  for (const value of values) {
    if (!value) {
      continue;
    }

    for (const token of value.split(/\s+/)) {
      const trimmed = token.trim();
      if (trimmed.length > 0) {
        set.add(trimmed);
      }
    }
  }

  return [...set];
};

export function applyDescribedBy(control: HTMLElement, ids: Array<string | undefined | null>): void {
  const normalized = normalizeIds(ids);

  if (normalized.length === 0) {
    control.removeAttribute('aria-describedby');
    return;
  }

  control.setAttribute('aria-describedby', normalized.join(' '));
}

export function applyInvalidState(control: HTMLElement, invalid: boolean): void {
  if (invalid) {
    control.setAttribute('aria-invalid', 'true');
  } else {
    control.removeAttribute('aria-invalid');
  }
}
