import { isElementDisabled } from './is-disabled';

export type KeyboardActivationOptions = {
  includeSpace?: boolean;
  preventDefault?: boolean;
};

export function bindKeyboardActivation(
  element: HTMLElement,
  handler: (event: KeyboardEvent) => void,
  options: KeyboardActivationOptions = {}
): () => void {
  const { includeSpace = true, preventDefault = true } = options;

  const onKeyDown = (event: KeyboardEvent) => {
    if (isElementDisabled(element)) {
      return;
    }

    const isEnter = event.key === 'Enter';
    const isSpace = includeSpace && (event.key === ' ' || event.key === 'Spacebar');

    if (!isEnter && !isSpace) {
      return;
    }

    if (preventDefault) {
      event.preventDefault();
    }

    handler(event);
  };

  element.addEventListener('keydown', onKeyDown);

  return () => {
    element.removeEventListener('keydown', onKeyDown);
  };
}
