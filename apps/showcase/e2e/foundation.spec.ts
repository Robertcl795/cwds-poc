import { expect, test } from '@playwright/test';

test('renders foundation controls', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Interactive button' })).toBeVisible();
  await expect(page.locator('.cv-icon')).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(page.locator('#foundation-button')).toBeFocused();
});
