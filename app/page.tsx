'use client'

import { useEffect, useRef, useState } from 'react'
import { COUNTRIES, COUNTRY_BY_ISO2 } from '../public/countries.js'
import { createDefaultFlagProgress, loadFlagProgress, completeCountry, getCountryProgress } from '../public/flag-progress.js'

type RewardPayload = ReturnType<typeof completeCountry>['reward']
type RewardStage = 'stamp' | 'souvenir' | 'stars' | 'xp' | 'done'

const STORAGE_KEY = 'flag_game_v1_active_country'
const LEGACY_STORAGE_KEYS = ['banana_game_v1_active_country']
const REGION_STORAGE_KEY = 'flag_game_v1_region_colors'
const LEGACY_REGION_STORAGE_KEYS = ['banana_game_v1_region_colors']

function safeStorageGet(key: string) {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

function safeStorageSet(key: string, value: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, value)
}

function loadRegionColorState() {
  const saved = safeStorageGet(REGION_STORAGE_KEY) || LEGACY_REGION_STORAGE_KEYS.map(safeStorageGet).find(Boolean)
  if (!saved) return {}
  try {
    const parsed = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object') return {}
    safeStorageSet(REGION_STORAGE_KEY, JSON.stringify(parsed))
    return parsed
  } catch {
    return {}
  }
}

function saveRegionColorState(state: Record<string, Record<string, { selectedColorIndex: number; isCorrect: boolean; updatedAt: string }>>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(REGION_STORAGE_KEY, JSON.stringify(state))
}

function getCountryShape(type: string, shape: any, fill: string) {
  if (type === 'rect') return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx="0" ry="0" fill={fill} />
  if (type === 'circle') return <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />
  if (type === 'polygon') return <polygon points={shape.points} fill={fill} />
  return null
}

function countryPalette(country: (typeof COUNTRIES)[number]) {
  return country.theme_colors || country.flag_colors || ['#F8D36A', '#FFFFFF', '#EF4135']
}

function getDifficultyLabel(difficulty?: string) {
  if (!difficulty) return 'unknown'
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

function getCompletionStateLabel(status?: string) {
  if (status === 'perfect') return 'Perfect'
  if (status === 'complete') return 'Complete'
  if (status === 'in_progress') return 'In Progress'
  if (status === 'active') return 'In Progress'
  return 'Not Started'
}

function isValidCountryCode(code?: string | null) {
  return !!code && !!COUNTRY_BY_ISO2[code]
}

function getInitialCountry() {
  const saved = safeStorageGet(STORAGE_KEY) || LEGACY_STORAGE_KEYS.map(safeStorageGet).find(Boolean)
  if (isValidCountryCode(saved)) return saved
  if (COUNTRY_BY_ISO2.FR) return 'FR'
  return COUNTRIES[0]?.iso2 || 'FR'
}

function resolveCountry(code: string) {
  if (isValidCountryCode(code)) return COUNTRY_BY_ISO2[code]
  if (COUNTRY_BY_ISO2.FR) return COUNTRY_BY_ISO2.FR
  return COUNTRIES[0]
}

function maybeTitle(progress: { levelTitle?: string }) {
  return progress.levelTitle || 'Junior Explorer'
}

function formatCompletionTimestamp(value?: string | null) {
  if (!value) return 'Today'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
}

function souvenirEmoji(name: string) {
  if (name === 'Eiffel Tower') return '🗼'
  if (name === 'Cherry Blossom') return '🌸'
  if (name === 'Soccer Ball') return '⚽'
  if (name === 'Statue of Liberty') return '🗽'
  if (name === 'Pizza') return '🍕'
  return '🏷️'
}

function CompletionOverlay({
  reward,
  countryName,
  progress,
  stage,
  onNext,
  onViewPassport,
}: {
  reward: RewardPayload
  countryName: string
  progress: ReturnType<typeof loadFlagProgress>
  stage: RewardStage
  onNext: () => void
  onViewPassport: () => void
}) {
  const stampVisible = stage !== 'stamp'
  const souvenirVisible = stage === 'souvenir' || stage === 'stars' || stage === 'xp' || stage === 'done'
  const starsVisible = stage === 'stars' || stage === 'xp' || stage === 'done'
  const xpVisible = stage === 'xp' || stage === 'done'
  const actionsVisible = stage === 'done'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1b0e]/70 px-4 backdrop-blur-sm">
      <div className="banana-overlay absolute inset-0 opacity-75" aria-hidden />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-[#ffd78a]/70 bg-gradient-to-br from-[#fff8dd] via-[#ffe9aa] to-[#ffd7a1] p-5 text-[#5e3511] shadow-[0_30px_100px_rgba(63,31,5,0.45)]">
        <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_70%)]" />
        <div className="absolute inset-0 banana-overlay opacity-45" aria-hidden />
        <div className="relative flex flex-col gap-4">
          <div className="banana-burst text-center">
            <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#9b5f13]">Flag Complete</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-[0.03em] text-[#7b3f09] drop-shadow-[0_2px_0_rgba(255,255,255,0.7)]">
              You colored {countryName}!
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#875214]">{reward.message}</p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] border-4 border-[#fff4c9] bg-[#fffaf0] p-4 shadow-[inset_0_0_0_1px_rgba(149,89,28,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-18 w-18 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#ffcc77] to-[#ff9b58] text-4xl shadow-[0_10px_20px_rgba(153,84,27,0.25)]">
                  {reward.flagEmoji || '🏳️'}
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.34em] text-[#b46e11]">Passport Stamp</div>
                  <div className="mt-1 text-2xl font-black text-[#753b0b]">{reward.passportStamp.label}</div>
                  <div className="text-sm font-semibold text-[#94602a]">{reward.passportStamp.countryName}</div>
                </div>
              </div>
              <div className={`mt-4 rounded-[24px] border-[6px] border-[#8c4a12] bg-[#f7d5a5] px-4 py-3 text-center shadow-[inset_0_0_0_2px_rgba(255,255,255,0.18)] ${stampVisible ? 'stamp-slam' : 'opacity-0'}`}>
                <div className="text-[10px] font-black uppercase tracking-[0.42em] text-[#7b2f0b]">{reward.passportStamp.label}</div>
                <div className="mt-1 text-2xl font-black tracking-[0.18em] text-[#6d2908]">{reward.passportStamp.countryName}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-[#7f4b15]">
                  {formatCompletionTimestamp(reward.passportStamp.completedAt)}
                </div>
                <div className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-[#a15b10]">Stars Earned: {reward.stars}</div>
              </div>
            </div>

            <div className="rounded-[28px] border-4 border-[#fff0be] bg-[#fff6d6] p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b46e11]">Souvenir Unlocked</div>
              <div className={`mt-3 rounded-[24px] bg-gradient-to-br from-[#fffdf2] to-[#ffe0a8] p-4 text-center shadow-[0_12px_24px_rgba(135,79,18,0.14)] ${souvenirVisible ? 'souvenir-pop' : 'opacity-0 translate-y-3'}`}>
                <div className="text-5xl">{souvenirEmoji(reward.souvenir.name)}</div>
                <div className="mt-2 text-2xl font-black text-[#7b3f09]">{reward.souvenir.name}</div>
              </div>
              <div className={`mt-4 ${starsVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b46e11]">Stars</div>
                <div className="mt-2 flex gap-2 text-4xl">
                  {Array.from({ length: reward.stars }).map((_, i) => (
                    <span key={i} className="star-pop">
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`grid gap-3 rounded-[28px] border border-[#c88c36]/20 bg-[#fff8e6] p-4 md:grid-cols-2 ${xpVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b46e11]">XP Summary</div>
              <div className="mt-3 space-y-1 text-sm font-semibold text-[#754016]">
                <div className="flex justify-between"><span>+{reward.xp.flagComplete} Flag Complete</span><span /></div>
                <div className="flex justify-between"><span>+{reward.xp.perfectBonus} Perfect Bonus</span><span /></div>
                <div className="flex justify-between"><span>+{reward.xp.souvenirBonus} Souvenir Unlock</span><span /></div>
                <div className="mt-2 flex justify-between border-t border-[#d7b26e]/40 pt-2 text-base font-black">
                  <span>Total</span>
                  <span>+{reward.xp.total} XP</span>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] bg-white/70 p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b46e11]">Explorer Title</div>
              <div className="mt-2 text-2xl font-black text-[#7b3f09]">{maybeTitle(progress)}</div>
              <div className="mt-2 text-sm font-semibold text-[#875214]">
                {progress.completedCountries} completed countries. {progress.perfectFlags} perfect flags.
              </div>
            </div>
          </div>

          <div className={`flex flex-col gap-3 sm:flex-row ${actionsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button onClick={onNext} className="flex-1 rounded-full bg-[#f08a24] px-6 py-4 text-lg font-black text-white shadow-[0_10px_0_#b85f12] transition-transform hover:-translate-y-0.5 active:translate-y-1">
              Next Flag
            </button>
            <button onClick={onViewPassport} className="flex-1 rounded-full border-2 border-[#b76b11] bg-white/75 px-6 py-4 text-lg font-black text-[#7b3f09] shadow-[0_6px_0_rgba(183,107,17,0.25)]">
              View Passport
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlagGamePage() {
  const [progress, setProgress] = useState<ReturnType<typeof loadFlagProgress>>(() => createDefaultFlagProgress() as ReturnType<typeof loadFlagProgress>)
  const [activeCountryCode, setActiveCountryCode] = useState('FR')
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [coloringState, setColoringState] = useState<Record<string, Record<string, { selectedColorIndex: number; isCorrect: boolean; updatedAt: string }>>>({})
  const [reward, setReward] = useState<RewardPayload | null>(null)
  const [rewardStage, setRewardStage] = useState<RewardStage>('stamp')
  const [clientReady, setClientReady] = useState(false)
  const [explorerQuery, setExplorerQuery] = useState('')
  const [explorerContinent, setExplorerContinent] = useState('all')
  const [explorerFilter, setExplorerFilter] = useState<'all' | 'not_started' | 'complete' | 'perfect' | 'easy' | 'medium' | 'hard' | 'expert'>('all')
  const timersRef = useRef<number[]>([])

  const country = resolveCountry(activeCountryCode)
  const countryProgress = getCountryProgress(progress, activeCountryCode)
  const completed = countryProgress.status === 'complete' || countryProgress.status === 'perfect'
  const palette = countryPalette(country)
  const regionFillState = coloringState[activeCountryCode] || {}
  const totalColorableRegions = country.flag_regions.length
  const coloredRegionCount = country.flag_regions.filter((region: any) => regionFillState[region.id] !== undefined).length
  const correctRegionCount = country.flag_regions.filter((region: any) => regionFillState[region.id]?.isCorrect).length
  const allRegionsFilled = totalColorableRegions > 0 && coloredRegionCount === totalColorableRegions
  const isPerfectFlag = allRegionsFilled && correctRegionCount === totalColorableRegions
  const completionStars = isPerfectFlag ? 3 : allRegionsFilled ? 2 : 0
  const completionMessage = isPerfectFlag ? 'Perfect match.' : allRegionsFilled ? 'Almost there!' : 'Finish every region to complete the flag.'
  const completionButtonLabel = completed ? 'Next Flag' : allRegionsFilled ? 'Almost there!' : 'Complete Flag'
  const displayProgress = clientReady ? progress : createDefaultFlagProgress()
  const displayActiveCountryCode = clientReady ? activeCountryCode : 'FR'
  const displayCountry = resolveCountry(displayActiveCountryCode)
  const displayCountryProgress = getCountryProgress(displayProgress, displayActiveCountryCode)
  const displayCompleted = displayCountryProgress.status === 'complete' || displayCountryProgress.status === 'perfect'
  const displayPalette = countryPalette(displayCountry)
  const displayRegionFillState = clientReady ? (coloringState[displayActiveCountryCode] || {}) : {}
  const displayTotalColorableRegions = displayCountry.flag_regions.length
  const displayColoredRegionCount = displayCountry.flag_regions.filter((region: any) => displayRegionFillState[region.id] !== undefined).length
  const displayCorrectRegionCount = displayCountry.flag_regions.filter((region: any) => displayRegionFillState[region.id]?.isCorrect).length
  const displayAllRegionsFilled = displayTotalColorableRegions > 0 && displayColoredRegionCount === displayTotalColorableRegions
  const displayIsPerfectFlag = displayAllRegionsFilled && displayCorrectRegionCount === displayTotalColorableRegions
  const displayCompletionMessage = displayIsPerfectFlag ? 'Perfect match.' : displayAllRegionsFilled ? 'Almost there!' : 'Finish every region to complete the flag.'
  const displayCompletionButtonLabel = displayCompleted ? 'Next Flag' : displayAllRegionsFilled ? 'Almost there!' : 'Complete Flag'
  const totalCountries = COUNTRIES.length
  const completedCountryCount = displayProgress.completedCountries
  const completionRatio = `${completedCountryCount} / ${totalCountries}`
  const perfectFlagsCount = displayProgress.perfectFlags
  const countryContinentOptions = Array.from(new Set(COUNTRIES.map((item) => item.continent))).sort()
  const normalizedQuery = explorerQuery.trim().toLowerCase()
  const visibleCountries = COUNTRIES.filter((item) => {
    const p = getCountryProgress(displayProgress, item.iso2)
    const difficulty = (item.difficulty || 'unknown').toLowerCase()
    const matchesQuery =
      !normalizedQuery ||
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.iso2.toLowerCase().includes(normalizedQuery) ||
      item.continent.toLowerCase().includes(normalizedQuery)
    const matchesContinent = explorerContinent === 'all' || item.continent.toLowerCase() === explorerContinent.toLowerCase()
    const matchesFilter = (() => {
      if (explorerFilter === 'all') return true
      if (explorerFilter === 'not_started') return p.status === 'not_started' || p.status === 'in_progress'
      if (explorerFilter === 'complete') return p.status === 'complete'
      if (explorerFilter === 'perfect') return p.status === 'perfect'
      return difficulty === explorerFilter
    })()
    return matchesQuery && matchesContinent && matchesFilter
  })
  const complexFlag = displayTotalColorableRegions > 6 || displayCountry.flag_regions.length > 6
  const flagHeightClass = complexFlag ? 'min-h-[320px]' : 'min-h-[240px]'

  useEffect(() => {
    const storedProgress = loadFlagProgress()
    const storedCountry = getInitialCountry()
    setProgress(storedProgress)
    setActiveCountryCode(storedCountry)
    setColoringState(loadRegionColorState())
    setClientReady(true)
  }, [])

  useEffect(() => {
    safeStorageSet(STORAGE_KEY, activeCountryCode)
  }, [activeCountryCode])

  useEffect(() => {
    saveRegionColorState(coloringState)
  }, [coloringState])

  useEffect(() => {
    setSelectedColorIndex(0)
  }, [activeCountryCode])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!reward) return
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    setRewardStage('stamp')
    timersRef.current.push(window.setTimeout(() => setRewardStage('souvenir'), 550))
    timersRef.current.push(window.setTimeout(() => setRewardStage('stars'), 1150))
    timersRef.current.push(window.setTimeout(() => setRewardStage('xp'), 1650))
    timersRef.current.push(window.setTimeout(() => setRewardStage('done'), 2200))
  }, [reward])

  function colorRegion(regionId: string) {
    if (!palette.length) return
    setColoringState((current) => {
      const nextForCountry = {
        ...(current[activeCountryCode] || {}),
        [regionId]: {
          selectedColorIndex,
          isCorrect: selectedColorIndex === country.flag_regions.find((region: any) => region.id === regionId)?.color,
          updatedAt: new Date().toISOString(),
        },
      }
      return {
        ...current,
        [activeCountryCode]: nextForCountry,
      }
    })
  }

  function markComplete() {
    if (completed || !allRegionsFilled) return
    const result = completeCountry(activeCountryCode, progress, {
      stars: completionStars || 1,
      completedAt: new Date().toISOString(),
    })
    setProgress(result.progress)
    setReward(result.reward)
  }

  function nextCountry() {
    const currentIndex = COUNTRIES.findIndex((item) => item.iso2 === activeCountryCode)
    const next = COUNTRIES[(currentIndex + 1) % COUNTRIES.length]
    setActiveCountryCode(next.iso2)
    setReward(null)
    const nextSaved = coloringState[next.iso2]
    const firstColorIndex = nextSaved ? Object.values(nextSaved)[0]?.selectedColorIndex ?? 0 : 0
    setSelectedColorIndex(firstColorIndex)
  }

  function viewPassport() {
    window.alert('Passport view is not built yet. Progress is saved locally.')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#fff7de_0%,_#f8d98f_28%,_#f0b55a_52%,_#7b3f09_100%)] text-[#5e3511]">
      <div className="banana-overlay pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
        <header className="rounded-[28px] border border-[#fff0c7]/80 bg-[rgba(255,251,235,0.82)] p-4 shadow-[0_16px_50px_rgba(102,55,11,0.18)] backdrop-blur-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#b96a10]">COLOR THE FLAG</div>
              <h1 className="mt-2 font-display text-4xl font-black tracking-[0.04em] text-[#7b3f09]">Ronan&apos;s Flag Game</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold text-[#8d5a22]">Color the flag, earn a stamp, unlock a souvenir, and move on to the next country.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-bold text-[#7b3f09]">
              <div className="rounded-2xl bg-white/70 px-4 py-3">XP <span className="block text-2xl font-black">{displayProgress.xp}</span></div>
              <div className="rounded-2xl bg-white/70 px-4 py-3">Title <span className="block text-lg font-black">{maybeTitle(displayProgress)}</span></div>
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border-4 border-[#fff2b9] bg-[rgba(255,250,235,0.8)] p-4 shadow-[0_24px_70px_rgba(94,53,17,0.18)] backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b96a10]">Current Flag</div>
                <div className="mt-1 text-3xl font-black text-[#7b3f09]">{displayCountry.name}</div>
                <div className="text-sm font-semibold text-[#8d5a22]">{displayCountry.continent}</div>
              </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-[0.3em] ${displayCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'}`}>
                {displayCountryProgress.status}
              </div>
              <div className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#8d5a22]">
                {getDifficultyLabel(displayCountry.difficulty)}
              </div>
            </div>
          </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] bg-white/75 px-4 py-3 text-sm font-semibold text-[#7a4a17]">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a15b10]">Global Progress</div>
                <div className="mt-1 text-xl font-black text-[#7b3f09]">{completedCountryCount} / {totalCountries}</div>
              </div>
              <div className="rounded-[22px] bg-white/75 px-4 py-3 text-sm font-semibold text-[#7a4a17]">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a15b10]">Perfect Flags</div>
                <div className="mt-1 text-xl font-black text-[#7b3f09]">{perfectFlagsCount}</div>
              </div>
              <div className="rounded-[22px] bg-white/75 px-4 py-3 text-sm font-semibold text-[#7a4a17]">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#a15b10]">Explorer State</div>
                <div className="mt-1 text-base font-black text-[#7b3f09]">{displayCountryProgress.status}</div>
              </div>
            </div>

            <div className={`mt-4 rounded-[30px] bg-[linear-gradient(180deg,#fffefa,#fff2c7)] p-4 shadow-inner ${flagHeightClass}`}>
              <svg viewBox="0 0 300 200" className="mx-auto h-full w-full max-w-2xl rounded-[22px] border-4 border-[#f3d68d] bg-white shadow-[0_16px_40px_rgba(133,79,18,0.14)]">
                {displayCountry.flag_regions.map((region: any) =>
                  region.shapes.map((shape: any, idx: number) => {
                    const fillColor = displayPalette[displayRegionFillState[region.id]?.selectedColorIndex ?? region.color] || '#eee'
                    return (
                      <g
                        key={`${region.id}-${idx}`}
                        className="cursor-pointer"
                        onClick={() => colorRegion(region.id)}
                        onTouchStart={() => colorRegion(region.id)}
                      >
                        {getCountryShape(shape.t, shape, fillColor)}
                      </g>
                    )
                  })
                )}
                {displayCompleted && <text x="150" y="25" textAnchor="middle" className="fill-[#7b3f09] text-[14px] font-black">COMPLETE</text>}
              </svg>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-[24px] bg-[#fff8e8] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b96a10]">Color Kit</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {displayPalette.map((color: string, idx: number) => (
                    <button
                      key={color}
                      className={`h-11 w-11 rounded-full border-4 shadow-[0_8px_16px_rgba(90,53,13,0.18)] transition-transform ${idx === selectedColorIndex ? 'scale-110 border-[#7b3f09] ring-4 ring-[#ffd26f]' : 'border-white'}`}
                      style={{ background: color }}
                      onClick={() => setSelectedColorIndex(idx)}
                      aria-label={`Color ${idx + 1}`}
                      aria-pressed={idx === selectedColorIndex}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] bg-[#fff8e8] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b96a10]">Saved State</div>
                <div className="mt-2 text-sm font-semibold text-[#7a4a17]">
                  {completedCountryCount} countries completed.
                  <br />
                  Campaign progress: {completionRatio}
                  <br />
                  {displayCountry.name} stays complete after refresh.
                  <br />
                  Colors filled: {displayColoredRegionCount} / {displayTotalColorableRegions}
                  <br />
                  Correct parts: {displayCorrectRegionCount} / {displayTotalColorableRegions}
                  <br />
                  {displayCompletionMessage}
                </div>
                <button
                  onClick={markComplete}
                  disabled={!displayAllRegionsFilled && !displayCompleted}
                  className={`mt-4 rounded-full px-4 py-2 text-sm font-black text-white shadow-[0_6px_0_#2e8a4d] ${(displayAllRegionsFilled || displayCompleted) ? 'bg-[#44b96a]' : 'bg-[#9db59f] opacity-75'}`}
                >
                  {displayCompleted ? 'View Reward' : displayCompletionButtonLabel}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-[24px] bg-[#fff8e8] p-4">
              <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b96a10]">Travel Summary</div>
              <div className="mt-3 grid gap-2 text-sm font-semibold text-[#7a4a17] sm:grid-cols-2">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">Completed</div>
                  <div className="mt-1">{formatCompletionTimestamp(displayProgress.passportStamps[displayProgress.passportStamps.length - 1]?.completedAt)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">Flag Parts Colored</div>
                  <div className="mt-1">{displayColoredRegionCount} / {displayTotalColorableRegions}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">Passport Stamps</div>
                  <div className="mt-1">{displayProgress.passportStamps.length}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">Souvenir</div>
                  <div className="mt-1">{displayProgress.unlockedSouvenirs[displayProgress.unlockedSouvenirs.length - 1] || 'None yet'}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">XP Earned</div>
                  <div className="mt-1">{displayProgress.xp}</div>
                </div>
              </div>
              <div className="mt-4 rounded-[20px] border border-[#efd8a4] bg-white/70 p-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8d5a22]">
                Explorer log now covers all {totalCountries} countries.
              </div>
            </div>
          </div>

          <aside className="rounded-[32px] border-4 border-[#fff2b9] bg-[rgba(255,250,235,0.82)] p-4 shadow-[0_24px_70px_rgba(94,53,17,0.18)] backdrop-blur-sm">
            <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b96a10]">Explorer Log</div>
            <div className="mt-2 rounded-[20px] border border-[#efd8a4] bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#8d5a22]">
              {completedCountryCount} of {totalCountries} completed
            </div>
            <div className="mt-2 rounded-[20px] border border-[#efd8a4] bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-[#8d5a22]">
              {perfectFlagsCount} perfect flags tracked
            </div>
            <div className="mt-3 space-y-3">
              <div className="grid gap-2">
                <label className="rounded-[18px] border border-[#efd8a4] bg-white/70 px-3 py-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">Search</span>
                  <input
                    value={explorerQuery}
                    onChange={(event) => setExplorerQuery(event.target.value)}
                    placeholder="Country name"
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-[#7b3f09] outline-none placeholder:text-[#b48b4f]"
                  />
                </label>
                <label className="rounded-[18px] border border-[#efd8a4] bg-white/70 px-3 py-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#a15b10]">Continent</span>
                  <select
                    value={explorerContinent}
                    onChange={(event) => setExplorerContinent(event.target.value)}
                    className="mt-1 w-full bg-transparent text-sm font-semibold text-[#7b3f09] outline-none"
                  >
                    <option value="all">All continents</option>
                    {countryContinentOptions.map((continent) => (
                      <option key={continent} value={continent}>
                        {continent}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['all', 'All'],
                    ['not_started', 'Not Started'],
                    ['complete', 'Complete'],
                    ['perfect', 'Perfect'],
                    ['easy', 'Easy'],
                    ['medium', 'Medium'],
                    ['hard', 'Hard'],
                    ['expert', 'Expert'],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setExplorerFilter(value as typeof explorerFilter)}
                      className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition ${
                        explorerFilter === value
                          ? 'bg-[#7b3f09] text-white shadow-[0_8px_18px_rgba(123,63,9,0.2)]'
                          : 'bg-white/70 text-[#8d5a22]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[72vh] space-y-3 overflow-y-auto pr-1 pb-2 overscroll-contain touch-pan-y">
                {visibleCountries.map((item) => {
                const p = getCountryProgress(displayProgress, item.iso2)
                return (
                  <button
                    key={item.iso2}
                    onClick={() => setActiveCountryCode(item.iso2)}
                    className={`w-full rounded-[22px] border px-4 py-3 text-left transition ${item.iso2 === activeCountryCode ? 'border-[#d89a37] bg-white shadow-[0_10px_24px_rgba(122,74,23,0.14)]' : 'border-[#efd8a4] bg-[#fffaf1]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black text-[#7b3f09]">{item.name}</div>
                        <div className="text-xs font-semibold text-[#8d5a22]">
                          {item.continent} · {getDifficultyLabel(item.difficulty)} · {getCompletionStateLabel(p.status)}
                        </div>
                      </div>
                      <div className="text-xl">{p.status === 'complete' || p.status === 'perfect' ? '✅' : p.status === 'in_progress' ? '🟠' : '⚪'}</div>
                    </div>
                  </button>
                )
                })}
                {visibleCountries.length === 0 && (
                  <div className="rounded-[22px] border border-dashed border-[#d8b46d] bg-white/60 px-4 py-6 text-center text-sm font-semibold text-[#8d5a22]">
                    No countries match this search or filter.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {reward && (
        <CompletionOverlay
          reward={reward}
          countryName={displayCountry.name}
          progress={displayProgress}
          stage={rewardStage}
          onNext={nextCountry}
          onViewPassport={viewPassport}
        />
      )}
    </main>
  )
}

