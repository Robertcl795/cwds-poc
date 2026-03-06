import { expect, test } from '@playwright/test';

test('overlay adapter surfaces stay visually stable', async ({ page }) => {
  await page.goto('/#components-overlays');

  const adapterAudit = page.locator('[data-overlays-adapter-audit="true"]');
  await expect(adapterAudit).toBeVisible();
  await expect(adapterAudit).toHaveScreenshot('overlays-adapter-surfaces.png', {
    animations: 'disabled',
    caret: 'hide'
  });
});

test('workflow tone surfaces stay visually stable', async ({ page }) => {
  await page.goto('/#components-workflows');

  const toneAudit = page.locator('[data-workflows-tone-audit="true"]');
  await expect(toneAudit).toBeVisible();
  await expect(toneAudit).toHaveScreenshot('workflows-tone-surfaces.png', {
    animations: 'disabled',
    caret: 'hide'
  });
});
