import { expect, test } from '@playwright/test';

test('renders workflow components route and validates workflow surfaces', async ({ page }) => {
  await page.goto('/#components-workflows');

  await expect(page.getByRole('heading', { name: 'Workflow Components Demo' })).toBeVisible();

  const tooltipTrigger = page.getByRole('button', { name: 'Latency budget details' });
  await tooltipTrigger.hover();
  await expect(page.getByRole('tooltip')).toBeVisible();

  const contextTarget = page.locator('[data-workflows-context-target="true"]');
  await contextTarget.click();
  await expect(page.getByRole('menu', { name: 'Deployment row actions' })).toBeVisible();

  await page.getByRole('menuitem', { name: 'Inspect run' }).click();
  await expect(page.locator('.workflows-log')).toContainText('inspect');

  await page.getByRole('button', { name: 'Show snackbar sequence' }).click();
  await expect(page.locator('.cv-snackbar')).toBeVisible();

  await page.getByRole('button', { name: 'Open alert dialog' }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
});
