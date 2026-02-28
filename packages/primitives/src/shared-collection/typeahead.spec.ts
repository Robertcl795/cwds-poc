import { describe, expect, it, vi } from 'vitest';

import { createTypeaheadMatcher } from './typeahead';

describe('createTypeaheadMatcher', () => {
  it('appends normalized input and clears after timeout', () => {
    vi.useFakeTimers();

    const matcher = createTypeaheadMatcher({ timeoutMs: 300 });

    expect(matcher.push('A')).toBe('a');
    expect(matcher.push('B')).toBe('ab');

    vi.advanceTimersByTime(299);
    expect(matcher.current()).toBe('ab');

    vi.advanceTimersByTime(1);
    expect(matcher.current()).toBe('');

    vi.useRealTimers();
  });

  it('supports explicit reset', () => {
    const matcher = createTypeaheadMatcher();
    matcher.push('x');
    matcher.reset();
    expect(matcher.current()).toBe('');
  });
});
