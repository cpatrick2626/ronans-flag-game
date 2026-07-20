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
          centerDelta: {
            x: (target.left + target.width / 2) - (visual.left + visual.width / 2),
            y: (target.top + target.height / 2) - (visual.top + visual.height / 2),
          },
          edgeOwners: points.map(([x, y]) => document.elementFromPoint(x, y)?.closest('button')?.getAttribute('aria-label') ?? null),
          hitboxStyle: getComputedStyle(button).transform,
          controlsRect: (() => { const rect = button.parentElement?.getBoundingClientRect(); return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null; })(),
          shellRect: (() => { const rect = button.closest('.france-play-image-shell')?.getBoundingClientRect(); return rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null; })(),
        };
      }));
      console.log(JSON.stringify({ country, viewport, measurements }));
      for (const measurement of measurements) {
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
