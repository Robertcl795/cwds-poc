import { expect, test } from '@playwright/test';

test('renders phase5 route and validates enterprise surfaces', async ({ page }) => {
  await page.goto('/#phase5');

  await expect(page.getByRole('heading', { name: 'Phase 5 Demo' })).toBeVisible();

  const tooltipTrigger = page.getByRole('button', { name: 'Latency budget details' });
  await tooltipTrigger.hover();
  await expect(page.getByRole('tooltip')).toBeVisible();

  const contextTarget = page.locator('[data-phase5-context-target="true"]');
  await contextTarget.click({ button: 'right' });
  await expect(page.getByRole('menu')).toBeVisible();

  await page.getByRole('menuitem', { name: 'Inspect run' }).click();
  await expect(page.locator('.phase5-log')).toContainText('inspect');

  await page.getByRole('button', { name: 'Show snackbar sequence' }).click();
  await expect(page.locator('.cv-snackbar')).toBeVisible();

  await page.getByRole('button', { name: 'Open alert dialog' }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
});
