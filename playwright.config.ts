import type { PlaywrightTestConfig } from '@playwright/test';

const PORT = Number(process.env.PORT ?? 3100);
const HOST = process.env.HOST ?? '127.0.0.1';
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${HOST}:${PORT}`;

const config: PlaywrightTestConfig = {
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
  },
  webServer: {
    command: `pnpm exec next dev --hostname ${HOST} --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  reporter: [['list'], ['html', { open: process.env.CI ? 'never' : 'never' }]],
};

export default config;
