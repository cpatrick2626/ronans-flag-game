import { test, expect } from '@playwright/test';

test.setTimeout(90_000);

// Italy inherits the whole challenge loop from the shared config-driven
// engine; these tests mirror the France flow to prove the template works.

async function playThroughToChallenge(page: import('@playwright/test').Page, errors: string[], sceneAlt: string) {
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

  await page.goto('/');

  const play = page.getByRole('button', { name: "Play Ronan's Flag Game" });
  await expect(play).toBeVisible();
  const continueBtn = page.getByRole('button', { name: 'Continue' });
  await expect(async () => {
    await play.click();
    await expect(continueBtn).toBeVisible({ timeout: 2000 });
  }).toPass({ timeout: 15000 });
  await continueBtn.click();

  const challengeEntry = page.getByRole('button', { name: 'Flag Color Challenge' });
  await expect(challengeEntry).toBeVisible();
  await challengeEntry.click();

  const playSolo = page.getByRole('button', { name: 'PLAY SOLO' });
  await expect(playSolo).toBeVisible();
  await playSolo.click();

  await expect(page.getByAltText(sceneAlt)).toBeVisible();
}

async function holdRegion(page: import('@playwright/test').Page, region: import('@playwright/test').Locator, ms: number) {
  const box = await region.boundingBox();
  if (!box) throw new Error('region is not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

async function drawTheLines(page: import('@playwright/test').Page, firstOrb: string) {
  const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' });
  await expect(holdTarget).toBeAttached();
  const box = await holdTarget.boundingBox();
  if (!box) throw new Error('line hold target is not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByRole('button', { name: firstOrb })).toBeAttached({ timeout: 6000 });
  await page.mouse.up();
}

test.describe('Italy challenge', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  // Start each test with Italy as the active country (saved-state path).
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('flag_game_v1_active_country', 'IT');
    });
  });

  test('Italy base palette shows only green, white, and red', async ({ page }) => {
    const errors: string[] = [];
    await playThroughToChallenge(page, errors, 'Italy Flag Color Challenge');

    // Blank flag with the two dotted stripe dividers, palette hidden
    await expect(page.locator('.flag-line-guide')).toHaveCount(2);
    await expect(page.getByRole('button', { name: 'Green orb' })).toHaveCount(0);
    await drawTheLines(page, 'Green orb');

    const gems = page.locator('.france-palette-gem');
    await expect(gems).toHaveCount(3);
    const labels = await gems.evaluateAll((items) => items.map((item) => item.getAttribute('aria-label')));
    expect([...labels].sort()).toEqual(['Green orb', 'Red orb', 'White orb']);
    await expect(page.getByRole('button', { name: 'Yellow orb' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Blue orb' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Green orb' })).toHaveAttribute('aria-pressed', 'true');

    const greenStripe = page.getByRole('button', { name: 'Italy green stripe' });
    const greenBox = await greenStripe.boundingBox();
    if (!greenBox) throw new Error('green stripe is not visible');
    await page.mouse.move(greenBox.x + greenBox.width / 2, greenBox.y + greenBox.height / 2);
    await expect(page.locator('.colored-pencil')).toHaveClass(/is-visible/);
    await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '1');
    await page.mouse.move(0, 0);
    await expect(page.locator('.colored-pencil')).toHaveClass(/is-visible/);
    await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '1');

    expect(errors).toEqual([]);
  });

  test('Italy gameplay: wrong feedback, correct fills, completion, reset', async ({ page }) => {
    const errors: string[] = [];
    await playThroughToChallenge(page, errors, 'Italy Flag Color Challenge');
    await drawTheLines(page, 'Green orb');

    const greenStripe = page.getByRole('button', { name: 'Italy green stripe' });
    const whiteStripe = page.getByRole('button', { name: 'Italy white stripe' });
    const redStripe = page.getByRole('button', { name: 'Italy red stripe' });

    // Wrong color: holding red on the green stripe shakes and never fills
    await page.getByRole('button', { name: 'Red orb' }).click();
    const wrongBox = await greenStripe.boundingBox();
    if (!wrongBox) throw new Error('green stripe is not visible');
    await page.mouse.move(wrongBox.x + wrongBox.width / 2, wrongBox.y + wrongBox.height / 2);
    await page.mouse.down();
    await expect(page.locator('.france-spark-burst.is-wrong')).toBeAttached();
    await page.waitForTimeout(600);
    await page.mouse.up();
    await expect(greenStripe).toHaveClass(/wrong/);
    await expect(greenStripe).not.toHaveClass(/is-filled/);

    // Correct fills: green left, white middle, red right
    await page.getByRole('button', { name: 'Green orb' }).click();
    await holdRegion(page, greenStripe, 2500);
    await expect(greenStripe).toHaveClass(/is-filled/);
    await page.getByRole('button', { name: 'White orb' }).click();
    await holdRegion(page, whiteStripe, 2500);
    await expect(whiteStripe).toHaveClass(/is-filled/);
    await expect(whiteStripe).toHaveClass(/is-white-region/);
    await page.getByRole('button', { name: 'Red orb' }).click();
    await holdRegion(page, redStripe, 2500);
    await expect(redStripe).toHaveClass(/is-filled/);
    await expect(page.locator('.colored-pencil')).not.toHaveClass(/is-visible/);
    await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '0');

    // Completion card names Italy, then the reward flow fires exactly once
    await expect(page.getByText('FLAG COMPLETE')).toBeVisible();
    await expect(page.locator('.flag-celebration-card').getByText('ITALY')).toBeVisible();
    await expect(page.getByText('COUNTRY DISCOVERED')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('COUNTRY DISCOVERED')).toHaveCount(1);

    // Next Flag is available now that a second country is playable
    await expect(page.getByRole('button', { name: 'Next Flag' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click({ force: true });
    await expect(page.getByText('COUNTRY DISCOVERED')).toHaveCount(0);

    // Re-entering the challenge resets both phases to blank
    await page.getByRole('button', { name: 'Back', exact: true }).first().click();
    await expect(page.getByRole('button', { name: 'PLAY SOLO' })).toBeVisible();
    await page.getByRole('button', { name: 'PLAY SOLO' }).click();
    await expect(page.getByAltText('Italy Flag Color Challenge')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hold to draw the flag lines' })).toBeAttached();
    await expect(page.getByRole('button', { name: 'Green orb' })).toHaveCount(0);
    await expect(page.locator('.colored-pencil')).toHaveClass(/is-visible/);

    expect(errors).toEqual([]);
  });

  test('Italy landscape orientation uses the landscape scene', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const errors: string[] = [];
    await playThroughToChallenge(page, errors, 'Italy Flag Color Challenge');
    await expect(page.getByAltText('Italy Flag Color Challenge')).toHaveAttribute('src', '/assets/italy-scene-landscape-v1.png');
    await expect(page.locator('.flag-line-guide')).toHaveCount(2);
    await expect(page.locator('.colored-pencil')).toHaveClass(/is-visible/);
    await drawTheLines(page, 'Green orb');

    const greenStripe = page.getByRole('button', { name: 'Italy green stripe' });
    const box = await greenStripe.boundingBox();
    if (!box) throw new Error('green stripe is not visible');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.locator('.colored-pencil')).toHaveClass(/is-visible/);
    await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '1');
    await page.mouse.move(0, 0);
    await expect(page.locator('.colored-pencil')).toHaveClass(/is-visible/);
    await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '1');
    expect(errors).toEqual([]);
  });
});

test('Next Flag routes from a completed France to Italy', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  await playThroughToChallenge(page, errors, 'France Flag Color Challenge');
  await drawTheLines(page, 'Blue orb');

  await page.getByRole('button', { name: 'Blue orb' }).click();
  await holdRegion(page, page.getByRole('button', { name: 'France blue stripe' }), 2500);
  await page.getByRole('button', { name: 'White orb' }).click();
  await holdRegion(page, page.getByRole('button', { name: 'France white stripe' }), 2500);
  await page.getByRole('button', { name: 'Red orb' }).click();
  await holdRegion(page, page.getByRole('button', { name: 'France red stripe' }), 2500);

  await expect(page.getByText('COUNTRY DISCOVERED')).toBeVisible({ timeout: 5000 });
  const nextFlag = page.getByRole('button', { name: 'Next Flag' });
  await expect(nextFlag).toBeVisible();
  await nextFlag.click({ force: true });

  // Next Flag advances to the Italy country-arrival screen
  await expect(page.getByText('Italy').first()).toBeVisible();

  expect(errors).toEqual([]);
});
