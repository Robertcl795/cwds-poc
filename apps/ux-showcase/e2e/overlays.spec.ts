import { expect, test } from '@playwright/test';

test('renders overlay components route and validates core interactions', async ({ page }) => {
  await page.goto('/#components-overlays');

  await expect(page.getByRole('heading', { name: 'Overlay Components Demo' })).toBeVisible();

  const tooltipTrigger = page.getByRole('button', { name: 'Latency budget details' });
  await tooltipTrigger.hover();
  await expect(page.getByRole('tooltip')).toBeVisible();

  const contextTarget = page.locator('[data-overlays-context-target="true"]');
  await contextTarget.click({ button: 'right' });
  await expect(page.getByRole('menu', { name: 'Deployment row actions' })).toBeVisible();

  await page.getByRole('menuitem', { name: 'Inspect run' }).click();
  await expect(page.locator('.overlays-log')).toContainText('inspect');

  await page.locator('[data-overlays-adapter="combobox"]').evaluate((node) => {
    const element = node as HTMLElement & { value: string };
    element.value = 'amy';
    element.dispatchEvent(
      new CustomEvent('cv-value-commit', {
        bubbles: true,
        composed: true,
        detail: {
          value: 'amy',
          source: 'programmatic'
        }
      })
    );
  });

  await page.locator('[data-overlays-adapter="advanced-select"]').evaluate((node) => {
    const element = node as HTMLElement & { value: string };
    element.value = 'prod';
    element.dispatchEvent(
      new CustomEvent('cv-value-commit', {
        bubbles: true,
        composed: true,
        detail: {
          value: 'prod',
          source: 'programmatic'
        }
      })
    );
  });

  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('.overlays-result')).toContainText('amy');
  await expect(page.locator('.overlays-result')).toContainText('prod');
});
