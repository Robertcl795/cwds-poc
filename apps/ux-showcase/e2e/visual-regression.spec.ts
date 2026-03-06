import { expect, test } from '@playwright/test';

test('phase4 adapter surfaces stay visually stable', async ({ page }) => {
  await page.goto('/#phase4');

  const adapterAudit = page.locator('[data-phase4-adapter-audit="true"]');
  await expect(adapterAudit).toBeVisible();
  await expect(adapterAudit).toHaveScreenshot('phase4-adapter-surfaces.png', {
    animations: 'disabled',
    caret: 'hide'
  });
});

test('phase5 tone surfaces stay visually stable', async ({ page }) => {
  await page.goto('/#phase5');

  const toneAudit = page.locator('[data-phase5-tone-audit="true"]');
  await expect(toneAudit).toBeVisible();
  await expect(toneAudit).toHaveScreenshot('phase5-tone-surfaces.png', {
    animations: 'disabled',
    caret: 'hide'
  });
});
