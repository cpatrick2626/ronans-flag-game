'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { COUNTRIES, COUNTRY_BY_ISO2 } from '../public/countries.js'
import { completeCountry, getCountryProgress, loadFlagProgress } from '../public/flag-progress.js'

type Screen = 'loading' | 'home' | 'country-arrival' | 'play' | 'create-room' | 'join-room' | 'waiting-room' | 'coop' | 'versus'
type Mode = 'solo' | 'coop' | 'versus'
type RewardStage = 'stamp' | 'souvenir' | 'stars' | 'xp' | 'done'
type CompletionSoundHook = 'button_click' | 'correct_fill' | 'wrong_fill' | 'stamp_thump' | 'country_complete' | 'arrival_theme' | 'home_theme' | 'victory_default' | 'victory_france' | 'victory_japan' | 'victory_brazil' | 'victory_egypt'
type CelebrationProfile = { confettiColors: string[]; particleShape: 'dot' | 'petal' | 'diamond'; soundHook: CompletionSoundHook; themeLabel?: string }
type RoomStatus = 'waiting' | 'ready' | 'active'
type PaintFeedback = { state: 'correct' | 'wrong'; at: number }
type RoomState = { id: string; code: string; hostName: string; guestName?: string; mode: Exclude<Mode, 'solo'>; createdAt: string; updatedAt: string; status: RoomStatus; activeCountryCode: string; rounds: string[]; roundIndex: number; scores: Record<string, number>; lastMoveAt?: string }
type RoomSnapshot = { room: RoomState; note: string }

const PLAYER_NAME_KEY = 'ronan_flag_player_name'
const PLAYER_NAME_CONFIRMED_KEY = 'ronan_flag_player_name_confirmed'
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

function IntroScreen({ onPlay, exiting }: { onPlay: () => void; exiting: boolean }) {
  return (
    <div
      className={`intro-screen-container ${exiting ? 'intro-screen-exiting' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Play Ronan's Flag Game"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onPlay()
        }
      }}
    >
      <div className="intro-screen-video-shell">
        <div className="intro-screen-video-frame">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="intro-screen-video"
            src="/assets/loading/ronans-loading-screen.mp4"
          />
          <button
            type="button"
            onClick={onPlay}
            className="intro-play-hitbox"
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
  const heroPins = [
    { code: 'CA', label: 'Canada', x: '16%', y: '38%', tone: 'pin-red' },
    { code: 'FR', label: 'France', x: '53%', y: '37%', tone: 'pin-blue' },
    { code: 'BR', label: 'Brazil', x: '23%', y: '66%', tone: 'pin-green' },
    { code: 'EG', label: 'Egypt', x: '56%', y: '62%', tone: 'pin-gold' },
    { code: 'IN', label: 'India', x: '82%', y: '63%', tone: 'pin-purple' },
    { code: '??', label: 'Mystery', x: '86%', y: '27%', tone: 'pin-mystery' },
  ]

  useEffect(() => { const storedProgress = loadFlagProgress(); setProgress(storedProgress); setActiveCountryCode(getInitialCountry()); setPlayerName(safeStorageGet(PLAYER_NAME_KEY) ?? 'Ronan'); setPlayerNameConfirmed(safeStorageGet(PLAYER_NAME_CONFIRMED_KEY) === 'true'); setMode((safeStorageGet(ACTIVE_MODE_KEY) as Mode | null) ?? 'solo'); setRoom(loadRoom()); setClientReady(true) }, [])
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
      {screen === 'loading' && <IntroScreen onPlay={beginIntroExit} exiting={introExiting} />}
      <div className="relative mx-auto flex min-h-screen w-full flex-col px-4 py-4 md:px-6 md:py-6">
        {screen === 'home' && (
          <section className="relative flex min-h-0 flex-1 items-center justify-center">
            <div className="home-map-shell relative flex h-full min-h-0 w-full max-w-[420px] flex-1 flex-col overflow-hidden rounded-[34px] border border-[#f6e0b2]/12 shadow-[0_36px_120px_rgba(61,36,12,0.12)]">
              {/* Use the provided full-screen reference image as the visual base */}
              <div className="main-reference-container relative w-full h-full">
                <img src="/assets/home/main-map-reference.png" alt="Main map reference" className="main-reference-image w-full h-full object-contain mx-auto" />

                {/* Invisible / faint hitboxes over the image for interactivity */}
                <button aria-label="France" className="reference-hitbox" style={{ left: '53%', top: '37%', width: '8%', height: '8%' } as React.CSSProperties} onClick={() => setActiveCountryCode('FR')} onPointerEnter={() => handlePinEnter('FR')} onPointerLeave={handlePinLeave} />
                <button aria-label="Canada" className="reference-hitbox" style={{ left: '16%', top: '38%', width: '8%', height: '8%' } as React.CSSProperties} onClick={() => setActiveCountryCode('CA')} onPointerEnter={() => handlePinEnter('CA')} onPointerLeave={handlePinLeave} />
                <button aria-label="Brazil" className="reference-hitbox" style={{ left: '23%', top: '66%', width: '8%', height: '8%' } as React.CSSProperties} onClick={() => setActiveCountryCode('BR')} onPointerEnter={() => handlePinEnter('BR')} onPointerLeave={handlePinLeave} />
                <button aria-label="Egypt" className="reference-hitbox" style={{ left: '56%', top: '62%', width: '8%', height: '8%' } as React.CSSProperties} onClick={() => setActiveCountryCode('EG')} onPointerEnter={() => handlePinEnter('EG')} onPointerLeave={handlePinLeave} />
                <button aria-label="India" className="reference-hitbox" style={{ left: '82%', top: '63%', width: '8%', height: '8%' } as React.CSSProperties} onClick={() => setActiveCountryCode('IN')} onPointerEnter={() => handlePinEnter('IN')} onPointerLeave={handlePinLeave} />
                <button aria-label="Mystery" className="reference-hitbox" style={{ left: '86%', top: '27%', width: '8%', height: '8%' } as React.CSSProperties} onClick={() => { /* mystery */ }} />

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

                {/* Star / profile */}
                <button aria-label="Star button" className="reference-hitbox" style={{ left: '88%', top: '10%', width: '8%', height: '8%' } as React.CSSProperties} />
              </div>
            </div>
          </section>
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
