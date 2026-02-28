export type FeatureFlags = {
  focusVisible: boolean;
  overflowClip: boolean;
  cssHas: boolean;
  cssScope: boolean;
  selectorPart: boolean;
};

type CssSupports = {
  supports: (condition: string) => boolean;
};

const resolveCssSupports = (win: Window): CssSupports | null => {
  const maybeCss = (win as Window & { CSS?: CssSupports }).CSS ?? (globalThis as { CSS?: CssSupports }).CSS;
  if (!maybeCss || typeof maybeCss.supports !== 'function') {
    return null;
  }

  return maybeCss;
};

const supportsSelector = (css: CssSupports, selector: string): boolean => {
  if (typeof css.supports !== 'function') {
    return false;
  }

  try {
    return css.supports(`selector(${selector})`);
  } catch {
    return false;
  }
};

export function detectFeatures(win: Window = window): FeatureFlags {
  const css = resolveCssSupports(win);

  if (!css) {
    return {
      focusVisible: false,
      overflowClip: false,
      cssHas: false,
      cssScope: false,
      selectorPart: false
    };
  }

  return {
    focusVisible: supportsSelector(css, ':focus-visible'),
    overflowClip: css.supports('overflow: clip'),
    cssHas: supportsSelector(css, ':has(*)'),
    cssScope: supportsSelector(css, ':scope'),
    selectorPart: supportsSelector(css, '::part(label)')
  };
}
