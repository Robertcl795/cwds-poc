import { applyFocusRing } from '@ds/utils-a11y';

import { applyFieldLinkage, createFieldIds, resolveFieldMessages, syncFieldDataState } from '../shared-field';
import type { PrimitiveSlider, PrimitiveSliderInputSource, PrimitiveSliderOptions } from './slider.types';

export const createPrimitiveSlider = (options: PrimitiveSliderOptions): PrimitiveSlider => {
  const ids = createFieldIds(options.id);
  const messages = resolveFieldMessages(options);

  const wrapper = document.createElement('div');
  wrapper.className = 'cv-slider-field';

  const label = document.createElement('label');
  label.className = 'cv-slider-field__label';
  label.id = ids.labelId;
  label.textContent = options.label;
  label.htmlFor = ids.controlId;

  const control = document.createElement('div');
  control.className = 'cv-slider-field__control';

  const input = document.createElement('input');
  input.className = 'cv-slider cv-focus-ring';
  input.type = 'range';
  input.id = ids.controlId;
  input.name = options.name;
  input.min = String(options.min ?? 0);
  input.max = String(options.max ?? 100);
  input.step = String(options.step ?? 1);
  input.value = String(options.value ?? options.min ?? 0);
  input.disabled = options.disabled ?? false;
  input.required = options.required ?? false;
  applyFocusRing(input, 'auto');

  const helper = document.createElement('p');
  helper.className = 'cv-slider-field__helper';
  helper.id = ids.helpId;
  helper.textContent = messages.helperText;

  let output: HTMLOutputElement | undefined;

  if (options.showValue) {
    output = document.createElement('output');
    output.className = 'cv-slider-field__value';
    output.htmlFor = ids.controlId;
    output.textContent = input.value;
  }

  let pendingSource: PrimitiveSliderInputSource = 'programmatic';

  const syncValidation = (): boolean => {
    const invalid = options.invalid ?? false;
    applyFieldLinkage(input, {
      helpId: ids.helpId,
      describedBy: options.describedBy,
      invalid
    });
    helper.textContent = invalid ? messages.errorText || messages.helperText : messages.helperText;
    return invalid;
  };

  const syncState = (): void => {
    const invalid = syncValidation();
    syncFieldDataState(wrapper, input, { invalid });
  };

  input.addEventListener('pointerdown', () => {
    pendingSource = 'pointer';
  });

  input.addEventListener('keydown', () => {
    pendingSource = 'keyboard';
  });

  input.addEventListener('input', () => {
    if (output) {
      output.textContent = input.value;
    }

    syncState();
    options.onValueChange?.(Number(input.value), pendingSource);
  });

  input.addEventListener('change', () => {
    pendingSource = 'programmatic';
    syncState();
  });

  input.addEventListener('focus', syncState);
  input.addEventListener('blur', syncState);

  control.append(input);
  if (output) {
    control.append(output);
  }

  wrapper.append(label, control, helper);
  syncState();

  return {
    element: wrapper,
    input,
    ...(output ? { output } : {}),
    setValue(value: number): void {
      input.value = String(value);
      if (output) {
        output.textContent = input.value;
      }
      syncState();
    }
  };
};
