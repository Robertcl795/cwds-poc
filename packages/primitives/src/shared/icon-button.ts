import { createIconNode } from '@ds/utils-icons';

export type IconButtonContentOptions = {
  icon: string | HTMLElement;
  ariaLabel?: string;
};

export function buildIconButtonContent(options: IconButtonContentOptions): HTMLElement {
  if (!options.ariaLabel || options.ariaLabel.trim().length === 0) {
    throw new Error('Icon button requires an accessible name via ariaLabel.');
  }

  const iconContainer = document.createElement('span');
  iconContainer.className = 'cv-icon-button__icon';
  iconContainer.setAttribute('aria-hidden', 'true');

  if (typeof options.icon === 'string') {
    iconContainer.append(createIconNode(options.icon));
  } else {
    iconContainer.append(options.icon);
  }

  return iconContainer;
}
