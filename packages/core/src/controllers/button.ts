import type { InputSource } from '../types/events';

export interface ButtonControllerOptions {
  disabled?: boolean;
  onPress?: (source: InputSource, event: Event) => void;
}

export interface ButtonA11yProps {
  type: 'button';
  disabled?: true;
  'aria-disabled'?: true;
}

export const createButtonController = (options: ButtonControllerOptions = {}) => {
  const isDisabled = () => options.disabled === true;

  const firePress = (source: InputSource, event: Event): void => {
    if (isDisabled()) {
      return;
    }

    options.onPress?.(source, event);
  };

  return {
    getA11yProps(): ButtonA11yProps {
      return isDisabled()
        ? {
            type: 'button',
            disabled: true,
            'aria-disabled': true
          }
        : { type: 'button' };
    },
    onClick(event: MouseEvent): void {
      firePress('pointer', event);
    },
    onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Enter' || event.key === ' ') {
        firePress('keyboard', event);
      }
    }
  };
};
