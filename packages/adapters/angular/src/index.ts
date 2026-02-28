import { Directive, ElementRef, InjectionToken, effect, inject, input, signal, type Provider } from '@angular/core';
import type { FormControl } from '@angular/forms';

import type { PrimitiveButtonColor, PrimitiveButtonShape } from '@ds/primitives';

export interface CvAngularAdapterConfig {
  zoneless?: boolean;
  defaultDensity?: 'default' | 'dense';
}

export const CV_ANGULAR_ADAPTER_CONFIG = new InjectionToken<CvAngularAdapterConfig>('CV_ANGULAR_ADAPTER_CONFIG');

export const provideCvAngularAdapter = (config: CvAngularAdapterConfig = {}): Provider[] => [
  {
    provide: CV_ANGULAR_ADAPTER_CONFIG,
    useValue: config
  }
];

export type CvTypedControl<T> = FormControl<T>;

@Directive({
  selector: 'button[cvButton]',
  standalone: true
})
export class CvButtonDirective {
  private readonly host = inject(ElementRef<HTMLButtonElement>);

  readonly cvColor = input<PrimitiveButtonColor>('primary');
  readonly cvShape = input<PrimitiveButtonShape>('filled');
  readonly cvDisabled = input<boolean>(false);

  readonly state = signal({
    color: this.cvColor(),
    shape: this.cvShape(),
    disabled: this.cvDisabled()
  });

  constructor() {
    effect(() => {
      const element = this.host.nativeElement;
      const color = this.cvColor();
      const shape = this.cvShape();
      const disabled = this.cvDisabled();

      this.state.set({ color, shape, disabled });
      element.classList.add('cv-button');
      element.dataset.color = color;
      element.dataset.shape = shape;
      element.disabled = disabled;
      element.toggleAttribute('data-disabled', disabled);
    });
  }
}
