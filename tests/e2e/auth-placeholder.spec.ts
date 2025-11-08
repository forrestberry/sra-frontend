import { expect, test } from '@playwright/test';

test.describe('Auth placeholder pages', () => {
  test('login form captures email + password state', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel('Email');
    await emailInput.fill('parent@example.com');

    const passwordInput = page.getByLabel('Password');
    await passwordInput.fill('hunter2!');

    await expect(page.getByRole('button', { name: /continue/i })).toBeEnabled();
  });

  test('signup form requires all fields', async ({ page }) => {
    await page.goto('/signup');

    await page.getByLabel('Household name').fill('Berry family');
    await page.getByLabel('Email').fill('parent@example.com');
    await page.getByLabel('Password').fill('strongpassword');

    await expect(
      page.getByRole('button', { name: /create account \(coming soon\)/i }),
    ).toBeEnabled();
  });
});
