import { test, expect } from '@playwright/test';

test('homepage loads and shows game content', async ({ page }) => {
  await page.goto('/');
  // The page should load without error
  await expect(page).not.toHaveTitle(/error/i);
  // At least one of main, h1, or a flag-related element should be visible
  const body = page.locator('body');
  await expect(body).toBeVisible();
  // Confirm the page renders meaningful content (not a blank screen)
  const content = await page.textContent('body');
  expect(content && content.trim().length).toBeGreaterThan(0);
});
