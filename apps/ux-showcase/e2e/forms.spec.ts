import { expect, test } from '@playwright/test';

test('renders form components route', async ({ page }) => {
  await page.goto('/#components-forms');

  await expect(page.getByRole('heading', { name: 'Form Components Demo' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Deploy' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Stable' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Volume' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Release status' })).toBeVisible();
});
