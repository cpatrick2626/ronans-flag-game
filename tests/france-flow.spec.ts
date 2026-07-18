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

// Regions fill by press-and-hold (~1.4s). Press the region center, hold for
// the given time, then release.
async function holdRegion(page: import('@playwright/test').Page, region: import('@playwright/test').Locator, ms: number) {
  const box = await region.boundingBox();
  if (!box) throw new Error('region is not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
}

// Phase 1: the palette stays hidden until the player holds on the flag and
// the dotted boundary lines finish drawing (~1.2s). Hold through completion
// and the reveal, then release once the palette has arrived.
async function drawTheLines(page: import('@playwright/test').Page) {
  const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' });
  await expect(holdTarget).toBeAttached();
  const box = await holdTarget.boundingBox();
  if (!box) throw new Error('line hold target is not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByRole('button', { name: 'Blue orb' })).toBeAttached({ timeout: 6000 });
  await page.mouse.up();
}

test('France draw-the-lines phase: palette hidden, hold pauses and resumes, reveal unlocks coloring', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);

  // Blank flag with dotted guides; the palette is not rendered at all
  await expect(page.locator('.flag-line-guide')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Blue orb' })).toHaveCount(0);
  const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' });
  await expect(holdTarget).toBeAttached();
  const box = await holdTarget.boundingBox();
  if (!box) throw new Error('line hold target is not visible');

  // Pointer movement alone never reveals the coloring pencil in Phase 1.
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('.colored-pencil')).not.toHaveClass(/is-visible/);
  await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '0');

  // A short hold advances the draw part-way; releasing pauses it
  const readProgress = () => page.locator('.flag-line-draw').evaluate((el) => Number.parseFloat((el as SVGGElement).style.getPropertyValue('--line-progress') || '0'));
  await page.mouse.down();
  await page.waitForTimeout(400);
  await page.mouse.up();
  const paused = await readProgress();
  expect(paused).toBeGreaterThan(0.1);
  expect(paused).toBeLessThan(1);

  // Still no palette and no coloring while paused mid-draw
  await expect(page.getByRole('button', { name: 'Blue orb' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'France blue stripe' })).not.toHaveClass(/is-filled/);

  // Re-holding resumes from the paused progress; completion reveals the palette
  await page.mouse.down();
  await expect(page.getByRole('button', { name: 'Blue orb' })).toBeAttached({ timeout: 6000 });
  await page.mouse.up();

  // Coloring works only now
  await page.getByRole('button', { name: 'Blue orb' }).click();
  const blueStripe = page.getByRole('button', { name: 'France blue stripe' });
  await holdRegion(page, blueStripe, 2500);
  await expect(blueStripe).toHaveClass(/is-filled/);

  expect(errors).toEqual([]);
});

test('France challenge flow: entry, orbs, stripes, back navigation', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);
  await drawTheLines(page);

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
  await drawTheLines(page);

  const blueStripe = page.getByRole('button', { name: 'France blue stripe' });
  const whiteStripe = page.getByRole('button', { name: 'France white stripe' });
  const redStripe = page.getByRole('button', { name: 'France red stripe' });

  // Wrong color: holding yellow on the blue stripe shakes and never fills
  await page.getByRole('button', { name: 'Yellow orb' }).click();
  await holdRegion(page, blueStripe, 600);
  await expect(blueStripe).toHaveClass(/wrong/);
  await expect(blueStripe).not.toHaveClass(/is-filled/);
  await expect(page.locator('.france-spark-burst.is-wrong')).toBeAttached();

  await page.getByRole('button', { name: 'Green orb' }).click();
  await blueStripe.click({ force: true });
  await expect(blueStripe).toHaveClass(/wrong/);
  await expect(blueStripe).not.toHaveClass(/is-filled/);

  // Correct color: a short hold pauses part-way and does not fill
  await page.getByRole('button', { name: 'Blue orb' }).click();
  await holdRegion(page, blueStripe, 400);
  await expect(blueStripe).not.toHaveClass(/is-filled/);

  // Rapid taps accumulate no meaningful progress (no instant-complete exploit)
  for (let i = 0; i < 5; i += 1) await blueStripe.click({ force: true });
  await expect(blueStripe).not.toHaveClass(/is-filled/);

  // Re-holding resumes from the paused progress and completes the fill
  const blueBox = await blueStripe.boundingBox();
  if (!blueBox) throw new Error('blue stripe is not visible');
  await page.mouse.move(blueBox.x + blueBox.width / 2, blueBox.y + blueBox.height / 2);
  await page.mouse.down();
  await expect(blueStripe).toHaveClass(/is-filled/, { timeout: 4000 });
  await expect(page.locator('.france-spark-burst.is-correct')).toBeAttached();
  await page.mouse.up();

  await page.getByRole('button', { name: 'White orb' }).click();
  await holdRegion(page, whiteStripe, 2000);
  await expect(whiteStripe).toHaveClass(/is-filled/);
  await expect(whiteStripe).toHaveClass(/is-white-region/);
  await page.getByRole('button', { name: 'Red orb' }).click();
  await holdRegion(page, redStripe, 2000);
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
  // Full reset of both phases: back to the blank dotted-line state, palette hidden
  await expect(page.getByRole('button', { name: 'Hold to draw the flag lines' })).toBeAttached();
  await expect(page.getByRole('button', { name: 'Blue orb' })).toHaveCount(0);

  // Back navigation still works after a completed round
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'PLAY SOLO' })).toBeVisible();
  await page.getByRole('button', { name: 'Back', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Flag Color Challenge' })).toBeVisible();

  expect(errors).toEqual([]);
});

test('France magical motion layer: scoped cursor, pencil, ambient, and reduced motion', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);
  await drawTheLines(page);

  const stage = page.locator('.france-play-stage');
  await expect(stage).toBeVisible();
  await expect(stage).toHaveCSS('cursor', 'none');
  await expect(page.locator('.france-play-ambient .france-cloud')).toHaveCount(2);
  await expect(page.locator('.france-play-ambient .france-aurora')).toHaveCount(2);

  await page.mouse.move(220, 220);
  await expect(page.locator('.colored-pencil')).not.toHaveClass(/is-visible/);
  await expect(page.locator('.colored-pencil')).toHaveCSS('opacity', '0');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Blue orb' }).click();
  await holdRegion(page, page.getByRole('button', { name: 'France blue stripe' }), 2000);
  await expect(page.getByRole('button', { name: 'France blue stripe' })).toHaveClass(/is-filled/);

  expect(errors).toEqual([]);
});

test('France fill choreography: random pattern class and stroking pencil during hold', async ({ page }) => {
  await page.setViewportSize(viewports[0]);
  const errors: string[] = [];
  await playThroughToFrance(page, errors);
  await drawTheLines(page);

  // Every region layer carries a randomized fill-pattern class for this attempt
  await expect(page.locator('.france-fill-layer[class*="fill-pattern-"]')).toHaveCount(3);

  await page.getByRole('button', { name: 'Blue orb' }).click();
  const blueStripe = page.getByRole('button', { name: 'France blue stripe' });
  const box = await blueStripe.boundingBox();
  if (!box) throw new Error('blue stripe is not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();

  // While filling, the pencil detaches and strokes along the fill front
  const pencil = page.locator('.colored-pencil');
  await expect(pencil).toHaveClass(/is-visible/);
  await expect(pencil).toHaveClass(/is-scribbling/);
  await expect(pencil).toHaveCSS('opacity', '1');
  const readX = () => pencil.evaluate((el) => el.style.getPropertyValue('--pencil-x'));
  const samples = [await readX()];
  await page.waitForTimeout(180);
  samples.push(await readX());
  await page.waitForTimeout(180);
  samples.push(await readX());
  expect(new Set(samples).size).toBeGreaterThan(1);

  // Releasing mid-fill stops the stroke and keeps the partial fill unfilled
  await page.mouse.up();
  await expect(pencil).not.toHaveClass(/is-visible/);
  await expect(pencil).not.toHaveClass(/is-scribbling/);
  await expect(pencil).toHaveCSS('opacity', '0');
  await expect(blueStripe).not.toHaveClass(/is-filled/);

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
