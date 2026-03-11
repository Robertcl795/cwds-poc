import type { CvInternalContextMenu } from './internal-context-menu';

const DEFAULT_MENU_WIDTH = 192;
const MIN_MENU_HEIGHT = 48;
const VIEWPORT_PADDING = 8;

let contextMenuSequence = 0;

export type ToggleEventLike = Event & {
  newState?: 'open' | 'closed';
};

export type PopoverMenuElement = CvInternalContextMenu & {
  showPopover: (options?: { source?: HTMLElement }) => void;
  hidePopover: () => void;
};

export const nextContextMenuId = (): string => {
  contextMenuSequence += 1;
  return `cv-context-menu-${contextMenuSequence}`;
};

export const supportsPopoverApi = (): boolean =>
  typeof HTMLElement !== 'undefined' &&
  'showPopover' in HTMLElement.prototype &&
  'hidePopover' in HTMLElement.prototype;

export const isPopoverOpen = (element: Element): boolean => {
  try {
    return element.matches(':popover-open');
  } catch {
    return false;
  }
};

export const isInside = (target: EventTarget | null, container: HTMLElement): boolean =>
  target instanceof Node && container.contains(target);

const measureMenu = (menu: CvInternalContextMenu): DOMRect => {
  const { hidden } = menu;
  const { display, left, top, visibility } = menu.style;

  menu.hidden = false;
  menu.style.display = 'grid';
  menu.style.visibility = 'hidden';
  menu.style.left = '0px';
  menu.style.top = '0px';
  menu.syncRender();

  const rect = menu.getBoundingClientRect();

  menu.hidden = hidden;
  menu.style.display = display;
  menu.style.left = left;
  menu.style.top = top;
  menu.style.visibility = visibility;

  return rect;
};

export const positionContextMenu = (menu: CvInternalContextMenu, x: number, y: number): { x: number; y: number } => {
  const rect = measureMenu(menu);
  const width = Math.max(rect.width, DEFAULT_MENU_WIDTH);
  const height = Math.max(rect.height, MIN_MENU_HEIGHT);
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
  const clampedX = Math.min(Math.max(VIEWPORT_PADDING, x), Math.max(VIEWPORT_PADDING, viewportWidth - width - VIEWPORT_PADDING));
  const clampedY = Math.min(
    Math.max(VIEWPORT_PADDING, y),
    Math.max(VIEWPORT_PADDING, viewportHeight - height - VIEWPORT_PADDING)
  );

  menu.style.position = 'fixed';
  menu.style.inset = 'auto';
  menu.style.left = `${Math.round(clampedX)}px`;
  menu.style.top = `${Math.round(clampedY)}px`;

  return { x: clampedX, y: clampedY };
};
