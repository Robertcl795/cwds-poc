import { expect, test } from '@playwright/test';

test('renders phase2.5 hardening route and submits form payload', async ({ page }) => {
  await page.goto('/#phase2-hardening');

  await expect(page.getByRole('heading', { name: 'Phase 2.5 Hardening Demo' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).fill('team@example.com');
  await page.locator('label.cv-chip--filter:has(#phase25-chip-beta) .cv-chip__surface').click();
  await page.getByRole('slider', { name: 'Volume' }).fill('55');
  await page.getByRole('combobox', { name: 'Status (enhanced if supported)' }).selectOption('canary');
  await page.getByRole('combobox', { name: 'Status (baseline)' }).selectOption('stable');

  await page.getByRole('button', { name: 'Submit hardening form' }).click();

  await expect(page.locator('.phase25-result')).toContainText('team@example.com');
  await expect(page.locator('.phase25-result')).toContainText('canary');
  await expect(page.locator('.phase25-result')).toContainText('stable');
});
