import { test, expect } from '@playwright/test';

// GUARD 3 — Hitedit save round-trip invariant
//
// This is the guard that would have caught the save-jump bug: a coordinate-
// frame error in doSave that caused elements with transform:translate(-50%,-50%)
// to be saved at the wrong percentage (~half-element-width off), so on reload
// the element visibly jumped from its placed position.
//
// Strategy: mock hitedit-overrides.json with a known position, navigate to
// hitedit mode, intercept the POST to /api/hitedit-save, click Save, then
// verify the captured payload preserves the original positions.  Finally
// page.reload() forces a full React state reset so the verification pass reads
// the saved values fresh — the full placed → saved → loaded cycle.
//
// Two branches of doSave are covered:
//   • challenge branch  (key = country ISO, saves orbLefts/orbTops for gems)
//   • boxes branch      (key = screen name, saves boxes for non-challenge screens)
// Both orientations are covered for the challenge branch.

test.setTimeout(90_000);

// Parses a percentage string like '40.0%' → 40.0.
function parsePct(s: string): number {
  return parseFloat(s.replace('%', ''));
}

// Navigates from the loading screen (after a fresh load) through to the gem
// palette on the France challenge screen.  Handles the player-name modal on
// first visits by probing whether it actually shows before clicking Continue,
// so it works regardless of whether localStorage already has the confirmed flag.
//
// FINDING: when ?hitedit=1 is active, child divs within #he-overlay intercept
// pointer events over the entire viewport in portrait (390×844), blocking PLAY,
// the name-modal Continue button, and hold-to-draw mouse events.  Landscape
// (844×390) is unaffected — the overlay's hit region differs by orientation.
//
// Inline DOM mutation (visibility:hidden, style.pointerEvents) is unreliable here
// because React may remount #he-overlay between the mutation and the action.
// page.addStyleTag is the correct suppression mechanism: injected CSS persists
// through React re-renders and survives SPA navigation within a page load.
// evaluate(el.click()) is layered on top for button clicks because Playwright's
// own hit-test check runs before the browser resolves the cascaded CSS value —
// the browser click itself is fine but Playwright would still abort pre-flight.
//
// This portrait-vs-landscape pointer-interception asymmetry may be connected to
// the known "mobile drag barely moves" bug (Step 2) — worth investigating overlay
// z-order and pointer-event coverage per orientation when that is addressed.
async function navigateToFranceGems(page: import('@playwright/test').Page, gemLabel: string) {
  // Suppress #he-overlay and all descendants for the navigation phase.
  // !important beats any component-level pointer-events that React may apply.
  await page.addStyleTag({ content: '#he-overlay, #he-overlay * { pointer-events: none !important; }' });

  const play = page.getByRole('button', { name: "Play Ronan's Flag Game" });
  await expect(play).toBeVisible({ timeout: 10000 });

  const continueBtn = page.getByRole('button', { name: 'Continue' });
  const challengeEntry = page.getByRole('button', { name: 'Flag Color Challenge' });

  // evaluate(el.click()) dispatches the click directly on the DOM element,
  // bypassing Playwright's pre-flight hit-test which can still flag interception
  // even when CSS pointer-events suppresses the overlay.
  await play.evaluate((el) => (el as HTMLElement).click());

  // Wait for the home screen to settle: either the name modal appears or the
  // challenge-entry button is directly visible (modal already confirmed).
  await expect(async () => {
    const hasModal = await continueBtn.isVisible();
    const hasEntry = await challengeEntry.isVisible();
    expect(hasModal || hasEntry).toBe(true);
  }).toPass({ timeout: 10000 });

  if (await continueBtn.isVisible()) {
    await continueBtn.evaluate((el) => (el as HTMLElement).click());
  }

  await expect(challengeEntry).toBeVisible({ timeout: 8000 });
  await challengeEntry.evaluate((el) => (el as HTMLElement).click());
  await page.getByRole('button', { name: 'PLAY SOLO' }).evaluate((el) => (el as HTMLElement).click());
  await page.locator('img.france-play-image[data-scene-ready="true"]').waitFor({ timeout: 15000 });

  // Complete the draw-the-lines phase so the gem palette is visible.
  // page.mouse events use browser coordinate hit-testing; the overlay CSS keeps
  // them from being intercepted.
  const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' });
  await expect(holdTarget).toBeAttached();
  const box = await holdTarget.boundingBox();
  if (!box) throw new Error('line hold target not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByRole('button', { name: gemLabel })).toBeAttached({ timeout: 8000 });
  await page.mouse.up();

  // Navigation and draw phase complete — restore overlay interactivity so that
  // expandHitEdit and the save button can be clicked normally.
  await page.addStyleTag({ content: '#he-overlay, #he-overlay * { pointer-events: auto !important; }' });
}

// Expands the hitedit overlay if it is currently collapsed ("▶ HitEdit").
async function expandHitEdit(page: import('@playwright/test').Page) {
  const toggle = page.getByRole('button', { name: '▶ HitEdit' });
  if (await toggle.isVisible({ timeout: 1000 }).catch(() => false)) {
    await toggle.click();
  }
}

// ── Test 1: Challenge branch, France portrait ────────────────────────────────

test('hitedit round-trip: FR portrait gem positions survive save → reload', async ({ page }) => {
  const KNOWN_LEFT = '40.0%';
  const KNOWN_TOP  = '70.0%';

  const mockedOverrides = {
    FR: { portrait: { orbLefts: { blue: KNOWN_LEFT }, orbTops: { blue: KNOWN_TOP } } },
  };

  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(mockedOverrides) }),
  );

  // Capture the POST body without writing to the real filesystem.
  let capturedBody: Record<string, unknown> | null = null;
  await page.route('/api/hitedit-save', async (route) => {
    capturedBody = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?hitedit=1');
  await navigateToFranceGems(page, 'Blue orb');
  await expandHitEdit(page);

  const saveBtn = page.getByRole('button', { name: /Save FR portrait/i });
  await expect(saveBtn).toBeVisible({ timeout: 5000 });
  await saveBtn.click();
  await expect.poll(() => capturedBody !== null, { timeout: 5000 }).toBe(true);

  type NestedStr = Record<string, Record<string, Record<string, Record<string, string>>>>;
  const b1 = capturedBody as unknown as NestedStr;
  const savedLeft: string = b1?.FR?.portrait?.orbLefts?.blue ?? '';
  const savedTop: string  = b1?.FR?.portrait?.orbTops?.blue ?? '';

  expect(savedLeft, 'saved orbLefts.blue must be present').toBeTruthy();
  expect(savedTop,  'saved orbTops.blue must be present').toBeTruthy();
  expect(Math.abs(parsePct(savedLeft) - parsePct(KNOWN_LEFT)), 'saved left within 0.5%').toBeLessThan(0.5);
  expect(Math.abs(parsePct(savedTop)  - parsePct(KNOWN_TOP)),  'saved top within 0.5%').toBeLessThan(0.5);

  // ── Reload verification ───────────────────────────────────────────────────────
  // page.reload() forces a full browser reload (React state resets) so the
  // verification pass reads hitedit-overrides.json from scratch.
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(capturedBody) }),
  );
  await page.reload();
  await navigateToFranceGems(page, 'Blue orb');

  const blueOrb = page.getByRole('button', { name: 'Blue orb' });
  await expect(blueOrb).toBeAttached();
  const renderedLeft = await blueOrb.evaluate((el) => (el as HTMLElement).style.left);
  const renderedTop  = await blueOrb.evaluate((el) => (el as HTMLElement).style.top);

  expect(Math.abs(parsePct(renderedLeft) - parsePct(KNOWN_LEFT)), 'rendered left matches original within 0.5%').toBeLessThan(0.5);
  expect(Math.abs(parsePct(renderedTop)  - parsePct(KNOWN_TOP)),  'rendered top matches original within 0.5%').toBeLessThan(0.5);
});

// ── Test 2: Challenge branch, France landscape ───────────────────────────────

test('hitedit round-trip: FR landscape gem positions survive save → reload', async ({ page }) => {
  const KNOWN_LEFT = '35.0%';
  const KNOWN_TOP  = '55.0%';

  const mockedOverrides = {
    FR: { landscape: { orbLefts: { blue: KNOWN_LEFT }, orbTops: { blue: KNOWN_TOP } } },
  };

  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(mockedOverrides) }),
  );

  let capturedBody: Record<string, unknown> | null = null;
  await page.route('/api/hitedit-save', async (route) => {
    capturedBody = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/?hitedit=1');
  await navigateToFranceGems(page, 'Blue orb');
  await expandHitEdit(page);

  const saveBtn = page.getByRole('button', { name: /Save FR landscape/i });
  await expect(saveBtn).toBeVisible({ timeout: 5000 });
  await saveBtn.click();
  await expect.poll(() => capturedBody !== null, { timeout: 5000 }).toBe(true);

  type NestedStr2 = Record<string, Record<string, Record<string, Record<string, string>>>>;
  const b2 = capturedBody as unknown as NestedStr2;
  const savedLeft: string = b2?.FR?.landscape?.orbLefts?.blue ?? '';
  const savedTop: string  = b2?.FR?.landscape?.orbTops?.blue ?? '';

  expect(savedLeft, 'saved landscape orbLefts.blue must be present').toBeTruthy();
  expect(savedTop,  'saved landscape orbTops.blue must be present').toBeTruthy();
  expect(Math.abs(parsePct(savedLeft) - parsePct(KNOWN_LEFT))).toBeLessThan(0.5);
  expect(Math.abs(parsePct(savedTop)  - parsePct(KNOWN_TOP))).toBeLessThan(0.5);

  // ── Reload verification ───────────────────────────────────────────────────────
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(capturedBody) }),
  );
  await page.reload();
  await navigateToFranceGems(page, 'Blue orb');

  const blueOrb = page.getByRole('button', { name: 'Blue orb' });
  await expect(blueOrb).toBeAttached();
  const renderedLeft = await blueOrb.evaluate((el) => (el as HTMLElement).style.left);
  const renderedTop  = await blueOrb.evaluate((el) => (el as HTMLElement).style.top);

  expect(Math.abs(parsePct(renderedLeft) - parsePct(KNOWN_LEFT))).toBeLessThan(0.5);
  expect(Math.abs(parsePct(renderedTop)  - parsePct(KNOWN_TOP))).toBeLessThan(0.5);
});

// ── Test 3: Boxes branch, loading screen portrait ────────────────────────────

test('hitedit round-trip: loading screen box positions survive save → reload', async ({ page }) => {
  const KNOWN_LEFT   = '15.0%';
  const KNOWN_TOP    = '25.0%';
  const KNOWN_WIDTH  = '60.0%';
  const KNOWN_HEIGHT = '10.0%';
  const BOX_LABEL    = "Play Ronan's Flag Game";

  const mockedOverrides = {
    loading: {
      portrait: {
        boxes: {
          [BOX_LABEL]: { left: KNOWN_LEFT, top: KNOWN_TOP, width: KNOWN_WIDTH, height: KNOWN_HEIGHT },
        },
      },
    },
  };

  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(mockedOverrides) }),
  );

  let capturedBody: Record<string, unknown> | null = null;
  await page.route('/api/hitedit-save', async (route) => {
    capturedBody = JSON.parse(route.request().postData() ?? '{}') as Record<string, unknown>;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true }) });
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?hitedit=1');
  const playBtn = page.getByRole('button', { name: BOX_LABEL });
  await expect(playBtn).toBeVisible({ timeout: 10000 });

  // Verify the override applied to the rendered position (numeric compare — app may
  // normalise '15.0%' → '15%', so exact-string match is fragile).
  const initialLeft = await playBtn.evaluate((el) => (el as HTMLElement).style.left);
  const initialTop  = await playBtn.evaluate((el) => (el as HTMLElement).style.top);
  expect(Math.abs(parsePct(initialLeft) - parsePct(KNOWN_LEFT)), 'initial left matches known within 0.5%').toBeLessThan(0.5);
  expect(Math.abs(parsePct(initialTop)  - parsePct(KNOWN_TOP)),  'initial top matches known within 0.5%').toBeLessThan(0.5);

  await expandHitEdit(page);

  const saveBtn = page.getByRole('button', { name: /Save loading portrait/i });
  await expect(saveBtn).toBeVisible({ timeout: 5000 });
  await saveBtn.click();
  await expect.poll(() => capturedBody !== null, { timeout: 5000 }).toBe(true);

  type BoxEntry = { left: string; top: string; width: string; height: string };
  type BoxNested = Record<string, Record<string, Record<string, Record<string, BoxEntry>>>>;
  const savedBox: BoxEntry | undefined = (capturedBody as unknown as BoxNested)
    ?.loading?.portrait?.boxes?.[BOX_LABEL];

  expect(savedBox, 'saved box entry must be present').toBeTruthy();
  expect(Math.abs(parsePct(savedBox!.left)   - parsePct(KNOWN_LEFT)),   'saved box.left within 0.5%').toBeLessThan(0.5);
  expect(Math.abs(parsePct(savedBox!.top)    - parsePct(KNOWN_TOP)),    'saved box.top within 0.5%').toBeLessThan(0.5);

  // ── Reload verification ───────────────────────────────────────────────────────
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: JSON.stringify(capturedBody) }),
  );
  await page.reload();
  await expect(playBtn).toBeVisible({ timeout: 10000 });

  const renderedLeft = await playBtn.evaluate((el) => (el as HTMLElement).style.left);
  const renderedTop  = await playBtn.evaluate((el) => (el as HTMLElement).style.top);

  expect(Math.abs(parsePct(renderedLeft) - parsePct(KNOWN_LEFT)), 'rendered left matches original within 0.5%').toBeLessThan(0.5);
  expect(Math.abs(parsePct(renderedTop)  - parsePct(KNOWN_TOP)),  'rendered top matches original within 0.5%').toBeLessThan(0.5);
});
