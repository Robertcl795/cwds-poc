import type { InputSource } from '@ds/core';
import { ariaBoolean, definedAttribute } from '@ds/core/lit';
import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import { createAdvancedOverlayController } from '../shared-overlay-advanced';
import type {
  ContextMenuActionItem,
  ContextMenuControlType,
  ContextMenuItem,
  PrimitiveContextMenu,
  PrimitiveContextMenuOptions
} from './context-menu.types';

let contextMenuSequence = 0;

const nextContextMenuId = (): string => {
  contextMenuSequence += 1;
  return `cv-context-menu-${contextMenuSequence}`;
};

const isActivationKey = (event: KeyboardEvent): boolean => event.key === 'Enter' || event.key === ' ';

const isNavigationKey = (event: KeyboardEvent): boolean =>
  event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End';

const isContextMenuKey = (event: KeyboardEvent): boolean =>
  event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10');

const isActionItem = (item: ContextMenuItem): item is ContextMenuActionItem => item.type === undefined || item.type === 'item';

const resolveRole = (item: ContextMenuActionItem): 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' => {
  if (item.control === 'checkbox' || item.control === 'switch') {
    return 'menuitemcheckbox';
  }

  if (item.control === 'radio') {
    return 'menuitemradio';
  }

  return 'menuitem';
};

type MenuItemState = {
  item: ContextMenuActionItem;
  control: ContextMenuControlType | null;
  checked: boolean;
  group: string | null;
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

const INTERNAL_CONTEXT_MENU_TAG = 'cv-internal-context-menu';

class CvInternalContextMenu extends LitElement {
  static properties = {
    ariaLabel: { attribute: false },
    items: { attribute: false },
    open: { type: Boolean, attribute: false }
  };

  declare ariaLabel: string;
  declare items: ContextMenuItem[];
  declare open: boolean;

  private readonly statesById = new Map<string, MenuItemState>();

  constructor() {
    super();
    this.ariaLabel = '';
    this.items = [];
    this.open = false;
  }

  createRenderRoot(): this {
    return this;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.className = 'cv-context-menu';
    this.role = 'menu';
    this.tabIndex = -1;
    this.hidden = true;
    this.dataset.open = 'false';
    this.addEventListener('keydown', this.onMenuKeyDown);
  }

  disconnectedCallback(): void {
    this.removeEventListener('keydown', this.onMenuKeyDown);
    super.disconnectedCallback();
  }

  setMenuItems(items: ContextMenuItem[]): void {
    this.items = items;
    this.statesById.clear();

    for (const item of items) {
      if (!isActionItem(item)) {
        continue;
      }

      this.statesById.set(item.id, {
        item,
        control: item.control ?? null,
        checked: item.checked === true,
        group: item.group ?? '__default__'
      });
    }

    this.syncRender();
  }

  focusFirstEnabled(): void {
    this.focusIndex(0);
  }

  syncRender(): void {
    this.requestUpdate();
    this.performUpdate();
  }

  private get actionButtons(): HTMLButtonElement[] {
    return Array.from(this.querySelectorAll<HTMLButtonElement>('button.cv-context-menu__item'));
  }

  private focusIndex(index: number): void {
    const enabled = this.actionButtons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

    enabled[index]?.focus();
  }

  private focusByOffset(offset: number): void {
    const enabled = this.actionButtons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

    const current = document.activeElement;
    const currentIndex = current instanceof HTMLButtonElement ? enabled.indexOf(current) : -1;
    const nextIndex = ((currentIndex + offset) % enabled.length + enabled.length) % enabled.length;
    enabled[nextIndex]?.focus();
  }

  private focusBoundary(toEnd: boolean): void {
    const enabled = this.actionButtons.filter((button) => !button.disabled);
    if (enabled.length === 0) {
      return;
    }

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
      for (const candidate of this.statesById.values()) {
        if (candidate.control !== 'radio' || candidate.group !== state.group) {
          continue;
        }

        candidate.checked = candidate.item.id === itemId;
      }
    }

    this.syncRender();

    const payload =
      state.control === null
        ? state.item
        : {
            ...state.item,
            checked: state.checked
          };

    this.dispatchEvent(
      new CustomEvent('cv-menu-action', {
        detail: {
          item: payload,
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
        if (!(element instanceof HTMLSpanElement)) {
          return;
        }

        element.replaceChildren(value.cloneNode(true));
      })}
    ></span>`;
  }

  private renderActionItem(item: ContextMenuActionItem): TemplateResult {
    const state = this.statesById.get(item.id) ?? {
      item,
      control: item.control ?? null,
      checked: item.checked === true,
      group: item.group ?? '__default__'
    };
    const leadingParts = [
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
    const hasLeading = leadingParts.some((part) => part !== nothing);
    const hasTrailing = Boolean(item.shortcut || item.iconEnd);

    return html`<button
      type="button"
      class="cv-context-menu__item"
      role=${resolveRole(item)}
      data-item-id=${item.id}
      data-kind=${item.kind ?? 'default'}
      data-control=${item.control ?? 'none'}
      data-group=${definedAttribute(item.group ?? (item.control === 'radio' ? '__default__' : undefined))}
      data-checked=${state.control ? (state.checked ? 'true' : 'false') : nothing}
      ?disabled=${item.disabled ?? false}
      aria-checked=${state.control ? ariaBoolean(state.checked) : nothing}
      aria-keyshortcuts=${definedAttribute(item.shortcut)}
      @click=${() => {
        this.activateItem(item.id, 'pointer');
      }}
      @keydown=${(event: KeyboardEvent) => {
        if (isActivationKey(event)) {
          event.preventDefault();
          this.activateItem(item.id, 'keyboard');
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
        } else if (event.key === 'Home') {
          this.focusBoundary(false);
        } else if (event.key === 'End') {
          this.focusBoundary(true);
        }
      }}
    >${hasLeading ? html`<span class="cv-context-menu__item-leading">${leadingParts}</span>` : nothing}<span
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

  private readonly onMenuKeyDown = (event: KeyboardEvent): void => {
    if (!isNavigationKey(event)) {
      return;
    }

    if (!(event.target instanceof HTMLButtonElement) || !event.target.classList.contains('cv-context-menu__item')) {
      if (event.key === 'Home') {
        this.focusBoundary(false);
      } else if (event.key === 'End') {
        this.focusBoundary(true);
      }
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowDown') {
      this.focusByOffset(1);
    } else if (event.key === 'ArrowUp') {
      this.focusByOffset(-1);
    } else if (event.key === 'Home') {
      this.focusBoundary(false);
    } else if (event.key === 'End') {
      this.focusBoundary(true);
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
        if (item.type === 'separator') {
          return html`<div class="cv-context-menu__separator" role="separator" data-menu-item-type="separator"></div>`;
        }

        return html`<div class="cv-context-menu__label" data-menu-item-type="label">${item.label}</div>`;
      }

      return this.renderActionItem(item);
    })}`;
  }
}

const defineInternalContextMenu = (): void => {
  if (!customElements.get(INTERNAL_CONTEXT_MENU_TAG)) {
    customElements.define(INTERNAL_CONTEXT_MENU_TAG, CvInternalContextMenu);
  }
};

export const createContextMenu = (options: PrimitiveContextMenuOptions): PrimitiveContextMenu => {
  defineInternalContextMenu();

  const triggerMode = options.triggerMode ?? 'contextmenu';
  const closeOnSelect = options.closeOnSelect ?? true;

  const menu = document.createElement(INTERNAL_CONTEXT_MENU_TAG) as CvInternalContextMenu;
  menu.id = options.id ?? nextContextMenuId();
  menu.ariaLabel = options.ariaLabel ?? '';
  menu.setMenuItems(options.items);

  const controller = createAdvancedOverlayController({
    overlay: menu,
    trigger: options.target,
    role: 'menu',
    enablePositioning: false,
    dismiss: {
      closeOnEscape: true,
      closeOnOutsidePress: options.closeOnOutsidePress ?? true,
      closeOnFocusOutside: true
    },
    onOpenChange(open) {
      menu.open = open;
      menu.hidden = !open;
      menu.dataset.open = open ? 'true' : 'false';
      menu.syncRender();

      if (open) {
        menu.focusFirstEnabled();
      }
    }
  });

  menu.addEventListener('cv-menu-action', (event) => {
    const detail = (event as CustomEvent<{ item: ContextMenuActionItem; source: InputSource }>).detail;
    options.onAction?.(detail.item, detail.source);

    if (closeOnSelect) {
      controller.close(detail.source);
    }
  });

  const openAt = (x: number, y: number, source: InputSource = 'programmatic'): void => {
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;

    const previousHidden = menu.hidden;
    menu.syncRender();

    if (previousHidden) {
      menu.hidden = false;
      menu.style.visibility = 'hidden';
    }

    const rect = menu.getBoundingClientRect();
    const width = Math.max(rect.width, 192);
    const height = Math.max(rect.height, 48);

    if (previousHidden) {
      menu.hidden = true;
      menu.style.removeProperty('visibility');
    }

    const clampedX = Math.min(Math.max(8, x), Math.max(8, viewportWidth - width - 8));
    const clampedY = Math.min(Math.max(8, y), Math.max(8, viewportHeight - height - 8));

    menu.style.position = 'fixed';
    menu.style.left = `${Math.round(clampedX)}px`;
    menu.style.top = `${Math.round(clampedY)}px`;

    controller.open(source);
  };

  const openNearTarget = (source: InputSource): void => {
    const rect = options.target.getBoundingClientRect();
    openAt(rect.left, rect.bottom, source);
  };

  const onContextMenu = (event: MouseEvent): void => {
    if (triggerMode !== 'contextmenu' && triggerMode !== 'both') {
      return;
    }

    event.preventDefault();
    openAt(event.clientX, event.clientY, 'pointer');
  };

  const onTargetClick = (event: MouseEvent): void => {
    if (triggerMode !== 'click' && triggerMode !== 'both') {
      return;
    }

    event.preventDefault();

    if (controller.isOpen()) {
      controller.close('pointer');
      return;
    }

    openNearTarget('pointer');
  };

  const onTargetPointerDown = (event: PointerEvent): void => {
    if (!controller.isOpen()) {
      return;
    }

    if (event.button !== 0 && event.button !== 2) {
      return;
    }

    if (triggerMode === 'contextmenu' || triggerMode === 'both') {
      return;
    }
  };

  const onTargetKeyDown = (event: KeyboardEvent): void => {
    const supportsKeyboardTrigger = triggerMode === 'contextmenu' || triggerMode === 'both' || triggerMode === 'click';
    if (!supportsKeyboardTrigger || !isContextMenuKey(event)) {
      return;
    }

    event.preventDefault();
    if (controller.isOpen()) {
      controller.close('keyboard');
      return;
    }

    openNearTarget('keyboard');
  };

  options.target.addEventListener('contextmenu', onContextMenu);
  options.target.addEventListener('click', onTargetClick);
  options.target.addEventListener('pointerdown', onTargetPointerDown);
  options.target.addEventListener('keydown', onTargetKeyDown);

  document.body.append(menu);
  menu.syncRender();

  return {
    element: menu,
    openAt,
    close(source: InputSource = 'programmatic'): void {
      controller.close(source);
    },
    destroy(): void {
      options.target.removeEventListener('contextmenu', onContextMenu);
      options.target.removeEventListener('click', onTargetClick);
      options.target.removeEventListener('pointerdown', onTargetPointerDown);
      options.target.removeEventListener('keydown', onTargetKeyDown);
      controller.dispose();
      menu.remove();
    }
  };
};
