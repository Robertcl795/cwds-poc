import type { FeedbackPriority } from './types';

export interface LiveRegionOptions {
  id?: string;
  priority?: FeedbackPriority;
  atomic?: boolean;
  root?: HTMLElement;
}

export interface LiveRegionHandle {
  readonly element: HTMLElement;
  announce: (message: string) => void;
  dispose: () => void;
}

let liveRegionSequence = 0;

const nextLiveRegionId = (): string => {
  liveRegionSequence += 1;
  return `cv-live-region-${liveRegionSequence}`;
};

const applyVisuallyHiddenStyles = (element: HTMLElement): void => {
  element.style.position = 'fixed';
  element.style.inlineSize = '1px';
  element.style.blockSize = '1px';
  element.style.overflow = 'hidden';
  element.style.clipPath = 'inset(50%)';
  element.style.whiteSpace = 'nowrap';
};

export const createLiveRegion = (options: LiveRegionOptions = {}): LiveRegionHandle => {
  const root = options.root ?? document.body;
  const priority = options.priority ?? 'polite';

  const element = document.createElement('div');
  element.id = options.id ?? nextLiveRegionId();
  element.className = 'cv-live-region';
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', options.atomic === false ? 'false' : 'true');
  element.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');

  applyVisuallyHiddenStyles(element);
  root.append(element);

  return {
    element,
    announce(message: string): void {
      const next = message.trim();
      element.textContent = '';

      queueMicrotask(() => {
        if (!element.isConnected) {
          return;
        }

        element.textContent = next;
      });
    },
    dispose(): void {
      element.remove();
    }
  };
};
