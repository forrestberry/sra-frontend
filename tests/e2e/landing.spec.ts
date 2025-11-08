import { expect, test } from '@playwright/test';

test.describe('Marketing landing page', () => {
  test('displays hero content and CTAs', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /keep every sra reader/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /create parent account/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /student workspace preview/i }),
    ).toBeVisible();
  });
});
