export type LoadingDensity = 'sm' | 'md' | 'lg';

export interface PrimitiveLoadingIndicatorOptions {
  density?: LoadingDensity;
  label?: string;
  muted?: boolean;
}

export const createPrimitiveLoadingIndicator = (
  options: PrimitiveLoadingIndicatorOptions = {}
): HTMLSpanElement => {
  const spinner = document.createElement('span');
  spinner.className = options.muted
    ? 'cv-loading-indicator cv-loading-indicator--muted'
    : 'cv-loading-indicator';
  spinner.dataset.density = options.density ?? 'md';
  spinner.setAttribute('role', 'status');
  spinner.setAttribute('aria-live', 'polite');
  spinner.setAttribute('aria-label', options.label ?? 'Loading');

  return spinner;
};
