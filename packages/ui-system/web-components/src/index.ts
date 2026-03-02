export * from './combobox';
export * from './advanced-select';

import { defineCvAdvancedSelect } from './advanced-select';
import { defineCvCombobox } from './combobox';

export const defineCvWebComponents = (): void => {
  defineCvCombobox();
  defineCvAdvancedSelect();
};

/**
 * @deprecated Use `defineCvWebComponents` instead.
 */
export const definePhase4WebComponents = defineCvWebComponents;
