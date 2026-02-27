export function queryOptional<T extends Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector<T>(selector);
}

export function queryRequired<T extends Element>(root: ParentNode, selector: string): T {
  const match = root.querySelector<T>(selector);

  if (!match) {
    throw new Error(`Expected selector to match at least one element: ${selector}`);
  }

  return match;
}
