import { expect, test } from '@playwright/test';

test('loads showcase app', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Create Alert Rule' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save rule' })).toBeVisible();
});
