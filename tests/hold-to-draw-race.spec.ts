import { test, expect } from '@playwright/test';

// GUARD 1 — Cold-load hold-to-draw race (verifies fix from commit 501df54)
//
// The fix gates the hold-to-draw gesture on data-scene-ready="true" so that
// a slow image decode on first load never lets drawing start prematurely.
// We use page.route() to hold the scene image response until we decide to
// release it, giving us a fully deterministic window where the image is
// pending without any timing guesses or arbitrary sleeps.

test.setTimeout(90_000);

// Navigate to the challenge screen and return once the hold-target button is
// attached. Deliberately does NOT wait for data-scene-ready so Guard 1 can
// assert the pre-ready state.
async function goToChallenge(page: import('@playwright/test').Page, errors: string[]) {
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
  await page.getByRole('button', { name: 'Flag Color Challenge' }).click();
  await page.getByRole('button', { name: 'PLAY SOLO' }).click();
  // Wait for hold target to be in DOM — does NOT require scene image to load
  await expect(page.getByRole('button', { name: 'Hold to draw the flag lines' })).toBeAttached({ timeout: 15000 });
}

// Returns current draw progress (0 if element absent or no progress set).
async function drawProgress(page: import('@playwright/test').Page): Promise<number> {
  return page.locator('.flag-line-draw')
    .evaluate((el) => parseFloat((el as SVGGElement).style.getPropertyValue('--line-progress') || '0'))
    .catch(() => 0);
}

const cases = [
  {
    label: 'Italy landscape 1900×1000',
    sceneGlob: '**/italy-scene-landscape-v1.png',
    viewport: { width: 1900, height: 1000 },
    iso2: 'IT',
  },
  {
    label: 'France landscape 1900×1000',
    sceneGlob: '**/france-scene-landscape-v1.png',
    viewport: { width: 1900, height: 1000 },
    iso2: 'FR',
  },
  {
    label: 'France portrait 390×844',
    sceneGlob: '**/france-scene-v2.png',
    viewport: { width: 390, height: 844 },
    iso2: 'FR',
  },
];

for (const { label, sceneGlob, viewport, iso2 } of cases) {
  test(`hold-to-draw gate: refused before scene ready, accepted after — ${label}`, async ({ page }) => {
    // Set up a gate: the scene image is fetched from the real server but its
    // delivery to the browser is held until releaseScene() is called.
    let releaseScene: () => void = () => {};
    const sceneGate = new Promise<void>((resolve) => { releaseScene = resolve; });

    await page.route(sceneGlob, async (route) => {
      const response = await route.fetch();
      const body = await response.body();
      await sceneGate; // hold delivery until test releases it
      await route.fulfill({ response, body });
    });

    await page.setViewportSize(viewport);
    if (iso2 !== 'FR') {
      await page.addInitScript((code: string) => {
        window.localStorage.setItem('flag_game_v1_active_country', code);
      }, iso2);
    }

    const errors: string[] = [];
    await goToChallenge(page, errors);

    // ── Assert: image still pending, gate not yet released ──────────────────────
    // The route interceptor guarantees data-scene-ready has not been set.
    const sceneImg = page.locator('img.france-play-image');
    expect(await sceneImg.getAttribute('data-scene-ready')).toBeNull();

    // Hold gesture before scene ready — must NOT start drawing.
    const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' });
    const box = await holdTarget.boundingBox();
    if (!box) throw new Error('holdTarget has no bounding box before scene ready');

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(700); // well past the draw-start threshold (~300 ms)
    const progressBefore = await drawProgress(page);
    await page.mouse.up();

    expect(progressBefore).toBe(0); // drawing MUST NOT have started

    // ── Release scene image, wait for ready signal ───────────────────────────────
    releaseScene();
    await page.locator('img.france-play-image[data-scene-ready="true"]').waitFor({ timeout: 15000 });

    // ── Assert: same gesture now starts drawing ──────────────────────────────────
    // Re-read bounding box in case layout shifted after image decode.
    const boxAfter = await holdTarget.boundingBox();
    if (!boxAfter) throw new Error('holdTarget lost bounding box after scene ready');

    await page.mouse.move(boxAfter.x + boxAfter.width / 2, boxAfter.y + boxAfter.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(800);
    const progressAfter = await drawProgress(page);
    await page.mouse.up();

    // 0.02 is a safe floor: before scene ready we got exactly 0, so any progress
    // here unambiguously means drawing has started.
    expect(progressAfter).toBeGreaterThan(0.02); // drawing HAS started

    expect(errors).toEqual([]);
  });
}
