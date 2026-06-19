'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { COUNTRIES, COUNTRY_BY_ISO2 } from '../public/countries.js'
import { completeCountry, getCountryProgress, loadFlagProgress } from '../public/flag-progress.js'

type Screen = 'loading' | 'player-entry' | 'home' | 'country-arrival' | 'play' | 'create-room' | 'join-room' | 'waiting-room' | 'coop' | 'versus'
type Mode = 'solo' | 'coop' | 'versus'
type RewardStage = 'stamp' | 'souvenir' | 'stars' | 'xp' | 'done'
type CompletionSoundHook = 'button_click' | 'correct_fill' | 'wrong_fill' | 'stamp_thump' | 'country_complete' | 'arrival_theme' | 'home_theme' | 'victory_default' | 'victory_france' | 'victory_japan' | 'victory_brazil' | 'victory_egypt'
type CelebrationProfile = { confettiColors: string[]; particleShape: 'dot' | 'petal' | 'diamond'; soundHook: CompletionSoundHook; themeLabel?: string }
type RoomStatus = 'waiting' | 'ready' | 'active'
type PaintFeedback = { state: 'correct' | 'wrong'; at: number }
type RoomState = { id: string; code: string; hostName: string; guestName?: string; mode: Exclude<Mode, 'solo'>; createdAt: string; updatedAt: string; status: RoomStatus; activeCountryCode: string; rounds: string[]; roundIndex: number; scores: Record<string, number>; lastMoveAt?: string }
type RoomSnapshot = { room: RoomState; note: string }

const PLAYER_NAME_KEY = 'ronan_flag_player_name'
const ACTIVE_MODE_KEY = 'ronan_flag_active_mode'
const ACTIVE_COUNTRY_KEY = 'flag_game_v1_active_country'
const ROOM_STORAGE_KEY = 'ronan_flag_room'
const ROOM_CHANNEL = 'ronan-flag-room-sync'

const GLOBAL_CELEBRATION: CelebrationProfile = { confettiColors: ['#f59e0b', '#38bdf8', '#22c55e'], particleShape: 'dot', soundHook: 'victory_default' }
const CELEBRATION_BY_COUNTRY: Record<string, CelebrationProfile> = {
  FR: { confettiColors: ['#0055A4', '#FFFFFF', '#EF4135'], particleShape: 'diamond', soundHook: 'victory_france', themeLabel: 'French victory' },
  JP: { confettiColors: ['#D4002A', '#FFFFFF', '#F5B7C4'], particleShape: 'petal', soundHook: 'victory_japan', themeLabel: 'Cherry blossom victory' },
  BR: { confettiColors: ['#009C3B', '#FFDF00', '#002776'], particleShape: 'diamond', soundHook: 'victory_brazil', themeLabel: 'Carnival victory' },
  EG: { confettiColors: ['#C8A04A', '#D8C7A1', '#123B7A'], particleShape: 'dot', soundHook: 'victory_egypt', themeLabel: 'Desert victory' },
}

function safeStorageGet(key: string) { if (typeof window === 'undefined') return null; return window.localStorage.getItem(key) }
function safeStorageSet(key: string, value: string) { if (typeof window === 'undefined') return; window.localStorage.setItem(key, value) }
function isValidCountryCode(code?: string | null) { return !!code && !!COUNTRY_BY_ISO2[code] }
function getInitialCountry() { const saved = safeStorageGet(ACTIVE_COUNTRY_KEY); return isValidCountryCode(saved) ? (saved as string) : 'FR' }
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

function useRoomChannel(onSnapshot: (room: RoomState) => void) { const channelRef = useRef<BroadcastChannel | null>(null); useEffect(() => { if (typeof window === 'undefined') return; const onStorage = (event: StorageEvent) => { if (event.key !== ROOM_STORAGE_KEY || !event.newValue) return; try { onSnapshot(JSON.parse(event.newValue) as RoomState) } catch {} }; window.addEventListener('storage', onStorage); if ('BroadcastChannel' in window) { const channel = new BroadcastChannel(ROOM_CHANNEL); channel.onmessage = (event) => { const payload = event.data as RoomSnapshot | null; if (payload?.room) onSnapshot(payload.room) }; channelRef.current = channel } return () => { window.removeEventListener('storage', onStorage); channelRef.current?.close() } }, [onSnapshot]); return channelRef }
function AtmosphereBackdrop() { return <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.62)_0%,_rgba(255,255,255,0.20)_26%,_rgba(142,213,255,0.00)_58%)]" /><div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(255,240,204,0)_0%,rgba(246,213,143,0.50)_55%,rgba(231,183,105,0.96)_100%)]" /><div className="absolute left-1/2 top-[16%] h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.94)_0%,_rgba(255,255,255,0.58)_42%,_rgba(255,255,255,0)_72%)] blur-[2px]" /></div> }

function LoadingScreen() {
  return (
    <div className="loading-screen-container">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="loading-screen-video"
        src="/assets/loading/ronans-loading-screen.mp4"
      />
      <div className="loading-screen-overlay">
        <div className="loading-shimmer" />
        <div className="loading-text">Preparing your adventure…</div>
      </div>
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
  const [progress, setProgress] = useState(() => loadFlagProgress())
  const [activeCountryCode, setActiveCountryCode] = useState('FR')
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
  const timersRef = useRef<number[]>([])
  const channelRef = useRoomChannel((nextRoom) => setRoom((current) => (current && current.updatedAt > nextRoom.updatedAt ? current : nextRoom)))
  const { playSound } = useSoundHooks()

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
  const celebrationProfile = useMemo(() => CELEBRATION_BY_COUNTRY[activeCountryCode] || GLOBAL_CELEBRATION, [activeCountryCode])
  const mapNodes = useMemo(() => buildMapNodes(visibleProgress, activeCountryCode), [visibleProgress, activeCountryCode])
  const travelRoutes = useMemo(() => routePairs(mapNodes), [mapNodes])
  const nextDestination = useMemo(() => {
    const currentIndex = COUNTRIES.findIndex((item) => item.iso2 === activeCountryCode)
    const next = COUNTRIES[(currentIndex + 1) % COUNTRIES.length] || COUNTRIES[0]
    const nextProgress = getCountryProgress(visibleProgress, next.iso2)
    return { country: next, status: nextProgress.status }
  }, [activeCountryCode, visibleProgress])
  const explorerTitle = getExplorerTier(completionProgress.percent)

  useEffect(() => { const storedProgress = loadFlagProgress(); setProgress(storedProgress); setActiveCountryCode(getInitialCountry()); setPlayerName(safeStorageGet(PLAYER_NAME_KEY) ?? 'Ronan'); setMode((safeStorageGet(ACTIVE_MODE_KEY) as Mode | null) ?? 'solo'); setRoom(loadRoom()); setClientReady(true) }, [])
  useEffect(() => { safeStorageSet(PLAYER_NAME_KEY, playerName) }, [playerName])
  useEffect(() => { safeStorageSet(ACTIVE_MODE_KEY, mode) }, [mode])
  useEffect(() => { safeStorageSet(ACTIVE_COUNTRY_KEY, activeCountryCode) }, [activeCountryCode])
  useEffect(() => { saveRoom(room); if (room && channelRef.current) channelRef.current.postMessage({ room, note: 'sync' } satisfies RoomSnapshot); if (room) setRoomSnapshot({ room, note: 'sync' }) }, [room, channelRef])
  useEffect(() => () => { timersRef.current.forEach((timer) => window.clearTimeout(timer)) }, [])

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

  useEffect(() => {
    if (screen !== 'loading') return
    const timer = window.setTimeout(() => setScreen('player-entry'), 3200)
    return () => window.clearTimeout(timer)
  }, [screen])

  function updateRoom(nextRoom: RoomState, note: RoomSnapshot['note'], nextScreen?: Screen) { setRoom(nextRoom); setRoomSnapshot({ room: nextRoom, note }); if (nextScreen) setScreen(nextScreen) }
  function enterGame() { playSound('home_theme'); setScreen('home') }
  function startSolo() { playSound('arrival_theme'); setScreen('country-arrival') }
  function colorRegion(regionId: string) { if (!palette.length) return; const region = country.flag_regions.find((item: any) => item.id === regionId); const isCorrect = region ? selectedColorIndex === region.color : false; setPaintFeedback((current) => ({ ...current, [regionId]: { state: isCorrect ? 'correct' : 'wrong', at: Date.now() } })); setColorState((current) => ({ ...current, [activeCountryCode]: { ...(current[activeCountryCode] || {}), [regionId]: selectedColorIndex } })) }
  function completeFlag() { if (!allRegionsFilled || completed) return; const result = completeCountry(activeCountryCode, progress, { stars: perfectFlag ? 3 : 2, completedAt: new Date().toISOString() }); setProgress(result.progress); setReward(result.reward) }
  function nextCountry() { const index = COUNTRIES.findIndex((item) => item.iso2 === activeCountryCode); const next = COUNTRIES[(index + 1) % COUNTRIES.length]; setActiveCountryCode(next.iso2); setReward(null); setScreen('country-arrival') }
  function createRoom(modeChoice: Exclude<Mode, 'solo'>) { const next = makeRoom(modeChoice, playerName, activeCountryCode); updateRoom(next, 'created', 'waiting-room'); setMode(modeChoice) }
  function joinRoom() { const existing = loadRoom(); if (!existing || existing.code !== roomCodeInput.trim().toUpperCase()) return; const joined: RoomState = { ...existing, guestName: playerName, status: 'active', updatedAt: new Date().toISOString() }; updateRoom(joined, 'joined'); setMode(joined.mode); setScreen(joined.mode === 'coop' ? 'coop' : 'versus') }
  function promoteRoom(modeChoice: Exclude<Mode, 'solo'>) { if (!room) return; updateRoom({ ...room, mode: modeChoice, status: room.guestName ? 'active' : 'waiting', updatedAt: new Date().toISOString() }, 'updated') }
  function beginRoom() { if (!room) return; updateRoom({ ...room, status: 'active', updatedAt: new Date().toISOString() }, 'started', room.mode === 'coop' ? 'coop' : 'versus') }
  function paintClass(regionId: string) { const feedback = paintFeedback[regionId]; return feedback ? (feedback.state === 'correct' ? 'paint-correct correct-glow' : 'paint-wrong wrong-shake') : '' }

  return (
    <main className="relative min-h-screen overflow-hidden text-[#fdf6ea]">
      <AtmosphereBackdrop />
      <div className="absolute inset-x-0 bottom-0 h-[30vh] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(94,144,82,0.18)_40%,rgba(53,100,55,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-[10%] flex justify-center"><div className="h-40 w-[92vw] max-w-6xl rounded-full bg-[radial-gradient(circle,_rgba(92,59,27,0.26)_0%,_rgba(92,59,27,0.20)_42%,_rgba(92,59,27,0)_72%)] blur-3xl" /></div>
      {screen === 'loading' && <LoadingScreen />}
      <div className="relative mx-auto flex min-h-screen w-full flex-col px-4 py-4 md:px-6 md:py-6">
        {screen === 'home' && (
          <section className="relative flex min-h-0 flex-1 flex-col">
            <div className="home-world-shell relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] border border-white/20 p-4 shadow-[0_30px_100px_rgba(33,47,71,0.18)] md:p-5">
              <div className="home-world-atmosphere pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="home-cloud home-cloud-a" />
                <div className="home-cloud home-cloud-b" />
                <div className="home-cloud home-cloud-c" />
                <div className="home-rays" />
                <div className="home-vignette" />
              </div>

              <header className="relative z-10 grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto]">
                <div className="explorer-panel flex items-center gap-3 rounded-[24px] px-4 py-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/40 bg-[radial-gradient(circle_at_30%_28%,#fffaf0_0%,#d7f0ff_30%,#7fc0ef_62%,#325f99_100%)] shadow-[0_18px_38px_rgba(31,54,78,0.18)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.24)_22%,rgba(255,255,255,0)_58%)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#57708a]">Explorer</div>
                    <div className="truncate font-display text-[clamp(1.5rem,3vw,2.35rem)] font-black text-[#1c3554]">{playerName}</div>
                    <div className="mt-1 text-sm font-semibold text-[#5f758b]">Passport route commander</div>
                  </div>
                </div>

                <div className="explorer-panel grid gap-2 rounded-[24px] px-4 py-3 text-[#17324e]">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#57708a]">Explorer Level</div>
                      <div className="mt-1 font-display text-[clamp(1.25rem,2vw,1.75rem)] font-black">{explorerTitle}</div>
                    </div>
                    <div className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-[#17345a]">Lv {visibleProgress.explorerLevel}</div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/60">
                    <div className="h-full rounded-full bg-[linear-gradient(90deg,#f5c84a,#7fdfb0,#7bc7ff)] transition-all duration-500" style={{ width: formatPercent(Math.max(12, Math.min(100, completionProgress.percent))) }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.22em] text-[#5f7488]">
                    <span>{visibleProgress.xp} XP</span>
                    <span>{completionProgress.percent}% route mastery</span>
                  </div>
                </div>

                <button onClick={() => setScreen('player-entry')} className="explorer-chip justify-self-start rounded-full px-4 py-3 text-[11px] font-black uppercase tracking-[0.36em] text-[#1f3550]">
                  Settings
                </button>
              </header>

              <div className="relative z-10 mt-4 grid flex-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
                <div className="relative overflow-hidden rounded-[30px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,250,237,0.44)_0%,rgba(201,230,255,0.18)_20%,rgba(95,147,193,0.10)_50%,rgba(49,89,126,0.18)_100%)] shadow-[0_26px_70px_rgba(28,56,86,0.16)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.58)_0%,rgba(255,255,255,0.12)_26%,rgba(255,255,255,0)_48%)]" />
                  <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(255,255,255,0)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(101,148,99,0.14)_45%,rgba(54,92,68,0.26)_100%)]" />

                  <div className="absolute inset-x-0 top-6 flex justify-center">
                    <div className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/90 backdrop-blur">
                      World Explorer Map
                    </div>
                  </div>

                  <div className="relative flex h-full min-h-[32rem] items-center justify-center p-4 sm:min-h-[38rem] md:p-6">
                    <div className="relative h-[min(76vw,42rem)] w-[min(76vw,42rem)] max-w-full">
                      <div className="absolute inset-[4%] rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(255,255,255,0.34)_0%,rgba(255,255,255,0.14)_22%,rgba(108,169,209,0.22)_48%,rgba(34,72,108,0.26)_74%,rgba(19,39,66,0.86)_100%)] blur-[1px]" />
                      <div className="absolute inset-[8%] rounded-full border border-white/20 bg-[radial-gradient(circle_at_36%_30%,rgba(255,255,255,0.88)_0%,rgba(153,213,244,0.84)_16%,rgba(71,129,176,0.84)_46%,rgba(24,50,84,0.98)_100%)] shadow-[inset_0_0_50px_rgba(255,255,255,0.12),0_36px_70px_rgba(16,38,66,0.28)]" />
                      <div className="absolute inset-[11%] rounded-full bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_30%)]" />

                      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
                        <defs>
                          <radialGradient id="world-glow" cx="35%" cy="28%" r="72%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
                            <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                          </radialGradient>
                          <linearGradient id="travel-route" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                            <stop offset="50%" stopColor="rgba(255,234,176,0.95)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
                          </linearGradient>
                          <linearGradient id="pin-complete" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#fff6c9" />
                            <stop offset="100%" stopColor="#f5c84a" />
                          </linearGradient>
                          <linearGradient id="pin-current" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#fff0a0" />
                            <stop offset="100%" stopColor="#ffcf4e" />
                          </linearGradient>
                          <linearGradient id="pin-locked" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#dbe8f4" />
                            <stop offset="100%" stopColor="#9eb5c8" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="38" fill="rgba(18,44,79,0.3)" />
                        <circle cx="50" cy="50" r="38" fill="url(#world-glow)" />
                        <ellipse cx="50" cy="50" rx="35" ry="18" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
                        <ellipse cx="50" cy="50" rx="24" ry="38" fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="0.6" />
                        <path d="M15 50H85M50 12V88M26 28C36 37 64 37 74 28M26 72C36 63 64 63 74 72" stroke="rgba(255,255,255,0.08)" strokeWidth="0.45" fill="none" />
                        <path d="M11 52c12-10 23-8 32-4s20 5 30 0 16-7 20-4" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" fill="none" strokeDasharray="1.3 2.1" />
                        {travelRoutes.map((route, index) => <polyline key={route} points={route} fill="none" stroke="url(#travel-route)" strokeWidth="0.9" strokeDasharray="1.5 1.8" opacity={0.6 - index * 0.02} />)}
                        {mapNodes.map((node) => {
                          const isCurrent = node.ring === 'current'
                          const isCompleted = node.ring === 'completed'
                          const isLocked = node.ring === 'locked'
                          const fill = isCurrent ? 'url(#pin-current)' : isCompleted ? 'url(#pin-complete)' : isLocked ? 'url(#pin-locked)' : '#fff0c7'
                          const halo = isCurrent ? 'rgba(255,214,92,0.26)' : isCompleted ? 'rgba(125,240,194,0.18)' : 'rgba(255,255,255,0.10)'
                          return (
                            <g key={node.country.iso2} onClick={() => { setActiveCountryCode(node.country.iso2); setScreen('country-arrival') }} className="cursor-pointer">
                              <circle cx={node.x} cy={node.y} r={isCurrent ? 2.95 : isCompleted ? 2.45 : 2.2} fill={halo} />
                              <circle cx={node.x} cy={node.y} r={isCurrent ? 1.95 : 1.65} fill={fill} stroke="rgba(255,255,255,0.82)" strokeWidth="0.35" />
                              <path d={`M ${node.x} ${node.y + 2.6} L ${node.x - 0.65} ${node.y + 4.45} L ${node.x + 0.65} ${node.y + 4.45} Z`} fill={fill} opacity={0.9} />
                              <circle cx={node.x} cy={node.y} r={isCurrent ? 4.8 : 4.1} fill="none" stroke={isCurrent ? 'rgba(255,214,92,0.72)' : 'rgba(255,255,255,0.32)'} strokeWidth="0.45" strokeDasharray={isCurrent ? '0.8 1' : '0.6 1.2'} />
                            </g>
                          )
                        })}
                      </svg>

                      <div className="absolute left-[6%] top-[14%] h-14 w-28 rounded-full bg-white/28 blur-3xl" />
                      <div className="absolute right-[10%] top-[18%] h-10 w-24 rounded-full bg-amber-100/25 blur-3xl" />
                      <div className="absolute inset-x-0 bottom-8 flex justify-center">
                        <div className="rounded-full border border-white/22 bg-white/14 px-4 py-2 text-[10px] font-black uppercase tracking-[0.38em] text-white/92 backdrop-blur">
                          Tap any country pin to open arrival
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="grid gap-3 self-stretch">
                  <div className="explorer-card rounded-[26px] p-4 text-[#18314b]">
                    <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#5d7388]">Next Destination</div>
                    <div className="mt-2 font-display text-[clamp(1.45rem,2.8vw,2.2rem)] font-black text-[#18314b]">{nextDestination.country.name}</div>
                    <div className="mt-1 text-sm font-semibold text-[#5d7388]">{nextDestination.country.continent} | {nextDestination.status === 'complete' || nextDestination.status === 'perfect' ? 'Completed route target' : 'Current challenge route'}</div>
                    <button onClick={() => { setActiveCountryCode(nextDestination.country.iso2); setScreen('country-arrival') }} className="mt-4 rounded-full bg-[#f5c84a] px-4 py-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#17345a] shadow-[0_12px_24px_rgba(192,145,29,0.18)]">
                      Launch Challenge
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <div className="explorer-card rounded-[26px] p-4 text-[#18314b]">
                      <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#5d7388]">Regional Completion %</div>
                      <div className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black text-[#1a3550]">{completionProgress.percent}%</div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dbe8ef]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#79c7ff,#6ed28d,#ffd45f)]" style={{ width: formatPercent(completionProgress.percent) }} /></div>
                    </div>
                    <div className="explorer-card rounded-[26px] p-4 text-[#18314b]">
                      <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#5d7388]">Flags Collected</div>
                      <div className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black text-[#1a3550]">{completionProgress.completed}</div>
                      <div className="mt-2 text-sm font-semibold text-[#5d7388]">of {completionProgress.total} nations discovered</div>
                    </div>
                    <div className="explorer-card rounded-[26px] p-4 text-[#18314b]">
                      <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#5d7388]">Landmark Unlocks</div>
                      <div className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black text-[#1a3550]">{visibleProgress.unlockedSouvenirs?.length || 0}</div>
                      <div className="mt-2 text-sm font-semibold text-[#5d7388]">passport discoveries secured</div>
                    </div>
                  </div>

                  <div className="explorer-card rounded-[26px] p-4 text-[#18314b]">
                    <div className="text-[10px] font-black uppercase tracking-[0.48em] text-[#5d7388]">Route Status</div>
                    <div className="mt-3 grid gap-2">
                      {mapNodes.slice(0, 5).map((node) => (
                        <button key={node.country.iso2} onClick={() => { setActiveCountryCode(node.country.iso2); setScreen('country-arrival') }} className="flex items-center justify-between rounded-2xl border border-[#dce7ee] bg-white/82 px-3 py-3 text-left transition-transform hover:-translate-y-0.5">
                          <div>
                            <div className="font-black">{node.country.name}</div>
                            <div className="text-xs font-semibold text-[#5d7388]">{node.country.continent}</div>
                          </div>
                          <div className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${node.ring === 'completed' ? 'bg-emerald-100 text-emerald-800' : node.ring === 'current' ? 'bg-amber-100 text-amber-800' : node.ring === 'locked' ? 'bg-slate-200 text-slate-600' : 'bg-sky-100 text-sky-800'}`}>
                            {node.ring}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              <nav className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2">
                {['Home', 'Map', 'Passport', 'Collections', 'Settings'].map((item) => (
                  <button key={item} onClick={() => { if (item === 'Home' || item === 'Map') setScreen('home'); else if (item === 'Passport') setShowExplorerLog(true); else setScreen('player-entry') }} className={`nav-pill-explorer ${item === 'Home' ? 'is-active' : ''}`}>
                    {item}
                  </button>
                ))}
              </nav>
            </div>
          </section>
        )}

        {screen === 'player-entry' && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">WELCOME</div><div className="mt-2 text-3xl font-black">Player Name</div><div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Enter player name" className="h-14 rounded-2xl border border-white/10 bg-white/90 px-4 text-lg font-bold outline-none placeholder:text-[#5d7590]" /><button onClick={enterGame} className="h-14 rounded-2xl bg-[#ffcf54] px-5 text-lg font-black text-[#17345a]">Continue</button></div></div></section>}

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
              <button onClick={() => setScreen('player-entry')} className="nav-pill">Collections</button>
              <button onClick={() => setScreen('player-entry')} className="nav-pill">Settings</button>
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

        {reward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="celebration-shell w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(7,12,18,0.96)] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.5)]" style={{ '--confetti-color-1': celebrationProfile.confettiColors[0], '--confetti-color-2': celebrationProfile.confettiColors[1] ?? celebrationProfile.confettiColors[0], '--confetti-color-3': celebrationProfile.confettiColors[2] ?? celebrationProfile.confettiColors[0] } as CSSProperties}>
              <div className={`confetti-layer confetti-${celebrationProfile.particleShape}`} aria-hidden="true" />
              <div className="relative">
                <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b8a97b]">COUNTRY DISCOVERED</div>
                <h3 className={`mt-2 font-display text-4xl font-black text-white ${rewardStage !== 'stamp' ? 'completion-title-rise' : ''}`}>{reward.countryName}</h3>
                <div className="mt-1 text-sm font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">{reward.message}</div>
                {celebrationProfile.themeLabel && <div className="mt-2 text-[11px] font-black uppercase tracking-[0.35em] text-[#f0c674]">{celebrationProfile.themeLabel}</div>}
                <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-3"><div className={`relative rounded-[24px] border border-white/10 bg-white/5 p-4 ${rewardStage === 'stamp' ? 'stamp-slam' : 'opacity-80'}`}><div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Passport Stamp</div><div className="mt-2 text-2xl font-black text-white">{reward.passportStamp.label}</div><div className="mt-1 text-sm text-[#9fb3c8]">{reward.passportStamp.completedAt}</div></div><div className={`rounded-[24px] border border-white/10 bg-white/5 p-4 ${rewardStage === 'souvenir' ? 'souvenir-pop' : 'opacity-80'}`}><div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Souvenir Reveal</div><div className="mt-2 text-2xl font-black text-white">{reward.souvenir.name}</div></div></div>
                  <div className="space-y-3"><div className={`rounded-[24px] border border-white/10 bg-white/5 p-4 ${rewardStage === 'xp' ? 'star-pop' : 'opacity-80'}`}><div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">XP Reveal</div><div className={`mt-2 text-5xl font-black text-[#22c55e] ${rewardStage === 'xp' ? 'xp-pulse' : ''}`}>+{rewardXpVisible}</div></div><div className="rounded-[24px] border border-white/10 bg-white/5 p-4"><div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Explorer Rank Progress</div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#22c55e,#f59e0b)] transition-all duration-700" style={{ width: `${rewardRankProgress}%` }} /></div></div></div>
                </div>
                <div className={`mt-4 flex flex-wrap gap-2 ${rewardStage === 'done' ? 'completion-actions' : 'opacity-70'}`}><button onClick={() => { playSound('button_click'); nextCountry() }} className="rounded-2xl bg-[#f59e0b] px-5 py-3 font-black text-[#111827]">Next Flag</button><button onClick={() => { playSound('button_click'); setReward(null) }} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-black text-white">Continue</button></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
