import { defineConfig } from '@playwright/test';

// Pure TypeScript tests: no browser, web server, or user storage.
export default defineConfig({
  testDir: '.',
  testMatch: 'game-session-core.spec.ts',
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: 'list',
});
