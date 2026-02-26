export interface ApiMapEntry {
  legacy: string;
  target: string;
  strategy: 'compatible' | 'shim' | 'manual';
  notes: string;
}

export const apiMap: ApiMapEntry[] = [
  {
    legacy: 'mwc-button',
    target: 'cv-button',
    strategy: 'shim',
    notes: 'Maps label/icon/raised to text, slot icon, and variant.'
  },
  {
    legacy: 'mwc-textfield',
    target: 'cv-form-field + input',
    strategy: 'shim',
    notes: 'Uses native input semantics and wrapper metadata for helper/error.'
  },
  {
    legacy: 'mwc-checkbox',
    target: 'cv-checkbox',
    strategy: 'compatible',
    notes: 'Mostly direct mapping with event name normalization.'
  },
  {
    legacy: 'mwc-dialog',
    target: 'cv-dialog',
    strategy: 'shim',
    notes: 'Open/close events preserved with compatibility detail payload.'
  }
];
