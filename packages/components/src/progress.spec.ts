import { describe, expect, it } from 'vitest';

import { createPrimitiveProgress } from './progress/create-progress';

describe('progress primitive', () => {
  it('clamps determinate value to max', () => {
    const progress = createPrimitiveProgress({
      value: 200,
      max: 100,
      ariaLabel: 'Sync progress'
    });

    expect(progress.value).toBe(100);
    expect(progress.max).toBe(100);
    expect(progress.dataset.state).toBe('determinate');
    expect(progress.getAttribute('aria-label')).toBe('Sync progress');
  });

  it('uses native indeterminate state', () => {
    const progress = createPrimitiveProgress({
      indeterminate: true
    });

    expect(progress.hasAttribute('value')).toBe(false);
    expect(progress.dataset.state).toBe('indeterminate');
  });
});
