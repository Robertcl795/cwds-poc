import axe from 'axe-core';

export async function runAxe(container: HTMLElement): Promise<axe.AxeResults> {
  return axe.run(container);
}
