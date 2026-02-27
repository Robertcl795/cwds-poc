import { afterEach, describe, expect, it } from 'vitest';

import { clearIconRegistry, createIconNode, registerIcons } from './icon-registry';

afterEach(() => {
  clearIconRegistry();
});

describe('icon registry', () => {
  it('registers and creates trusted icons', () => {
    registerIcons({
      check: {
        viewBox: '0 0 24 24',
        paths: ['M4 12l5 5 11-11']
      }
    });

    const icon = createIconNode('check');
    expect(icon.tagName).toBe('svg');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('rejects invalid names', () => {
    expect(() =>
      registerIcons({
        '../bad': {
          viewBox: '0 0 24 24',
          paths: ['M0 0']
        }
      })
    ).toThrowError();
  });
});
