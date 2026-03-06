export type EnvironmentFlags = {
  reducedMotion: boolean;
  forcedColors: boolean;
};

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FORCED_COLORS_QUERY = '(forced-colors: active)';

type MediaQueryListLike = Pick<MediaQueryList, 'matches' | 'addEventListener' | 'removeEventListener'>;

const createMediaQueryList = (win: Window, query: string): MediaQueryListLike => {
  if (typeof win.matchMedia === 'function') {
    return win.matchMedia(query);
  }

  return {
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined
  };
};

export function getEnvironmentFlags(win: Window = window): EnvironmentFlags {
  const reduced = createMediaQueryList(win, REDUCED_MOTION_QUERY);
  const forced = createMediaQueryList(win, FORCED_COLORS_QUERY);

  return {
    reducedMotion: reduced.matches,
    forcedColors: forced.matches
  };
}

export function onEnvironmentChange(
  callback: (flags: EnvironmentFlags) => void,
  win: Window = window
): () => void {
  const reduced = createMediaQueryList(win, REDUCED_MOTION_QUERY);
  const forced = createMediaQueryList(win, FORCED_COLORS_QUERY);

  const notify = () => callback(getEnvironmentFlags(win));

  reduced.addEventListener('change', notify);
  forced.addEventListener('change', notify);

  return () => {
    reduced.removeEventListener('change', notify);
    forced.removeEventListener('change', notify);
  };
}
