import { expect, test } from '@playwright/test';

test('renders phase4 route and validates core interactions', async ({ page }) => {
  await page.goto('/#phase4');

  await expect(page.getByRole('heading', { name: 'Phase 4 Demo' })).toBeVisible();

  const tooltipTrigger = page.getByRole('button', { name: 'Latency budget details' });
  await tooltipTrigger.hover();
  await expect(page.getByRole('tooltip')).toBeVisible();

  const contextTarget = page.getByRole('button', { name: 'Right-click deployment row' });
  await contextTarget.click({ button: 'right' });
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Inspect run' }).click();
  await expect(page.locator('.phase4-log')).toContainText('inspect');

  await page.locator('cv-combobox').evaluate((node) => {
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

  await page.locator('cv-advanced-select').evaluate((node) => {
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
  await expect(page.locator('.phase4-result')).toContainText('amy');
  await expect(page.locator('.phase4-result')).toContainText('prod');
});
