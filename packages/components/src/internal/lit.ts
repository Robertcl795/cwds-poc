import { nothing } from 'lit';

export const ariaBoolean = (value: boolean | undefined): 'true' | 'false' | typeof nothing => {
  if (value === undefined) {
    return nothing;
  }

  return value ? 'true' : 'false';
};

export const definedAttribute = <T extends string | number>(value: T | null | undefined): T | typeof nothing => {
  if (value === null || value === undefined || value === '') {
    return nothing;
  }

  return value;
};
