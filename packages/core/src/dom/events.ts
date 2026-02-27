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
): () => void {
  const listener = handler as EventListener;
  element.addEventListener(type, listener, options);
  return () => {
    element.removeEventListener(type, listener, options);
  };
}
