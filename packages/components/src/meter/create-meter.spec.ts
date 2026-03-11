import { describe, expect, it } from 'vitest';

import { createPrimitiveMeter } from './create-meter';

describe('meter primitive', () => {
  it('renders a native meter with semantic bounds', () => {
    const meter = createPrimitiveMeter({
      id: 'health-meter',
      label: 'Health',
      value: 72,
      min: 0,
      max: 100,
      low: 40,
      high: 80,
      optimum: 90
    });

    expect(meter.meter.tagName).toBe('METER');
    expect(meter.meter.value).toBe(72);
    expect(meter.meter.low).toBe(40);
    expect(meter.meter.high).toBe(80);
    expect(meter.meter.optimum).toBe(90);
  });

  it('updates its rendered value output', () => {
    const meter = createPrimitiveMeter({
      label: 'Readiness',
      value: 25,
      max: 100
    });

    meter.setValue(60);

    expect(meter.meter.value).toBe(60);
    expect(meter.output?.textContent).toContain('60');
  });
});
