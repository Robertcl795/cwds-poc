export type PrimitiveProgressOptions = {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  tone?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export function createPrimitiveProgress(options: PrimitiveProgressOptions = {}): HTMLProgressElement {
  const progress = document.createElement('progress');
  progress.className = 'cv-progress';

  const max = options.max ?? 100;
  progress.max = max;
  progress.dataset.tone = options.tone ?? 'primary';
  progress.dataset.size = options.size ?? 'md';

  if (options.ariaLabel) {
    progress.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.ariaLabelledBy) {
    progress.setAttribute('aria-labelledby', options.ariaLabelledBy);
  }

  if (options.indeterminate) {
    progress.removeAttribute('value');
    progress.dataset.state = 'indeterminate';
  } else {
    progress.value = clamp(options.value ?? 0, 0, max);
    progress.dataset.state = 'determinate';
  }

  return progress;
}
