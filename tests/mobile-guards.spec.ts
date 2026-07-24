import { test, expect } from '@playwright/test';

// GUARD 2 — Mobile overflow + tap targets
//
// For France and Italy at all three canonical mobile portrait viewports, through
// the full flow (entry → draw-lines → fill stripes → completion/reward panel):
//   • No horizontal overflow (document.scrollWidth <= viewport width)
//   • Reward panel not clipped: fully within viewport bounds left/right
//   • Gems and nav items meet a 32 × 32 px gross minimum touch-target size
//     (violations at the 44 px recommended iOS/WCAG minimum are also logged)
//
// These complement the entry-point overflow smoke tests in france-flow.spec.ts
// by covering the FULL flow including completion, adding Italy, and adding the
// tap-target and reward-panel assertions.

test.setTimeout(120_000);

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 414, height: 736 },
  { width: 421, height: 743 },
];

const MIN_TAP_GROSS_PX = 32;  // hard fail if below this
const MIN_TAP_WARN_PX = 44;   // log a finding (iOS/WCAG recommended) if below this

async function horizontalOverflow(page: import('@playwright/test').Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

async function navigateToChallenge(
  page: import('@playwright/test').Page,
  errors: string[],
  country: 'France' | 'Italy',
) {
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
  await expect(page.getByAltText(`${country} Flag Color Challenge`)).toBeAttached({ timeout: 15000 });
  await page.locator('img.france-play-image[data-scene-ready="true"]').waitFor({ timeout: 15000 });
}

async function drawLines(page: import('@playwright/test').Page, firstOrb: string) {
  const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' });
  await expect(holdTarget).toBeAttached();
  const box = await holdTarget.boundingBox();
  if (!box) throw new Error('line hold target is not visible');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(page.getByRole('button', { name: firstOrb })).toBeAttached({ timeout: 8000 });
  await page.mouse.up();
}

async function fillStripe(page: import('@playwright/test').Page, orbLabel: string, stripeLabel: string) {
  await page.getByRole('button', { name: orbLabel }).click();
  const stripe = page.getByRole('button', { name: stripeLabel });
  const box = await stripe.boundingBox();
  if (!box) throw new Error(`${stripeLabel} not visible`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(stripe).toHaveClass(/is-filled/, { timeout: 5000 });
  await page.mouse.up();
}

const COUNTRY_FILL_PLAN: Record<string, { firstOrb: string; fills: [string, string][] }> = {
  France: {
    firstOrb: 'Blue orb',
    fills: [
      ['Blue orb', 'France blue stripe'],
      ['White orb', 'France white stripe'],
      ['Red orb', 'France red stripe'],
    ],
  },
  Italy: {
    firstOrb: 'Green orb',
    fills: [
      ['Green orb', 'Italy green stripe'],
      ['White orb', 'Italy white stripe'],
      ['Red orb', 'Italy red stripe'],
    ],
  },
};

for (const viewport of VIEWPORTS) {
  for (const country of ['France', 'Italy'] as const) {
    const plan = COUNTRY_FILL_PLAN[country];

    test(
      `${country} ${viewport.width}×${viewport.height}: full-flow overflow, reward panel in viewport, tap targets`,
      async ({ page }) => {
        await page.setViewportSize(viewport);
        if (country === 'Italy') {
          await page.addInitScript(() => {
            window.localStorage.setItem('flag_game_v1_active_country', 'IT');
          });
        }

        const errors: string[] = [];
        await navigateToChallenge(page, errors, country);

        // ── Challenge entry ──────────────────────────────────────────────────────
        expect(await horizontalOverflow(page), 'overflow at challenge entry').toBeLessThanOrEqual(0);

        // ── Draw-the-lines phase ─────────────────────────────────────────────────
        await drawLines(page, plan.firstOrb);
        expect(await horizontalOverflow(page), 'overflow after draw-lines').toBeLessThanOrEqual(0);

        // ── Tap-target check (gems + nav are now visible) ────────────────────────
        const sizes = await page.evaluate(({ minWarn, minGross }) => {
          const warnings: string[] = [];
          const grossFails: string[] = [];

          function check(label: string, r: DOMRect) {
            if (r.width < minWarn || r.height < minWarn) {
              const msg = `${label}: ${Math.round(r.width)}×${Math.round(r.height)}px`;
              warnings.push(msg);
              if (r.width < minGross || r.height < minGross) grossFails.push(msg);
            }
          }

          for (const btn of document.querySelectorAll<HTMLElement>('.france-palette-gem')) {
            check(`gem "${btn.getAttribute('aria-label')}"`, btn.getBoundingClientRect());
          }

          // Nav buttons that are rendered and on-screen
          const navNames = ['Home', 'Passport nav', 'Back'];
          for (const name of navNames) {
            const btn = [...document.querySelectorAll<HTMLElement>('button')].find(
              (b) => b.getAttribute('aria-label') === name,
            );
            if (!btn) continue;
            const r = btn.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            check(`nav "${name}"`, r);
          }

          return { warnings, grossFails };
        }, { minWarn: MIN_TAP_WARN_PX, minGross: MIN_TAP_GROSS_PX });

        if (sizes.warnings.length > 0) {
          console.warn(
            `[FINDING] Tap targets below ${MIN_TAP_WARN_PX}px recommended minimum at ${country} ${viewport.width}×${viewport.height}:\n` +
            sizes.warnings.join('\n'),
          );
        }
        // Hard fail only for gross violations — anything below 32 px is clearly wrong
        expect(sizes.grossFails, `tap targets below ${MIN_TAP_GROSS_PX}px gross minimum`).toEqual([]);

        // ── Fill all stripes ─────────────────────────────────────────────────────
        for (const [orb, stripe] of plan.fills) {
          await fillStripe(page, orb, stripe);
          expect(await horizontalOverflow(page), `overflow after filling ${stripe}`).toBeLessThanOrEqual(0);
        }

        // ── Reward panel: visible and not clipped ────────────────────────────────
        const rewardText = page.getByText('COUNTRY DISCOVERED');
        await expect(rewardText).toBeVisible({ timeout: 8000 });
        expect(await horizontalOverflow(page), 'overflow during reward panel').toBeLessThanOrEqual(0);

        const rewardBox = await rewardText.boundingBox();
        expect(rewardBox, 'COUNTRY DISCOVERED must have a bounding box').toBeTruthy();
        expect(rewardBox!.x, 'reward panel must not be clipped on the left').toBeGreaterThanOrEqual(0);
        expect(
          rewardBox!.x + rewardBox!.width,
          'reward panel must not overflow on the right',
        ).toBeLessThanOrEqual(viewport.width + 1); // 1 px tolerance for sub-pixel rendering

        expect(errors).toEqual([]);
      },
    );
  }
}
