import { expect, test } from '@playwright/test';
import { createClient, type User } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for auth E2E tests.',
  );
}

const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function listUsersPaged(page = 1, perPage = 100) {
  const { data } = await adminClient.auth.admin.listUsers({
    page,
    perPage,
  });
  return data?.users ?? [];
}

async function findUserByEmail(email: string) {
  for (let page = 1; page <= 5; page += 1) {
    const users = await listUsersPaged(page);
    const match = users.find((user) => user.email === email);
    if (match) {
      return match;
    }
    if (users.length < 100) {
      break;
    }
  }
  return undefined;
}

async function deleteUserByEmail(email: string) {
  const user = await findUserByEmail(email);
  if (user) {
    await adminClient.auth.admin.deleteUser(user.id);
  }
}

async function confirmUserByEmail(email: string) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const user = (await findUserByEmail(email)) as User | undefined;
    if (user) {
      await adminClient.auth.admin.updateUserById(user.id, {
        email_confirm: true,
      });
      return user.id;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Unable to locate newly created user for ${email}`);
}

test.describe('Parent auth flow', () => {
  test('signup then login', async ({ page }) => {
    const email = `playwright+${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const household = `Playwright Family ${Date.now()}`;

    await deleteUserByEmail(email);

    await page.goto('/signup');
    await page.getByLabel('Household name').fill(household);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: /create account/i }).click();

    await confirmUserByEmail(email);

    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page).toHaveURL(/\/parent/);

    await deleteUserByEmail(email);
  });
});
