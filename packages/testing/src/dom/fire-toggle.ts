export function fireCheckboxToggle(element: HTMLInputElement): void {
  element.checked = !element.checked;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}
