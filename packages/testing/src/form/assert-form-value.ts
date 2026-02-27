export function assertFormValue(form: HTMLFormElement, key: string, expected: string | null): void {
  const data = new FormData(form);
  const value = data.get(key);

  if (value !== expected) {
    throw new Error(`Expected "${key}" to equal "${expected}", received "${String(value)}"`);
  }
}
