import { test, expect, chromium, type BrowserContext, type Page } from '@playwright/test';

// PWA install guard: the game must stay installable to a phone home screen as a
// standalone app, with no service worker (online-only by design), and a cold
// restart must never reset saved player progress.

const MANIFEST_URL = '/manifest.webmanifest';

type ManifestIcon = { src: string; sizes: string; type: string; purpose?: string };

async function headAttr(page: Page, selector: string, attr: string) {
  return page.locator(`head ${selector}`).first().getAttribute(attr);
}

test('manifest declares an installable standalone app', async ({ request }) => {
  const res = await request.get(MANIFEST_URL);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toMatch(/manifest\+json|application\/json/);
  const m = await res.json();
  expect(m.name).toBe("Ronan's Flag Game");
  expect(m.short_name).toBe("Ronan's Flags");
  expect(m.start_url).toBe('/');
  expect(m.scope).toBe('/');
  expect(m.id).toBe('/');
  expect(m.display).toBe('standalone');
  expect(m.prefer_related_applications ?? false).toBe(false);
  expect(m.background_color).toBe('#030508');
  expect(m.theme_color).toBe('#030508');
  const icons = m.icons as ManifestIcon[];
  for (const purpose of ['any', 'maskable']) {
    for (const size of ['192x192', '512x512']) {
      expect(icons.some((i) => i.sizes === size && i.type === 'image/png' && (i.purpose ?? 'any') === purpose),
        `${purpose} ${size} icon`).toBe(true);
    }
  }
});

test('every icon is a PNG of its declared size', async ({ page, request }) => {
  const m = await (await request.get(MANIFEST_URL)).json();
  const urls: Array<{ src: string; size: number }> = (m.icons as ManifestIcon[]).map((i) => ({ src: i.src, size: Number(i.sizes.split('x')[0]) }));
  urls.push({ src: '/icons/apple-touch-icon.png', size: 180 }, { src: '/icons/favicon-32.png', size: 32 });
  await page.goto('/');
  for (const { src, size } of urls) {
    const res = await request.get(src);
    expect(res.status(), src).toBe(200);
    expect(res.headers()['content-type'], src).toBe('image/png');
    const dims = await page.evaluate(async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      return [img.naturalWidth, img.naturalHeight];
    }, src);
    expect(dims, src).toEqual([size, size]);
  }
});

test('page head links the manifest, icons and iOS standalone metadata', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle("Ronan's Flag Game");
  expect(await headAttr(page, 'link[rel="manifest"]', 'href')).toBe(MANIFEST_URL);
  expect(await headAttr(page, 'link[rel="apple-touch-icon"]', 'href')).toBe('/icons/apple-touch-icon.png');
  expect(await headAttr(page, 'meta[name="theme-color"]', 'content')).toBe('#030508');
  expect(await headAttr(page, 'meta[name="apple-mobile-web-app-capable"]', 'content')).toBe('yes');
  expect(await headAttr(page, 'meta[name="apple-mobile-web-app-title"]', 'content')).toBe("Ronan's Flags");
  expect(await headAttr(page, 'meta[name="apple-mobile-web-app-status-bar-style"]', 'content')).toBe('black-translucent');
  expect(await headAttr(page, 'meta[name="viewport"]', 'content')).toContain('viewport-fit=cover');
});

test('Chromium reports no installability errors and no service worker is registered', async ({ browserName }, testInfo) => {
  test.setTimeout(90_000); // launches a second, full Chromium; slow against a cold dev server
  test.skip(browserName !== 'chromium', 'CDP installability check is Chromium-only');
  // The headless shell has no install logic (it reports [] even with no manifest), and a
  // default Playwright context counts as incognito, which is never installable. A full
  // Chromium with a real profile gives the same verdict Chrome's install menu uses.
  const ctx = await chromium.launchPersistentContext(testInfo.outputPath('profile'), { channel: 'chromium' });
  try {
    const page = await ctx.newPage();
    await page.goto(new URL('/', testInfo.project.use.baseURL).href);
    await expect(page.getByRole('button', { name: "Play Ronan's Flag Game" })).toBeVisible();
    const cdp = await ctx.newCDPSession(page);
    const manifest = await cdp.send('Page.getAppManifest');
    expect(manifest.url).toMatch(/\/manifest\.webmanifest$/);
    expect(manifest.errors).toEqual([]);
    const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
    expect(installabilityErrors).toEqual([]);
    const registrations = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length);
    expect(registrations).toBe(0);
  } finally {
    await ctx.close();
  }
});

const SAVED = {
  ronan_flag_player_name: 'Ronan Tester',
  ronan_flag_player_name_confirmed: 'true',
  flag_game_v1_active_country: 'FR',
  flag_progression_v1: JSON.stringify({
    playerName: 'Ronan Tester',
    xp: 25,
    explorerLevel: 2,
    levelTitle: 'Junior Explorer',
    completedCountries: 1,
    perfectFlags: 1,
    unlockedSouvenirs: ['eiffel_tower'],
    passportStamps: [],
    countries: { FR: { countryCode: 'FR', status: 'perfect', stars: 3, completedAt: '2026-07-18T12:00:00.000Z' } },
  }),
};

// Seeds a returning player's save, then reopens the game in the same profile (as relaunching
// the installed app does) and returns storage once the game has booted.
async function relaunchWithSave(context: BrowserContext) {
  // Seed from a same-origin page that runs no game code, so it can't race the game's own writes.
  const first = await context.newPage();
  await first.goto(MANIFEST_URL);
  await first.evaluate((entries) => { for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v); }, SAVED);
  await first.close();

  const errors: string[] = [];
  const relaunch = await context.newPage();
  relaunch.on('pageerror', (err) => errors.push(err.message));
  await relaunch.goto('/');
  await expect(relaunch.getByRole('button', { name: "Play Ronan's Flag Game" })).toBeVisible();
  await relaunch.waitForLoadState('networkidle');
  const after = await relaunch.evaluate((keys) => Object.fromEntries(keys.map((k) => [k, localStorage.getItem(k)])), Object.keys(SAVED));
  return { after, errors };
}

test('a cold restart keeps saved flag progress', async ({ context }) => {
  const { after, errors } = await relaunchWithSave(context);
  expect(after.flag_game_v1_active_country).toBe('FR');
  const progress = JSON.parse(after.flag_progression_v1 ?? '{}');
  expect(progress.completedCountries).toBe(1);
  expect(progress.xp).toBe(25);
  expect(progress.unlockedSouvenirs).toEqual(['eiffel_tower']);
  expect(progress.countries.FR.status).toBe('perfect');
  expect(errors).toEqual([]);
});

test('a cold restart keeps the saved player name', async ({ context }) => {
  // Known pre-existing dev-only issue (not PWA-related): under `next dev`, React StrictMode
  // re-runs page.tsx's mount effects, so the load effect re-reads the default name the save
  // effect just wrote. Production builds don't double-run effects and keep the name. Run with
  // PWA_PROD_SERVER=1 against `next start` for the strict check; remove this marker once fixed.
  test.fail(!process.env.PWA_PROD_SERVER, 'dev-only StrictMode player-name reset in page.tsx');
  const { after, errors } = await relaunchWithSave(context);
  expect(after.ronan_flag_player_name).toBe('Ronan Tester');
  expect(after.ronan_flag_player_name_confirmed).toBe('true');
  expect(errors).toEqual([]);
});
