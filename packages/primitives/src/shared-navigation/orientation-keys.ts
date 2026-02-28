export type NavigationOrientation = 'horizontal' | 'vertical';

export type NavigationIntent = 'next' | 'prev' | 'first' | 'last' | null;

export const resolveOrientationNavigationIntent = (
  key: string,
  orientation: NavigationOrientation
): NavigationIntent => {
  if (key === 'Home') {
    return 'first';
  }

  if (key === 'End') {
    return 'last';
  }

  if (orientation === 'horizontal') {
    if (key === 'ArrowRight') {
      return 'next';
    }

    if (key === 'ArrowLeft') {
      return 'prev';
    }

    return null;
  }

  if (key === 'ArrowDown') {
    return 'next';
  }

  if (key === 'ArrowUp') {
    return 'prev';
  }

  return null;
};
