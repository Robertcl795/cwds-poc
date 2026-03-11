import type { FilterOption, FilterStrategy } from '@ds/core';

import type { ComboboxOption } from './cv-combobox';

export interface ComboboxElements {
  label: HTMLLabelElement;
  field: HTMLDivElement;
  input: HTMLInputElement;
  listbox: HTMLUListElement;
}

export type NormalizedComboboxOption = ComboboxOption & { id: string };

export interface ComboboxHost extends HTMLElement {
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
}

const addPart = (element: HTMLElement, part: string): void => {
  const target = element as HTMLElement & { part?: { add?: (token: string) => void } };
  if (target.part?.add) {
    target.part.add(part);
    return;
  }

  const existing = element.getAttribute('part');
  element.setAttribute('part', existing ? `${existing} ${part}` : part);
};

export const isPrintableCharacter = (event: KeyboardEvent): boolean =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

export const ensureComboboxShadow = (
  host: HTMLElement,
  styles: string,
  listboxId: string
): ComboboxElements => {
  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });

  if (!shadow.querySelector('label.label')) {
    shadow.innerHTML = `
      <style>${styles}</style>
      <label class="label" part="label"></label>
      <div class="field" part="field" data-open="false">
        <input part="input" type="text" role="combobox" aria-autocomplete="list" />
      </div>
      <ul class="popup" part="popup" role="listbox"></ul>
    `;
  }

  const label = shadow.querySelector('label.label');
  const field = shadow.querySelector('div.field');
  const input = shadow.querySelector('input[part="input"]');
  const listbox = shadow.querySelector('ul.popup');

  if (
    !(label instanceof HTMLLabelElement) ||
    !(field instanceof HTMLDivElement) ||
    !(input instanceof HTMLInputElement) ||
    !(listbox instanceof HTMLUListElement)
  ) {
    throw new Error('Combobox shadow root missing required elements');
  }

  listbox.id = listboxId;
  return { label, field, input, listbox };
};

export const normalizeOptions = (
  options: ComboboxOption[],
  listboxId: string
): NormalizedComboboxOption[] =>
  options.map((option, index) => ({
    ...option,
    id: option.id ?? `${listboxId}-option-${index + 1}`
  }));

export const filterComboboxOptions = <T extends FilterOption>(
  options: T[],
  inputValue: string,
  minChars: number,
  filter: FilterStrategy
): T[] =>
  inputValue.trim().length < minChars ? [] : filter.filter(options, inputValue);

export const findOptionByValue = <T extends { value: string }>(options: T[], value: string): T | undefined =>
  options.find((option) => option.value === value);

export const findOptionById = <T extends { id: string }>(options: T[], id: string | null): T | undefined =>
  id ? options.find((option) => option.id === id) : undefined;

const enabledOptions = <T extends { disabled?: boolean }>(options: T[]): T[] =>
  options.filter((option) => !option.disabled);

export const firstEnabledId = <T extends { id: string; disabled?: boolean }>(options: T[]): string | null =>
  enabledOptions(options)[0]?.id ?? null;

export const boundaryHighlightedId = <T extends { id: string; disabled?: boolean }>(
  options: T[],
  toEnd: boolean
): string | null => {
  const enabled = enabledOptions(options);
  return enabled[toEnd ? enabled.length - 1 : 0]?.id ?? null;
};

export const moveHighlightedId = <T extends { id: string; disabled?: boolean }>(
  options: T[],
  currentId: string | null,
  delta: number
): string | null => {
  const enabled = enabledOptions(options);
  if (enabled.length === 0) {
    return null;
  }

  const currentIndex = currentId ? enabled.findIndex((option) => option.id === currentId) : delta > 0 ? -1 : enabled.length;
  return enabled[((currentIndex + delta) % enabled.length + enabled.length) % enabled.length]?.id ?? null;
};

export const optionIdFromTarget = (target: EventTarget | null): string | null =>
  target instanceof Element ? target.closest<HTMLElement>('[data-option-id]')?.dataset.optionId ?? null : null;

const createEmptyNode = (noResultsText: string): HTMLLIElement => {
  const empty = document.createElement('li');
  empty.className = 'empty';
  empty.textContent = noResultsText;
  addPart(empty, 'empty');
  return empty;
};

const createOptionNode = (
  option: NormalizedComboboxOption,
  highlightedId: string | null,
  value: string
): HTMLLIElement => {
  const item = document.createElement('li');
  item.id = option.id;
  item.className = 'option';
  item.role = 'option';
  item.textContent = option.label;
  item.dataset.optionId = option.id;
  item.dataset.active = highlightedId === option.id ? 'true' : 'false';
  item.dataset.disabled = option.disabled ? 'true' : 'false';
  item.dataset.selected = value === option.value ? 'true' : 'false';
  item.setAttribute('aria-disabled', option.disabled ? 'true' : 'false');
  item.setAttribute('aria-selected', value === option.value ? 'true' : 'false');
  addPart(item, 'option');
  return item;
};

export const renderListbox = (
  listbox: HTMLUListElement,
  options: NormalizedComboboxOption[],
  state: {
    open: boolean;
    highlightedId: string | null;
    noResultsText: string;
    value: string;
  }
): void => {
  listbox.hidden = !state.open;
  listbox.replaceChildren(
    ...(options.length === 0
      ? [createEmptyNode(state.noResultsText)]
      : options.map((option) => createOptionNode(option, state.highlightedId, state.value)))
  );
};
