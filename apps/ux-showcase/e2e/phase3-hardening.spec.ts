import { expect, test } from '@playwright/test';

test('renders phase3-hardening route and validates keyboard + dialog focus flows', async ({ page }) => {
  await page.goto('/#phase3-hardening');

  await expect(page.getByRole('heading', { name: 'Phase 3.5 Hardening Demo' })).toBeVisible();

  const tabs = page.getByRole('tab', { name: 'Overview' });
  await tabs.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Home/End and orientation coverage should be tested.')).toBeVisible();

  await page.getByRole('button', { name: 'Open hardening dialog' }).click();
  await expect(page.getByRole('heading', { name: 'Overlay hardening checks' })).toBeVisible();
  await page.keyboard.press('Escape');

  const trigger = page.getByRole('button', { name: 'Open hardening dialog' });
  await expect(trigger).toBeFocused();

  await page.getByRole('button', { name: 'Open hardening report' }).click();
  await expect(page.locator('#phase35-list-log')).toContainText('Action: open-report');
});
