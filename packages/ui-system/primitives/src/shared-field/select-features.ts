export type SelectFeatureSupport = {
  baseSelect: boolean;
  picker: boolean;
  selectedContent: boolean;
  pickerIcon: boolean;
  checkmark: boolean;
  openPseudo: boolean;
  checkedPseudo: boolean;
};

const supportsSelector = (selector: string): boolean => {
  if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
    return false;
  }

  try {
    return CSS.supports(`selector(${selector})`);
  } catch {
    return false;
  }
};

export function detectSelectFeatureSupport(): SelectFeatureSupport {
  const supportsCss = typeof CSS !== 'undefined' && typeof CSS.supports === 'function';

  return {
    baseSelect: supportsCss ? CSS.supports('appearance: base-select') : false,
    picker: supportsSelector('select::picker(select)'),
    selectedContent: supportsSelector('selectedcontent'),
    pickerIcon: supportsSelector('select::picker-icon'),
    checkmark: supportsSelector('option::checkmark'),
    openPseudo: supportsSelector('select:open'),
    checkedPseudo: supportsSelector('option:checked')
  };
}

export function shouldEnhanceNativeSelect(support: SelectFeatureSupport): boolean {
  return support.baseSelect && support.picker;
}
