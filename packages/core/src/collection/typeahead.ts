export interface TypeaheadMatcherOptions {
  timeoutMs?: number;
  normalize?: (value: string) => string;
}

export interface TypeaheadMatcher {
  push: (input: string) => string;
  reset: () => void;
  current: () => string;
}

const defaultNormalize = (value: string): string => value.toLocaleLowerCase();

export const createTypeaheadMatcher = (options: TypeaheadMatcherOptions = {}): TypeaheadMatcher => {
  const timeoutMs = options.timeoutMs ?? 700;
  const normalize = options.normalize ?? defaultNormalize;

  let buffer = '';
  let clearTimer: number | null = null;

  const clearPendingTimer = (): void => {
    if (clearTimer === null) {
      return;
    }

    window.clearTimeout(clearTimer);
    clearTimer = null;
  };

  const scheduleReset = (): void => {
    clearPendingTimer();
    clearTimer = window.setTimeout(() => {
      buffer = '';
      clearTimer = null;
    }, timeoutMs);
  };

  return {
    push(input: string): string {
      buffer += normalize(input);
      scheduleReset();
      return buffer;
    },
    reset(): void {
      clearPendingTimer();
      buffer = '';
    },
    current(): string {
      return buffer;
    }
  };
};
