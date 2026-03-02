import { advancedSelectStyles } from './cv-advanced-select.styles';
import { type ComboboxOption, defineCvCombobox } from '../combobox';
import { createFormValueAdapter } from '../shared/form-associated';

export class CvAdvancedSelect extends HTMLElement {
  static formAssociated = true;

  private _name = '';
  private _value = '';
  private _label = '';
  private _placeholder = '';
  private _noResultsText = 'No matches';
  private _disabled = false;
  private _required = false;
  private _searchable = true;
  private _options: ComboboxOption[] = [];

  private readonly formAdapter = createFormValueAdapter(this);
  private removeResetListener: (() => void) | null = null;
  private initialValue = '';
  private hasCapturedInitialValue = false;

  private innerCombobox: (HTMLElement & {
    name: string;
    value: string;
    label: string;
    placeholder: string;
    noResultsText: string;
    disabled: boolean;
    required: boolean;
    readonly: boolean;
    options: ComboboxOption[];
  }) | null = null;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.formAdapter.setName(value);
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this.formAdapter.setValue(value);

    if (this.innerCombobox) {
      this.innerCombobox.value = value;
    }
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
    this.syncInnerCombobox();
  }

  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.syncInnerCombobox();
  }

  get noResultsText(): string {
    return this._noResultsText;
  }

  set noResultsText(value: string) {
    this._noResultsText = value;
    this.syncInnerCombobox();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    this.toggleAttribute('disabled', value);
    this.formAdapter.setDisabled(value);
    this.syncInnerCombobox();
  }

  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = value;
    this.toggleAttribute('required', value);
    this.formAdapter.setRequired(value);
    this.syncInnerCombobox();
  }

  get searchable(): boolean {
    return this._searchable;
  }

  set searchable(value: boolean) {
    this._searchable = value;
    this.toggleAttribute('searchable', value);
    this.syncInnerCombobox();
  }

  get options(): ComboboxOption[] {
    return this._options;
  }

  set options(value: ComboboxOption[]) {
    this._options = Array.isArray(value) ? value : [];
    this.syncInnerCombobox();
  }

  connectedCallback(): void {
    this.upgradeProperty('name');
    this.upgradeProperty('value');
    this.upgradeProperty('label');
    this.upgradeProperty('placeholder');
    this.upgradeProperty('noResultsText');
    this.upgradeProperty('disabled');
    this.upgradeProperty('required');
    this.upgradeProperty('searchable');
    this.upgradeProperty('options');

    defineCvCombobox();
    this.ensureShadowDom();

    if (!this.hasCapturedInitialValue) {
      this.initialValue = this.value;
      this.hasCapturedInitialValue = true;
    }

    this.removeResetListener = this.formAdapter.onFormReset(() => {
      this.value = this.initialValue;
    });

    this.formAdapter.setName(this.name);
    this.formAdapter.setDisabled(this.disabled);
    this.formAdapter.setRequired(this.required);
    this.formAdapter.setValue(this.value);

    this.syncInnerCombobox();
  }

  disconnectedCallback(): void {
    this.removeResetListener?.();
    this.removeResetListener = null;
    this.formAdapter.dispose();
  }

  private upgradeProperty<K extends keyof CvAdvancedSelect>(property: K): void {
    if (!Object.prototype.hasOwnProperty.call(this, property)) {
      return;
    }

    const value = this[property];
    delete (this as CvAdvancedSelect & Record<string, unknown>)[property as string];
    this[property] = value;
  }

  private ensureShadowDom(): void {
    if (this.shadowRoot) {
      return;
    }

    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${advancedSelectStyles}</style><cv-combobox exportparts="label,field,input,popup,option,empty"></cv-combobox>`;

    this.innerCombobox = shadow.querySelector('cv-combobox') as CvAdvancedSelect['innerCombobox'];

    if (!this.innerCombobox) {
      throw new Error('Missing inner combobox');
    }

    this.innerCombobox.addEventListener('cv-value-commit', this.onInnerCommit);
  }

  private onInnerCommit = (event: Event): void => {
    const detail = event as CustomEvent<{ value: string; source: 'keyboard' | 'pointer' | 'programmatic' }>;
    if (!detail.detail) {
      return;
    }

    this._value = detail.detail.value;
    this.formAdapter.setValue(this._value);

    this.dispatchEvent(new Event('change', { bubbles: true }));
    this.dispatchEvent(
      new CustomEvent('cv-value-commit', {
        bubbles: true,
        composed: true,
        detail: {
          value: this._value,
          source: detail.detail.source
        }
      })
    );
  };

  private syncInnerCombobox(): void {
    if (!this.innerCombobox) {
      return;
    }

    this.innerCombobox.name = '';
    this.innerCombobox.value = this.value;
    this.innerCombobox.label = this.label;
    this.innerCombobox.placeholder = this.placeholder;
    this.innerCombobox.noResultsText = this.noResultsText;
    this.innerCombobox.disabled = this.disabled;
    this.innerCombobox.required = this.required;
    this.innerCombobox.readonly = !this.searchable;
    this.innerCombobox.options = this.options;
  }
}

export const defineCvAdvancedSelect = (): void => {
  if (!customElements.get('cv-advanced-select')) {
    customElements.define('cv-advanced-select', CvAdvancedSelect);
  }
};
