import { comboboxStyles } from './cv-combobox.styles';
import { createWebActiveDescendantController } from '../shared/active-descendant';
import { createFilterStrategy, type FilterOption } from '../shared/filtering';
import { createFormValueAdapter } from '../shared/form-associated';
import { linkPopup, type PopupLink } from '../shared/popup-linkage';
import { createSelectionModel } from '../shared/selection-model';

export interface ComboboxOption extends FilterOption {
  id?: string;
}

let comboboxSequence = 0;

const nextComboboxId = (): string => {
  comboboxSequence += 1;
  return `cv-combobox-${comboboxSequence}`;
};

const isPrintableCharacter = (event: KeyboardEvent): boolean =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

const addPart = (element: HTMLElement, part: string): void => {
  const target = element as HTMLElement & { part?: { add?: (token: string) => void } };
  if (target.part && typeof target.part.add === 'function') {
    target.part.add(part);
    return;
  }

  const existing = element.getAttribute('part');
  element.setAttribute('part', existing ? `${existing} ${part}` : part);
};

export class CvCombobox extends HTMLElement {
  static formAssociated = true;

  private _name = '';
  private _value = '';
  private _label = '';
  private _placeholder = '';
  private _noResultsText = 'No results';
  private _disabled = false;
  private _readonly = false;
  private _required = false;
  private _open = false;
  private _minChars = 0;
  private _options: ComboboxOption[] = [];

  private readonly hostId = nextComboboxId();
  private readonly listboxId = `${this.hostId}-listbox`;
  private readonly formAdapter = createFormValueAdapter(this);
  private readonly filter = createFilterStrategy({ mode: 'contains' });

  private popupLink: PopupLink | null = null;
  private activeDescendantController: ReturnType<typeof createWebActiveDescendantController> | null = null;
  private selectionModel = createSelectionModel({ getOptions: () => this.computedOptions, initialValue: '' });

  private removeResetListener: (() => void) | null = null;
  private removeOutsidePointerListener: (() => void) | null = null;
  private initialValue = '';
  private hasCapturedInitialValue = false;

  private inputValue = '';
  private highlightedId: string | null = null;

  private labelElement: HTMLLabelElement | null = null;
  private fieldElement: HTMLDivElement | null = null;
  private inputElement: HTMLInputElement | null = null;
  private listboxElement: HTMLUListElement | null = null;

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
    this.selectionModel.commitByValue(value);
    this.syncInputFromValue();
    this.render();
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
    this.render();
  }

  get placeholder(): string {
    return this._placeholder;
  }

  set placeholder(value: string) {
    this._placeholder = value;
    this.render();
  }

  get noResultsText(): string {
    return this._noResultsText;
  }

  set noResultsText(value: string) {
    this._noResultsText = value;
    this.render();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
    this.toggleAttribute('disabled', value);
    this.formAdapter.setDisabled(value);

    if (value) {
      this.closePopup();
    }

    this.render();
  }

  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = value;
    this.toggleAttribute('readonly', value);
    this.render();
  }

  get required(): boolean {
    return this._required;
  }

  set required(value: boolean) {
    this._required = value;
    this.toggleAttribute('required', value);
    this.formAdapter.setRequired(value);
    this.render();
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
    this.toggleAttribute('open', value);
    this.popupLink?.syncExpanded(value);
    this.render();
  }

  get minChars(): number {
    return this._minChars;
  }

  set minChars(value: number) {
    this._minChars = Number.isFinite(value) ? value : 0;
    this.render();
  }

  get options(): ComboboxOption[] {
    return this._options;
  }

  set options(value: ComboboxOption[]) {
    this._options = Array.isArray(value) ? value : [];
    this.selectionModel = createSelectionModel({
      getOptions: () => this.computedOptions,
      initialValue: this.value
    });
    this.selectionModel.commitByValue(this.value);
    this.syncInputFromValue();
    this.render();
  }

  connectedCallback(): void {
    this.upgradeProperty('name');
    this.upgradeProperty('value');
    this.upgradeProperty('label');
    this.upgradeProperty('placeholder');
    this.upgradeProperty('noResultsText');
    this.upgradeProperty('disabled');
    this.upgradeProperty('readonly');
    this.upgradeProperty('required');
    this.upgradeProperty('open');
    this.upgradeProperty('minChars');
    this.upgradeProperty('options');

    this.ensureShadowDom();

    if (!this.hasCapturedInitialValue) {
      this.initialValue = this.value;
      this.hasCapturedInitialValue = true;
    }

    this.removeResetListener = this.formAdapter.onFormReset(() => {
      this.value = this.initialValue;
      this.closePopup();
    });

    const onPointerDown = (event: PointerEvent): void => {
      const path = event.composedPath();
      if (path.includes(this)) {
        return;
      }

      this.closePopup();
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    this.removeOutsidePointerListener = () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };

    this.formAdapter.setName(this.name);
    this.formAdapter.setDisabled(this.disabled);
    this.formAdapter.setRequired(this.required);
    this.formAdapter.setValue(this.value);

    this.syncInputFromValue();
    this.render();
  }

  disconnectedCallback(): void {
    this.removeResetListener?.();
    this.removeResetListener = null;
    this.removeOutsidePointerListener?.();
    this.removeOutsidePointerListener = null;
    this.popupLink?.destroy();
    this.popupLink = null;
    this.formAdapter.dispose();
  }

  private upgradeProperty<K extends keyof CvCombobox>(property: K): void {
    if (!Object.prototype.hasOwnProperty.call(this, property)) {
      return;
    }

    const value = this[property];
    delete (this as CvCombobox & Record<string, unknown>)[property as string];
    this[property] = value;
  }

  private ensureShadowDom(): void {
    if (this.shadowRoot) {
      return;
    }

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>${comboboxStyles}</style>
      <label class="label" part="label"></label>
      <div class="field" part="field" data-open="false">
        <input part="input" type="text" role="combobox" aria-autocomplete="list" />
      </div>
      <ul class="popup" part="popup" role="listbox"></ul>
    `;

    this.labelElement = shadow.querySelector('label.label');
    this.fieldElement = shadow.querySelector('div.field');
    this.inputElement = shadow.querySelector('input[part="input"]');
    this.listboxElement = shadow.querySelector('ul.popup');

    if (!this.inputElement || !this.listboxElement) {
      throw new Error('Combobox shadow root missing required elements');
    }

    this.listboxElement.id = this.listboxId;
    this.popupLink = linkPopup(this.inputElement, this.listboxElement, 'listbox');

    this.activeDescendantController = createWebActiveDescendantController(
      this.inputElement,
      this.listboxElement,
      () => Array.from(this.listboxElement?.querySelectorAll<HTMLElement>('[data-option-id]') ?? [])
    );

    this.inputElement.addEventListener('input', this.onInput);
    this.inputElement.addEventListener('keydown', this.onKeyDown);
    this.inputElement.addEventListener('focus', this.onFocus);
  }

  private get computedOptions(): Array<ComboboxOption & { id: string }> {
    return this.options.map((option, index) => ({
      ...option,
      id: option.id ?? `${this.listboxId}-option-${index + 1}`
    }));
  }

  private get filteredOptions(): Array<ComboboxOption & { id: string }> {
    if (this.inputValue.trim().length < this.minChars) {
      return [];
    }

    return this.filter.filter(this.computedOptions, this.inputValue) as Array<ComboboxOption & { id: string }>;
  }

  private findByValue(value: string): (ComboboxOption & { id: string }) | undefined {
    return this.computedOptions.find((option) => option.value === value);
  }

  private syncInputFromValue(): void {
    const match = this.findByValue(this.value);
    if (match) {
      this.inputValue = match.label;
      this.highlightedId = match.id;
      return;
    }

    if (this.value.length === 0) {
      this.inputValue = '';
      this.highlightedId = null;
    }
  }

  private openPopup(): void {
    if (this.disabled) {
      return;
    }

    this.open = true;

    if (!this.highlightedId) {
      const firstEnabled = this.filteredOptions.find((option) => !option.disabled);
      this.highlightedId = firstEnabled?.id ?? null;
    }

    this.render();
  }

  private closePopup(): void {
    this.open = false;
    this.render();
  }

  private moveHighlight(delta: number): void {
    const enabled = this.filteredOptions.filter((option) => !option.disabled);
    if (enabled.length === 0) {
      this.highlightedId = null;
      this.render();
      return;
    }

    const currentIndex = this.highlightedId ? enabled.findIndex((option) => option.id === this.highlightedId) : -1;
    const nextIndex = ((currentIndex + delta) % enabled.length + enabled.length) % enabled.length;
    this.highlightedId = enabled[nextIndex]?.id ?? null;
    this.render();
  }

  private highlightBoundary(toEnd: boolean): void {
    const enabled = this.filteredOptions.filter((option) => !option.disabled);
    if (enabled.length === 0) {
      this.highlightedId = null;
      this.render();
      return;
    }

    this.highlightedId = enabled[toEnd ? enabled.length - 1 : 0]?.id ?? null;
    this.render();
  }

  private commitHighlighted(source: 'keyboard' | 'pointer' | 'programmatic'): void {
    if (!this.highlightedId) {
      return;
    }

    const option = this.filteredOptions.find((candidate) => candidate.id === this.highlightedId);
    if (!option || option.disabled) {
      return;
    }

    this._value = option.value;
    this.formAdapter.setValue(this._value);
    this.inputValue = option.label;
    this.selectionModel.commitById(option.id);

    this.dispatchEvent(new Event('change', { bubbles: true }));
    this.dispatchEvent(
      new CustomEvent('cv-value-commit', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value,
          source
        }
      })
    );

    this.closePopup();
  }

  private onInput = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.inputValue = target.value;

    if (this.inputValue.trim().length < this.minChars) {
      this.highlightedId = null;
      this.closePopup();
      return;
    }

    this.openPopup();
    const firstEnabled = this.filteredOptions.find((option) => !option.disabled);
    this.highlightedId = firstEnabled?.id ?? null;

    this.dispatchEvent(new Event('input', { bubbles: true }));
    this.render();
  };

  private onFocus = (): void => {
    if (this.readonly) {
      return;
    }

    if (this.inputValue.trim().length < this.minChars) {
      return;
    }

    this.openPopup();
  };

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!this.open) {
        this.openPopup();
        return;
      }

      this.moveHighlight(1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open) {
        this.openPopup();
        this.highlightBoundary(true);
        return;
      }

      this.moveHighlight(-1);
      return;
    }

    if (event.key === 'Home' && this.open) {
      event.preventDefault();
      this.highlightBoundary(false);
      return;
    }

    if (event.key === 'End' && this.open) {
      event.preventDefault();
      this.highlightBoundary(true);
      return;
    }

    if (event.key === 'Enter' && this.open) {
      event.preventDefault();
      this.commitHighlighted('keyboard');
      return;
    }

    if (event.key === 'Escape') {
      if (this.open) {
        event.preventDefault();
      }

      this.closePopup();
      this.syncInputFromValue();
      return;
    }

    if (event.key === 'Tab') {
      this.closePopup();
      return;
    }

    if (this.readonly && isPrintableCharacter(event)) {
      event.preventDefault();
    }
  };

  private onOptionMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  private onOptionClick = (id: string): void => {
    this.highlightedId = id;
    this.commitHighlighted('pointer');
  };

  private render(): void {
    if (!this.shadowRoot || !this.inputElement || !this.listboxElement || !this.labelElement || !this.fieldElement) {
      return;
    }

    this.labelElement.textContent = this.label;
    this.labelElement.hidden = this.label.trim().length === 0;

    this.fieldElement.dataset.open = this.open ? 'true' : 'false';

    this.inputElement.placeholder = this.placeholder;
    this.inputElement.disabled = this.disabled;
    this.inputElement.readOnly = this.readonly;
    this.inputElement.required = this.required;
    this.inputElement.value = this.inputValue;
    this.inputElement.setAttribute('aria-controls', this.listboxId);
    this.inputElement.setAttribute('aria-expanded', this.open ? 'true' : 'false');

    const filtered = this.filteredOptions;

    this.listboxElement.hidden = !this.open;
    this.listboxElement.replaceChildren();

    if (filtered.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'empty';
      addPart(empty, 'empty');
      empty.textContent = this.noResultsText;
      this.listboxElement.append(empty);
    } else {
      for (const option of filtered) {
        const item = document.createElement('li');
        item.id = option.id;
        item.className = 'option';
        addPart(item, 'option');
        item.dataset.optionId = option.id;
        item.dataset.active = this.highlightedId === option.id ? 'true' : 'false';
        item.dataset.selected = this.value === option.value ? 'true' : 'false';
        item.dataset.disabled = option.disabled ? 'true' : 'false';
        item.role = 'option';
        item.setAttribute('aria-selected', this.value === option.value ? 'true' : 'false');
        item.setAttribute('aria-disabled', option.disabled ? 'true' : 'false');
        item.textContent = option.label;

        item.addEventListener('mousedown', this.onOptionMouseDown);
        item.addEventListener('click', () => {
          if (option.disabled) {
            return;
          }

          this.onOptionClick(option.id);
        });

        this.listboxElement.append(item);
      }
    }

    this.activeDescendantController?.setActive(this.highlightedId);
  }
}

export const defineCvCombobox = (): void => {
  if (!customElements.get('cv-combobox')) {
    customElements.define('cv-combobox', CvCombobox);
  }
};
