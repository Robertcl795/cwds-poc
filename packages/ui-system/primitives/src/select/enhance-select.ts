import { detectSelectFeatureSupport, shouldEnhanceNativeSelect } from '../shared-field';

export type EnhanceNativeSelectOptions = {
  enabled?: boolean;
  support?: ReturnType<typeof detectSelectFeatureSupport>;
};

const isGlobalEnhancementDisabled = (): boolean => {
  const globalWithFlag = globalThis as typeof globalThis & {
    __CV_DISABLE_SELECT_ENHANCEMENT__?: boolean;
  };

  return globalWithFlag.__CV_DISABLE_SELECT_ENHANCEMENT__ === true;
};

export function enhanceNativeSelect(select: HTMLSelectElement, options: EnhanceNativeSelectOptions = {}): boolean {
  const enabled = options.enabled ?? true;

  if (!enabled || isGlobalEnhancementDisabled()) {
    select.dataset.enhanced = 'false';
    return false;
  }

  const support = options.support ?? detectSelectFeatureSupport();
  const supported = shouldEnhanceNativeSelect(support);
  select.dataset.enhanced = supported ? 'true' : 'false';

  return supported;
}
