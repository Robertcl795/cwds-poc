import type { InputSource } from '@ds/headless';

import { createAdvancedOverlayController, type OverlayPlacement } from '../shared-overlay-advanced';

export interface PrimitiveTooltipOptions {
  trigger: HTMLElement;
  content: string;
  id?: string;
  placement?: OverlayPlacement;
  openDelayMs?: number;
  closeDelayMs?: number;
  disabled?: boolean;
  disableTouch?: boolean;
  maxWidth?: string;
}

export interface PrimitiveTooltip {
  element: HTMLElement;
  open: (source?: InputSource) => void;
  close: (source?: InputSource) => void;
  destroy: () => void;
}

let tooltipSequence = 0;

const nextTooltipId = (): string => {
  tooltipSequence += 1;
  return `cv-tooltip-${tooltipSequence}`;
};

const mergeDescribedBy = (existing: string | null, id: string): string => {
  const values = (existing ?? '')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  if (!values.includes(id)) {
    values.push(id);
  }

  return values.join(' ');
};

const removeDescribedByToken = (value: string | null, token: string): string | null => {
  const values = (value ?? '')
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry !== token);

  if (values.length === 0) {
    return null;
  }

  return values.join(' ');
};

const clampDelay = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
};

export const createPrimitiveTooltip = (options: PrimitiveTooltipOptions): PrimitiveTooltip => {
  const tooltip = document.createElement('div');
  tooltip.id = options.id ?? nextTooltipId();
  tooltip.className = 'cv-tooltip';
  tooltip.role = 'tooltip';
  tooltip.hidden = true;
  tooltip.setAttribute('aria-hidden', 'true');
  tooltip.dataset.open = 'false';
  tooltip.textContent = options.content;
  if (options.maxWidth) {
    tooltip.style.maxInlineSize = options.maxWidth;
  }

  document.body.append(tooltip);

  const previousDescribedBy = options.trigger.getAttribute('aria-describedby');
  options.trigger.setAttribute('aria-describedby', mergeDescribedBy(previousDescribedBy, tooltip.id));

  const controller = createAdvancedOverlayController({
    overlay: tooltip,
    trigger: options.trigger,
    role: 'tooltip',
    restoreFocus: false,
    placement: options.placement ?? 'top',
    dismiss: {
      closeOnEscape: true,
      closeOnOutsidePress: false,
      closeOnFocusOutside: true
    },
    onOpenChange(open, source) {
      tooltip.hidden = !open;
      tooltip.setAttribute('aria-hidden', open ? 'false' : 'true');
      tooltip.dataset.open = open ? 'true' : 'false';
      options.trigger.dispatchEvent(
        new CustomEvent(open ? 'cv-tooltip-open' : 'cv-tooltip-close', {
          bubbles: true,
          detail: {
            source
          }
        })
      );
    }
  });

  const openDelayMs = clampDelay(options.openDelayMs ?? 300, 0, 2000);
  const closeDelayMs = clampDelay(options.closeDelayMs ?? 80, 0, 1000);
  const disableTouch = options.disableTouch ?? true;

  let openTimer: number | null = null;
  let closeTimer: number | null = null;

  const clearOpenTimer = (): void => {
    if (openTimer === null) {
      return;
    }

    window.clearTimeout(openTimer);
    openTimer = null;
  };

  const clearCloseTimer = (): void => {
    if (closeTimer === null) {
      return;
    }

    window.clearTimeout(closeTimer);
    closeTimer = null;
  };

  const scheduleOpen = (source: InputSource): void => {
    if (options.disabled) {
      return;
    }

    clearCloseTimer();
    clearOpenTimer();

    openTimer = window.setTimeout(() => {
      openTimer = null;
      controller.open(source);
    }, openDelayMs);
  };

  const scheduleClose = (source: InputSource): void => {
    clearOpenTimer();
    clearCloseTimer();

    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      controller.close(source);
    }, closeDelayMs);
  };

  const onPointerEnter = (event: PointerEvent): void => {
    if (disableTouch && event.pointerType === 'touch') {
      return;
    }

    scheduleOpen('pointer');
  };

  const onPointerLeave = (): void => {
    scheduleClose('pointer');
  };

  const onFocusIn = (): void => {
    scheduleOpen('keyboard');
  };

  const onFocusOut = (): void => {
    scheduleClose('keyboard');
  };

  const onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape') {
      return;
    }

    clearCloseTimer();
    clearOpenTimer();
    controller.close('keyboard');
  };

  options.trigger.addEventListener('pointerenter', onPointerEnter);
  options.trigger.addEventListener('pointerleave', onPointerLeave);
  options.trigger.addEventListener('focusin', onFocusIn);
  options.trigger.addEventListener('focusout', onFocusOut);
  options.trigger.addEventListener('keydown', onTriggerKeyDown);

  return {
    element: tooltip,
    open(source: InputSource = 'programmatic'): void {
      clearCloseTimer();
      clearOpenTimer();
      controller.open(source);
    },
    close(source: InputSource = 'programmatic'): void {
      clearCloseTimer();
      clearOpenTimer();
      controller.close(source);
    },
    destroy(): void {
      clearCloseTimer();
      clearOpenTimer();

      options.trigger.removeEventListener('pointerenter', onPointerEnter);
      options.trigger.removeEventListener('pointerleave', onPointerLeave);
      options.trigger.removeEventListener('focusin', onFocusIn);
      options.trigger.removeEventListener('focusout', onFocusOut);
      options.trigger.removeEventListener('keydown', onTriggerKeyDown);

      const nextDescribedBy = removeDescribedByToken(options.trigger.getAttribute('aria-describedby'), tooltip.id);
      if (nextDescribedBy) {
        options.trigger.setAttribute('aria-describedby', nextDescribedBy);
      } else {
        options.trigger.removeAttribute('aria-describedby');
      }

      controller.dispose();
      tooltip.remove();
    }
  };
};
