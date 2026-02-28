import { expect, test } from '@playwright/test';

test('renders phase1 primitives route', async ({ page }) => {
  await page.goto('/#phase1');

  await expect(page.getByRole('heading', { name: 'Phase 1 Primitives Demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Enable notifications' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Auto deploy' })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Upload progress' })).toBeVisible();
});
