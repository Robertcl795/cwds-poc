import { expect, test } from '@playwright/test';

test('renders primitive components route', async ({ page }) => {
  await page.goto('/#components-primitives');

  await expect(page.getByRole('heading', { name: 'Primitive Components Demo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirm' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Enable notifications' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Auto deploy' })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Upload progress' })).toBeVisible();
});
