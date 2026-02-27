export type DisabledStateOptions = {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  ariaDisabled?: boolean | undefined;
};

export type ResolvedDisabledState = {
  native: boolean;
  aria: boolean;
};

export function resolveDisabledState(options: DisabledStateOptions = {}): ResolvedDisabledState {
  const native = options.disabled === true || options.loading === true;
  const aria = native || options.ariaDisabled === true;

  return { native, aria };
}

export function writeDisabledState(host: HTMLElement, state: ResolvedDisabledState): void {
  host.dataset.disabled = state.native ? 'true' : 'false';
  host.setAttribute('aria-disabled', state.aria ? 'true' : 'false');
}
