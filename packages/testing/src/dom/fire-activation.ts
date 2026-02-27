export function firePointerActivation(element: HTMLElement): void {
  element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
  element.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
}

export function fireKeyboardActivation(element: HTMLElement, key: 'Enter' | ' ' = 'Enter'): void {
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }));
  element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key }));
}
