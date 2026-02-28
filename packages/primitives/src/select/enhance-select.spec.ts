import { describe, expect, it } from 'vitest';

import { enhanceNativeSelect } from './enhance-select';

describe('enhanceNativeSelect', () => {
  it('marks select as enhanced when support and flag allow it', () => {
    const select = document.createElement('select');

    const enhanced = enhanceNativeSelect(select, {
      enabled: true,
      support: {
        baseSelect: true,
        picker: true,
        selectedContent: false,
        pickerIcon: true,
        checkmark: false,
        openPseudo: true,
        checkedPseudo: true
      }
    });

    expect(enhanced).toBe(true);
    expect(select.dataset.enhanced).toBe('true');
  });

  it('keeps select baseline when disabled', () => {
    const select = document.createElement('select');

    const enhanced = enhanceNativeSelect(select, { enabled: false });

    expect(enhanced).toBe(false);
    expect(select.dataset.enhanced).toBe('false');
  });

  it('respects global enhancement kill switch', () => {
    const select = document.createElement('select');
    const withFlag = globalThis as typeof globalThis & { __CV_DISABLE_SELECT_ENHANCEMENT__?: boolean };
    withFlag.__CV_DISABLE_SELECT_ENHANCEMENT__ = true;

    const enhanced = enhanceNativeSelect(select, {
      enabled: true,
      support: {
        baseSelect: true,
        picker: true,
        selectedContent: true,
        pickerIcon: true,
        checkmark: true,
        openPseudo: true,
        checkedPseudo: true
      }
    });

    expect(enhanced).toBe(false);
    expect(select.dataset.enhanced).toBe('false');

    delete withFlag.__CV_DISABLE_SELECT_ENHANCEMENT__;
  });
});
