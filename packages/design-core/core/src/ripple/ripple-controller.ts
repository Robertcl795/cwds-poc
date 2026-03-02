import { getEnvironmentFlags } from '../features/environment';
import { isElementDisabled } from '../a11y/is-disabled';
import type { RippleController, RippleOptions } from './types';

const RIPPLE_CONTAINER_SELECTOR = '[data-cv-ripple-layer="true"]';

function resolveDisabled(host: HTMLElement, disabled: RippleOptions['disabled']): boolean {
  if (typeof disabled === 'function') {
    return disabled();
  }

  if (typeof disabled === 'boolean') {
    return disabled;
  }

  if (host.dataset.cvRipple === 'off') {
    return true;
  }

  if (host.ownerDocument.documentElement.dataset.cvRipple === 'off') {
    return true;
  }

  return isElementDisabled(host);
}

function ensureRippleLayer(host: HTMLElement): HTMLElement {
  const existing = host.querySelector<HTMLElement>(RIPPLE_CONTAINER_SELECTOR);
  if (existing) {
    return existing;
  }

  const layer = host.ownerDocument.createElement('span');
  layer.className = 'cv-ripple-layer';
  layer.setAttribute('data-cv-ripple-layer', 'true');
  layer.setAttribute('aria-hidden', 'true');
  host.append(layer);

  return layer;
}

function maxDiameter(rect: DOMRect, x: number, y: number): number {
  const maxX = Math.max(x, rect.width - x);
  const maxY = Math.max(y, rect.height - y);
  return Math.sqrt(maxX * maxX + maxY * maxY) * 2;
}

type SpawnWaveOptions = {
  fromKeyboard: boolean;
  pointerX?: number;
  pointerY?: number;
};

function spawnWave(host: HTMLElement, layer: HTMLElement, config: Required<RippleOptions>, options: SpawnWaveOptions) {
  while (layer.childElementCount >= config.maxWaves) {
    layer.firstElementChild?.remove();
  }

  const wave = host.ownerDocument.createElement('span');
  wave.className = 'cv-ripple-wave';

  if (config.styleMutation === 'allow') {
    const rect = host.getBoundingClientRect();
    const x = options.fromKeyboard || options.pointerX === undefined ? rect.width / 2 : options.pointerX - rect.left;
    const y = options.fromKeyboard || options.pointerY === undefined ? rect.height / 2 : options.pointerY - rect.top;
    const size = maxDiameter(rect, x, y);

    wave.style.setProperty('--cv-ripple-x', `${x}px`);
    wave.style.setProperty('--cv-ripple-y', `${y}px`);
    wave.style.setProperty('--cv-ripple-size', `${size}px`);
    wave.style.setProperty('--cv-ripple-duration', `${config.durationMs}ms`);
  } else {
    wave.classList.add('cv-ripple-wave--centered');
  }

  layer.append(wave);

  const cleanup = () => {
    wave.removeEventListener('animationend', cleanup);
    wave.remove();
  };

  wave.addEventListener('animationend', cleanup);
  const fallbackWindow = globalThis.window;
  const view = host.ownerDocument.defaultView ?? fallbackWindow;
  view.setTimeout(cleanup, config.durationMs + 32);
}

export function attachRipple(host: HTMLElement, options: RippleOptions = {}): RippleController {
  const config: Required<RippleOptions> = {
    disabled: options.disabled ?? false,
    maxWaves: options.maxWaves ?? 2,
    durationMs: options.durationMs ?? 450,
    styleMutation: options.styleMutation ?? 'forbid',
    centeredOnKeyboard: options.centeredOnKeyboard ?? true,
    respectReducedMotion: options.respectReducedMotion ?? true
  };

  host.classList.add('cv-ripple-host');

  const layer = ensureRippleLayer(host);
  let disabled = resolveDisabled(host, config.disabled);

  const onPointerDown = (event: PointerEvent) => {
    disabled = resolveDisabled(host, config.disabled);
    if (event.button !== 0 || disabled) {
      return;
    }

    if (config.respectReducedMotion && getEnvironmentFlags().reducedMotion) {
      return;
    }

    spawnWave(host, layer, config, { fromKeyboard: false, pointerX: event.clientX, pointerY: event.clientY });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    disabled = resolveDisabled(host, config.disabled);
    if (disabled) {
      return;
    }

    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    if (config.respectReducedMotion && getEnvironmentFlags().reducedMotion) {
      return;
    }

    spawnWave(host, layer, config, { fromKeyboard: config.centeredOnKeyboard });
  };

  host.addEventListener('pointerdown', onPointerDown);
  host.addEventListener('keydown', onKeyDown);

  return {
    destroy() {
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('keydown', onKeyDown);
      layer.remove();
    },
    setDisabled(nextDisabled) {
      disabled = nextDisabled;
    }
  };
}

export type { RippleController, RippleOptions } from './types';
