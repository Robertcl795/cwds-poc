export type DisposalBin = {
  add: (cleanup: () => void) => void;
  dispose: () => void;
};

export function createDisposalBin(): DisposalBin {
  const cleanup = new Set<() => void>();

  return {
    add(fn) {
      cleanup.add(fn);
    },
    dispose() {
      for (const fn of cleanup) {
        fn();
      }
      cleanup.clear();
    }
  };
}

export function listen<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;
export function listen<K extends keyof DocumentEventMap>(
  document: Document,
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;
export function listen<K extends keyof WindowEventMap>(
  window: Window,
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void;
export function listen(
  target: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void;
export function listen(
  target: EventTarget,
  type: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): () => void {
  target.addEventListener(type, handler, options);
  return () => {
    target.removeEventListener(type, handler, options);
  };
}
