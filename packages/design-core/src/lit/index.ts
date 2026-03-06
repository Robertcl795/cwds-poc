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

export const tokenList = (...tokens: Array<string | false | null | undefined>): string | typeof nothing => {
  const resolved = tokens.filter((token): token is string => typeof token === 'string' && token.length > 0);
  return resolved.length > 0 ? resolved.join(' ') : nothing;
};
