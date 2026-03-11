import type { InputSource } from '@ds/core';
import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import { ariaBoolean, definedAttribute } from '../internal/lit';
import type {
  ContextMenuActionItem,
  ContextMenuControlType,
  ContextMenuItem
} from './context-menu.types';

export const INTERNAL_CONTEXT_MENU_TAG = 'cv-internal-context-menu';

type MenuItemState = {
  item: ContextMenuActionItem;
  control: ContextMenuControlType | null;
  checked: boolean;
  group: string | null;
};

export interface ContextMenuActionEventDetail {
  item: ContextMenuActionItem;
  source: InputSource;
}

const defaultGroup = '__default__';
const isActivationKey = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';
const isNavigationKey = (event: KeyboardEvent): boolean =>
  event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End';
const isActionItem = (item: ContextMenuItem): item is ContextMenuActionItem => item.type === undefined || item.type === 'item';
const toItemState = (item: ContextMenuActionItem): MenuItemState => ({
  item,
  control: item.control ?? null,
  checked: item.checked === true,
  group: item.group ?? defaultGroup
});

const resolveRole = (item: ContextMenuActionItem): 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' => {
  if (item.control === 'checkbox' || item.control === 'switch') {
    return 'menuitemcheckbox';
  }

  return item.control === 'radio' ? 'menuitemradio' : 'menuitem';
};

const formatControlIndicator = (control: ContextMenuControlType, checked: boolean): string => {
  if (control === 'radio') {
    return checked ? '●' : '○';
  }

  if (control === 'switch') {
    return checked ? 'On' : 'Off';
  }

  return checked ? '✓' : '';
};

export class CvInternalContextMenu extends LitElement {
  static properties = {
    ariaLabel: { attribute: false },
    items: { attribute: false }
  };

  declare ariaLabel: string;
  declare items: ContextMenuItem[];

  private statesById = new Map<string, MenuItemState>();

  constructor() {
    super();
    this.ariaLabel = '';
    this.items = [];
  }

  createRenderRoot(): this {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.className = 'cv-context-menu';
    this.role = 'menu';
    this.tabIndex = -1;
    this.dataset.open = 'false';
    this.addEventListener('click', this.onMenuClick);
    this.addEventListener('keydown', this.onMenuKeyDown);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onMenuClick);
    this.removeEventListener('keydown', this.onMenuKeyDown);
    super.disconnectedCallback();
  }

  setMenuItems(items: ContextMenuItem[]): void {
    this.items = items;
    this.statesById = new Map(items.filter(isActionItem).map((item) => [item.id, toItemState(item)]));
    this.syncRender();
  }

  focusFirstEnabled(): void {
    this.actionButtons.find((button) => !button.disabled)?.focus();
  }

  syncRender(): void {
    this.requestUpdate();
    this.performUpdate();
  }

  private get actionButtons(): HTMLButtonElement[] {
    return Array.from(this.querySelectorAll<HTMLButtonElement>('button.cv-context-menu__item'));
  }

  private focusByOffset(offset: number): void {
    const enabled = this.actionButtons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

    const currentIndex = document.activeElement instanceof HTMLButtonElement ? enabled.indexOf(document.activeElement) : -1;
    enabled[((currentIndex + offset) % enabled.length + enabled.length) % enabled.length]?.focus();
  }

  private focusBoundary(toEnd: boolean): void {
    const enabled = this.actionButtons.filter((button) => !button.disabled);
    enabled[toEnd ? enabled.length - 1 : 0]?.focus();
  }

  private activateItem(itemId: string, source: InputSource): void {
    const state = this.statesById.get(itemId);
    if (!state || state.item.disabled) {
      return;
    }

    if (state.control === 'checkbox' || state.control === 'switch') {
      state.checked = !state.checked;
    } else if (state.control === 'radio' && !state.checked) {
      this.statesById.forEach((candidate) => {
        if (candidate.control === 'radio' && candidate.group === state.group) {
          candidate.checked = candidate.item.id === itemId;
        }
      });
    }

    this.syncRender();
    this.dispatchEvent(
      new CustomEvent<ContextMenuActionEventDetail>('cv-menu-action', {
        detail: {
          item: state.control ? { ...state.item, checked: state.checked } : state.item,
          source
        }
      })
    );
  }

  private renderIcon(value: string | HTMLElement | undefined, className: string): TemplateResult | typeof nothing {
    if (!value) {
      return nothing;
    }

    if (typeof value === 'string') {
      return html`<span class=${className} aria-hidden="true">${value}</span>`;
    }

    return html`<span
      class=${className}
      aria-hidden="true"
      ${ref((element) => {
        if (element instanceof HTMLSpanElement) {
          element.replaceChildren(value.cloneNode(true));
        }
      })}
    ></span>`;
  }

  private renderActionItem(item: ContextMenuActionItem): TemplateResult {
    const state = this.statesById.get(item.id) ?? toItemState(item);
    const leading = [
      state.control
        ? html`<span
            class="cv-context-menu__item-control"
            aria-hidden="true"
            data-control=${state.control}
            data-checked=${state.checked ? 'true' : 'false'}
            >${formatControlIndicator(state.control, state.checked)}</span
          >`
        : nothing,
      this.renderIcon(item.iconStart, 'cv-context-menu__item-icon cv-context-menu__item-icon--start')
    ];
    const hasLeading = leading.some((part) => part !== nothing);
    const hasTrailing = Boolean(item.shortcut || item.iconEnd);

    return html`<button
      type="button"
      class="cv-context-menu__item"
      role=${resolveRole(item)}
      data-item-id=${item.id}
      data-kind=${item.kind ?? 'default'}
      data-control=${item.control ?? 'none'}
      data-group=${definedAttribute(item.group ?? (item.control === 'radio' ? defaultGroup : undefined))}
      data-checked=${state.control ? (state.checked ? 'true' : 'false') : nothing}
      ?disabled=${item.disabled ?? false}
      aria-checked=${state.control ? ariaBoolean(state.checked) : nothing}
      aria-keyshortcuts=${definedAttribute(item.shortcut)}
    >${hasLeading ? html`<span class="cv-context-menu__item-leading">${leading}</span>` : nothing}<span
        class="cv-context-menu__item-label"
        >${item.label}</span
      >${hasTrailing
        ? html`<span class="cv-context-menu__item-trailing"
            >${item.shortcut
              ? html`<span class="cv-context-menu__item-shortcut" aria-hidden="true">${item.shortcut}</span>`
              : nothing}${this.renderIcon(item.iconEnd, 'cv-context-menu__item-icon cv-context-menu__item-icon--end')}</span
          >`
        : nothing}</button>`;
  }

  private readonly onMenuClick = (event: Event): void => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button.cv-context-menu__item') : null;
    if (!button || !this.contains(button) || button.disabled) {
      return;
    }

    this.activateItem(button.dataset.itemId ?? '', 'pointer');
  };

  private readonly onMenuKeyDown = (event: KeyboardEvent): void => {
    const button =
      event.target instanceof HTMLButtonElement && event.target.classList.contains('cv-context-menu__item')
        ? event.target
        : null;

    if (button && isActivationKey(event)) {
      event.preventDefault();
      this.activateItem(button.dataset.itemId ?? '', 'keyboard');
      return;
    }

    if (!isNavigationKey(event)) {
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowDown') {
      this.focusByOffset(1);
    } else if (event.key === 'ArrowUp') {
      this.focusByOffset(-1);
    } else {
      this.focusBoundary(event.key === 'End');
    }
  };

  render(): TemplateResult {
    if (this.ariaLabel) {
      this.setAttribute('aria-label', this.ariaLabel);
    } else {
      this.removeAttribute('aria-label');
    }

    return html`${this.items.map((item) => {
      if (!isActionItem(item)) {
        return item.type === 'separator'
          ? html`<div class="cv-context-menu__separator" role="separator" data-menu-item-type="separator"></div>`
          : html`<div class="cv-context-menu__label" data-menu-item-type="label">${item.label}</div>`;
      }

      return this.renderActionItem(item);
    })}`;
  }
}

export const defineInternalContextMenu = (): void => {
  if (!customElements.get(INTERNAL_CONTEXT_MENU_TAG)) {
    customElements.define(INTERNAL_CONTEXT_MENU_TAG, CvInternalContextMenu);
  }
};
