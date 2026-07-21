import { test, expect } from '@playwright/test';

test.setTimeout(60_000);

async function enterChallenge(page: import('@playwright/test').Page, country: 'France' | 'Italy') {
  await page.addInitScript((code) => {
    window.localStorage.setItem('flag_game_v1_active_country', code);
  }, country === 'France' ? 'FR' : 'IT');
  await page.goto('/');
  const play = page.getByRole('button', { name: "Play Ronan's Flag Game" });
  await expect(play).toBeVisible();
  const continueButton = page.getByRole('button', { name: 'Continue' });
  await expect(async () => {
    await play.click();
    await expect(continueButton).toBeVisible({ timeout: 1500 });
  }).toPass({ timeout: 10_000 });
  await continueButton.click();
  await page.getByRole('button', { name: 'Flag Color Challenge' }).click();
  await page.getByRole('button', { name: 'PLAY SOLO' }).click();
  await expect(page.getByAltText(`${country} Flag Color Challenge`)).toBeVisible();
  const hold = page.getByRole('button', { name: 'Hold to draw the flag lines' });
  const box = await hold.boundingBox();
  if (!box) throw new Error('line target missing');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByRole('button', { name: country === 'France' ? 'Blue orb' : 'Green orb' })).toBeAttached({ timeout: 6000 });
  await page.mouse.up();
}

// Wide-desktop regression: at any viewport wider than the landscape art's
// 2752/1536 (≈1.79) aspect ratio the shell must not overflow the viewport
// vertically (banner stays fully visible) and the gem hitboxes must stay
// registered to the artwork's gem positions (shell-relative 84.7% down).
// France landscape orbTop is '84.7%' (lib/countries/france.ts).
test('wide-desktop landscape: banner not clipped, gems aligned to artwork', async ({ page }) => {
  // 1900x1000 ratio ≈ 1.9 > 1.79 — the range where cover-sizing clips the top.
  await page.setViewportSize({ width: 1900, height: 1000 });
  await enterChallenge(page, 'France');
  await page.screenshot({ path: 'test-results/audit-france-1900x1000.png' });

  const shellBox = await page.locator('.france-play-shell').first().boundingBox();
  if (!shellBox) throw new Error('play shell not found');

  // Banner must not be clipped: shell top must be at or below the viewport top.
  expect(shellBox.y, 'landscape shell top must not be above viewport (banner clipped)').toBeGreaterThanOrEqual(-1);

  // Each gem hitbox centre must lie at roughly orbTop (84.7%) down the shell.
  // Tolerance ±2% of shell height (≤20px at 1000px shell) to cover subpixel
  // rounding. With the cover-sizing bug this is off by ≈11% (≈110px).
  const gems = await page.locator('.france-palette-gem').all();
  expect(gems.length).toBeGreaterThan(0);
  for (const gem of gems) {
    const box = await gem.boundingBox();
    if (!box) throw new Error('gem bounding box missing');
    const centerY = box.y + box.height / 2;
    const shellRelativeY = (centerY - shellBox.y) / shellBox.height;
    expect(
      Math.abs(shellRelativeY - 0.847),
      `gem "${await gem.getAttribute('aria-label')}" Y should be ≈84.7% down the shell (got ${(shellRelativeY * 100).toFixed(1)}%)`
    ).toBeLessThanOrEqual(0.02);
  }
});

for (const country of ['France', 'Italy'] as const) {
  test(`wide-desktop ${country}: click at visible gem center selects that gem and anchors pencil there`, async ({ page }) => {
    await page.setViewportSize({ width: 1900, height: 1000 });
    await enterChallenge(page, country);

    const whiteGem = page.getByRole('button', { name: 'White orb' });
    const geometry = await whiteGem.locator('.france-palette-gem-visual').evaluate((visual) => {
      const rect = visual.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
    await page.mouse.move(geometry.x, geometry.y);
    await page.mouse.click(geometry.x, geometry.y);

    await expect(whiteGem).toHaveAttribute('aria-pressed', 'true');
    await page.waitForTimeout(1000);
    const anchor = await page.locator('.colored-pencil-anchor').boundingBox();
    if (!anchor) throw new Error('pencil anchor missing');
    expect(Math.abs(anchor.x - geometry.x), 'pencil X must match visible gem center').toBeLessThanOrEqual(1);
    expect(Math.abs(anchor.y - geometry.y), 'pencil Y must match visible gem center').toBeLessThanOrEqual(1);
  });
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
  for (const country of ['France', 'Italy'] as const) {
    test(`audit ${country} ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await enterChallenge(page, country);
      await page.screenshot({ path: `test-results/audit-${country.toLowerCase()}-${viewport.width}x${viewport.height}.png` });
      const measurements = await page.locator('.france-palette-gem').evaluateAll((buttons) => buttons.map((button) => {
        const target = button.getBoundingClientRect();
        const visual = button.querySelector('.france-palette-gem-visual')?.getBoundingClientRect();
        if (!visual) throw new Error('visible gem missing');
        const points = [
          [visual.left + 1, visual.top + visual.height / 2],
          [visual.right - 1, visual.top + visual.height / 2],
          [visual.left + visual.width / 2, visual.top + 1],
          [visual.left + visual.width / 2, visual.bottom - 1],
        ];
        return {
          label: button.getAttribute('aria-label'),
          target: { left: target.left, top: target.top, width: target.width, height: target.height },
          visual: { left: visual.left, top: visual.top, width: visual.width, height: visual.height },
          offset: {
            x: (target.left + target.width / 2) - (visual.left + visual.width / 2),
            y: (target.top + target.height / 2) - (visual.top + visual.height / 2),
          },
          centers: {
            target: { x: target.left + target.width / 2, y: target.top + target.height / 2 },
            visual: { x: visual.left + visual.width / 2, y: visual.top + visual.height / 2 },
          },
          edgeOwners: points.map(([x, y]) => document.elementFromPoint(x, y)?.closest('button')?.getAttribute('aria-label') ?? null),
          hitboxStyle: getComputedStyle(button).transform,
          controlsRect: (() => { const rect = button.parentElement?.getBoundingClientRect(); return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null; })(),
          shellRect: (() => { const rect = button.closest('.france-play-image-shell')?.getBoundingClientRect(); return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null; })(),
        };
      }));
      console.log(JSON.stringify({ country, viewport, measurements }));
      for (const measurement of measurements) {
        expect(Math.abs(measurement.offset.x), `${measurement.label} clickable X offset`).toBeLessThanOrEqual(3);
        expect(Math.abs(measurement.offset.y), `${measurement.label} clickable Y offset`).toBeLessThanOrEqual(3);
        expect(Math.abs(measurement.target.left - measurement.visual.left)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(measurement.target.top - measurement.visual.top)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(measurement.target.width - measurement.visual.width)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(measurement.target.height - measurement.visual.height)).toBeLessThanOrEqual(0.5);
        expect(measurement.edgeOwners.every((owner) => owner === measurement.label)).toBe(true);
      }
      for (const button of await page.locator('.france-palette-gem').all()) {
        const point = await button.locator('.france-palette-gem-visual').evaluate((visual) => {
          const rect = visual.getBoundingClientRect();
          return [
            [rect.left + rect.width / 2, rect.top + 1],
            [rect.right - 1, rect.top + rect.height / 2],
            [rect.left + rect.width / 2, rect.bottom - 1],
            [rect.left + 1, rect.top + rect.height / 2],
          ];
        });
        const label = await button.getAttribute('aria-label');
        for (const [x, y] of point) {
          await page.mouse.click(x, y);
          await expect(page.getByRole('button', { name: label! })).toHaveAttribute('aria-pressed', 'true');
        }
      }
    });
  }
}
