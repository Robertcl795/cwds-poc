import { expect, test } from '@playwright/test';

test('renders phase2 input surfaces route', async ({ page }) => {
  await page.goto('/#phase2');

  await expect(page.getByRole('heading', { name: 'Phase 2 Input Surfaces Demo' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Deploy' })).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Stable' })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Volume' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Release status' })).toBeVisible();
});
