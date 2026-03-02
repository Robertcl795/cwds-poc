const BOOLEAN_DISABLED = new Set(['true', '1', 'yes']);

export function isElementDisabled(element: Element): boolean {
  if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
    return element.disabled;
  }

  const attrDisabled = element.getAttribute('disabled');
  if (attrDisabled !== null) {
    return true;
  }

  const ariaDisabled = element.getAttribute('aria-disabled');
  if (ariaDisabled && BOOLEAN_DISABLED.has(ariaDisabled.toLowerCase())) {
    return true;
  }

  const dataDisabled = element.getAttribute('data-disabled');
  return dataDisabled ? BOOLEAN_DISABLED.has(dataDisabled.toLowerCase()) : false;
}
