export type PrimitiveMeterSize = 'sm' | 'md' | 'lg';

export interface PrimitiveMeterOptions {
  id?: string;
  label?: string;
  helper?: string;
  value: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  size?: PrimitiveMeterSize;
  showValue?: boolean;
  valueText?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export interface PrimitiveMeter {
  element: HTMLDivElement;
  meter: HTMLMeterElement;
  output?: HTMLOutputElement;
  setValue: (value: number) => void;
}

let meterSequence = 0;

const nextMeterId = (): string => {
  meterSequence += 1;
  return `cv-meter-${meterSequence}`;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const formatValueText = (
  value: number,
  max: number,
  explicitValueText: string | undefined
): string => explicitValueText ?? `${Math.round(value)} / ${Math.round(max)}`;

export const createPrimitiveMeter = (options: PrimitiveMeterOptions): PrimitiveMeter => {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const wrapper = document.createElement('div');
  wrapper.className = 'cv-meter-field';

  const meter = document.createElement('meter');
  meter.className = 'cv-meter';
  meter.id = options.id ?? nextMeterId();
  meter.min = min;
  meter.max = max;
  meter.value = clamp(options.value, min, max);
  meter.dataset.size = options.size ?? 'md';

  if (options.low !== undefined) {
    meter.low = options.low;
  }

  if (options.high !== undefined) {
    meter.high = options.high;
  }

  if (options.optimum !== undefined) {
    meter.optimum = options.optimum;
  }

  if (options.ariaLabel) {
    meter.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.ariaLabelledBy) {
    meter.setAttribute('aria-labelledby', options.ariaLabelledBy);
  }

  if (options.label) {
    const label = document.createElement('label');
    label.className = 'cv-meter-field__label';
    label.htmlFor = meter.id;
    label.textContent = options.label;
    wrapper.append(label);
  }

  const control = document.createElement('div');
  control.className = 'cv-meter-field__control';
  control.append(meter);

  let output: HTMLOutputElement | undefined;
  if (options.showValue !== false) {
    output = document.createElement('output');
    output.className = 'cv-meter-field__value';
    output.htmlFor = meter.id;
    output.textContent = formatValueText(meter.value, max, options.valueText);
    control.append(output);
  }

  wrapper.append(control);

  if (options.helper) {
    const helper = document.createElement('p');
    helper.className = 'cv-meter-field__helper';
    helper.id = `${meter.id}-helper`;
    helper.textContent = options.helper;
    meter.setAttribute('aria-describedby', helper.id);
    wrapper.append(helper);
  }

  return {
    element: wrapper,
    meter,
    ...(output ? { output } : {}),
    setValue(value: number): void {
      meter.value = clamp(value, min, max);
      if (output) {
        output.textContent = formatValueText(meter.value, max, options.valueText);
      }
    }
  };
};
