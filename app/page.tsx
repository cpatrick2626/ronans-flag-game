'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { COUNTRIES, COUNTRY_BY_ISO2 } from '../public/countries.js'
import {
  completeCountry,
  getCountryProgress,
  loadFlagProgress,
} from '../public/flag-progress.js'

type Screen =
  | 'player-entry'
  | 'home'
  | 'country-arrival'
  | 'play'
  | 'create-room'
  | 'join-room'
  | 'waiting-room'
  | 'coop'
  | 'versus'

type Mode = 'solo' | 'coop' | 'versus'
type RewardStage = 'stamp' | 'souvenir' | 'stars' | 'xp' | 'done'
type CompletionSoundHook =
  | 'button_click'
  | 'correct_fill'
  | 'wrong_fill'
  | 'stamp_thump'
  | 'country_complete'
  | 'arrival_theme'
  | 'home_theme'
  | 'victory_default'
  | 'victory_france'
  | 'victory_japan'
  | 'victory_brazil'
  | 'victory_egypt'

type CelebrationProfile = {
  confettiColors: string[]
  particleShape: 'dot' | 'petal' | 'diamond'
  soundHook: CompletionSoundHook
  themeLabel?: string
}
type RoomStatus = 'waiting' | 'ready' | 'active'
type PaintFeedback = {
  state: 'correct' | 'wrong'
  at: number
}

type RoomState = {
  id: string
  code: string
  hostName: string
  guestName?: string
  mode: Exclude<Mode, 'solo'>
  createdAt: string
  updatedAt: string
  status: RoomStatus
  activeCountryCode: string
  rounds: string[]
  roundIndex: number
  scores: Record<string, number>
  lastMoveAt?: string
}

type RoomSnapshot = {
  room: RoomState
  note: string
}

type SyncState = 'idle' | 'local' | 'broadcast' | 'joined' | 'started' | 'updated'

const PLAYER_NAME_KEY = 'ronan_flag_player_name'
const ACTIVE_MODE_KEY = 'ronan_flag_active_mode'
const ACTIVE_COUNTRY_KEY = 'flag_game_v1_active_country'
const ROOM_STORAGE_KEY = 'ronan_flag_room'
const ROOM_CHANNEL = 'ronan-flag-room-sync'
const GLOBAL_CELEBRATION: CelebrationProfile = {
  confettiColors: ['#f59e0b', '#38bdf8', '#22c55e'],
  particleShape: 'dot',
  soundHook: 'victory_default',
  themeLabel: 'Global celebration',
}

const CELEBRATION_BY_COUNTRY: Record<string, CelebrationProfile> = {
  FR: {
    confettiColors: ['#0055A4', '#FFFFFF', '#EF4135'],
    particleShape: 'diamond',
    soundHook: 'victory_france',
    themeLabel: 'French victory',
  },
  JP: {
    confettiColors: ['#D4002A', '#FFFFFF', '#F5B7C4'],
    particleShape: 'petal',
    soundHook: 'victory_japan',
    themeLabel: 'Cherry blossom victory',
  },
  BR: {
    confettiColors: ['#009C3B', '#FFDF00', '#002776'],
    particleShape: 'diamond',
    soundHook: 'victory_brazil',
    themeLabel: 'Carnival victory',
  },
  EG: {
    confettiColors: ['#C8A04A', '#D8C7A1', '#123B7A'],
    particleShape: 'dot',
    soundHook: 'victory_egypt',
    themeLabel: 'Desert victory',
  },
}

const CELEBRATION_BY_CONTINENT: Record<string, CelebrationProfile> = {
  Europe: {
    confettiColors: ['#0055A4', '#FFFFFF', '#EF4135'],
    particleShape: 'diamond',
    soundHook: 'victory_default',
    themeLabel: 'European celebration',
  },
  Asia: {
    confettiColors: ['#D4002A', '#FFFFFF', '#F5B7C4'],
    particleShape: 'petal',
    soundHook: 'victory_default',
    themeLabel: 'Asian celebration',
  },
  'South America': {
    confettiColors: ['#009C3B', '#FFDF00', '#002776'],
    particleShape: 'diamond',
    soundHook: 'victory_default',
    themeLabel: 'South American celebration',
  },
  Americas: {
    confettiColors: ['#0055A4', '#FFFFFF', '#EF4135'],
    particleShape: 'diamond',
    soundHook: 'victory_default',
    themeLabel: 'Americas celebration',
  },
  Africa: {
    confettiColors: ['#C8A04A', '#D8C7A1', '#123B7A'],
    particleShape: 'dot',
    soundHook: 'victory_default',
    themeLabel: 'African celebration',
  },
}

function getCelebrationProfile(countryCode: string) {
  const country = COUNTRY_BY_ISO2[countryCode]
  if (!country) return GLOBAL_CELEBRATION

  const countryProfile = CELEBRATION_BY_COUNTRY[country.iso2]
  if (countryProfile) return countryProfile

  const continentProfile = CELEBRATION_BY_CONTINENT[country.continent]
  if (continentProfile) return continentProfile

  return GLOBAL_CELEBRATION
}

function safeStorageGet(key: string) {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(key)
}

function safeStorageSet(key: string, value: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, value)
}

function isValidCountryCode(code?: string | null) {
  return !!code && !!COUNTRY_BY_ISO2[code]
}

function getInitialCountry() {
  const saved = safeStorageGet(ACTIVE_COUNTRY_KEY)
  return isValidCountryCode(saved) ? (saved as string) : 'FR'
}

function getDifficultyLabel(difficulty?: string) {
  if (!difficulty) return 'Unknown'
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

function getCountryLanguage(country: (typeof COUNTRIES)[number]) {
  if (country.languages?.length) return country.languages[0]
  return 'Unknown'
}

function getCountryFunFact(country: (typeof COUNTRIES)[number]) {
  const recordedFact = country.fun_facts?.find((fact: string) => fact && fact.trim().length > 0)
  if (recordedFact) return recordedFact

  const landmark = country.landmark?.trim()
  if (landmark) return `${country.name} is associated with ${landmark}.`

  const food = country.foods?.find((item: string) => item && item.trim().length > 0)
  if (food) return `${food} is a known local specialty in ${country.name}.`

  const animal = country.animals?.find((item: string) => item && item.trim().length > 0)
  if (animal) return `${animal} is one of the animals closely tied to ${country.name}.`

  return `${country.name} is in ${country.continent} and uses ${getCountryLanguage(country)} as its primary language.`
}

function roomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function roomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function useSoundHooks() {
  const hookMap: Record<CompletionSoundHook, null> = {
    button_click: null,
    correct_fill: null,
    wrong_fill: null,
    stamp_thump: null,
    country_complete: null,
    arrival_theme: null,
    home_theme: null,
    victory_default: null,
    victory_france: null,
    victory_japan: null,
    victory_brazil: null,
    victory_egypt: null,
  }
  return {
    playSound: (hook: CompletionSoundHook) => {
      void hookMap[hook]
      void hook
    },
  }
}

function loadRoom(): RoomState | null {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(ROOM_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as RoomState
  } catch {
    return null
  }
}

function saveRoom(room: RoomState | null) {
  if (typeof window === 'undefined') return
  if (!room) {
    window.localStorage.removeItem(ROOM_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(room))
}

function makeRoom(mode: Exclude<Mode, 'solo'>, hostName: string, countryCode: string): RoomState {
  const baseCountry = COUNTRY_BY_ISO2[countryCode] || COUNTRIES[0]
  return {
    id: roomId(),
    code: roomCode(),
    hostName,
    mode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'waiting',
    activeCountryCode: baseCountry.iso2,
    rounds: COUNTRIES.slice(0, 12).map((item) => item.iso2),
    roundIndex: 0,
    scores: {},
  }
}

function countryPalette(country: (typeof COUNTRIES)[number]): string[] {
  return country.theme_colors || country.flag_colors || ['#0055A4', '#FFFFFF', '#EF4135']
}

function getCountryShape(type: string, shape: any, fill: string) {
  if (type === 'rect') return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx="0" ry="0" fill={fill} />
  if (type === 'circle') return <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={fill} />
  if (type === 'polygon') return <polygon points={shape.points} fill={fill} />
  return null
}

function titleFor(progress: ReturnType<typeof loadFlagProgress>) {
  return progress.levelTitle || 'Junior Explorer'
}

function getExplorerRank(completedCountries: number) {
  if (completedCountries >= 120) return { name: 'Atlas Marshal', nextAt: null }
  if (completedCountries >= 75) return { name: 'Passport Commander', nextAt: 120 }
  if (completedCountries >= 35) return { name: 'Route Specialist', nextAt: 75 }
  if (completedCountries >= 12) return { name: 'Field Explorer', nextAt: 35 }
  return { name: 'Junior Explorer', nextAt: 12 }
}

function getCompletionProgress(progress: ReturnType<typeof loadFlagProgress>) {
  const completed = progress.completedCountries || 0
  const total = COUNTRIES.length
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    rank: getExplorerRank(completed),
  }
}

function useRoomChannel(onSnapshot: (room: RoomState) => void) {
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onStorage = (event: StorageEvent) => {
      if (event.key !== ROOM_STORAGE_KEY || !event.newValue) return
      try {
        onSnapshot(JSON.parse(event.newValue) as RoomState)
      } catch {
        // Ignore malformed sync payloads.
      }
    }

    window.addEventListener('storage', onStorage)

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(ROOM_CHANNEL)
      channel.onmessage = (event) => {
        const payload = event.data as RoomSnapshot | null
        if (payload?.room) onSnapshot(payload.room)
      }
      channelRef.current = channel
    }

    return () => {
      window.removeEventListener('storage', onStorage)
      channelRef.current?.close()
    }
  }, [onSnapshot])

  return channelRef
}

function ScreenCard({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-[#f4e7c4]/10 bg-[rgba(8,12,18,0.76)] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
      <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b8a97b]">{eyebrow}</div>
      <h2 className="mt-2 font-display text-3xl font-black tracking-[0.06em] text-[#fbf4e6]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function StatusChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-[#dbeafe]">
      {children}
    </div>
  )
}

function ModeBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#c6d6e6]">
      {children}
    </span>
  )
}

export default function FlagGamePage() {
  const [screen, setScreen] = useState<Screen>('player-entry')
  const [playerName, setPlayerName] = useState('Ronan')
  const [mode, setMode] = useState<Mode>('solo')
  const [progress, setProgress] = useState<ReturnType<typeof loadFlagProgress>>(() => loadFlagProgress())
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
  const timersRef = useRef<number[]>([])
  const syncStateRef = useRef<SyncState>('idle')
  const channelRef = useRoomChannel((nextRoom) => {
    setRoom((current) => {
      if (current && current.updatedAt > nextRoom.updatedAt) return current
      syncStateRef.current = 'broadcast'
      return nextRoom
    })
  })

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
  const roomSyncLabel = roomSnapshot?.note || syncStateRef.current
  const completionProgress = getCompletionProgress(visibleProgress)
  const { playSound } = useSoundHooks()
  const celebrationProfile = useMemo(() => getCelebrationProfile(activeCountryCode), [activeCountryCode])

  useEffect(() => {
    const storedProgress = loadFlagProgress()
    setProgress(storedProgress)
    setActiveCountryCode(getInitialCountry())
    setPlayerName(safeStorageGet(PLAYER_NAME_KEY) ?? 'Ronan')
    setMode((safeStorageGet(ACTIVE_MODE_KEY) as Mode | null) ?? 'solo')
    setRoom(loadRoom())
    setClientReady(true)
  }, [])

  useEffect(() => {
    safeStorageSet(PLAYER_NAME_KEY, playerName)
  }, [playerName])

  useEffect(() => {
    safeStorageSet(ACTIVE_MODE_KEY, mode)
  }, [mode])

  useEffect(() => {
    safeStorageSet(ACTIVE_COUNTRY_KEY, activeCountryCode)
  }, [activeCountryCode])

  useEffect(() => {
    saveRoom(room)
    if (room && channelRef.current) {
      channelRef.current.postMessage({ room, note: 'sync' } satisfies RoomSnapshot)
    }
    if (room) setRoomSnapshot({ room, note: 'sync' })
  }, [room, channelRef])

  useEffect(() => {
    if (!reward) return
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
    setRewardStage('stamp')
    setRewardXpVisible(0)
    setRewardRankProgress(completionProgress.percent)
    playSound(celebrationProfile.soundHook)
    timersRef.current.push(window.setTimeout(() => {
      setRewardStage('souvenir')
      playSound('stamp_thump')
    }, 420))
    timersRef.current.push(window.setTimeout(() => setRewardStage('stars'), 880))
    timersRef.current.push(window.setTimeout(() => {
      setRewardStage('xp')
      const xpTarget = reward.xp.total
      const steps = 18
      const interval = 24
      for (let index = 1; index <= steps; index += 1) {
        timersRef.current.push(window.setTimeout(() => {
          setRewardXpVisible(Math.round((xpTarget * index) / steps))
        }, index * interval))
      }
    }, 1260))
    timersRef.current.push(window.setTimeout(() => {
      setRewardRankProgress(Math.min(100, completionProgress.percent + 8))
    }, 1520))
    timersRef.current.push(window.setTimeout(() => setRewardStage('done'), 2140))
  }, [reward, completionProgress.percent, playSound, celebrationProfile.soundHook])

  useEffect(() => {
    if (!reward || rewardStage !== 'done') return
    const timer = window.setTimeout(() => setReward(null), 2600)
    timersRef.current.push(timer)
  }, [reward, rewardStage])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  function setScreenAndMode(nextScreen: Screen, nextMode?: Mode) {
    if (nextMode) setMode(nextMode)
    setScreen(nextScreen)
  }

  function updateRoom(nextRoom: RoomState, note: RoomSnapshot['note'], nextScreen?: Screen) {
    syncStateRef.current = note as SyncState
    setRoom(nextRoom)
    setRoomSnapshot({ room: nextRoom, note })
    if (nextScreen) setScreen(nextScreen)
  }

  function enterGame() {
    playSound('home_theme')
    setScreen('home')
  }

  function startSolo() {
    playSound('arrival_theme')
    setScreenAndMode('country-arrival', 'solo')
  }

  function colorRegion(regionId: string) {
    if (!palette.length) return
    const region = country.flag_regions.find((item: any) => item.id === regionId)
    const isCorrect = region ? selectedColorIndex === region.color : false
    playSound(isCorrect ? 'correct_fill' : 'wrong_fill')
    setPaintFeedback((current) => ({
      ...current,
      [regionId]: { state: isCorrect ? 'correct' : 'wrong', at: Date.now() },
    }))
    setColorState((current) => ({
      ...current,
      [activeCountryCode]: {
        ...(current[activeCountryCode] || {}),
        [regionId]: selectedColorIndex,
      },
    }))
  }

  function completeFlag() {
    if (!allRegionsFilled || completed) return
    playSound('button_click')
    const result = completeCountry(activeCountryCode, progress, {
      stars: perfectFlag ? 3 : 2,
      completedAt: new Date().toISOString(),
    })
    setProgress(result.progress)
    setReward(result.reward)
  }

  function paintClass(regionId: string) {
    const feedback = paintFeedback[regionId]
    if (!feedback) return ''
    return feedback.state === 'correct' ? 'paint-correct correct-glow' : 'paint-wrong wrong-shake'
  }

  function nextCountry() {
    const index = COUNTRIES.findIndex((item) => item.iso2 === activeCountryCode)
    const next = COUNTRIES[(index + 1) % COUNTRIES.length]
    setActiveCountryCode(next.iso2)
    setReward(null)
    setScreen('country-arrival')
  }

  function createRoom(modeChoice: Exclude<Mode, 'solo'>) {
    const next = makeRoom(modeChoice, playerName, activeCountryCode)
    updateRoom(next, 'created', 'waiting-room')
    setMode(modeChoice)
  }

  function joinRoom() {
    const existing = loadRoom()
    if (!existing || existing.code !== roomCodeInput.trim().toUpperCase()) return
    const joined: RoomState = { ...existing, guestName: playerName, status: 'active', updatedAt: new Date().toISOString() }
    updateRoom(joined, 'joined')
    setMode(joined.mode)
    setScreen(joined.mode === 'coop' ? 'coop' : 'versus')
  }

  function promoteRoom(modeChoice: Exclude<Mode, 'solo'>) {
    if (!room) return
    const next: RoomState = {
      ...room,
      mode: modeChoice,
      status: room.guestName ? 'active' : 'waiting',
      updatedAt: new Date().toISOString(),
    }
    updateRoom(next, 'updated')
  }

  function beginRoom() {
    if (!room) return
    const next: RoomState = { ...room, status: 'active', updatedAt: new Date().toISOString() }
    updateRoom(next, 'started')
    setScreen(room.mode === 'coop' ? 'coop' : 'versus')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(7,27,62,0.95)_0%,_rgba(8,15,25,0.96)_42%,_#020406_100%)] text-[#f4ead9]">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),radial-gradient(circle_at_20%_20%,rgba(255,215,128,0.10),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(90,140,255,0.09),transparent_24%)] [background-size:42px_42px,42px_42px,100%_100%,100%_100%]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-30" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 p-4 md:p-6">
        <header className="overflow-hidden rounded-[30px] border border-[#f4e7c4]/12 bg-[rgba(7,10,16,0.88)] shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="h-1 bg-[linear-gradient(90deg,#0055A4_0%,#FFFFFF_52%,#EF4135_100%)]" />
          <div className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.5em] text-[#c7b27c]">France Expedition</div>
              <h1 className="mt-2 font-display text-4xl font-black tracking-[0.08em] text-[#fff8ed]">Magical Flag World</h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold text-[#9fb3c8]">
                A game-first exploration journey where the flag is the hero, country atmosphere supports the scene, and multiplayer progression stays intact.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm font-bold">
              <div className="rounded-2xl border border-[#f4e7c4]/10 bg-white/5 px-4 py-3">
                Player <span className="block text-lg font-black text-white">{playerName}</span>
              </div>
              <div className="rounded-2xl border border-[#f4e7c4]/10 bg-white/5 px-4 py-3">
                Title <span className="block text-lg font-black text-white">{titleFor(visibleProgress)}</span>
              </div>
            </div>
          </div>
          </div>
        </header>

        {screen === 'player-entry' && (
          <ScreenCard title="Adventurer Name" eyebrow="01 / GATE">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Enter player name"
                className="h-14 rounded-2xl border border-white/10 bg-black/30 px-4 text-lg font-bold text-white outline-none placeholder:text-[#6f8599]"
              />
              <button onClick={enterGame} className="h-14 rounded-2xl bg-[#f59e0b] px-5 text-lg font-black text-[#111827]">
                Continue
              </button>
            </div>
          </ScreenCard>
        )}

        {screen === 'home' && (
          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <ScreenCard title="World Gate" eyebrow="02 / JOURNEY">
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={startSolo} className="rounded-[22px] border border-[#f4e7c4]/10 bg-white/5 p-4 text-left">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Solo Path</div>
                  <div className="mt-2 text-2xl font-black text-white">Continue the Expedition</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">Enter the world map</div>
                  <div className="mt-3"><ModeBadge>Solo</ModeBadge></div>
                </button>
                <button onClick={() => { setPendingRoomMode('coop'); setScreen('create-room') }} className="rounded-[22px] border border-[#f4e7c4]/10 bg-white/5 p-4 text-left">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Co-op Path</div>
                  <div className="mt-2 text-2xl font-black text-white">Gather the Party</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">Shared exploration</div>
                  <div className="mt-3"><ModeBadge>Co-op</ModeBadge></div>
                </button>
                <button onClick={() => { setPendingRoomMode('versus'); setScreen('create-room') }} className="rounded-[22px] border border-[#f4e7c4]/10 bg-white/5 p-4 text-left">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Challenge Path</div>
                  <div className="mt-2 text-2xl font-black text-white">Set Rival Course</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">Head-to-head journey</div>
                  <div className="mt-3"><ModeBadge>Versus</ModeBadge></div>
                </button>
                <button onClick={() => setScreen('join-room')} className="rounded-[22px] border border-[#f4e7c4]/10 bg-white/5 p-4 text-left">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Join Path</div>
                  <div className="mt-2 text-2xl font-black text-white">Enter Another Expedition</div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">Realtime co-op / versus</div>
                  <div className="mt-3"><ModeBadge>Sync</ModeBadge></div>
                </button>
              </div>
            </ScreenCard>
            <ScreenCard title="World Status" eyebrow="LIVE">
              <div className="space-y-3 text-sm font-semibold text-[#b8c7d7]">
                <div>194-country atlas: online</div>
                <div>Discovery log: preserved</div>
                <div>Flag interaction: preserved</div>
                <div>Progress, XP, titles, stamps: preserved</div>
                <div>Multiplayer journeys: preserved</div>
                <div>Realtime sync: {roomSyncLabel}</div>
              </div>
            </ScreenCard>
          </section>
        )}

        {screen === 'join-room' && (
          <ScreenCard title="Join Expedition" eyebrow="05 / GATE">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={roomCodeInput}
                onChange={(event) => setRoomCodeInput(event.target.value)}
                placeholder="Room code"
                className="h-14 rounded-2xl border border-white/10 bg-black/30 px-4 text-lg font-bold text-white outline-none placeholder:text-[#6f8599]"
              />
              <button onClick={joinRoom} className="h-14 rounded-2xl bg-[#d4af37] px-5 text-lg font-black text-[#08111d]">
                Join
              </button>
            </div>
            <button onClick={() => setScreen('home')} className="mt-4 text-sm font-bold text-[#93a7bb]">
              Back
            </button>
          </ScreenCard>
        )}

        {screen === 'country-arrival' && (
          <ScreenCard title="Country Arrival" eyebrow="02B / ARRIVAL">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b8a97b]">Arrived In</div>
                <div className="mt-2 text-4xl font-black text-white">{country.name}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusChip>{country.continent}</StatusChip>
                  <StatusChip>{getDifficultyLabel(country.difficulty)}</StatusChip>
                  <StatusChip>{country.capital}</StatusChip>
                </div>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-[#b8c7d7] sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#93a7bb]">Capital</div>
                    <div className="mt-1 text-lg font-black text-white">{country.capital}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#93a7bb]">Language</div>
                    <div className="mt-1 text-lg font-black text-white">{getCountryLanguage(country)}</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:col-span-2">
                    <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#93a7bb]">Fun Fact</div>
                    <div className="mt-1 text-base font-semibold text-[#dbeafe]">{getCountryFunFact(country)}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b8a97b]">Journey Prep</div>
                <div className="mt-2 text-2xl font-black text-white">Flag as the Artifact</div>
                <div className="mt-3 space-y-2 text-sm font-semibold text-[#b8c7d7]">
                  <div>Country: {country.name}</div>
                  <div>Continent: {country.continent}</div>
                  <div>Difficulty: {getDifficultyLabel(country.difficulty)}</div>
                  <div>Language: {getCountryLanguage(country)}</div>
                </div>
                <button
                  onClick={() => { playSound('button_click'); setScreen('play') }}
                  className="mt-5 w-full rounded-2xl bg-[#f59e0b] px-5 py-3 text-lg font-black text-[#111827]"
                >
                  Enter the Flag
                </button>
              </div>
            </div>
          </ScreenCard>
        )}

        {screen === 'create-room' && (
          <ScreenCard title="Create Expedition" eyebrow="04 / PARTY">
            <div className="grid gap-3 md:grid-cols-2">
              <button
                onClick={() => {
                  if (!pendingRoomMode) return
                  playSound('button_click')
                  createRoom(pendingRoomMode)
                }}
                className="rounded-[22px] border border-white/10 bg-[#f59e0b] px-4 py-4 text-left text-lg font-black text-[#111827]"
              >
                Launch {pendingRoomMode === 'versus' ? 'Versus' : 'Co-op'} Journey
              </button>
              <button
                onClick={() => setScreen('home')}
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-left text-lg font-black text-white"
              >
                Back to World Gate
              </button>
            </div>
          </ScreenCard>
        )}

        {screen === 'waiting-room' && room && (
          <ScreenCard title="Campfire Wait" eyebrow="06 / SYNC">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Expedition Code</div>
                <div className="mt-2 text-3xl font-black text-white">{room.code}</div>
                <div className="mt-2 text-sm text-[#9fb3c8]">Share this code to bring another player in.</div>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Travelers</div>
                <div className="mt-2 font-bold text-white">{room.hostName}</div>
                <div className="text-[#9fb3c8]">{room.guestName || 'Waiting for second player'}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => promoteRoom('coop')} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-black text-white">Co-op</button>
              <button onClick={() => promoteRoom('versus')} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-black text-white">Versus</button>
              <button onClick={beginRoom} className="rounded-full bg-[#d4af37] px-4 py-2 font-black text-[#111827]">Begin Journey</button>
            </div>
            <div className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">
              World sync: {roomSyncLabel}
            </div>
          </ScreenCard>
        )}

        {(screen === 'play' || screen === 'coop' || screen === 'versus') && (
          <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4">
              <ScreenCard
                title={screen === 'play' ? 'Flag Journey' : screen === 'coop' ? 'Co-op Journey' : 'Versus Journey'}
                eyebrow="03 / ROUTE"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#b8a97b]">Current Country</div>
                    <div className="mt-1 text-3xl font-black text-white">{country.name}</div>
                    <div className="text-sm text-[#9fb3c8]">
                      {country.continent} | {getDifficultyLabel(country.difficulty)}
                    </div>
                  </div>
                  <StatusChip>{countryProgress.status}</StatusChip>
                </div>
                <div className="mt-4 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-3">
                  <svg viewBox="0 0 300 200" className="h-auto w-full rounded-[18px] bg-white">
                    {country.flag_regions.map((region: any) =>
                      region.shapes.map((shape: any, idx: number) => {
                        const fill = palette[(regionState[region.id] ?? region.color) % palette.length] || '#eee'
                        return (
                          <g
                            key={`${region.id}-${idx}`}
                            onClick={() => colorRegion(region.id)}
                            role="button"
                            tabIndex={0}
                            className={paintClass(region.id)}
                          >
                            {getCountryShape(shape.t, shape, fill)}
                          </g>
                        )
                      })
                    )}
                    {completed && <text x="150" y="26" textAnchor="middle" className="fill-[#111827] text-[14px] font-black">COMPLETE</text>}
                  </svg>
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">
                  {totalRegions} regions total | {filledRegions} filled | {perfectFlag ? 'Perfect ready' : 'Complete the flag to earn the stamp'}
                </div>
              </ScreenCard>

              <div className="grid gap-4 md:grid-cols-2">
                <ScreenCard title="Explorer Growth" eyebrow="XP / TITLES">
                  <div className="space-y-2 text-sm font-semibold text-[#b8c7d7]">
                    <div>XP: {visibleProgress.xp}</div>
                    <div>Title: {titleFor(visibleProgress)}</div>
                    <div>Countries: {visibleProgress.completedCountries}</div>
                    <div>Perfect flags: {visibleProgress.perfectFlags}</div>
                    <div>Stamps: {visibleProgress.passportStamps.length}</div>
                  </div>
                </ScreenCard>
                <ScreenCard title="Global Discovery" eyebrow="WORLD MAP">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs font-black uppercase tracking-[0.35em] text-[#93a7bb]">
                        <span>Completion</span>
                        <span>{completionProgress.percent}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#22c55e,#f59e0b,#f97316)] transition-all duration-500"
                          style={{ width: `${completionProgress.percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs font-semibold text-[#8ca2b6]">
                        {completionProgress.completed} of {completionProgress.total} countries discovered
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Explorer Rank</div>
                      <div className="mt-1 text-2xl font-black text-white">{completionProgress.rank.name}</div>
                      <div className="mt-1 text-sm text-[#9fb3c8]">
                        Level {visibleProgress.explorerLevel} | {titleFor(visibleProgress)}
                      </div>
                      {completionProgress.rank.nextAt && (
                        <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">
                          Next rank at {completionProgress.rank.nextAt} countries
                        </div>
                      )}
                    </div>
                  </div>
                </ScreenCard>
                <ScreenCard title="Flag Surface" eyebrow="DENSE FLAGS">
                  <div className="space-y-2 text-sm font-semibold text-[#b8c7d7]">
                    <div>Preserved for dense flag interaction.</div>
                    <div>Built into the play surface, not a separate mode.</div>
                  </div>
                </ScreenCard>
              </div>
            </div>

            <aside className="space-y-4">
              <ScreenCard title="Discovery Atlas" eyebrow="WORLD INDEX">
                <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                  {explorerCountries.map((item) => {
                    const p = getCountryProgress(visibleProgress, item.iso2)
                    const isCurrent = item.iso2 === activeCountryCode
                    return (
                      <button
                        key={item.iso2}
                        onClick={() => {
                          setActiveCountryCode(item.iso2)
                          setReward(null)
                          setScreen('country-arrival')
                        }}
                        className={`w-full rounded-2xl border px-3 py-2 text-left ${isCurrent ? 'border-[#f59e0b] bg-white/10' : 'border-white/10 bg-white/5'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-black text-white">{item.name}</div>
                            <div className="text-xs text-[#9fb3c8]">
                              {item.continent} | {getDifficultyLabel(item.difficulty)} | {p.status}
                            </div>
                          </div>
                          <div className="text-sm">{p.status === 'complete' || p.status === 'perfect' ? '✓' : '□'}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScreenCard>

              <ScreenCard title="Flag Tools" eyebrow="TRAVEL KIT">
                <div className="flex flex-wrap gap-2">
                  {palette.map((color, idx) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`h-10 w-10 rounded-full border-2 ${idx === selectedColorIndex ? 'border-white ring-4 ring-[#f59e0b]/40' : 'border-white/30'}`}
                      style={{ background: color }}
                      aria-label={`Color ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={completeFlag}
                  className="mt-4 w-full rounded-2xl bg-[#f59e0b] px-4 py-3 text-lg font-black text-[#111827]"
                >
                  Seal the Flag
                </button>
                {room && (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs font-bold uppercase tracking-[0.2em] text-[#8ca2b6]">
                    Camp {room.code} | {room.mode} | {room.status}
                  </div>
                )}
                {roomSnapshot && (
                  <div className="mt-2 text-xs text-[#8ca2b6]">Realtime sync: {roomSnapshot.note}</div>
                )}
              </ScreenCard>
            </aside>
          </section>
        )}

        {reward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div
              className="celebration-shell w-full max-w-3xl overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(7,12,18,0.96)] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.5)]"
              style={
                {
                  '--confetti-color-1': celebrationProfile.confettiColors[0],
                  '--confetti-color-2': celebrationProfile.confettiColors[1] ?? celebrationProfile.confettiColors[0],
                  '--confetti-color-3': celebrationProfile.confettiColors[2] ?? celebrationProfile.confettiColors[0],
                } as CSSProperties
              }
            >
              <div className={`confetti-layer confetti-${celebrationProfile.particleShape}`} aria-hidden="true" />
              <div className="relative">
                <div className="text-[11px] font-black uppercase tracking-[0.45em] text-[#b8a97b]">COUNTRY DISCOVERED</div>
                <h3 className={`mt-2 font-display text-4xl font-black text-white ${rewardStage !== 'stamp' ? 'completion-title-rise' : ''}`}>{reward.countryName}</h3>
                <div className="mt-1 text-sm font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">
                  {reward.message}
                </div>
                {celebrationProfile.themeLabel && (
                  <div className="mt-2 text-[11px] font-black uppercase tracking-[0.35em] text-[#f0c674]">
                    {celebrationProfile.themeLabel}
                  </div>
                )}

                <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-3">
                    <div className={`relative rounded-[24px] border border-white/10 bg-white/5 p-4 ${rewardStage === 'stamp' ? 'stamp-slam' : 'opacity-80'}`}>
                      <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Passport Stamp</div>
                      <div className="mt-2 text-2xl font-black text-white">{reward.passportStamp.label}</div>
                      <div className="mt-1 text-sm text-[#9fb3c8]">{reward.passportStamp.completedAt}</div>
                    </div>
                    <div className={`rounded-[24px] border border-white/10 bg-white/5 p-4 ${rewardStage === 'souvenir' ? 'souvenir-pop' : 'opacity-80'}`}>
                      <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Souvenir Reveal</div>
                      <div className="mt-2 text-2xl font-black text-white">{reward.souvenir.name}</div>
                      <div className="mt-1 text-sm text-[#9fb3c8]">Locked into explorer inventory.</div>
                      <div className="mt-3 text-[11px] font-black uppercase tracking-[0.35em] text-[#93a7bb]">
                        {rewardStage === 'souvenir' ? 'Inventory unlocked' : 'Pending reveal'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className={`rounded-[24px] border border-white/10 bg-white/5 p-4 ${rewardStage === 'xp' ? 'star-pop' : 'opacity-80'}`}>
                      <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">XP Reveal</div>
                      <div className={`mt-2 text-5xl font-black text-[#22c55e] ${rewardStage === 'xp' ? 'xp-pulse' : ''}`}>+{rewardXpVisible}</div>
                      <div className="mt-2 text-sm text-[#9fb3c8]">
                        Base {reward.xp.flagComplete} | Bonus {reward.xp.perfectBonus + reward.xp.souvenirBonus}
                      </div>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                      <div className="text-[11px] font-black uppercase tracking-[0.35em] text-[#b8a97b]">Explorer Rank Progress</div>
                      <div className="mt-2 text-2xl font-black text-white">{completionProgress.rank.name}</div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8,#22c55e,#f59e0b)] transition-all duration-700"
                          style={{ width: `${rewardRankProgress}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ca2b6]">
                        {completionProgress.completed}/{completionProgress.total} global discovery
                        {completionProgress.rank.nextAt ? ` | next rank at ${completionProgress.rank.nextAt}` : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 flex flex-wrap gap-2 ${rewardStage === 'done' ? 'completion-actions' : 'opacity-70'}`}>
                  <button onClick={() => { playSound('button_click'); nextCountry() }} className="rounded-2xl bg-[#f59e0b] px-5 py-3 font-black text-[#111827]">
                    Next Flag
                  </button>
                  <button onClick={() => { playSound('button_click'); setReward(null) }} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-black text-white">
                    Continue
                  </button>
                  <button onClick={() => { playSound('button_click'); setRewardStage('stamp') }} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-black text-white">
                    Replay Stamp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
