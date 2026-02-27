import type { ElevationLevel } from '../types';

const ELEVATION_LEVELS: readonly ElevationLevel[] = [0, 1, 2, 3, 4, 5];

export function setElevation(element: HTMLElement, level: ElevationLevel): void {
  if (!ELEVATION_LEVELS.includes(level)) {
    throw new Error(`Unsupported elevation level: ${level}`);
  }

  element.dataset.cvElevation = String(level);
}
