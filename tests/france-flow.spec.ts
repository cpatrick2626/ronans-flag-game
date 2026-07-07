import { test, expect } from '@playwright/test';

const viewports = [
  { width: 390, height: 844 },
  { width: 414, height: 736 },
  { width: 421, height: 743 },
];

async function playThroughToFrance(page: import('@playwright/test').Page, errors: string[]) {
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('/');

  // Loading/title screen with PLAY hitbox
  const play = page.getByRole('button', { name: "Play Ronan's Flag Game" });
  await expect(play).toBeVisible();

  // Player-name modal on first visit. Under parallel dev-server load the
  // first click can land before hydration, so re-click until the modal shows.
  const continueBtn = page.getByRole('button', { name: 'Continue' });
  await expect(async () => {
    await play.click();
    await expect(continueBtn).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });
  await continueBtn.click();

  // Home/map screen with challenge entry and pins
  const challengeEntry = page.getByRole('button', { name: 'Flag Color Challenge' });
  await expect(challengeEntry).toBeVisible();
  await expect(page.getByRole('button', { name: 'France', exact: true })).toBeAttached();
  await challengeEntry.click();

  // Flag Color Challenge select screen
  const playSolo = page.getByRole('button', { name: 'PLAY SOLO' });
  await expect(playSolo).toBeVisible();
  await playSolo.click();

  // France gameplay scene
  await expect(page.getByAltText('France Flag Color Challenge')).toBeVisible();
}

test('France challenge flow: entry, orbs, stripes, back navigation', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);

  // Orb selection behavior
  const blueOrb = page.getByRole('button', { name: 'Blue orb' });
  const redOrb = page.getByRole('button', { name: 'Red orb' });
  await expect(blueOrb).toHaveAttribute('aria-pressed', 'true');
  await redOrb.click();
  await expect(redOrb).toHaveAttribute('aria-pressed', 'true');
  await expect(blueOrb).toHaveAttribute('aria-pressed', 'false');

  // Flag regions respond (they idle-animate, so force past the stability check)
  await page.getByRole('button', { name: 'France blue stripe' }).click({ force: true });
  await page.getByRole('button', { name: 'France white stripe' }).click({ force: true });
  await page.getByRole('button', { name: 'France red stripe' }).click({ force: true });

  // Back to select screen, then back to home
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'PLAY SOLO' })).toBeVisible();
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Flag Color Challenge' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('France gameplay: wrong feedback, correct fills, completion, reset', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);

  const blueStripe = page.getByRole('button', { name: 'France blue stripe' });
  const whiteStripe = page.getByRole('button', { name: 'France white stripe' });
  const redStripe = page.getByRole('button', { name: 'France red stripe' });

  // Wrong color: yellow on the blue stripe shakes and does not fill
  await page.getByRole('button', { name: 'Yellow orb' }).click();
  await blueStripe.click({ force: true });
  await expect(blueStripe).toHaveClass(/wrong/);
  await expect(blueStripe).not.toHaveClass(/is-filled/);

  // Correct colors fill each region
  await page.getByRole('button', { name: 'Blue orb' }).click();
  await blueStripe.click({ force: true });
  await expect(blueStripe).toHaveClass(/is-filled/);
  await page.getByRole('button', { name: 'White orb' }).click();
  await whiteStripe.click({ force: true });
  await expect(whiteStripe).toHaveClass(/is-filled/);
  await page.getByRole('button', { name: 'Red orb' }).click();
  await redStripe.click({ force: true });
  await expect(redStripe).toHaveClass(/is-filled/);

  // Completion card, then the reward flow triggers automatically exactly once
  await expect(page.getByText('FLAG COMPLETE')).toBeVisible();
  await expect(page.getByText('COUNTRY DISCOVERED')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('COUNTRY DISCOVERED')).toHaveCount(1);
  // The celebration card animates continuously, so force past the stability check
  await page.getByRole('button', { name: 'Continue' }).click({ force: true });
  await expect(page.getByText('COUNTRY DISCOVERED')).toHaveCount(0);

  // Re-entering the challenge resets the round
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'PLAY SOLO' })).toBeVisible();
  await page.getByRole('button', { name: 'PLAY SOLO' }).click();
  await expect(page.getByAltText('France Flag Color Challenge')).toBeVisible();
  await expect(page.getByRole('button', { name: 'France blue stripe' })).not.toHaveClass(/is-filled/);

  // Back navigation still works after a completed round
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'PLAY SOLO' })).toBeVisible();
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Flag Color Challenge' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('France paint feedback: wrong shake, correct glow via country arrival', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);

  // Back out to home, then reach the country-arrival flag via the Passport log
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await page.getByRole('button', { name: 'Passport nav' }).click();
  await page.getByRole('button', { name: /^France Europe/ }).click();

  // Flag regions float continuously, so force clicks past the stability check
  const regions = page.locator('svg.flag-hero g[role="button"]');
  await expect(regions).toHaveCount(3);

  // Wrong color (red) on the left stripe (correct: blue) shows wrong feedback
  await page.getByRole('button', { name: 'Color 3' }).click();
  await regions.nth(0).click({ force: true });
  await expect(regions.nth(0)).toHaveClass(/wrong-shake/);

  // Correct colors on every stripe show correct feedback
  await page.getByRole('button', { name: 'Color 1' }).click();
  await regions.nth(0).click({ force: true });
  await page.getByRole('button', { name: 'Color 2' }).click();
  await regions.nth(1).click({ force: true });
  await page.getByRole('button', { name: 'Color 3' }).click();
  await regions.nth(2).click({ force: true });
  await expect(regions.nth(0)).toHaveClass(/correct-glow/);
  await expect(regions.nth(1)).toHaveClass(/correct-glow/);
  await expect(regions.nth(2)).toHaveClass(/correct-glow/);
  await expect(page.getByText('3 regions | 3 filled | Perfect ready')).toBeVisible();

  // Home nav returns to the map
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Flag Color Challenge' })).toBeVisible();

  expect(errors).toEqual([]);
});

for (const viewport of viewports) {
  test(`no horizontal overflow through France flow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    await playThroughToFrance(page, errors);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}
