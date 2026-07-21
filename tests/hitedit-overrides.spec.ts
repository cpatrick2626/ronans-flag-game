import { test, expect } from '@playwright/test'

test.setTimeout(60_000)

// Navigate from loading screen through player-name modal to France challenge,
// then complete the draw-the-lines phase so gems are visible.
async function reachFranceGems(page: import('@playwright/test').Page) {
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const play = page.getByRole('button', { name: "Play Ronan's Flag Game" })
  await expect(play).toBeVisible()
  const continueBtn = page.getByRole('button', { name: 'Continue' })
  await expect(async () => {
    await play.click()
    await expect(continueBtn).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 15000 })
  await continueBtn.click()
  await page.getByRole('button', { name: 'Flag Color Challenge' }).click()
  await page.getByRole('button', { name: 'PLAY SOLO' }).click()
  await expect(page.getByAltText('France Flag Color Challenge')).toBeVisible()
  // Draw-the-lines phase: hold until palette appears
  const holdTarget = page.getByRole('button', { name: 'Hold to draw the flag lines' })
  await expect(holdTarget).toBeAttached()
  const box = await holdTarget.boundingBox()
  if (!box) throw new Error('line hold target not visible')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await expect(page.getByRole('button', { name: 'Blue orb' })).toBeAttached({ timeout: 6000 })
  await page.mouse.up()
}

test('overrides apply over config defaults when overrides file is present', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        FR: {
          portrait: {
            orbTop: '77%',
            orbLefts: { blue: '11%' },
          },
        },
      }),
    })
  )
  await reachFranceGems(page)
  const blueOrb = page.getByRole('button', { name: 'Blue orb' })
  await expect(blueOrb).toBeVisible()
  const blueLeft = await blueOrb.evaluate((el) => (el as HTMLElement).style.left)
  expect(blueLeft).toBe('11%')
  const blueTop = await blueOrb.evaluate((el) => (el as HTMLElement).style.top)
  expect(blueTop).toBe('77%')
})

// buildRoundPalette shuffles gem order, so a given gem's slot left varies per
// run. The config slot lefts for France's 3-gem palette with 5 configured slots
// (indexes 0, 2, 4) are '17.7%', '50.1%', '82.3%'. All three are valid defaults.
const FRANCE_VALID_DEFAULT_GEM_LEFTS = new Set(['17.7%', '50.1%', '82.3%'])

test('absence of overrides leaves config defaults unchanged', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: '{}' })
  )
  await reachFranceGems(page)
  const blueOrb = page.getByRole('button', { name: 'Blue orb' })
  await expect(blueOrb).toBeVisible()
  const blueLeft = await blueOrb.evaluate((el) => (el as HTMLElement).style.left)
  expect(FRANCE_VALID_DEFAULT_GEM_LEFTS.has(blueLeft)).toBe(true)
  const blueTop = await blueOrb.evaluate((el) => (el as HTMLElement).style.top)
  expect(blueTop).toBe('84.25%')
})

test('malformed overrides file falls back to config defaults', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ status: 404, body: 'not found' })
  )
  await reachFranceGems(page)
  const blueOrb = page.getByRole('button', { name: 'Blue orb' })
  await expect(blueOrb).toBeVisible()
  const blueLeft = await blueOrb.evaluate((el) => (el as HTMLElement).style.left)
  // Must be a valid config-derived slot left, never a garbage or overridden value
  expect(FRANCE_VALID_DEFAULT_GEM_LEFTS.has(blueLeft)).toBe(true)
})

// ── Non-challenge screen override tests ───────────────────────────────────────

test('loading screen: no override → play button has no inline position style', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: '{}' })
  )
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const playBtn = page.getByRole('button', { name: "Play Ronan's Flag Game" })
  await expect(playBtn).toBeVisible()
  const inlineStyle = await playBtn.evaluate((el) => el.getAttribute('style'))
  expect(inlineStyle).toBeNull()
})

test('loading screen: saved override repositions play button on reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        loading: { portrait: { boxes: { "Play Ronan's Flag Game": { left: '5%', top: '20%', width: '40%', height: '8%' } } } },
      }),
    })
  )
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const playBtn = page.getByRole('button', { name: "Play Ronan's Flag Game" })
  await expect(playBtn).toBeVisible()
  const left = await playBtn.evaluate((el) => (el as HTMLElement).style.left)
  const top = await playBtn.evaluate((el) => (el as HTMLElement).style.top)
  expect(left).toBe('5%')
  expect(top).toBe('20%')
})

test('home screen: no override → Next Destination button has no inline transform override', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: '{}' })
  )
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const continueBtn = page.getByRole('button', { name: 'Continue' })
  await expect(async () => {
    await page.getByRole('button', { name: "Play Ronan's Flag Game" }).click()
    await expect(continueBtn).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 15000 })
  await continueBtn.click()
  const nextDest = page.getByRole('button', { name: 'Next Destination (France)' })
  await expect(nextDest).toBeVisible()
  const transform = await nextDest.evaluate((el) => (el as HTMLElement).style.transform)
  // Without override, transform comes from CSS class only, not inline style
  expect(transform).toBe('')
})

test('home screen: saved override repositions Next Destination button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        home: { portrait: { boxes: { 'Next Destination (France)': { left: '5%', top: '5%', width: '20%', height: '10%' } } } },
      }),
    })
  )
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const continueBtn = page.getByRole('button', { name: 'Continue' })
  await expect(async () => {
    await page.getByRole('button', { name: "Play Ronan's Flag Game" }).click()
    await expect(continueBtn).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 15000 })
  await continueBtn.click()
  const nextDest = page.getByRole('button', { name: 'Next Destination (France)' })
  await expect(nextDest).toBeVisible()
  const left = await nextDest.evaluate((el) => (el as HTMLElement).style.left)
  const transform = await nextDest.evaluate((el) => (el as HTMLElement).style.transform)
  expect(left).toBe('5%')
  expect(transform).toBe('none')
})

test('play screen: no override → PLAY SOLO button uses default inline position', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: '{}' })
  )
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const continueBtn = page.getByRole('button', { name: 'Continue' })
  await expect(async () => {
    await page.getByRole('button', { name: "Play Ronan's Flag Game" }).click()
    await expect(continueBtn).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 15000 })
  await continueBtn.click()
  await page.getByRole('button', { name: 'Flag Color Challenge' }).click()
  const playSolo = page.getByRole('button', { name: 'PLAY SOLO' })
  await expect(playSolo).toBeVisible()
  const left = await playSolo.evaluate((el) => (el as HTMLElement).style.left)
  // Default: x=50 → left: '50%' from the hitbox definition
  expect(left).toBe('50%')
  const transform = await playSolo.evaluate((el) => (el as HTMLElement).style.transform)
  // No override means no inline transform override (CSS class handles it)
  expect(transform).toBe('')
})

test('play screen: saved override repositions PLAY SOLO button', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        play: { portrait: { boxes: { 'PLAY SOLO': { left: '10%', top: '30%', width: '50%', height: '8%' } } } },
      }),
    })
  )
  page.on('pageerror', (err) => { throw err })
  await page.goto('/')
  const continueBtn = page.getByRole('button', { name: 'Continue' })
  await expect(async () => {
    await page.getByRole('button', { name: "Play Ronan's Flag Game" }).click()
    await expect(continueBtn).toBeVisible({ timeout: 2000 })
  }).toPass({ timeout: 15000 })
  await continueBtn.click()
  await page.getByRole('button', { name: 'Flag Color Challenge' }).click()
  const playSolo = page.getByRole('button', { name: 'PLAY SOLO' })
  await expect(playSolo).toBeVisible()
  const left = await playSolo.evaluate((el) => (el as HTMLElement).style.left)
  const transform = await playSolo.evaluate((el) => (el as HTMLElement).style.transform)
  expect(left).toBe('10%')
  expect(transform).toBe('none')
})

// ── Task 2 tests ──────────────────────────────────────────────────────────────

test('per-gem orbTops override: one gem moved does not affect others', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        FR: {
          portrait: {
            orbTops: { blue: '20%' },
          },
        },
      }),
    })
  )
  await reachFranceGems(page)
  const blueOrb = page.getByRole('button', { name: 'Blue orb' })
  const redOrb = page.getByRole('button', { name: 'Red orb' })
  const whiteOrb = page.getByRole('button', { name: 'White orb' })
  await expect(blueOrb).toBeVisible()
  await expect(redOrb).toBeAttached()
  await expect(whiteOrb).toBeAttached()
  const blueTop = await blueOrb.evaluate((el) => (el as HTMLElement).style.top)
  expect(blueTop).toBe('20%')
  // Red and white should not be '20%' — they use config default
  const redTop = await redOrb.evaluate((el) => (el as HTMLElement).style.top)
  const whiteTop = await whiteOrb.evaluate((el) => (el as HTMLElement).style.top)
  expect(redTop).not.toBe('20%')
  expect(whiteTop).not.toBe('20%')
})

test('no-override: all gems share default orbTop from config', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({ contentType: 'application/json', body: '{}' })
  )
  await reachFranceGems(page)
  const blueOrb = page.getByRole('button', { name: 'Blue orb' })
  const redOrb = page.getByRole('button', { name: 'Red orb' })
  await expect(blueOrb).toBeAttached()
  await expect(redOrb).toBeAttached()
  const blueTop = await blueOrb.evaluate((el) => (el as HTMLElement).style.top)
  const redTop = await redOrb.evaluate((el) => (el as HTMLElement).style.top)
  // Both should match the France config default orbTop
  expect(blueTop).toBe('84.25%')
  expect(redTop).toBe('84.25%')
})

test('legacy orbTop override applies to all gems when no orbTops present', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route('/hitedit-overrides.json', (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        FR: {
          portrait: {
            orbTop: '30%',
          },
        },
      }),
    })
  )
  await reachFranceGems(page)
  const blueOrb = page.getByRole('button', { name: 'Blue orb' })
  const redOrb = page.getByRole('button', { name: 'Red orb' })
  await expect(blueOrb).toBeAttached()
  await expect(redOrb).toBeAttached()
  const blueTop = await blueOrb.evaluate((el) => (el as HTMLElement).style.top)
  const redTop = await redOrb.evaluate((el) => (el as HTMLElement).style.top)
  expect(blueTop).toBe('30%')
  expect(redTop).toBe('30%')
})
