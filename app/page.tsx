'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { COUNTRIES, COUNTRY_BY_ISO2 } from '../public/countries.js'
import { completeCountry, getCountryProgress, loadFlagProgress } from '../public/flag-progress.js'
import { CHALLENGE_COUNTRIES, DEFAULT_CHALLENGE_ISO2, MAP_PINS, getCelebrationProfile, resolvePlayableChallenge, type CompletionSoundHook, type CountryChallengeConfig, type FillPatternId, type FlagRegionConfig } from '../lib/countries'

type Screen = 'loading' | 'home' | 'country-arrival' | 'play' | 'flag-color-challenge' | 'create-room' | 'join-room' | 'waiting-room' | 'coop' | 'versus'
type Mode = 'solo' | 'coop' | 'versus'
type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
type RewardStage = 'stamp' | 'souvenir' | 'stars' | 'xp' | 'done'
type RoomStatus = 'waiting' | 'ready' | 'active'
type PaintFeedback = { state: 'correct' | 'wrong'; at: number }
type FillHold = { regionId: string; pointerId: number | null; scenePoint: { x: number; y: number }; raf: number | null; lastTs: number | null; metrics: { svgRect: DOMRect; stageRect: DOMRect } | null }
type FranceSpark = { key: number; x: number; y: number; hue: string; kind: 'orb' | 'correct' | 'wrong' | 'complete' }
type RoomState = { id: string; code: string; hostName: string; guestName?: string; mode: Exclude<Mode, 'solo'>; createdAt: string; updatedAt: string; status: RoomStatus; activeCountryCode: string; rounds: string[]; roundIndex: number; scores: Record<string, number>; lastMoveAt?: string }
type RoomSnapshot = { room: RoomState; note: string }

const PLAYER_NAME_KEY = 'ronan_flag_player_name'
const PLAYER_NAME_CONFIRMED_KEY = 'ronan_flag_player_name_confirmed'
const ACTIVE_MODE_KEY = 'ronan_flag_active_mode'
const CHALLENGE_DIFFICULTY_KEY = 'ronan_flag_challenge_difficulty'
const ACTIVE_COUNTRY_KEY = 'flag_game_v1_active_country'
const ROOM_STORAGE_KEY = 'ronan_flag_room'
const ROOM_CHANNEL = 'ronan-flag-room-sync'

function safeStorageGet(key: string) { if (typeof window === 'undefined') return null; return window.localStorage.getItem(key) }
function safeStorageSet(key: string, value: string) { if (typeof window === 'undefined') return; window.localStorage.setItem(key, value) }
function isValidCountryCode(code?: string | null) { return !!code && !!COUNTRY_BY_ISO2[code] }
function getInitialCountry() { const saved = safeStorageGet(ACTIVE_COUNTRY_KEY); return isValidCountryCode(saved) ? (saved as string) : DEFAULT_CHALLENGE_ISO2 }
function getCountryLanguage(country: (typeof COUNTRIES)[number]) { return country.languages?.[0] || 'Unknown' }
function getCountryFunFact(country: (typeof COUNTRIES)[number]) { return country.fun_facts?.find((fact: string) => fact?.trim()) || country.landmark?.trim() || `${country.name} is in ${country.continent}.` }
function roomCode() { return Math.random().toString(36).slice(2, 8).toUpperCase() }
function roomId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}` }
function useSoundHooks() { return { playSound: (_hook: CompletionSoundHook) => void 0 } }
function loadRoom(): RoomState | null { if (typeof window === 'undefined') return null; const raw = window.localStorage.getItem(ROOM_STORAGE_KEY); if (!raw) return null; try { return JSON.parse(raw) as RoomState } catch { return null } }
function saveRoom(room: RoomState | null) { if (typeof window === 'undefined') return; if (!room) window.localStorage.removeItem(ROOM_STORAGE_KEY); else window.localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(room)) }
function makeRoom(mode: Exclude<Mode, 'solo'>, hostName: string, countryCode: string): RoomState { const baseCountry = COUNTRY_BY_ISO2[countryCode] || COUNTRIES[0]; return { id: roomId(), code: roomCode(), hostName, mode, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'waiting', activeCountryCode: baseCountry.iso2, rounds: COUNTRIES.slice(0, 12).map((item) => item.iso2), roundIndex: 0, scores: {} } }
function countryPalette(country: (typeof COUNTRIES)[number]) { return country.theme_colors || country.flag_colors || ['#0055A4', '#FFFFFF', '#EF4135'] }
function getCountryShape(type: string, shape: any, fill: string) { if (type === 'rect') return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} fill={fill} />; if (type === 'circle') return <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />; if (type === 'polygon') return <polygon points={shape.points} fill={fill} />; return null }
function titleFor(progress: ReturnType<typeof loadFlagProgress>) { return progress.levelTitle || 'Junior Explorer' }
function getCompletionProgress(progress: ReturnType<typeof loadFlagProgress>) { const completed = progress.completedCountries || 0; const total = COUNTRIES.length; return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 } }
type WorldMapNode = {
  country: (typeof COUNTRIES)[number]
  x: number
  y: number
  ring: 'completed' | 'current' | 'locked' | 'default'
}

function getExplorerTier(percent: number) {
  if (percent >= 85) return 'Global Pathfinder'
  if (percent >= 60) return 'Continental Voyager'
  if (percent >= 35) return 'Route Keeper'
  return 'Junior Explorer'
}

function buildMapNodes(progress: ReturnType<typeof loadFlagProgress>, currentCountryCode: string): WorldMapNode[] {
  const ringByCountry = COUNTRIES.map((country, index) => {
    const completion = getCountryProgress(progress, country.iso2)
    return {
      country,
      ring: country.iso2 === currentCountryCode ? 'current' : completion.status === 'complete' || completion.status === 'perfect' ? 'completed' : 'locked',
      index,
    } satisfies { country: (typeof COUNTRIES)[number]; ring: WorldMapNode['ring']; index: number }
  })

  const coordinates = ringByCountry.map(({ country, ring, index }) => {
    const latSeed = (country.name.charCodeAt(0) * 11 + country.id.length * 17 + index * 23) % 160
    const lngSeed = (country.name.charCodeAt(country.name.length - 1) * 13 + country.iso2.charCodeAt(0) * 7 + index * 19) % 220
    const x = 18 + ((lngSeed / 220) * 64) + (ring === 'current' ? 2 : 0)
    const y = 18 + ((latSeed / 160) * 64)
    return { country, x, y, ring }
  })

  return coordinates.slice(0, 24)
}

function routePairs(nodes: WorldMapNode[]) {
  const completed = nodes.filter((node) => node.ring === 'completed')
  return completed.slice(0, -1).map((node, index) => {
    const next = completed[index + 1]
    return `${node.x},${node.y} ${next.x},${next.y}`
  })
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Rewards panel shows completion dates kid-friendly ("July 9, 2026"). The
// stored value stays untouched — this only formats for display, and hides
// the line entirely if the stored string is not a recognizable date.
function formatFriendlyDate(value?: string | null) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '')
  if (!match) return null
  const month = MONTH_NAMES[Number(match[2]) - 1]
  return month ? `${month} ${Number(match[3])}, ${Number(match[1])}` : null
}

// Next Flag only appears once a second country is playable in the challenge
// registry, so unfinished prototypes can never be reached from the rewards
// panel. Shipping the next country (playable: true) re-enables it.
const HAS_NEXT_PLAYABLE_CHALLENGE = Object.values(CHALLENGE_COUNTRIES).filter((config) => config.playable).length > 1

// Viewport-driven orientation (not device-driven): a rotated phone and a
// desktop window take the same landscape path. Exposed as data-orientation
// on the root wrapper so later tasks can branch screen layouts on it; no
// screen branches on it yet. SSR renders portrait; corrected on mount.
function useViewportOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  useEffect(() => {
    const query = window.matchMedia('(orientation: landscape)')
    const apply = () => setOrientation(query.matches ? 'landscape' : 'portrait')
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])
  return orientation
}

function useRoomChannel(onSnapshot: (room: RoomState) => void) { const channelRef = useRef<BroadcastChannel | null>(null); useEffect(() => { if (typeof window === 'undefined') return; const onStorage = (event: StorageEvent) => { if (event.key !== ROOM_STORAGE_KEY || !event.newValue) return; try { onSnapshot(JSON.parse(event.newValue) as RoomState) } catch {} }; window.addEventListener('storage', onStorage); if ('BroadcastChannel' in window) { const channel = new BroadcastChannel(ROOM_CHANNEL); channel.onmessage = (event) => { const payload = event.data as RoomSnapshot | null; if (payload?.room) onSnapshot(payload.room) }; channelRef.current = channel } return () => { window.removeEventListener('storage', onStorage); channelRef.current?.close() } }, [onSnapshot]); return channelRef }
function AtmosphereBackdrop() { return <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.62)_0%,_rgba(255,255,255,0.20)_26%,_rgba(142,213,255,0.00)_58%)]" /><div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(255,240,204,0)_0%,rgba(246,213,143,0.50)_55%,rgba(231,183,105,0.96)_100%)]" /><div className="absolute left-1/2 top-[16%] h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.94)_0%,_rgba(255,255,255,0.58)_42%,_rgba(255,255,255,0)_72%)] blur-[2px]" /></div> }

function renderFlagShape(shape: FlagRegionConfig['shapes'][number], fill: string, key?: string) {
  if (shape.t === 'rect') return <rect key={key} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx || 0} fill={fill} />
  if (shape.t === 'circle') return <circle key={key} cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />
  if (shape.t === 'polygon') return <polygon key={key} points={shape.points} fill={fill} />
  return null
}

type AssignedFillPattern = { pattern: FillPatternId; variant: string }
type RegionBox = { x: number; y: number; w: number; h: number }

const ALL_FILL_PATTERNS: FillPatternId[] = ['vertical', 'horizontal', 'diagonal', 'perimeter']
const FILL_PATTERN_VARIANTS: Record<FillPatternId, string[]> = {
  vertical: ['down', 'up'],
  horizontal: ['right', 'left'],
  diagonal: ['tl', 'tr', 'bl', 'br'],
  perimeter: ['cw', 'ccw'],
}
const PENCIL_STROKES_PER_SECOND = 3
const PENCIL_BASE_ROTATION = -14

// One random pattern+direction per region per attempt. Dealing shuffled
// combos without replacement guarantees the regions of one flag never all
// share a single pattern+direction in a playthrough.
function assignFillPatterns(regions: FlagRegionConfig[], pool: FillPatternId[], reducedMotion: boolean): Record<string, AssignedFillPattern> {
  const assigned: Record<string, AssignedFillPattern> = {}
  if (reducedMotion || !pool.length) {
    for (const region of regions) assigned[region.id] = { pattern: 'vertical', variant: 'down' }
    return assigned
  }
  const combos = pool.flatMap((pattern) => FILL_PATTERN_VARIANTS[pattern].map((variant) => ({ pattern, variant })))
  for (let i = combos.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combos[i], combos[j]] = [combos[j], combos[i]]
  }
  regions.forEach((region, index) => { assigned[region.id] = combos[index % combos.length] })
  return assigned
}

// Fill-front anchor in flag SVG coords for the current progress, plus the
// unit direction the pencil strokes along (perpendicular to fill travel).
// tSec drives the perimeter lap position; the sweep patterns ignore it.
function fillFrontPoint(assigned: AssignedFillPattern, b: RegionBox, progress: number, tSec: number) {
  const inset = Math.min(b.w, b.h) * 0.12
  const clampX = (x: number) => Math.min(b.x + b.w - inset, Math.max(b.x + inset, x))
  const clampY = (y: number) => Math.min(b.y + b.h - inset, Math.max(b.y + inset, y))
  if (assigned.pattern === 'vertical') {
    const y = assigned.variant === 'down' ? b.y + progress * b.h : b.y + (1 - progress) * b.h
    return { x: b.x + b.w / 2, y: clampY(y), perpX: 1, perpY: 0 }
  }
  if (assigned.pattern === 'horizontal') {
    const x = assigned.variant === 'right' ? b.x + progress * b.w : b.x + (1 - progress) * b.w
    return { x: clampX(x), y: b.y + b.h / 2, perpX: 0, perpY: 1 }
  }
  if (assigned.pattern === 'diagonal') {
    const fromLeft = assigned.variant === 'tl' || assigned.variant === 'bl'
    const fromTop = assigned.variant === 'tl' || assigned.variant === 'tr'
    const x = clampX((fromLeft ? b.x : b.x + b.w) + (fromLeft ? 1 : -1) * progress * b.w)
    const y = clampY((fromTop ? b.y : b.y + b.h) + (fromTop ? 1 : -1) * progress * b.h)
    const len = Math.hypot(b.w, b.h)
    return { x, y, perpX: ((fromTop ? 1 : -1) * b.h) / len, perpY: ((fromLeft ? -1 : 1) * b.w) / len }
  }
  // Perimeter: ride the shrinking inner ring (matches the 0.56 CSS inset factor).
  const ix = Math.min(progress * 0.56, 0.46) * b.w
  const iy = Math.min(progress * 0.56, 0.46) * b.h
  const rx = b.x + ix
  const ry = b.y + iy
  const rw = Math.max(4, b.w - 2 * ix)
  const rh = Math.max(4, b.h - 2 * iy)
  const lap = tSec * 1.1
  let u = lap - Math.floor(lap)
  if (assigned.variant === 'ccw') u = 1 - u
  const d = u * 2 * (rw + rh)
  let x = rx
  let y = ry
  let perpX = 0
  let perpY = 1
  if (d < rw) { x = rx + d; y = ry; perpX = 0; perpY = 1 }
  else if (d < rw + rh) { x = rx + rw; y = ry + (d - rw); perpX = -1; perpY = 0 }
  else if (d < rw + rh + rw) { x = rx + rw - (d - rw - rh); y = ry + rh; perpX = 0; perpY = -1 }
  else { x = rx; y = ry + rh - (d - 2 * rw - rh); perpX = 1; perpY = 0 }
  return { x: clampX(x), y: clampY(y), perpX, perpY }
}

// Local offsets for the three fill sparkles, spread along the fill front.
function sparkleOffsets(assigned: AssignedFillPattern, b: RegionBox) {
  if (assigned.pattern === 'perimeter') return [{ dx: -4, dy: 0 }, { dx: 2, dy: 3 }, { dx: 5, dy: -2 }]
  const { perpX, perpY } = fillFrontPoint(assigned, b, 0, 0)
  const span = assigned.pattern === 'diagonal' ? Math.min(b.w, b.h) : Math.abs(perpX) > 0 ? b.w : b.h
  return [-0.24, 0.04, 0.28].map((s) => ({ dx: perpX * s * span, dy: perpY * s * span }))
}

function FlagColorChallengeGame({
  config,
  onBack,
  onComplete,
}: {
  config: CountryChallengeConfig
  onBack: () => void
  onComplete: () => void
}) {
  const scene = config.scene
  const round = config.round
  // Phase 1 draws the region boundary lines; the palette and coloring only
  // exist once phase reaches 'color'. Re-entry remounts this component, so
  // every play starts back at the blank dotted-line state.
  const [phase, setPhase] = useState<'draw' | 'reveal' | 'color'>('draw')
  const [lineHolding, setLineHolding] = useState(false)
  const [selectedOrb, setSelectedOrb] = useState(scene.defaultOrbId)
  const [activeNav, setActiveNav] = useState(scene.defaultNavId)
  const [spark, setSpark] = useState<FranceSpark | null>(null)
  const [filledRegions, setFilledRegions] = useState<Record<string, boolean>>({})
  const [activeFillRegion, setActiveFillRegion] = useState<string | null>(null)
  const [regionFeedback, setRegionFeedback] = useState<{ regionId: string; state: 'correct' | 'wrong'; at: number } | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [selectedPulse, setSelectedPulse] = useState(0)
  const [pointer, setPointer] = useState({ x: 50, y: 50, rotation: -14, active: false, pressing: false, recoil: false, touch: false })
  const sparkTimerRef = useRef<number | null>(null)
  const pointerTimerRef = useRef<number | null>(null)
  const pressTimerRef = useRef<number | null>(null)
  const recoilTimerRef = useRef<number | null>(null)
  const completionFiredRef = useRef(false)
  const lastPointerRef = useRef({ x: 50, y: 50 })
  const stageRef = useRef<HTMLElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const fillProgressRef = useRef<Record<string, number>>({})
  const holdRef = useRef<FillHold | null>(null)
  const lineProgressRef = useRef(0)
  const lineHoldRef = useRef<{ raf: number | null; lastTs: number | null } | null>(null)
  const lineLayerRef = useRef<SVGGElement | null>(null)
  const revealTimerRef = useRef<number | null>(null)
  const fillLayerRefs = useRef<Record<string, SVGGElement | null>>({})
  const fillSparkleRefs = useRef<Record<string, SVGGElement | null>>({})
  const pencilRef = useRef<HTMLDivElement | null>(null)
  const flagSvgRef = useRef<SVGSVGElement | null>(null)
  const reducedMotionRef = useRef(false)
  const [regionPatterns] = useState(() => assignFillPatterns(
    round.regions,
    round.fillPatterns ?? ALL_FILL_PATTERNS,
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  ))

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = query.matches
    const onChange = () => { reducedMotionRef.current = query.matches }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const navItems = scene.nav
  const orbItems = scene.orbs
  const selectedOrbHue = orbItems.find((orb) => orb.id === selectedOrb)?.hue || '#ffffff'
  const allComplete = round.regions.every((region) => filledRegions[region.id])
  const fillDurationMs = round.fillDurationMs ?? 1400
  const regionBounds = useMemo(() => {
    const bounds: Record<string, { x: number; y: number; w: number; h: number }> = {}
    for (const region of round.regions) {
      const rect = region.shapes.find((shape) => shape.t === 'rect' && shape.w != null && shape.h != null)
      bounds[region.id] = rect ? { x: rect.x ?? 0, y: rect.y ?? 0, w: rect.w ?? 300, h: rect.h ?? 200 } : { x: 0, y: 0, w: 300, h: 200 }
    }
    return bounds
  }, [round.regions])
  const lineDrawMs = round.lineDrawMs ?? 1200
  // Region boundary guides for Phase 1: the interior edges of each region's
  // bounding rect (edges not on the flag border), deduped across neighbors.
  // For France this yields the two vertical stripe dividers.
  const boundaryLines = useMemo(() => {
    const seen = new Set<string>()
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = []
    for (const region of round.regions) {
      const b = regionBounds[region.id]
      const edges = [
        b.x > 0 ? { x1: b.x, y1: b.y, x2: b.x, y2: b.y + b.h } : null,
        b.x + b.w < 300 ? { x1: b.x + b.w, y1: b.y, x2: b.x + b.w, y2: b.y + b.h } : null,
        b.y > 0 ? { x1: b.x, y1: b.y, x2: b.x + b.w, y2: b.y } : null,
        b.y + b.h < 200 ? { x1: b.x, y1: b.y + b.h, x2: b.x + b.w, y2: b.y + b.h } : null,
      ]
      for (const edge of edges) {
        if (!edge) continue
        const key = `${edge.x1},${edge.y1},${edge.x2},${edge.y2}`
        if (!seen.has(key)) { seen.add(key); lines.push(edge) }
      }
    }
    return lines
  }, [round.regions, regionBounds])

  useEffect(() => () => {
    if (sparkTimerRef.current) window.clearTimeout(sparkTimerRef.current)
    if (pointerTimerRef.current) window.clearTimeout(pointerTimerRef.current)
    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current)
    if (recoilTimerRef.current) window.clearTimeout(recoilTimerRef.current)
    if (holdRef.current?.raf != null) window.cancelAnimationFrame(holdRef.current.raf)
    if (lineHoldRef.current?.raf != null) window.cancelAnimationFrame(lineHoldRef.current.raf)
    if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current)
  }, [])

  useEffect(() => {
    if (!lineHolding) return
    const stop = () => releaseLineHold()
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('blur', stop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineHolding])

  useEffect(() => {
    if (!activeFillRegion) return
    const stop = () => releaseRegionHold(null)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    window.addEventListener('blur', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      window.removeEventListener('blur', stop)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFillRegion])

  useEffect(() => {
    if (!allComplete || completionFiredRef.current) return
    completionFiredRef.current = true
    const completeSparkTimer = window.setTimeout(() => {
      setCelebrate(true)
      setSpark({ key: Date.now(), x: 50, y: 38, hue: '#ffe08a', kind: 'complete' })
    }, 900)
    const rewardTimer = window.setTimeout(() => onComplete(), 2500)
    const cardTimer = window.setTimeout(() => setCelebrate(false), 3200)
    return () => {
      window.clearTimeout(completeSparkTimer)
      window.clearTimeout(rewardTimer)
      window.clearTimeout(cardTimer)
    }
  }, [allComplete, onComplete])

  function triggerSpark(x: number, y: number, hue: string, kind: FranceSpark['kind']) {
    if (sparkTimerRef.current) window.clearTimeout(sparkTimerRef.current)
    setSpark({ key: Date.now(), x, y, hue, kind })
    sparkTimerRef.current = window.setTimeout(() => setSpark(null), kind === 'complete' ? 1200 : 760)
  }

  function updatePointer(event: React.PointerEvent) {
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const nextX = ((event.clientX - rect.left) / rect.width) * 100
    const nextY = ((event.clientY - rect.top) / rect.height) * 100
    const deltaX = nextX - lastPointerRef.current.x
    const deltaY = nextY - lastPointerRef.current.y
    lastPointerRef.current = { x: nextX, y: nextY }
    // While a hold is filling, the pencil rides the fill front (rAF-driven);
    // only remember the touch point so release can ease the pencil home.
    if (holdRef.current) return
    setPointer((current) => ({
      ...current,
      x: nextX,
      y: nextY,
      rotation: Math.max(-30, Math.min(6, -14 + deltaX * 2.1 + deltaY * 0.9)),
      active: true,
      touch: event.pointerType === 'touch',
    }))
    if (pointerTimerRef.current) window.clearTimeout(pointerTimerRef.current)
    pointerTimerRef.current = window.setTimeout(() => setPointer((current) => ({ ...current, active: false })), 900)
  }

  function pressPencil(event: React.PointerEvent) {
    updatePointer(event)
    setPointer((current) => ({ ...current, pressing: true }))
    if (pressTimerRef.current) window.clearTimeout(pressTimerRef.current)
    pressTimerRef.current = window.setTimeout(() => setPointer((current) => ({ ...current, pressing: false })), 180)
  }

  function handleOrbSelect(orbId: string, x: number, y: number, hue: string) {
    setSelectedOrb(orbId)
    setSelectedPulse(Date.now())
    triggerSpark(x, y, hue, 'orb')
  }

  function applyFillVisual(regionId: string, progress: number, tSec: number) {
    const layer = fillLayerRefs.current[regionId]
    if (layer) layer.style.setProperty('--fill-progress', `${(progress * 100).toFixed(2)}%`)
    const sparkles = fillSparkleRefs.current[regionId]
    const bounds = regionBounds[regionId]
    const assigned = regionPatterns[regionId]
    if (sparkles && bounds && assigned) {
      const anchor = fillFrontPoint(assigned, bounds, progress, tSec)
      sparkles.setAttribute('transform', `translate(${anchor.x.toFixed(2)} ${anchor.y.toFixed(2)})`)
    }
  }

  // Rides the pencil along the fill front, stroking back and forth
  // perpendicular to the fill direction. Writes CSS vars straight to the
  // element inside the existing rAF loop — no per-frame React state.
  function updatePencilRide(hold: FillHold, progress: number, ts: number) {
    const pencil = pencilRef.current
    const metrics = hold.metrics
    const assigned = regionPatterns[hold.regionId]
    const bounds = regionBounds[hold.regionId]
    if (!pencil || !metrics || !assigned || !bounds || reducedMotionRef.current) return
    const tSec = ts / 1000
    const phase = tSec * Math.PI * PENCIL_STROKES_PER_SECOND
    const front = fillFrontPoint(assigned, bounds, progress, tSec)
    const inset = Math.min(bounds.w, bounds.h) * 0.12
    const amp = assigned.pattern === 'perimeter' ? Math.min(bounds.w, bounds.h) * 0.1 : Math.max(6, Math.min(bounds.w, bounds.h) / 2 - inset)
    const sway = Math.sin(phase) * amp
    const x = Math.min(bounds.x + bounds.w - inset, Math.max(bounds.x + inset, front.x + front.perpX * sway))
    const y = Math.min(bounds.y + bounds.h - inset, Math.max(bounds.y + inset, front.y + front.perpY * sway))
    const clientX = metrics.svgRect.left + (x / 300) * metrics.svgRect.width
    const clientY = metrics.svgRect.top + (y / 200) * metrics.svgRect.height
    pencil.style.setProperty('--pencil-x', `${(((clientX - metrics.stageRect.left) / metrics.stageRect.width) * 100).toFixed(3)}vw`)
    pencil.style.setProperty('--pencil-y', `${(((clientY - metrics.stageRect.top) / metrics.stageRect.height) * 100).toFixed(3)}vh`)
    pencil.style.setProperty('--pencil-rotation', `${(PENCIL_BASE_ROTATION + Math.cos(phase) * 9).toFixed(2)}deg`)
  }

  // Eases the pencil back to the last touch/rest point after a ride. The
  // vars must be written directly because React's style diffing does not
  // know about the per-frame writes above.
  function restorePencilHome() {
    const pencil = pencilRef.current
    if (pencil) {
      pencil.style.setProperty('--pencil-x', `${lastPointerRef.current.x}vw`)
      pencil.style.setProperty('--pencil-y', `${lastPointerRef.current.y}vh`)
      pencil.style.setProperty('--pencil-rotation', `${PENCIL_BASE_ROTATION}deg`)
    }
    setPointer((current) => ({ ...current, x: lastPointerRef.current.x, y: lastPointerRef.current.y, rotation: PENCIL_BASE_ROTATION }))
  }

  function runFillFrame(ts: number) {
    const hold = holdRef.current
    if (!hold) return
    if (hold.lastTs !== null) {
      const dt = Math.min(ts - hold.lastTs, 50)
      const next = Math.min(1, (fillProgressRef.current[hold.regionId] ?? 0) + dt / fillDurationMs)
      fillProgressRef.current[hold.regionId] = next
      applyFillVisual(hold.regionId, next, ts / 1000)
      updatePencilRide(hold, next, ts)
      if (next >= 1) {
        holdRef.current = null
        setActiveFillRegion(null)
        setRegionFeedback({ regionId: hold.regionId, state: 'correct', at: Date.now() })
        setFilledRegions((current) => ({ ...current, [hold.regionId]: true }))
        triggerSpark(hold.scenePoint.x, hold.scenePoint.y, scene.regionSparkHue, 'correct')
        restorePencilHome()
        return
      }
    }
    hold.lastTs = ts
    hold.raf = window.requestAnimationFrame(runFillFrame)
  }

  function releaseRegionHold(regionId: string | null, pointerId?: number) {
    const hold = holdRef.current
    if (!hold) return
    if (regionId && hold.regionId !== regionId) return
    if (pointerId !== undefined && hold.pointerId !== null && hold.pointerId !== pointerId) return
    if (hold.raf !== null) window.cancelAnimationFrame(hold.raf)
    holdRef.current = null
    setActiveFillRegion(null)
    restorePencilHome()
  }

  // Phase 1: one held press (anywhere on the flag) draws the dotted boundary
  // guides into solid lines. Releasing pauses; re-holding resumes. Reuses the
  // rAF hold-progress pattern from the coloring phase below.
  function applyLineVisual(progress: number) {
    const layer = lineLayerRef.current
    if (layer) layer.style.setProperty('--line-progress', progress.toFixed(4))
  }

  function runLineDrawFrame(ts: number) {
    const hold = lineHoldRef.current
    if (!hold) return
    if (hold.lastTs !== null) {
      const dt = Math.min(ts - hold.lastTs, 50)
      const next = Math.min(1, lineProgressRef.current + dt / lineDrawMs)
      lineProgressRef.current = next
      applyLineVisual(next)
      if (next >= 1) {
        lineHoldRef.current = null
        setLineHolding(false)
        finishLineDraw()
        return
      }
    }
    hold.lastTs = ts
    hold.raf = window.requestAnimationFrame(runLineDrawFrame)
  }

  function finishLineDraw() {
    setPhase('reveal')
    if (!reducedMotionRef.current) triggerSpark(50, 34, scene.regionSparkHue, 'correct')
    revealTimerRef.current = window.setTimeout(() => setPhase('color'), reducedMotionRef.current ? 0 : 650)
  }

  function startLineHold(event: React.PointerEvent | null) {
    if (phase !== 'draw' || lineHoldRef.current) return
    // Touch pointers implicitly capture; release so sliding off the flag
    // pauses the draw, matching the coloring hold behavior.
    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    lineHoldRef.current = { raf: null, lastTs: null }
    lineHoldRef.current.raf = window.requestAnimationFrame(runLineDrawFrame)
    setLineHolding(true)
  }

  function releaseLineHold() {
    const hold = lineHoldRef.current
    if (!hold) return
    if (hold.raf !== null) window.cancelAnimationFrame(hold.raf)
    lineHoldRef.current = null
    setLineHolding(false)
  }

  function handleRegionPress(region: FlagRegionConfig, event: React.PointerEvent | null) {
    if (phase !== 'color' || filledRegions[region.id] || holdRef.current) return
    // Touch pointers implicitly capture to the region, which would keep the
    // fill running after the finger slides off; release so pointerleave pauses.
    if (event && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const selectedPaletteIndex = round.palette.findIndex((entry) => entry.label.toLowerCase() === selectedOrb)
    const isCorrect = selectedPaletteIndex === region.correctColorIndex
    const shell = shellRef.current
    const scenePoint = { x: 50, y: 50 }
    if (event && shell) {
      const rect = shell.getBoundingClientRect()
      scenePoint.x = ((event.clientX - rect.left) / rect.width) * 100
      scenePoint.y = ((event.clientY - rect.top) / rect.height) * 100
    }
    if (!isCorrect) {
      setRegionFeedback({ regionId: region.id, state: 'wrong', at: Date.now() })
      setSelectedPulse(Date.now())
      setPointer((current) => ({ ...current, pressing: false, recoil: true }))
      if (recoilTimerRef.current) window.clearTimeout(recoilTimerRef.current)
      recoilTimerRef.current = window.setTimeout(() => setPointer((current) => ({ ...current, recoil: false })), 260)
      triggerSpark(scenePoint.x, scenePoint.y, selectedOrbHue, 'wrong')
      return
    }
    const svg = flagSvgRef.current
    const stage = stageRef.current
    const metrics = svg && stage ? { svgRect: svg.getBoundingClientRect(), stageRect: stage.getBoundingClientRect() } : null
    holdRef.current = { regionId: region.id, pointerId: event ? event.pointerId : null, scenePoint, raf: null, lastTs: null, metrics }
    holdRef.current.raf = window.requestAnimationFrame(runFillFrame)
    setActiveFillRegion(region.id)
  }

  return (
    <section
      ref={stageRef}
      className="france-play-stage"
      onPointerMove={updatePointer}
      onPointerDown={pressPencil}
    >
      <img src={scene.image} alt="" aria-hidden="true" draggable={false} className="scene-backdrop" />
      <div className="france-play-shell">
        <div className="france-play-stage-frame">
          <div className="france-play-title-ribbon" aria-hidden="true">
            {scene.titleRibbon}
          </div>
          <div className="france-portrait-art" aria-hidden="true">
            <span className="france-portrait-slice france-portrait-title" />
            <span className="france-portrait-slice france-portrait-board" />
            <span className="france-portrait-slice france-portrait-tray" />
            <span className="france-portrait-slice france-portrait-chips" />
            <span className="france-portrait-slice france-portrait-nav" />
          </div>
          <div className="france-play-image-shell" ref={shellRef}>
            <img
              src={scene.image}
              alt={scene.imageAlt}
              className="france-play-image"
              draggable={false}
            />
            <div
              className="challenge-flag-overlay"
              style={{ left: scene.flagOverlay.left, top: scene.flagOverlay.top, width: scene.flagOverlay.width, height: scene.flagOverlay.height }}
            >
              <svg ref={flagSvgRef} viewBox="0 0 300 200" preserveAspectRatio="none" className="challenge-flag-svg" aria-label={`${config.name} flag to color`}>
                <defs>
                  <clipPath id="challenge-flag-clip">
                    <rect x="0" y="0" width="300" height="200" rx="10" />
                  </clipPath>
                  <filter id="france-paint-texture" x="-8%" y="-8%" width="116%" height="116%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="2" seed="17" result="grain" />
                    <feColorMatrix in="grain" type="saturate" values="0" result="softGrain" />
                    <feBlend in="SourceGraphic" in2="softGrain" mode="soft-light" />
                  </filter>
                  <linearGradient id="challenge-flag-sheen" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="45%" stopColor="rgba(255,255,255,0.04)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                  </linearGradient>
                  <linearGradient id="france-white-pearl" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fffefd" />
                    <stop offset="36%" stopColor="#f4fbff" />
                    <stop offset="68%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#dfeeff" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="300" height="200" rx="10" fill="#e9dcb7" />
                <g clipPath="url(#challenge-flag-clip)">
                  {round.regions.map((region) => {
                    const isFilled = !!filledRegions[region.id]
                    const paletteEntry = round.palette[region.correctColorIndex]
                    const isWhiteRegion = paletteEntry.label.toLowerCase() === 'white'
                    const finalFill = isWhiteRegion ? 'url(#france-white-pearl)' : paletteEntry.color
                    const fill = isFilled ? finalFill : 'rgba(249, 242, 222, 0.92)'
                    const feedbackState = regionFeedback?.regionId === region.id ? regionFeedback.state : ''
                    const isFilling = activeFillRegion === region.id
                    const bounds = regionBounds[region.id]
                    const progress = fillProgressRef.current[region.id] ?? 0
                    const assigned = regionPatterns[region.id] ?? { pattern: 'vertical' as const, variant: 'down' }
                    const sparkleAnchor = fillFrontPoint(assigned, bounds, progress, 0)
                    const sparkleDots = sparkleOffsets(assigned, bounds)
                    return (
                      <g
                        key={`${region.id}-${feedbackState ? regionFeedback?.at : 'idle'}`}
                        role="button"
                        tabIndex={phase === 'color' ? 0 : -1}
                        aria-label={region.label}
                        className={`interactive-region ${isFilled ? 'is-filled' : ''} ${isWhiteRegion ? 'is-white-region' : ''} ${feedbackState}`}
                        onPointerDown={(event) => handleRegionPress(region, event)}
                        onPointerUp={(event) => releaseRegionHold(region.id, event.pointerId)}
                        onPointerLeave={(event) => releaseRegionHold(region.id, event.pointerId)}
                        onPointerCancel={(event) => releaseRegionHold(region.id, event.pointerId)}
                        onKeyDown={(event) => {
                          if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
                            event.preventDefault()
                            handleRegionPress(region, null)
                          }
                        }}
                        onKeyUp={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') releaseRegionHold(region.id)
                        }}
                      >
                        {region.shapes.map((shape, index) => renderFlagShape(shape, fill, `${region.id}-${index}`))}
                        {!isFilled && (
                          <g
                            className={`france-fill-layer fill-pattern-${assigned.pattern}-${assigned.variant}`}
                            pointerEvents="none"
                            ref={(el) => { fillLayerRefs.current[region.id] = el }}
                            style={{ '--fill-progress': `${progress * 100}%` } as CSSProperties}
                          >
                            <g className="france-fill-paint">
                              {region.shapes.map((shape, index) => renderFlagShape(shape, finalFill, `${region.id}-fill-${index}`))}
                            </g>
                            <g className="france-fill-edge">
                              {region.shapes.map((shape, index) => renderFlagShape(shape, finalFill, `${region.id}-edge-${index}`))}
                            </g>
                          </g>
                        )}
                        {!isFilled && isFilling && (
                          <g
                            className="france-fill-sparkles"
                            pointerEvents="none"
                            ref={(el) => { fillSparkleRefs.current[region.id] = el }}
                            transform={`translate(${sparkleAnchor.x} ${sparkleAnchor.y})`}
                          >
                            <circle className="france-fill-sparkle-dot" cx={sparkleDots[0].dx} cy={sparkleDots[0].dy} r={2.6} />
                            <circle className="france-fill-sparkle-dot" cx={sparkleDots[1].dx} cy={sparkleDots[1].dy} r={2} />
                            <circle className="france-fill-sparkle-dot" cx={sparkleDots[2].dx} cy={sparkleDots[2].dy} r={2.4} />
                          </g>
                        )}
                        {isFilled && (
                          <g className="france-paint-finish" filter="url(#france-paint-texture)" pointerEvents="none">
                            {region.shapes.map((shape, index) => renderFlagShape(shape, fill, `${region.id}-finish-${index}`))}
                          </g>
                        )}
                        {!isFilled && (
                          <g className="flag-region-hint">
                            {region.shapes.map((shape, index) => renderFlagShape(shape, 'rgba(255,255,255,0.05)', `${region.id}-hint-${index}`))}
                          </g>
                        )}
                      </g>
                    )
                  })}
                  <g
                    ref={lineLayerRef}
                    className={`flag-line-draw ${phase !== 'draw' ? 'is-complete' : ''}`}
                    pointerEvents="none"
                    style={{ '--line-progress': phase === 'draw' ? lineProgressRef.current : 1 } as CSSProperties}
                  >
                    {boundaryLines.map((line) => (
                      <g key={`line-${line.x1}-${line.y1}-${line.x2}-${line.y2}`}>
                        <line className="flag-line-guide" x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
                        <line className="flag-line-ink" pathLength={1} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />
                      </g>
                    ))}
                  </g>
                  {phase === 'draw' && (
                    <rect
                      x="0"
                      y="0"
                      width="300"
                      height="200"
                      rx="10"
                      fill="transparent"
                      className="flag-line-hold-target"
                      role="button"
                      tabIndex={0}
                      aria-label="Hold to draw the flag lines"
                      onPointerDown={(event) => startLineHold(event)}
                      onPointerUp={() => releaseLineHold()}
                      onPointerLeave={() => releaseLineHold()}
                      onPointerCancel={() => releaseLineHold()}
                      onKeyDown={(event) => {
                        if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
                          event.preventDefault()
                          startLineHold(null)
                        }
                      }}
                      onKeyUp={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') releaseLineHold()
                      }}
                    />
                  )}
                  <rect x="0" y="0" width="300" height="200" rx="10" fill="url(#challenge-flag-sheen)" opacity="0.35" pointerEvents="none" />
                </g>
              </svg>
            </div>
            {/* Placeholder cover frosting the baked gem-palette art while the
                palette is locked; the real hidden-palette art comes later. */}
            <div className={`france-palette-veil ${phase === 'color' ? 'is-lifted' : ''}`} aria-hidden="true" />
            <div className="france-play-hotspots">
              {phase === 'color' && orbItems.map((orb) => (
                <button
                  key={`${orb.id}-${selectedOrb === orb.id ? selectedPulse : 0}`}
                  type="button"
                  aria-label={`${orb.label} orb`}
                  aria-pressed={selectedOrb === orb.id}
                  className={`france-hotspot orb invisible-hotspot ${selectedOrb === orb.id ? 'is-selected' : ''} ${selectedOrb === orb.id && selectedPulse ? 'is-pulsing' : ''}`}
                  style={{ left: orb.left, top: scene.orbTop, width: scene.orbSize, height: scene.orbSize }}
                  onClick={() => handleOrbSelect(orb.id, Number.parseFloat(orb.left), Number.parseFloat(scene.orbTop), orb.hue)}
                />
              ))}
              {navItems.map((nav) => (
                <button
                  key={nav.id}
                  type="button"
                  aria-label={nav.label}
                  aria-pressed={activeNav === nav.id}
                  className={`france-hotspot nav invisible-hotspot ${activeNav === nav.id ? 'is-active' : ''}`}
                  style={{ left: nav.left, top: scene.navTop, width: scene.navWidth, height: scene.navHeight }}
                  onClick={() => setActiveNav(nav.id)}
                />
              ))}
            </div>
            <div className="france-play-ambient" aria-hidden="true">
              <span className="france-ray france-ray-a" />
              <span className="france-ray france-ray-b" />
              <span className="france-cloud france-cloud-a" />
              <span className="france-cloud france-cloud-b" />
              <span className="france-aurora france-aurora-a" />
              <span className="france-aurora france-aurora-b" />
              <span className="france-glint" />
              <span className="france-sheen" />
              <span className="france-window-shimmer france-window-shimmer-a" />
              <span className="france-window-shimmer france-window-shimmer-b" />
              <span className="france-dust france-dust-a" />
              <span className="france-dust france-dust-b" />
              <span className="france-sparkle france-sparkle-a" />
              <span className="france-sparkle france-sparkle-b" />
              <span className="france-sparkle france-sparkle-c" />
            </div>
            {spark && (
              <span
                key={spark.key}
                className={`france-spark-burst is-${spark.kind}`}
                style={{ left: `${spark.x}%`, top: `${spark.y}%`, background: spark.hue }}
                aria-hidden="true"
              />
            )}
            {celebrate && (
              <div className="flag-celebration" aria-live="polite">
                <div className="flag-celebration-card">
                  <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#f3d18d]">FLAG COMPLETE</div>
                  <div className="mt-2 font-display text-4xl font-black text-[#fff6df]">{config.name.toUpperCase()}</div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="france-play-back-hitbox invisible-hotspot"
            aria-label="Back"
          />
          <div className="sr-only" aria-live="polite">
            {phase === 'draw'
              ? 'Hold the flag to draw the lines'
              : phase === 'reveal'
                ? 'Lines complete. Colors unlocked.'
                : `${selectedOrb.charAt(0).toUpperCase() + selectedOrb.slice(1)} orb selected`}
          </div>
        </div>
      </div>
      <div
        ref={pencilRef}
        className={`colored-pencil ${pointer.active || activeFillRegion ? 'is-visible' : ''} ${pointer.pressing ? 'is-pressing' : ''} ${pointer.recoil ? 'is-recoiling' : ''} ${pointer.touch ? 'is-touching' : ''} ${activeFillRegion ? 'is-scribbling' : ''} ${allComplete ? 'is-celebrating' : ''}`}
        style={{ '--pencil-x': `${pointer.x}vw`, '--pencil-y': `${pointer.y}vh`, '--pencil-color': selectedOrbHue, '--pencil-rotation': `${pointer.rotation}deg` } as CSSProperties}
        aria-hidden="true"
      >
        <span className="colored-pencil-trail colored-pencil-trail-a" />
        <span className="colored-pencil-trail colored-pencil-trail-b" />
        <span className="colored-pencil-star colored-pencil-star-a" />
        <span className="colored-pencil-star colored-pencil-star-b" />
        <span className="colored-pencil-tip" />
        <span className="colored-pencil-body" />
      </div>
    </section>
  )
}

function FlagColorSelectScreen({
  selectedMode,
  selectedDifficulty,
  onSelectMode,
  onSelectDifficulty,
  onBack,
  onPlaySolo,
}: {
  selectedMode: Mode
  selectedDifficulty: ChallengeDifficulty
  onSelectMode: (mode: Mode) => void
  onSelectDifficulty: (difficulty: ChallengeDifficulty) => void
  onBack: () => void
  onPlaySolo: () => void
}) {
  const sparkleTimerRef = useRef<number | null>(null)
  const [sparkle, setSparkle] = useState<{ key: string; x: number; y: number } | null>(null)
  const [lockedNotice, setLockedNotice] = useState<{ title: string; detail: string } | null>(null)
  const lockedNoticeTimerRef = useRef<number | null>(null)

  function triggerSparkle(key: string, x: number, y: number) {
    if (sparkleTimerRef.current) window.clearTimeout(sparkleTimerRef.current)
    setSparkle({ key, x, y })
    sparkleTimerRef.current = window.setTimeout(() => setSparkle(null), 260)
  }

  function showLockedNotice(title: string, detail: string) {
    if (lockedNoticeTimerRef.current) window.clearTimeout(lockedNoticeTimerRef.current)
    setLockedNotice({ title, detail })
    lockedNoticeTimerRef.current = window.setTimeout(() => setLockedNotice(null), 2200)
  }

  useEffect(() => () => {
    if (sparkleTimerRef.current) window.clearTimeout(sparkleTimerRef.current)
    if (lockedNoticeTimerRef.current) window.clearTimeout(lockedNoticeTimerRef.current)
  }, [])

  const modeHitboxes = [
    { label: 'PLAY SOLO', x: 50, y: 54, w: 66, h: 10, mode: 'solo' as const, action: onPlaySolo },
    {
      label: 'TEAM UP CO-OP',
      x: 50,
      y: 66,
      w: 70,
      h: 10,
      mode: 'coop' as const,
      action: () => {
        onSelectMode('coop')
        showLockedNotice('Team Up Co-op is coming soon!', 'Play Solo is ready now.')
      },
    },
    {
      label: 'HEAD TO HEAD BATTLE',
      x: 50,
      y: 78,
      w: 76,
      h: 10,
      mode: 'versus' as const,
      action: () => {
        onSelectMode('versus')
        showLockedNotice('Head to Head Battle is coming soon!', 'Play Solo is ready now.')
      },
    },
  ]

  const difficultyHitboxes = [
    { label: 'Easy', x: 18, y: 84, w: 17, h: 9, difficulty: 'easy' as const },
    { label: 'Medium', x: 39, y: 84, w: 19, h: 9, difficulty: 'medium' as const },
    { label: 'Hard', x: 61, y: 84, w: 17, h: 9, difficulty: 'hard' as const },
    { label: 'Expert', x: 82, y: 84, w: 17, h: 9, difficulty: 'expert' as const },
  ]

  return (
    <section className="flag-select-screen" aria-label="Flag Color Challenge menu">
      <video
        className="scene-backdrop"
        src="/assets/flag-color/flag-color-select-screen.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="flag-select-ambient" aria-hidden="true">
        <span className="flag-select-orbit flag-select-orbit-a" />
        <span className="flag-select-orbit flag-select-orbit-b" />
        <span className="flag-select-orbit flag-select-orbit-c" />
        <span className="flag-select-spot flag-select-spot-a" />
        <span className="flag-select-spot flag-select-spot-b" />
      </div>
      <div className="flag-select-shell">
        <div className="flag-select-frame">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="flag-select-video"
            src="/assets/flag-color/flag-color-select-screen.mp4"
          />
          <button
            type="button"
            className="flag-select-hitbox flag-select-back-hitbox invisible-hotspot"
            aria-label="Back"
            onPointerDown={() => triggerSparkle('back', 50, 12)}
            onClick={onBack}
          />
          {modeHitboxes.map((hitbox) => {
            const active = selectedMode === hitbox.mode
            return (
              <button
                key={hitbox.label}
                type="button"
                aria-label={hitbox.label}
                aria-pressed={active}
                className={`flag-select-hitbox invisible-hotspot ${active ? 'is-active' : ''}`}
                style={{ left: `${hitbox.x}%`, top: `${hitbox.y}%`, width: `${hitbox.w}%`, height: `${hitbox.h}%` } as React.CSSProperties}
                onPointerDown={() => triggerSparkle(hitbox.label, hitbox.x, hitbox.y)}
                onClick={() => {
                  hitbox.action()
                }}
              />
            )
          })}
          {difficultyHitboxes.map((hitbox) => {
            const active = selectedDifficulty === hitbox.difficulty
            return (
              <button
                key={hitbox.label}
                type="button"
                aria-label={hitbox.label}
                aria-pressed={active}
                className={`flag-select-hitbox flag-select-difficulty-hitbox invisible-hotspot ${active ? 'is-active' : ''}`}
                style={{ left: `${hitbox.x}%`, top: `${hitbox.y}%`, width: `${hitbox.w}%`, height: `${hitbox.h}%` } as React.CSSProperties}
                onPointerDown={() => triggerSparkle(hitbox.label, hitbox.x, hitbox.y)}
                onClick={() => {
                  onSelectDifficulty(hitbox.difficulty)
                }}
              />
            )
          })}
          {sparkle && (
            <span
              className="flag-select-sparkle"
              style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` } as React.CSSProperties}
              aria-hidden="true"
            />
          )}
          {lockedNotice && (
            <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4">
              <div className="max-w-[min(92vw,320px)] rounded-[22px] border border-[#9b6a2b]/40 bg-[linear-gradient(180deg,rgba(255,247,216,0.98),rgba(241,218,170,0.95))] px-4 py-3 text-center text-[#6d4416] shadow-[0_16px_34px_rgba(94,58,18,0.22)]">
                <div className="text-[11px] font-black uppercase tracking-[0.32em]">{lockedNotice.title}</div>
                <div className="mt-1 text-[12px] font-bold tracking-[0.08em]">{lockedNotice.detail}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function IntroScreen({ onPlay, exiting }: { onPlay: () => void; exiting: boolean }) {
  const playLockRef = useRef(false)
  const videoARef = useRef<HTMLVideoElement | null>(null)
  const videoBRef = useRef<HTMLVideoElement | null>(null)
  const activeVideoRef = useRef<0 | 1>(0)
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0)
  const [readyVideos, setReadyVideos] = useState<{ 0: boolean; 1: boolean }>({ 0: false, 1: false })
  const loopSwapLockRef = useRef(false)
  const restartDelayRef = useRef<number | null>(null)

  function handlePlayTrigger(event: React.SyntheticEvent) {
    event.preventDefault()
    if (playLockRef.current) return
    playLockRef.current = true
    onPlay()
  }

  function getVideo(index: 0 | 1) {
    return index === 0 ? videoARef.current : videoBRef.current
  }

  function resetVideo(video: HTMLVideoElement | null) {
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  function playVideo(video: HTMLVideoElement | null) {
    if (!video) return
    const maybePromise = video.play()
    if (maybePromise && typeof maybePromise.catch === 'function') {
      void maybePromise.catch(() => void 0)
    }
  }

  function switchTo(index: 0 | 1) {
    const current = getVideo(activeVideoRef.current)
    const next = getVideo(index)
    if (!next || current === next) return
    resetVideo(current)
    setActiveVideo(index)
    activeVideoRef.current = index
    playVideo(next)
  }

  function handleVideoCanPlay(index: 0 | 1) {
    setReadyVideos((current) => ({ ...current, [index]: true }))
    if (index !== activeVideoRef.current) return
    playVideo(getVideo(index))
  }

  function handleVideoTimeUpdate(index: 0 | 1) {
    if (index !== activeVideoRef.current || loopSwapLockRef.current) return
    const video = getVideo(index)
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
    const remaining = video.duration - video.currentTime
    if (remaining > 0.18) return
    loopSwapLockRef.current = true
    const nextIndex: 0 | 1 = index === 0 ? 1 : 0
    const nextVideo = getVideo(nextIndex)
    if (!nextVideo) return
    resetVideo(nextVideo)
    nextVideo.currentTime = 0
    setActiveVideo(nextIndex)
    activeVideoRef.current = nextIndex
    playVideo(nextVideo)
    restartDelayRef.current = window.setTimeout(() => {
      resetVideo(video)
      loopSwapLockRef.current = false
    }, 260)
  }

  useEffect(() => {
    if (readyVideos[activeVideo]) playVideo(getVideo(activeVideo))
  }, [activeVideo, readyVideos])

  useEffect(() => () => {
    if (restartDelayRef.current) window.clearTimeout(restartDelayRef.current)
  }, [])

  return (
    <div className={`intro-screen-container ${exiting ? 'intro-screen-exiting' : ''}`}>
      <video
        className="scene-backdrop"
        src="/assets/loading/ronans-loading-screen.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="intro-screen-video-shell">
        <div className="intro-screen-video-frame">
          <video
            ref={videoARef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="intro-screen-video"
            src="/assets/loading/ronans-loading-screen.mp4"
            aria-hidden={activeVideo !== 0}
            style={{ opacity: activeVideo === 0 ? 1 : 0, transition: 'opacity 180ms linear' }}
            onCanPlay={() => handleVideoCanPlay(0)}
            onTimeUpdate={() => handleVideoTimeUpdate(0)}
            onEnded={() => switchTo(1)}
          />
          <video
            ref={videoBRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="intro-screen-video intro-screen-video-layer"
            src="/assets/loading/ronans-loading-screen.mp4"
            aria-hidden={activeVideo !== 1}
            style={{ opacity: activeVideo === 1 ? 1 : 0, transition: 'opacity 180ms linear' }}
            onCanPlay={() => handleVideoCanPlay(1)}
            onTimeUpdate={() => handleVideoTimeUpdate(1)}
            onEnded={() => switchTo(0)}
          />
          <button
            type="button"
            onPointerDown={handlePlayTrigger}
            onClick={handlePlayTrigger}
            className="intro-play-hitbox invisible-hotspot"
            aria-label="Play Ronan's Flag Game"
          />
        </div>
      </div>
      <div className="intro-screen-overlay" aria-hidden="true">
        <div className="intro-screen-vignette" />
      </div>
    </div>
  )
}

function PlayerNameModal({
  playerName,
  onPlayerNameChange,
  onContinue,
}: {
  playerName: string
  onPlayerNameChange: (value: string) => void
  onContinue: () => void
}) {
  return (
    <div className="player-name-modal-backdrop" role="presentation">
      <section className="player-name-modal" role="dialog" aria-modal="true" aria-labelledby="player-name-title">
        <div className="player-name-ribbon" aria-hidden="true">
          <svg className="ribbon-flag" width="44" height="22" viewBox="0 0 44 22" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="44" height="22" rx="4" fill="#fff" /><rect x="2" y="2" width="14" height="18" rx="2" fill="#2b6cb0" /><rect x="18" y="2" width="24" height="18" rx="2" fill="#ef4444" opacity="0.95" /></svg>
        </div>
        <div className="player-name-toplabel">PLAYER NAME</div>
        <div className="player-name-header">
          <svg className="player-name-star" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2l2.39 4.85L19 8.18l-3.2 3.12L16.3 16 12 13.77 7.7 16l.5-4.7L4.99 8.18l4.61-.33L12 2z" fill="#FFD54A"/></svg>
          <h2 id="player-name-title" className="player-name-title">What should we call you?</h2>
          <svg className="player-name-compass" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#2b6cb0" opacity="0.14"/><path d="M7 17l4.5-2.5L17 7l-4.5 2.5L7 17z" fill="#60a5fa"/></svg>
        </div>
        <input
          id="player-name-input"
          value={playerName}
          onChange={(event) => onPlayerNameChange(event.target.value)}
          placeholder="Ronan"
          className="player-name-input"
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onContinue() } }}
          autoFocus
          aria-label="Player name"
        />
        <div className="player-name-helper">You can change this later.</div>
        <button
          type="button"
          onClick={onContinue}
          className="player-name-continue"
          aria-label="Continue"
        >
          <span className="continue-label">Continue</span>
        </button>
      </section>
    </div>
  )
}

function CountryField({
  country,
  palette,
  countryProgress,
  visibleProgress,
  selectedColorIndex,
  setSelectedColorIndex,
  colorRegion,
  paintClass,
  regionState,
  completed,
  perfectFlag,
  totalRegions,
  filledRegions,
  showArrivalDetails,
}: {
  country: (typeof COUNTRIES)[number]
  palette: string[]
  countryProgress: ReturnType<typeof getCountryProgress>
  visibleProgress: ReturnType<typeof loadFlagProgress>
  selectedColorIndex: number
  setSelectedColorIndex: (index: number) => void
  colorRegion: (regionId: string) => void
  paintClass: (regionId: string) => string
  regionState: Record<string, number>
  completed: boolean
  perfectFlag: boolean
  totalRegions: number
  filledRegions: number
  showArrivalDetails: boolean
}) {
  return (
    <div className="relative flex w-full flex-1 flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-center">
        <div className="mt-4 text-[10px] font-black uppercase tracking-[0.7em] text-white/80 md:mt-2">COLOR THE FLAG</div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-8 flex items-start justify-center md:top-6">
        <h2 className="font-display text-[clamp(2.5rem,7vw,6.25rem)] font-black tracking-[0.12em] text-[#fff8eb] drop-shadow-[0_10px_0_rgba(31,61,98,0.14)]">
          {country.name}
        </h2>
      </div>
      <div className="flex w-full flex-col items-center justify-center pt-24 md:pt-28">
        {showArrivalDetails && (
          <div className="mb-4 rounded-full border border-white/25 bg-white/14 px-4 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-white backdrop-blur">
            {country.continent} | {country.difficulty || 'Unknown'} | {country.languages?.[0] || 'Unknown'}
          </div>
        )}
        <div className="flag-float relative w-[min(86vw,720px)]">
          <div className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(59,86,64,0.34)_0%,_rgba(59,86,64,0.16)_35%,_rgba(59,86,64,0)_72%)] blur-2xl" />
          <div className="relative mx-auto w-full max-w-[720px]">
            <svg viewBox="0 0 300 200" className="flag-hero h-auto w-full drop-shadow-[0_28px_55px_rgba(11,31,52,0.28)]">
              <defs>
                <linearGradient id="flag-sheen" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.24)" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="300" height="200" rx="16" fill="rgba(255,255,255,0.12)" />
              {country.flag_regions.map((region: any) => region.shapes.map((shape: any, idx: number) => { const fill = palette[(regionState[region.id] ?? region.color) % palette.length] || '#eee'; return <g key={`${region.id}-${idx}`} onClick={() => colorRegion(region.id)} role="button" tabIndex={0} className={paintClass(region.id)}>{getCountryShape(shape.t, shape, fill)}</g> }))}
              <rect x="0.8" y="0.8" width="298.4" height="198.4" rx="15" fill="url(#flag-sheen)" opacity="0.4" pointerEvents="none" />
              {completed && <text x="150" y="28" textAnchor="middle" className="fill-[#17345a] text-[14px] font-black">COMPLETE</text>}
            </svg>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 px-4">
          {palette.map((color: string, idx: number) => <button key={color} onClick={() => setSelectedColorIndex(idx)} className={`h-12 w-12 rounded-full border-4 shadow-[0_10px_26px_rgba(11,31,52,0.24)] transition-transform ${idx === selectedColorIndex ? 'scale-110 border-white ring-4 ring-white/20' : 'border-white/75'}`} style={{ background: color }} aria-label={`Color ${idx + 1}`} />)}
        </div>
        <div className="mt-4 text-center text-[12px] font-black uppercase tracking-[0.28em] text-white/85">
          Pick a color, then tap the flag!
        </div>
        <div className="mt-4 rounded-full border border-white/25 bg-white/14 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-white backdrop-blur">
          {countryProgress.status} | XP {visibleProgress.xp} | {titleFor(visibleProgress)}
        </div>
        <div className="mt-2 text-[11px] font-semibold text-white/70">
          {showArrivalDetails ? `${totalRegions} regions | ${filledRegions} filled | ${perfectFlag ? 'Perfect ready' : 'Color every region to finish the flag'}` : country.name}
        </div>
      </div>
    </div>
  )
}

export default function FlagGamePage() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [playerName, setPlayerName] = useState('Ronan')
  const [mode, setMode] = useState<Mode>('solo')
  const [challengeDifficulty, setChallengeDifficulty] = useState<ChallengeDifficulty>('easy')
  const [progress, setProgress] = useState(() => loadFlagProgress())
  const [activeCountryCode, setActiveCountryCode] = useState('FR')
  const [playerNameConfirmed, setPlayerNameConfirmed] = useState(false)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [reward, setReward] = useState<null | ReturnType<typeof completeCountry>['reward']>(null)
  const [rewardStage, setRewardStage] = useState<RewardStage>('stamp')
  const [rewardXpVisible, setRewardXpVisible] = useState(0)
  const [rewardRankProgress, setRewardRankProgress] = useState(0)
  const [clientReady, setClientReady] = useState(false)
  const [room, setRoom] = useState<RoomState | null>(null)
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [roomSnapshot, setRoomSnapshot] = useState<RoomSnapshot | null>(null)
  const [pendingRoomMode, setPendingRoomMode] = useState<Exclude<Mode, 'solo'> | null>(null)
  const [colorState, setColorState] = useState<Record<string, Record<string, number>>>({})
  const [paintFeedback, setPaintFeedback] = useState<Record<string, PaintFeedback>>({})
  const [showExplorerLog, setShowExplorerLog] = useState(false)
  const [introExiting, setIntroExiting] = useState(false)
  const [activePin, setActivePin] = useState<string | null>(null)
  const timersRef = useRef<number[]>([])
  const pinTimerRef = useRef<number | null>(null)
  const channelRef = useRoomChannel((nextRoom) => setRoom((current) => (current && current.updatedAt > nextRoom.updatedAt ? current : nextRoom)))
  const { playSound } = useSoundHooks()
  const orientation = useViewportOrientation()

  const country = COUNTRY_BY_ISO2[activeCountryCode] || COUNTRIES[0]
  const palette = countryPalette(country)
  const countryProgress = getCountryProgress(progress, activeCountryCode)
  const completed = countryProgress.status === 'complete' || countryProgress.status === 'perfect'
  const regionState = colorState[activeCountryCode] || {}
  const totalRegions = country.flag_regions.length
  const filledRegions = country.flag_regions.filter((region: any) => regionState[region.id] !== undefined).length
  const allRegionsFilled = totalRegions > 0 && filledRegions === totalRegions
  const perfectFlag = allRegionsFilled && country.flag_regions.every((region: any) => regionState[region.id] === region.color)
  const visibleProgress = clientReady ? progress : loadFlagProgress()
  const explorerCountries = useMemo(() => COUNTRIES.slice(0, 194), [])
  const completionProgress = getCompletionProgress(visibleProgress)
  const celebrationProfile = useMemo(() => getCelebrationProfile(activeCountryCode), [activeCountryCode])
  const activeChallengeConfig = useMemo(() => resolvePlayableChallenge(activeCountryCode), [activeCountryCode])
  const mapNodes = useMemo(() => buildMapNodes(visibleProgress, activeCountryCode), [visibleProgress, activeCountryCode])
  const travelRoutes = useMemo(() => routePairs(mapNodes), [mapNodes])
  const nextDestination = useMemo(() => {
    const currentIndex = COUNTRIES.findIndex((item) => item.iso2 === activeCountryCode)
    const next = COUNTRIES[(currentIndex + 1) % COUNTRIES.length] || COUNTRIES[0]
    const nextProgress = getCountryProgress(visibleProgress, next.iso2)
    return { country: next, status: nextProgress.status }
  }, [activeCountryCode, visibleProgress])
  const explorerTitle = getExplorerTier(completionProgress.percent)

  useEffect(() => { const storedProgress = loadFlagProgress(); setProgress(storedProgress); setActiveCountryCode(getInitialCountry()); setPlayerName(safeStorageGet(PLAYER_NAME_KEY) ?? 'Ronan'); setPlayerNameConfirmed(safeStorageGet(PLAYER_NAME_CONFIRMED_KEY) === 'true'); setMode((safeStorageGet(ACTIVE_MODE_KEY) as Mode | null) ?? 'solo'); setChallengeDifficulty((safeStorageGet(CHALLENGE_DIFFICULTY_KEY) as ChallengeDifficulty | null) ?? 'easy'); setRoom(loadRoom()); setClientReady(true) }, [])
  useEffect(() => { safeStorageSet(PLAYER_NAME_KEY, playerName) }, [playerName])
  useEffect(() => { safeStorageSet(PLAYER_NAME_CONFIRMED_KEY, String(playerNameConfirmed)) }, [playerNameConfirmed])
  useEffect(() => { safeStorageSet(ACTIVE_MODE_KEY, mode) }, [mode])
  useEffect(() => { safeStorageSet(ACTIVE_COUNTRY_KEY, activeCountryCode) }, [activeCountryCode])
  useEffect(() => { saveRoom(room); if (room && channelRef.current) channelRef.current.postMessage({ room, note: 'sync' } satisfies RoomSnapshot); if (room) setRoomSnapshot({ room, note: 'sync' }) }, [room, channelRef])
  useEffect(() => () => { timersRef.current.forEach((timer) => window.clearTimeout(timer)); if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current) }, [])

  useEffect(() => {
    if (!reward) return
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    setRewardStage('stamp'); setRewardXpVisible(0); setRewardRankProgress(completionProgress.percent)
    timersRef.current.push(window.setTimeout(() => setRewardStage('souvenir'), 420))
    timersRef.current.push(window.setTimeout(() => setRewardStage('stars'), 880))
    timersRef.current.push(window.setTimeout(() => { setRewardStage('xp'); const xpTarget = reward.xp.total; const steps = 18; for (let index = 1; index <= steps; index += 1) timersRef.current.push(window.setTimeout(() => setRewardXpVisible(Math.round((xpTarget * index) / steps)), index * 24)) }, 1260))
    timersRef.current.push(window.setTimeout(() => setRewardRankProgress(Math.min(100, completionProgress.percent + 8)), 1520))
    timersRef.current.push(window.setTimeout(() => setRewardStage('done'), 2140))
  }, [reward, completionProgress.percent])

  function handlePinEnter(isoCode: string) {
    if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current)
    setActivePin(isoCode)
  }
  function handlePinLeave() {
    pinTimerRef.current = window.setTimeout(() => setActivePin(null), 100)
  }
  function handlePinTap(isoCode: string) {
    if (pinTimerRef.current) window.clearTimeout(pinTimerRef.current)
    setActivePin(isoCode)
    pinTimerRef.current = window.setTimeout(() => setActivePin(null), 700)
  }

  function beginIntroExit() {
    if (screen !== 'loading' || introExiting) return
    setIntroExiting(true)
    window.setTimeout(() => setScreen('home'), 420)
  }

  function updateRoom(nextRoom: RoomState, note: RoomSnapshot['note'], nextScreen?: Screen) { setRoom(nextRoom); setRoomSnapshot({ room: nextRoom, note }); if (nextScreen) setScreen(nextScreen) }
  function enterGame() { playSound('home_theme'); setPlayerNameConfirmed(true); setScreen('home') }
  function startSolo() { playSound('arrival_theme'); setActiveCountryCode(resolvePlayableChallenge(activeCountryCode).iso2); setScreen('flag-color-challenge') }
  function colorRegion(regionId: string) { if (!palette.length) return; const region = country.flag_regions.find((item: any) => item.id === regionId); const isCorrect = region ? selectedColorIndex === region.color : false; setPaintFeedback((current) => ({ ...current, [regionId]: { state: isCorrect ? 'correct' : 'wrong', at: Date.now() } })); setColorState((current) => ({ ...current, [activeCountryCode]: { ...(current[activeCountryCode] || {}), [regionId]: selectedColorIndex } })) }
  function completeFlag() { if (!allRegionsFilled || completed) return; const result = completeCountry(activeCountryCode, progress, { stars: perfectFlag ? 3 : 2, completedAt: new Date().toISOString() }); setProgress(result.progress); setReward(result.reward) }
  function completeChallengeRound() { if (completed) return; const result = completeCountry(activeCountryCode, progress, { stars: 3, completedAt: new Date().toISOString() }); setProgress(result.progress); setReward(result.reward) }
  function nextCountry() { const index = COUNTRIES.findIndex((item) => item.iso2 === activeCountryCode); const next = COUNTRIES[(index + 1) % COUNTRIES.length]; setActiveCountryCode(next.iso2); setReward(null); setScreen('country-arrival') }
  function createRoom(modeChoice: Exclude<Mode, 'solo'>) { const next = makeRoom(modeChoice, playerName, activeCountryCode); updateRoom(next, 'created', 'waiting-room'); setMode(modeChoice) }
  function joinRoom() { const existing = loadRoom(); if (!existing || existing.code !== roomCodeInput.trim().toUpperCase()) return; const joined: RoomState = { ...existing, guestName: playerName, status: 'active', updatedAt: new Date().toISOString() }; updateRoom(joined, 'joined'); setMode(joined.mode); setScreen(joined.mode === 'coop' ? 'coop' : 'versus') }
  function promoteRoom(modeChoice: Exclude<Mode, 'solo'>) { if (!room) return; updateRoom({ ...room, mode: modeChoice, status: room.guestName ? 'active' : 'waiting', updatedAt: new Date().toISOString() }, 'updated') }
  function beginRoom() { if (!room) return; updateRoom({ ...room, status: 'active', updatedAt: new Date().toISOString() }, 'started', room.mode === 'coop' ? 'coop' : 'versus') }
  function paintClass(regionId: string) { const feedback = paintFeedback[regionId]; return feedback ? (feedback.state === 'correct' ? 'paint-correct correct-glow' : 'paint-wrong wrong-shake') : '' }

  return (
    <main data-orientation={orientation} className="app-shell relative overflow-hidden text-[#fdf6ea]">
      <AtmosphereBackdrop />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(94,144,82,0.18)_40%,rgba(53,100,55,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-[10%] flex justify-center"><div className="h-40 w-[92vw] max-w-6xl rounded-full bg-[radial-gradient(circle,_rgba(92,59,27,0.26)_0%,_rgba(92,59,27,0.20)_42%,_rgba(92,59,27,0)_72%)] blur-3xl" /></div>
      {screen === 'loading' && <IntroScreen onPlay={beginIntroExit} exiting={introExiting} />}
      <div className="app-playfield relative mx-auto flex w-full flex-col px-4 py-4 md:px-6 md:py-6">
        {screen === 'home' && (
          <section className="relative flex min-h-0 flex-1 items-center justify-center">
            <div className="home-map-shell relative flex h-full min-h-0 w-full max-w-[420px] flex-1 flex-col overflow-hidden rounded-[34px] border border-[#f6e0b2]/12 shadow-[0_36px_120px_rgba(61,36,12,0.12)]">
              {/* Use the provided full-screen reference image as the visual base */}
              <div className="main-reference-container relative w-full h-full">
                <img src="/assets/home/main-map-reference.png" alt="Main map reference" className="main-reference-image w-full h-full object-contain mx-auto" />

                {/* Invisible / faint hitboxes over the image for interactivity */}
                {MAP_PINS.map((pin) => pin.selectable ? (
                  <button key={pin.label} aria-label={pin.label} className="reference-hitbox" style={{ left: pin.x, top: pin.y, width: '8%', height: '8%' } as React.CSSProperties} onClick={() => setActiveCountryCode(pin.code)} onPointerEnter={() => handlePinEnter(pin.code)} onPointerLeave={handlePinLeave} />
                ) : (
                  <button key={pin.label} aria-label={pin.label} className="reference-hitbox" style={{ left: pin.x, top: pin.y, width: '8%', height: '8%' } as React.CSSProperties} onClick={() => { /* not yet unlocked */ }} />
                ))}

                {/* Card + nav hitboxes */}
                <button aria-label="Next Destination (France)" className="reference-hitbox" style={{ left: '18%', top: '16%', width: '24%', height: '12%' } as React.CSSProperties} onClick={() => setActiveCountryCode('FR')} />
                <button aria-label="Europe Progress" className="reference-hitbox" style={{ left: '78%', top: '16%', width: '14%', height: '12%' } as React.CSSProperties} />
                <button aria-label="Flags Collected" className="reference-hitbox" style={{ left: '22%', top: '64%', width: '22%', height: '12%' } as React.CSSProperties} />
                <button aria-label="Eiffel Tower" className="reference-hitbox" style={{ left: '78%', top: '64%', width: '20%', height: '12%' } as React.CSSProperties} />

                {/* Bottom nav hitboxes */}
                <button aria-label="Home nav" className="reference-hitbox" style={{ left: '10%', top: '92%', width: '16%', height: '8%' } as React.CSSProperties} onClick={() => setScreen('home')} />
                <button aria-label="Map nav" className="reference-hitbox is-active" style={{ left: '30%', top: '92%', width: '16%', height: '8%' } as React.CSSProperties} />
                <button aria-label="Passport nav" className="reference-hitbox" style={{ left: '50%', top: '92%', width: '16%', height: '8%' } as React.CSSProperties} onClick={() => setShowExplorerLog(true)} />
                <button aria-label="Collections nav" className="reference-hitbox" style={{ left: '70%', top: '92%', width: '16%', height: '8%' } as React.CSSProperties} />
                <button aria-label="Settings nav" className="reference-hitbox" style={{ left: '90%', top: '92%', width: '16%', height: '8%' } as React.CSSProperties} />
                <button
                  type="button"
                  aria-label="Flag Color Challenge"
                  className="launch-challenge-btn launch-challenge-pin absolute left-[58%] top-[52%] z-10 flex -translate-x-1/2 -translate-y-full items-center gap-2 rounded-full border border-[#fff0bf]/28 bg-[linear-gradient(180deg,rgba(255,239,180,0.96),rgba(214,167,70,0.92))] px-3 py-2 text-left shadow-[0_12px_28px_rgba(112,76,18,0.2)]"
                  onClick={() => setScreen('play')}
                >
                  <span className="launch-challenge-pin-icon flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,247,214,0.68))] text-[1rem] shadow-inner">🏳️</span>
                  <span className="pointer-events-none hidden min-w-0 sm:block">
                    <span className="block text-[9px] font-black uppercase tracking-[0.36em] text-[#7b4f12]/78">Adventure Mode</span>
                    <span className="block text-[13px] font-black uppercase tracking-[0.14em] text-[#5f3a0c]">Flag Color Challenge</span>
                  </span>
                </button>

                {/* Star / profile */}
                <button aria-label="Star button" className="reference-hitbox" style={{ left: '88%', top: '10%', width: '8%', height: '8%' } as React.CSSProperties} />
              </div>
            </div>
          </section>
        )}

        {screen === 'play' && (
          <FlagColorSelectScreen
            selectedMode={mode}
            selectedDifficulty={challengeDifficulty}
            onSelectMode={(nextMode) => {
              setMode(nextMode)
              safeStorageSet(ACTIVE_MODE_KEY, nextMode)
            }}
            onSelectDifficulty={(nextDifficulty) => {
              setChallengeDifficulty(nextDifficulty)
              safeStorageSet(CHALLENGE_DIFFICULTY_KEY, nextDifficulty)
            }}
            onBack={() => setScreen('home')}
            onPlaySolo={() => {
              setMode('solo')
              safeStorageSet(ACTIVE_MODE_KEY, 'solo')
              safeStorageSet(CHALLENGE_DIFFICULTY_KEY, challengeDifficulty)
              startSolo()
            }}
          />
        )}

        {screen === 'flag-color-challenge' && (
          <FlagColorChallengeGame
            config={activeChallengeConfig}
            onBack={() => setScreen('play')}
            onComplete={completeChallengeRound}
          />
        )}

        {(screen === 'country-arrival' || screen === 'play' || screen === 'coop' || screen === 'versus') && (
          <section className="relative flex min-h-0 flex-1 flex-col">
            <CountryField
              country={country}
              palette={palette}
              countryProgress={countryProgress}
              visibleProgress={visibleProgress}
              selectedColorIndex={selectedColorIndex}
              setSelectedColorIndex={setSelectedColorIndex}
              colorRegion={colorRegion}
              paintClass={paintClass}
              regionState={regionState}
              completed={completed}
              perfectFlag={perfectFlag}
              totalRegions={totalRegions}
              filledRegions={filledRegions}
              showArrivalDetails={screen === 'country-arrival'}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center md:bottom-8">
              <div className="pointer-events-auto rounded-full border border-white/25 bg-white/14 px-4 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-white backdrop-blur">
                {completionProgress.completed} / {completionProgress.total} discovered
              </div>
            </div>
            <nav className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-3 md:gap-3 md:pb-4">
              <button onClick={() => { playSound('button_click'); setScreen('home') }} className="nav-pill">Home</button>
              <button onClick={() => setShowExplorerLog((value) => !value)} className="nav-pill">Passport</button>
              <button onClick={() => setPlayerNameConfirmed(false)} className="nav-pill">Collections</button>
              <button onClick={() => setPlayerNameConfirmed(false)} className="nav-pill">Settings</button>
            </nav>
          </section>
        )}

        {screen === 'join-room' && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">SYNC</div><div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input value={roomCodeInput} onChange={(event) => setRoomCodeInput(event.target.value)} placeholder="Room code" className="h-14 rounded-2xl border border-white/10 bg-white/90 px-4 text-lg font-bold outline-none placeholder:text-[#5d7590]" /><button onClick={joinRoom} className="h-14 rounded-2xl bg-[#ffcf54] px-5 text-lg font-black text-[#17345a]">Join</button></div></div></section>}
        {screen === 'create-room' && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">MULTIPLAYER</div><div className="mt-4 grid gap-3 md:grid-cols-2"><button onClick={() => { if (!pendingRoomMode) return; playSound('button_click'); createRoom(pendingRoomMode) }} className="rounded-[22px] bg-[#ffcf54] px-4 py-4 text-left text-lg font-black text-[#17345a]">Launch</button><button onClick={() => setScreen('home')} className="rounded-[22px] border border-white/10 bg-white/15 px-4 py-4 text-left text-lg font-black text-[#17345a]">Back</button></div></div></section>}
        {screen === 'waiting-room' && room && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">SYNC</div><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-[22px] border border-white/10 bg-white/15 p-4"><div className="text-[11px] font-black uppercase tracking-[0.4em]">Code</div><div className="mt-2 text-3xl font-black">{room.code}</div></div><div className="rounded-[22px] border border-white/10 bg-white/15 p-4"><div className="text-[11px] font-black uppercase tracking-[0.4em]">Travelers</div><div className="mt-2 font-black">{room.hostName}</div><div>{room.guestName || 'Waiting for second player'}</div></div></div><div className="mt-4 flex gap-2"><button onClick={() => promoteRoom('coop')} className="rounded-full border border-white/10 bg-white/15 px-4 py-2 font-black">Co-op</button><button onClick={() => promoteRoom('versus')} className="rounded-full border border-white/10 bg-white/15 px-4 py-2 font-black">Versus</button><button onClick={beginRoom} className="rounded-full bg-[#ffcf54] px-4 py-2 font-black">Begin</button></div></div></section>}

        {showExplorerLog && (
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setShowExplorerLog(false)}>
            <aside className="absolute right-4 top-4 bottom-20 w-[min(92vw,380px)] overflow-hidden rounded-[28px] border border-white/20 bg-[rgba(255,250,240,0.96)] p-4 text-[#17345a] shadow-[0_24px_80px_rgba(0,0,0,0.24)]" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between"><div className="text-[11px] font-black uppercase tracking-[0.45em]">Explorer Log</div><button onClick={() => setShowExplorerLog(false)} className="rounded-full border border-[#17345a]/15 px-3 py-1 text-xs font-black uppercase">Close</button></div>
              <div className="mt-4 max-h-[calc(100%-48px)] space-y-2 overflow-y-auto pr-1">
                {explorerCountries.map((item) => {
                  const p = getCountryProgress(visibleProgress, item.iso2)
                  const isCurrent = item.iso2 === activeCountryCode
                  return <button key={item.iso2} onClick={() => { setActiveCountryCode(item.iso2); setReward(null); setScreen('country-arrival'); setShowExplorerLog(false) }} className={`w-full rounded-2xl border px-3 py-2 text-left ${isCurrent ? 'border-[#2b72d6] bg-[#dff1ff]' : 'border-[#17345a]/10 bg-white'}`}><div className="flex items-center justify-between"><div><div className="font-black">{item.name}</div><div className="text-xs text-[#5d7590]">{item.continent} | {item.difficulty || 'Unknown'} | {p.status}</div></div><div className="text-sm">{p.status === 'complete' || p.status === 'perfect' ? '✓' : '□'}</div></div></button>
                })}
              </div>
            </aside>
          </div>
        )}

        {screen === 'home' && !playerNameConfirmed && (
          <PlayerNameModal
            playerName={playerName}
            onPlayerNameChange={setPlayerName}
            onContinue={enterGame}
          />
        )}

        {reward && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2a1704]/60">
            <div className="flex min-h-full items-center justify-center px-4 py-6">
              <div className="reward-panel relative w-full min-w-0 max-w-3xl overflow-hidden rounded-[30px] p-5 text-[#5f3a0c] sm:p-6">
                <div className="reward-burst" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /></div>
                <div className="relative min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#a06a1d]">COUNTRY DISCOVERED</div>
                  <h3 className={`mt-2 font-display text-3xl font-black text-[#4a2c0c] sm:text-4xl ${rewardStage !== 'stamp' ? 'completion-title-rise' : ''}`}>{reward.countryName}</h3>
                  <div className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-[#8a5a22]">{reward.message}</div>
                  {celebrationProfile.themeLabel && <div className="mt-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#b97f16]">{celebrationProfile.themeLabel}</div>}
                  <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="min-w-0 space-y-3"><div className={`reward-card relative rounded-[24px] p-4 ${rewardStage === 'stamp' ? 'stamp-slam' : 'opacity-90'}`}><div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#a06a1d]">Passport Stamp</div><div className="mt-2 break-words text-2xl font-black text-[#4a2c0c]">{reward.passportStamp.label}</div>{formatFriendlyDate(reward.passportStamp.completedAt) && <div className="mt-1 text-sm font-bold text-[#8a5a22]">{formatFriendlyDate(reward.passportStamp.completedAt)}</div>}</div><div className={`reward-card rounded-[24px] p-4 ${rewardStage === 'souvenir' ? 'souvenir-pop' : 'opacity-90'}`}><div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#a06a1d]">Souvenir Reveal</div><div className="mt-2 break-words text-2xl font-black text-[#4a2c0c]">{reward.souvenir.name}</div></div></div>
                    <div className="min-w-0 space-y-3"><div className={`reward-card rounded-[24px] p-4 ${rewardStage === 'xp' ? 'star-pop' : 'opacity-90'}`}><div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#a06a1d]">XP Reveal</div><div className={`mt-2 text-5xl font-black text-[#2e7d32] ${rewardStage === 'xp' ? 'xp-pulse' : ''}`}>+{rewardXpVisible}</div></div><div className="reward-card rounded-[24px] p-4"><div className="text-[11px] font-black uppercase tracking-[0.3em] text-[#a06a1d]">Explorer Rank Progress</div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#5f3a0c]/15"><div className="h-full rounded-full bg-[linear-gradient(90deg,#f7d074,#e8a13a,#c97f1b)] transition-all duration-700" style={{ width: `${rewardRankProgress}%` }} /></div></div></div>
                  </div>
                  <div className={`mt-4 flex flex-wrap gap-2 ${rewardStage === 'done' ? 'completion-actions' : 'opacity-70'}`}><button onClick={() => { playSound('button_click'); setReward(null) }} className="rounded-2xl bg-[linear-gradient(180deg,#ffe9ae,#e9b654)] px-6 py-3 font-black text-[#5f3a0c] shadow-[0_10px_24px_rgba(112,76,18,0.28)]">Continue</button>{HAS_NEXT_PLAYABLE_CHALLENGE && <button onClick={() => { playSound('button_click'); nextCountry() }} className="rounded-2xl border border-[#9b6a2b]/40 bg-white/40 px-5 py-3 font-black text-[#7b4f12]">Next Flag</button>}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
