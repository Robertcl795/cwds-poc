import {
  createFilterStrategy,
  createFormValueAdapter,
  type FilterOption
} from '@ds/core';

import { comboboxStyles } from './cv-combobox.styles';
import { ComboboxController } from './combobox.controller';
import { reflectStringAttribute, upgradeProperties } from '../internal/custom-element';

export interface ComboboxOption extends FilterOption {
  id?: string;
}

type ComboboxState = {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  noResultsText: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  open: boolean;
  minChars: number;
  options: ComboboxOption[];
};

let comboboxSequence = 0;
const nextComboboxId = (): string => `cv-combobox-${(comboboxSequence += 1)}`;

const createDefaultState = (): ComboboxState => ({
  name: '',
  value: '',
  label: '',
  placeholder: '',
  noResultsText: 'No results',
  disabled: false,
  readonly: false,
  required: false,
  open: false,
  minChars: 0,
  options: []
});

export class CvCombobox extends HTMLElement {
  static formAssociated = true;

  private state = createDefaultState();
  private readonly hostId = nextComboboxId();
  private readonly listboxId = `${this.hostId}-listbox`;
  private readonly formAdapter = createFormValueAdapter(this);
  private readonly filter = createFilterStrategy({ mode: 'contains' });
  private readonly controller = new ComboboxController(this, this.formAdapter, this.filter, this.listboxId);

  get name(): string {
    return this.state.name;
  }

  set name(value: string) {
    this.state.name = value;
    reflectStringAttribute(this, 'name', value);
    this.formAdapter.setName(value);
  }

  get value(): string {
    return this.state.value;
  }

  set value(value: string) {
    this.state.value = value;
    this.formAdapter.setValue(value);
    this.controller.syncInputFromValue();
    this.controller.render();
  }

  get label(): string {
    return this.state.label;
  }

  set label(value: string) {
    this.state.label = value;
    this.controller.render();
  }

  get placeholder(): string {
    return this.state.placeholder;
  }

  set placeholder(value: string) {
    this.state.placeholder = value;
    this.controller.render();
  }

  get noResultsText(): string {
    return this.state.noResultsText;
  }

  set noResultsText(value: string) {
    this.state.noResultsText = value;
    this.controller.render();
  }

  get disabled(): boolean {
    return this.state.disabled;
  }

  set disabled(value: boolean) {
    this.state.disabled = value;
    this.toggleAttribute('disabled', value);
    this.formAdapter.setDisabled(value);

    if (value) {
      this.controller.closePopup();
      return;
    }

    this.controller.render();
  }

  get readonly(): boolean {
    return this.state.readonly;
  }

  set readonly(value: boolean) {
    this.state.readonly = value;
    this.toggleAttribute('readonly', value);
    this.controller.render();
  }

  get required(): boolean {
    return this.state.required;
  }

  set required(value: boolean) {
    this.state.required = value;
    this.toggleAttribute('required', value);
    this.formAdapter.setRequired(value);
    this.controller.render();
  }

  get open(): boolean {
    return this.state.open;
  }

  set open(value: boolean) {
    this.state.open = value;
    this.toggleAttribute('open', value);
    this.controller.syncExpanded(value);
    this.controller.render();
  }

  get minChars(): number {
    return this.state.minChars;
  }

  set minChars(value: number) {
    this.state.minChars = Number.isFinite(value) ? Math.max(0, value) : 0;
    this.controller.render();
  }

  get options(): ComboboxOption[] {
    return this.state.options;
  }

  set options(value: ComboboxOption[]) {
    this.state.options = Array.isArray(value) ? value : [];
    this.controller.syncInputFromValue();
    this.controller.render();
  }

  connectedCallback(): void {
    upgradeProperties(this, [
      'name',
      'value',
      'label',
      'placeholder',
      'noResultsText',
      'disabled',
      'readonly',
      'required',
      'open',
      'minChars',
      'options'
    ]);
    this.controller.connect(comboboxStyles);
  }

  disconnectedCallback(): void {
    this.controller.disconnect();
  }
}

export const defineCvCombobox = (): void => {
  if (!customElements.get('cv-combobox')) {
    customElements.define('cv-combobox', CvCombobox);
  }
};
