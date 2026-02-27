import { describe, expect, it, vi } from 'vitest';

import { detectSelectFeatureSupport, shouldEnhanceNativeSelect } from './select-features';

describe('select feature support detection', () => {
  it('returns false when CSS.supports is unavailable', () => {
    const originalCss = globalThis.CSS;
    vi.stubGlobal('CSS', undefined);

    expect(detectSelectFeatureSupport()).toEqual({
      baseSelect: false,
      picker: false,
      selectedContent: false,
      pickerIcon: false,
      checkmark: false,
      openPseudo: false,
      checkedPseudo: false
    });

    vi.stubGlobal('CSS', originalCss);
  });

  it('enables enhancement when base-select and picker selectors are supported', () => {
    const support = {
      baseSelect: true,
      picker: true,
      selectedContent: false,
      pickerIcon: true,
      checkmark: false,
      openPseudo: true,
      checkedPseudo: true
    };

    expect(shouldEnhanceNativeSelect(support)).toBe(true);
  });
});
