export const reflectStringAttribute = (element: HTMLElement, name: string, value: string): void => {
  if (value.length > 0) {
    element.setAttribute(name, value);
  } else {
    element.removeAttribute(name);
  }
};

export const upgradeProperties = <T extends HTMLElement>(
  element: T,
  properties: readonly (keyof T)[]
): void => {
  for (const property of properties) {
    if (!Object.prototype.hasOwnProperty.call(element, property)) {
      continue;
    }

    const value = Reflect.get(element, property);
    Reflect.deleteProperty(element, property);
    Reflect.set(element, property, value);
  }
};
