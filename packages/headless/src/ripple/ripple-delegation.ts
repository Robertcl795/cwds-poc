import { attachRipple, type RippleOptions } from './ripple-controller';
import { isElementDisabled } from '../a11y/is-disabled';

export function attachDelegatedRipple(root: HTMLElement, options: RippleOptions = {}): () => void {
  const controllers = new WeakMap<HTMLElement, ReturnType<typeof attachRipple>>();

  const resolveHost = (target: EventTarget | null): HTMLElement | null => {
    if (!(target instanceof Element)) {
      return null;
    }

    return target.closest<HTMLElement>('[data-cv-ripple="on"]');
  };

  const ensureController = (host: HTMLElement) => {
    let controller = controllers.get(host);
    if (!controller) {
      controller = attachRipple(host, options);
      controllers.set(host, controller);
    }
    return controller;
  };

  const onPointerDown = (event: PointerEvent) => {
    const host = resolveHost(event.target);
    if (!host || isElementDisabled(host)) {
      return;
    }

    ensureController(host);
  };

  root.addEventListener('pointerdown', onPointerDown);

  return () => {
    root.removeEventListener('pointerdown', onPointerDown);
  };
}
