import type { IconDefinition } from '../types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ICON_NAME_PATTERN = /^[a-z0-9-]+$/;

const registry = new Map<string, IconDefinition>();

export function registerIcons(icons: Record<string, IconDefinition>): void {
  for (const [name, definition] of Object.entries(icons)) {
    if (!ICON_NAME_PATTERN.test(name)) {
      throw new Error(`Invalid icon name: ${name}`);
    }

    if (registry.has(name)) {
      throw new Error(`Icon already registered: ${name}`);
    }

    registry.set(name, {
      viewBox: definition.viewBox,
      paths: Object.freeze([...definition.paths])
    });
  }
}

export function createIconNode(name: string): SVGSVGElement {
  const icon = registry.get(name);

  if (!icon) {
    throw new Error(`Icon not found: ${name}`);
  }

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.classList.add('cv-icon');
  svg.setAttribute('viewBox', icon.viewBox);
  svg.setAttribute('aria-hidden', 'true');

  for (const pathData of icon.paths) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.append(path);
  }

  return svg;
}

export function clearIconRegistry(): void {
  registry.clear();
}
