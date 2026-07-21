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
