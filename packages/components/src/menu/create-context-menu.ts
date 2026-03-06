import type { InputSource } from '@ds/core';
import { LitElement, html, nothing, type TemplateResult } from 'lit';
import { ref } from 'lit/directives/ref.js';

import { ariaBoolean, definedAttribute } from '../internal/lit';
import type {
  ContextMenuActionItem,
  ContextMenuControlType,
  ContextMenuItem,
  PrimitiveContextMenu,
  PrimitiveContextMenuOptions
} from './context-menu.types';

let contextMenuSequence = 0;

const DEFAULT_MENU_WIDTH = 192;
const MIN_MENU_HEIGHT = 48;
const VIEWPORT_PADDING = 8;
const INTERNAL_CONTEXT_MENU_TAG = 'cv-internal-context-menu';

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

const isInside = (target: EventTarget | null, container: HTMLElement): boolean => target instanceof Node && container.contains(target);

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

class CvInternalContextMenu extends LitElement {
  static properties = {
    ariaLabel: { attribute: false },
    items: { attribute: false }
  };

  declare ariaLabel: string;
  declare items: ContextMenuItem[];

  private readonly statesById = new Map<string, MenuItemState>();

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
    this.getEnabledButtons()[0]?.focus();
  }

  syncRender(): void {
    this.requestUpdate();
    this.performUpdate();
  }

  private get actionButtons(): HTMLButtonElement[] {
    return Array.from(this.querySelectorAll<HTMLButtonElement>('button.cv-context-menu__item'));
  }

  private getEnabledButtons(): HTMLButtonElement[] {
    return this.actionButtons.filter((button) => !button.disabled);
  }

  private focusByOffset(offset: number): void {
    const enabled = this.getEnabledButtons();
    if (enabled.length === 0) {
      return;
    }

    const current = document.activeElement;
    const currentIndex = current instanceof HTMLButtonElement ? enabled.indexOf(current) : -1;
    const nextIndex = ((currentIndex + offset) % enabled.length + enabled.length) % enabled.length;
    enabled[nextIndex]?.focus();
  }

  private focusBoundary(toEnd: boolean): void {
    const enabled = this.getEnabledButtons();
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
      @click=${(event: MouseEvent) => {
        const currentTarget = event.currentTarget;
        if (!(currentTarget instanceof HTMLButtonElement)) {
          return;
        }

        this.activateItem(currentTarget.dataset.itemId ?? '', 'pointer');
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
    const target = event.target;
    const isActionButton = target instanceof HTMLButtonElement && target.classList.contains('cv-context-menu__item');

    if (isActionButton && isActivationKey(event)) {
      event.preventDefault();
      this.activateItem(target.dataset.itemId ?? '', 'keyboard');
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

const measureMenu = (menu: CvInternalContextMenu): DOMRect => {
  const previousHidden = menu.hidden;
  const previousVisibility = menu.style.visibility;
  const previousLeft = menu.style.left;
  const previousTop = menu.style.top;

  menu.hidden = false;
  menu.style.visibility = 'hidden';
  menu.style.left = '0px';
  menu.style.top = '0px';
  menu.syncRender();

  const rect = menu.getBoundingClientRect();

  menu.hidden = previousHidden;
  menu.style.visibility = previousVisibility;
  menu.style.left = previousLeft;
  menu.style.top = previousTop;

  return rect;
};

export const createContextMenu = (options: PrimitiveContextMenuOptions): PrimitiveContextMenu => {
  defineInternalContextMenu();

  const triggerMode = options.triggerMode ?? 'contextmenu';
  const closeOnOutsidePress = options.closeOnOutsidePress ?? true;
  const closeOnSelect = options.closeOnSelect ?? true;

  const menu = document.createElement(INTERNAL_CONTEXT_MENU_TAG) as CvInternalContextMenu;
  menu.id = options.id ?? nextContextMenuId();
  menu.ariaLabel = options.ariaLabel ?? '';
  menu.setMenuItems(options.items);

  document.body.append(menu);

  let open = false;
  let lastPosition: { x: number; y: number } | null = null;

  const syncTriggerState = (): void => {
    options.target.setAttribute('aria-controls', menu.id);
    options.target.setAttribute('aria-expanded', open ? 'true' : 'false');
    options.target.setAttribute('aria-haspopup', 'menu');
  };

  const restoreFocusToTrigger = (): void => {
    if (document.activeElement === options.target) {
      return;
    }

    options.target.focus();
  };

  const positionMenu = (x: number, y: number): void => {
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const rect = measureMenu(menu);
    const width = Math.max(rect.width, DEFAULT_MENU_WIDTH);
    const height = Math.max(rect.height, MIN_MENU_HEIGHT);
    const clampedX = Math.min(Math.max(VIEWPORT_PADDING, x), Math.max(VIEWPORT_PADDING, viewportWidth - width - VIEWPORT_PADDING));
    const clampedY = Math.min(
      Math.max(VIEWPORT_PADDING, y),
      Math.max(VIEWPORT_PADDING, viewportHeight - height - VIEWPORT_PADDING)
    );

    lastPosition = { x: clampedX, y: clampedY };
    menu.style.position = 'fixed';
    menu.style.left = `${Math.round(clampedX)}px`;
    menu.style.top = `${Math.round(clampedY)}px`;
  };

  const onDocumentPointerDown = (event: PointerEvent): void => {
    if (!open || !closeOnOutsidePress) {
      return;
    }

    if (isInside(event.target, menu) || isInside(event.target, options.target)) {
      return;
    }

    closeMenu('pointer', false);
  };

  const onDocumentKeyDown = (event: KeyboardEvent): void => {
    if (!open || event.key !== 'Escape') {
      return;
    }

    event.preventDefault();
    closeMenu('keyboard', true);
  };

  const onDocumentFocusIn = (event: FocusEvent): void => {
    if (!open) {
      return;
    }

    if (isInside(event.target, menu) || isInside(event.target, options.target)) {
      return;
    }

    closeMenu('programmatic', false);
  };

  const onWindowChange = (): void => {
    if (!open || !lastPosition) {
      return;
    }

    positionMenu(lastPosition.x, lastPosition.y);
  };

  const attachOpenListeners = (): void => {
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    document.addEventListener('keydown', onDocumentKeyDown, true);
    document.addEventListener('focusin', onDocumentFocusIn, true);
    window.addEventListener('resize', onWindowChange);
    window.addEventListener('scroll', onWindowChange, true);
  };

  const detachOpenListeners = (): void => {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true);
    document.removeEventListener('keydown', onDocumentKeyDown, true);
    document.removeEventListener('focusin', onDocumentFocusIn, true);
    window.removeEventListener('resize', onWindowChange);
    window.removeEventListener('scroll', onWindowChange, true);
  };

  const setOpen = (nextOpen: boolean): void => {
    if (open === nextOpen) {
      return;
    }

    open = nextOpen;
    menu.hidden = !nextOpen;
    menu.dataset.open = nextOpen ? 'true' : 'false';

    if (nextOpen) {
      attachOpenListeners();
      menu.focusFirstEnabled();
    } else {
      detachOpenListeners();
    }

    syncTriggerState();
  };

  const openMenuAt = (x: number, y: number, _source: InputSource): void => {
    positionMenu(x, y);
    setOpen(true);
  };

  function closeMenu(source: InputSource = 'programmatic', restoreFocus = source !== 'pointer'): void {
    if (!open) {
      return;
    }

    setOpen(false);

    if (restoreFocus) {
      restoreFocusToTrigger();
    }
  }

  const openNearTarget = (source: InputSource): void => {
    const rect = options.target.getBoundingClientRect();
    openMenuAt(rect.left, rect.bottom, source);
  };

  const onMenuAction = (event: Event): void => {
    const detail = (event as CustomEvent<{ item: ContextMenuActionItem; source: InputSource }>).detail;
    options.onAction?.(detail.item, detail.source);

    if (closeOnSelect) {
      closeMenu(detail.source, true);
    }
  };

  const onContextMenu = (event: MouseEvent): void => {
    if (triggerMode !== 'contextmenu' && triggerMode !== 'both') {
      return;
    }

    event.preventDefault();
    openMenuAt(event.clientX, event.clientY, 'pointer');
  };

  const onTargetClick = (event: MouseEvent): void => {
    if (triggerMode !== 'click' && triggerMode !== 'both') {
      return;
    }

    event.preventDefault();

    if (open) {
      closeMenu('pointer', false);
      return;
    }

    openNearTarget('pointer');
  };

  const onTargetKeyDown = (event: KeyboardEvent): void => {
    if (!isContextMenuKey(event)) {
      return;
    }

    event.preventDefault();

    if (open) {
      closeMenu('keyboard', true);
      return;
    }

    openNearTarget('keyboard');
  };

  menu.addEventListener('cv-menu-action', onMenuAction);
  options.target.addEventListener('contextmenu', onContextMenu);
  options.target.addEventListener('click', onTargetClick);
  options.target.addEventListener('keydown', onTargetKeyDown);

  syncTriggerState();

  return {
    element: menu,
    openAt(x: number, y: number, source: InputSource = 'programmatic'): void {
      openMenuAt(x, y, source);
    },
    close(source: InputSource = 'programmatic'): void {
      closeMenu(source);
    },
    destroy(): void {
      closeMenu('programmatic', false);
      menu.removeEventListener('cv-menu-action', onMenuAction);
      options.target.removeEventListener('contextmenu', onContextMenu);
      options.target.removeEventListener('click', onTargetClick);
      options.target.removeEventListener('keydown', onTargetKeyDown);
      options.target.removeAttribute('aria-controls');
      options.target.removeAttribute('aria-expanded');
      options.target.removeAttribute('aria-haspopup');
      menu.remove();
    }
  };
};
