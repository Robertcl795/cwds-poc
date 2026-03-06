import { expect, test } from '@playwright/test';

test('renders form verification route and submits form payload', async ({ page }) => {
  await page.goto('/#verification-forms');

  await expect(page.getByRole('heading', { name: 'Form Verification Demo' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Email' }).fill('team@example.com');
  await page.locator('label.cv-chip--filter:has(#verification-forms-chip-beta) .cv-chip__surface').click();
  await page.getByRole('slider', { name: 'Volume' }).fill('55');
  await page.getByRole('combobox', { name: 'Status (enhanced if supported)' }).selectOption('canary');
  await page.getByRole('combobox', { name: 'Status (baseline)' }).selectOption('stable');

  await page.getByRole('button', { name: 'Submit hardening form' }).click();

  await expect(page.locator('.verification-forms-result')).toContainText('team@example.com');
  await expect(page.locator('.verification-forms-result')).toContainText('canary');
  await expect(page.locator('.verification-forms-result')).toContainText('stable');
});
