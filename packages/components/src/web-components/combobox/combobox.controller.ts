import { linkPopup } from '@ds/core';
import type { FilterStrategy, FormValueAdapter, PopupLink } from '@ds/core';
import {
  boundaryHighlightedId,
  type ComboboxHost,
  ensureComboboxShadow,
  filterComboboxOptions,
  findOptionById,
  findOptionByValue,
  firstEnabledId,
  isPrintableCharacter,
  moveHighlightedId,
  normalizeOptions,
  optionIdFromTarget,
  renderListbox,
  type ComboboxElements,
  type NormalizedComboboxOption
} from './combobox.helpers';

export class ComboboxController {
  private popupLink: PopupLink | null = null;
  private removeResetListener: (() => void) | null = null;
  private removeOutsidePointerListener: (() => void) | null = null;
  private elements: ComboboxElements | null = null;
  private initialValue = '';
  private hasCapturedInitialValue = false;
  private inputValue = '';
  private highlightedId: string | null = null;

  constructor(
    private readonly host: ComboboxHost,
    private readonly formAdapter: FormValueAdapter,
    private readonly filter: FilterStrategy,
    private readonly listboxId: string
  ) {}

  connect(styles: string): void {
    this.ensureShadowDom(styles);

    if (!this.hasCapturedInitialValue) {
      this.initialValue = this.host.value;
      this.hasCapturedInitialValue = true;
    }

    this.removeResetListener = this.formAdapter.onFormReset(() => {
      this.host.value = this.initialValue;
      this.closePopup();
    });

    const onPointerDown = (event: PointerEvent): void => {
      if (!event.composedPath().includes(this.host)) {
        this.closePopup();
      }
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    this.removeOutsidePointerListener = () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
    };

    this.formAdapter.setName(this.host.name);
    this.formAdapter.setDisabled(this.host.disabled);
    this.formAdapter.setRequired(this.host.required);
    this.formAdapter.setValue(this.host.value);
    this.syncInputFromValue();
    this.render();
  }

  disconnect(): void {
    this.removeResetListener?.();
    this.removeResetListener = null;
    this.removeOutsidePointerListener?.();
    this.removeOutsidePointerListener = null;
    this.popupLink?.destroy();
    this.popupLink = null;
    this.formAdapter.dispose();
  }

  syncExpanded(open: boolean): void {
    this.popupLink?.syncExpanded(open);
  }

  syncInputFromValue(): void {
    const match = findOptionByValue(this.normalizedOptions, this.host.value);
    if (match) {
      this.inputValue = match.label;
      this.highlightedId = match.id;
      return;
    }

    if (this.host.value.length === 0) {
      this.inputValue = '';
      this.highlightedId = null;
    }
  }

  render(): void {
    if (!this.elements) {
      return;
    }

    const { field, input, label, listbox } = this.elements;

    label.hidden = this.host.label.trim().length === 0;
    label.textContent = this.host.label;
    field.dataset.open = this.host.open ? 'true' : 'false';
    input.disabled = this.host.disabled;
    input.placeholder = this.host.placeholder;
    input.readOnly = this.host.readonly;
    input.required = this.host.required;
    input.value = this.inputValue;
    input.setAttribute('aria-controls', this.listboxId);
    input.setAttribute('aria-expanded', this.host.open ? 'true' : 'false');

    if (this.host.open && this.highlightedId) {
      input.setAttribute('aria-activedescendant', this.highlightedId);
    } else {
      input.removeAttribute('aria-activedescendant');
    }

    renderListbox(listbox, this.filteredOptions, {
      open: this.host.open,
      highlightedId: this.highlightedId,
      noResultsText: this.host.noResultsText,
      value: this.host.value
    });
  }

  closePopup(): void {
    this.host.open = false;
  }

  private get normalizedOptions(): NormalizedComboboxOption[] {
    return normalizeOptions(this.host.options, this.listboxId);
  }

  private get filteredOptions(): NormalizedComboboxOption[] {
    return filterComboboxOptions(this.normalizedOptions, this.inputValue, this.host.minChars, this.filter);
  }

  private ensureShadowDom(styles: string): void {
    if (!this.elements) {
      this.elements = ensureComboboxShadow(this.host, styles, this.listboxId);
      this.elements.input.addEventListener('input', this.onInput);
      this.elements.input.addEventListener('keydown', this.onKeyDown);
      this.elements.input.addEventListener('focus', this.onFocus);
      this.elements.listbox.addEventListener('mousedown', this.onOptionMouseDown);
      this.elements.listbox.addEventListener('click', this.onOptionClick);
    }

    if (!this.popupLink) {
      this.popupLink = linkPopup(this.elements.input, this.elements.listbox, 'listbox');
    }
  }

  private openPopup(): void {
    if (this.host.disabled) {
      return;
    }

    if (!this.highlightedId) {
      this.highlightedId = firstEnabledId(this.filteredOptions);
    }

    this.host.open = true;
  }

  private moveHighlight(delta: number): void {
    this.highlightedId = moveHighlightedId(this.filteredOptions, this.highlightedId, delta);
    this.render();
  }

  private highlightBoundary(toEnd: boolean): void {
    this.highlightedId = boundaryHighlightedId(this.filteredOptions, toEnd);
    this.render();
  }

  private commitHighlighted(source: 'keyboard' | 'pointer' | 'programmatic'): void {
    const option = findOptionById(this.filteredOptions, this.highlightedId);
    if (!option || option.disabled) {
      return;
    }

    this.host.value = option.value;
    this.host.dispatchEvent(new Event('change', { bubbles: true }));
    this.host.dispatchEvent(
      new CustomEvent('cv-value-commit', {
        bubbles: true,
        composed: true,
        detail: {
          value: option.value,
          source
        }
      })
    );

    this.closePopup();
  }

  private readonly onInput = (event: Event): void => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    this.inputValue = event.target.value;

    if (this.inputValue.trim().length < this.host.minChars) {
      this.highlightedId = null;
      this.closePopup();
      return;
    }

    this.highlightedId = firstEnabledId(this.filteredOptions);
    this.host.open = true;
    this.host.dispatchEvent(new Event('input', { bubbles: true }));
  };

  private readonly onFocus = (): void => {
    if (!this.host.readonly && this.inputValue.trim().length >= this.host.minChars) {
      this.openPopup();
    }
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (this.host.readonly && isPrintableCharacter(event)) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Tab') {
      this.closePopup();
      return;
    }

    if (event.key === 'Escape') {
      if (this.host.open) {
        event.preventDefault();
      }

      this.closePopup();
      this.syncInputFromValue();
      return;
    }

    if (event.key === 'Enter' && this.host.open) {
      event.preventDefault();
      this.commitHighlighted('keyboard');
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.host.open) {
        this.moveHighlight(1);
      } else {
        this.openPopup();
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (this.host.open) {
        this.moveHighlight(-1);
      } else {
        this.openPopup();
        this.highlightBoundary(true);
      }

      return;
    }

    if (this.host.open && (event.key === 'Home' || event.key === 'End')) {
      event.preventDefault();
      this.highlightBoundary(event.key === 'End');
    }
  };

  private readonly onOptionMouseDown = (event: MouseEvent): void => {
    if (optionIdFromTarget(event.target)) {
      event.preventDefault();
    }
  };

  private readonly onOptionClick = (event: MouseEvent): void => {
    const option = findOptionById(this.filteredOptions, optionIdFromTarget(event.target));
    if (!option || option.disabled) {
      return;
    }

    this.highlightedId = option.id;
    this.commitHighlighted('pointer');
  };
}
