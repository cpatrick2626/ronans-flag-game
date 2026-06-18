'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { COUNTRIES, COUNTRY_BY_ISO2 } from '../public/countries.js'
import { completeCountry, getCountryProgress, loadFlagProgress } from '../public/flag-progress.js'

type Screen = 'player-entry' | 'home' | 'country-arrival' | 'play' | 'create-room' | 'join-room' | 'waiting-room' | 'coop' | 'versus'
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
function useRoomChannel(onSnapshot: (room: RoomState) => void) { const channelRef = useRef<BroadcastChannel | null>(null); useEffect(() => { if (typeof window === 'undefined') return; const onStorage = (event: StorageEvent) => { if (event.key !== ROOM_STORAGE_KEY || !event.newValue) return; try { onSnapshot(JSON.parse(event.newValue) as RoomState) } catch {} }; window.addEventListener('storage', onStorage); if ('BroadcastChannel' in window) { const channel = new BroadcastChannel(ROOM_CHANNEL); channel.onmessage = (event) => { const payload = event.data as RoomSnapshot | null; if (payload?.room) onSnapshot(payload.room) }; channelRef.current = channel } return () => { window.removeEventListener('storage', onStorage); channelRef.current?.close() } }, [onSnapshot]); return channelRef }
function AtmosphereBackdrop() { return <div className="pointer-events-none absolute inset-0 overflow-hidden"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.62)_0%,_rgba(255,255,255,0.20)_26%,_rgba(142,213,255,0.00)_58%)]" /><div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(255,240,204,0)_0%,rgba(246,213,143,0.50)_55%,rgba(231,183,105,0.96)_100%)]" /><div className="absolute left-1/2 top-[16%] h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.94)_0%,_rgba(255,255,255,0.58)_42%,_rgba(255,255,255,0)_72%)] blur-[2px]" /></div> }

export default function FlagGamePage() {
  const [screen, setScreen] = useState<Screen>('player-entry')
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
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        {screen === 'home' && (
          <section className="relative flex min-h-screen flex-1 flex-col items-center justify-between pb-8 pt-2">
            <div className="flex w-full justify-end"><button onClick={() => setScreen('player-entry')} className="rounded-full border border-white/35 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white backdrop-blur">Start</button></div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8">
              <div className="float-slow relative h-48 w-48 rounded-full border border-white/35 bg-[radial-gradient(circle_at_35%_35%,#fffef9_0%,#dff3ff_28%,#7cc9ff_56%,#2e6db0_100%)] shadow-[0_30px_90px_rgba(0,63,126,0.22)]"><div className="absolute inset-4 rounded-full border border-white/20" /><div className="absolute left-7 top-8 h-9 w-14 rounded-[50%] bg-white/80 blur-[1px]" /><div className="absolute right-7 top-16 h-7 w-12 rounded-[50%] bg-white/70 blur-[1px]" /></div>
              <div className="relative flex h-32 w-[94vw] max-w-5xl items-end justify-center">
                <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(52,89,44,0)_0%,rgba(52,89,44,0.44)_100%)]" />
                <div className="absolute bottom-4 left-8 h-16 w-24 rounded-t-[60%] bg-[#3f6f41]" /><div className="absolute bottom-2 left-24 h-24 w-16 rounded-t-[55%] bg-[#5f8e4d]" /><div className="absolute bottom-0 left-40 h-28 w-10 bg-[#7e5638]" /><div className="absolute bottom-8 left-[42%] h-20 w-24 rounded-t-[50%] bg-[#6c9d55]" /><div className="absolute bottom-0 right-[32%] h-24 w-20 rounded-t-[60%] bg-[#4f7445]" /><div className="absolute bottom-3 right-24 h-20 w-18 rounded-t-[55%] bg-[#8a5d39]" /><div className="absolute bottom-0 right-10 h-14 w-16 rounded-t-[45%] bg-[#315d3e]" />
              </div>
              <div className="text-center"><div className="text-[11px] font-black uppercase tracking-[0.6em] text-[#fef8eb]/85">RONAN FLAG GAME</div><h1 className="mt-4 font-display text-5xl font-black tracking-[0.12em] text-[#fff9ef] drop-shadow-[0_6px_0_rgba(107,74,31,0.18)]">COLOR THE FLAG</h1></div>
              <div className="flex flex-col items-stretch gap-3"><button onClick={startSolo} className="w-56 rounded-full bg-[#ffcf54] px-7 py-3 text-lg font-black text-[#17345a] shadow-[0_14px_30px_rgba(145,92,0,0.22)]">Play</button><button onClick={() => setScreen('player-entry')} className="w-56 rounded-full border border-white/40 bg-white/20 px-7 py-3 text-lg font-black text-[#17345a] backdrop-blur">Passport</button><button onClick={() => setScreen('player-entry')} className="w-56 rounded-full border border-white/40 bg-white/20 px-7 py-3 text-lg font-black text-[#17345a] backdrop-blur">Collections</button><button onClick={() => setScreen('player-entry')} className="w-56 rounded-full border border-white/40 bg-white/20 px-7 py-3 text-lg font-black text-[#17345a] backdrop-blur">Settings</button></div>
            </div>
          </section>
        )}

        {screen === 'player-entry' && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">WELCOME</div><div className="mt-2 text-3xl font-black">Player Name</div><div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Enter player name" className="h-14 rounded-2xl border border-white/10 bg-white/90 px-4 text-lg font-bold outline-none placeholder:text-[#5d7590]" /><button onClick={enterGame} className="h-14 rounded-2xl bg-[#ffcf54] px-5 text-lg font-black text-[#17345a]">Continue</button></div></div></section>}

        {(screen === 'country-arrival' || screen === 'play' || screen === 'coop' || screen === 'versus') && (
          <section className="relative flex min-h-0 flex-1 flex-col">
            <div className="mb-4 flex items-center justify-between"><div className="text-[11px] font-black uppercase tracking-[0.55em] text-[#fff7e6]">COLOR THE FLAG</div><button onClick={() => setShowExplorerLog((value) => !value)} className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-white backdrop-blur">Explorer Log</button></div>
            <div className="flex-1 rounded-[34px] border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.12)_100%)] p-4 shadow-[0_24px_80px_rgba(30,58,90,0.20)] backdrop-blur-[2px] md:p-6">
              <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="relative min-w-0">
                  <div className="text-center"><h2 className="font-display text-4xl font-black tracking-[0.10em] text-[#17345a] md:text-6xl">{country.name}</h2></div>
                  <div className="relative mt-5 overflow-hidden rounded-[34px] border border-white/30 bg-[linear-gradient(180deg,#92d8ff_0%,#d6f0ff_40%,#fff0c8_100%)] p-4 md:p-6">
                    <div className="absolute left-4 top-4 text-[10px] font-black uppercase tracking-[0.45em] text-[#17345a]/75">COLOR THE FLAG</div>
                    <div className="absolute right-5 top-4 text-[10px] font-black uppercase tracking-[0.35em] text-[#17345a]/55">{country.continent}</div>
                    <div className="mx-auto mt-8 max-w-3xl">
                      <svg viewBox="0 0 300 200" className="h-auto w-full rounded-[22px] border border-white/40 bg-white shadow-[0_16px_40px_rgba(23,52,90,0.16)]">
                        {country.flag_regions.map((region: any) => region.shapes.map((shape: any, idx: number) => { const fill = palette[(regionState[region.id] ?? region.color) % palette.length] || '#eee'; return <g key={`${region.id}-${idx}`} onClick={() => colorRegion(region.id)} role="button" tabIndex={0} className={paintClass(region.id)}>{getCountryShape(shape.t, shape, fill)}</g> }))}
                        {completed && <text x="150" y="28" textAnchor="middle" className="fill-[#17345a] text-[14px] font-black">COMPLETE</text>}
                      </svg>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">{palette.map((color: string, idx: number) => <button key={color} onClick={() => setSelectedColorIndex(idx)} className={`h-11 w-11 rounded-full border-4 shadow-sm ${idx === selectedColorIndex ? 'border-white ring-4 ring-[#17345a]/20' : 'border-white/70'}`} style={{ background: color }} aria-label={`Color ${idx + 1}`} />)}</div>
                    <div className="mt-4 text-center text-sm font-black text-[#17345a]">{totalRegions} regions total | {filledRegions} filled | {perfectFlag ? 'Perfect ready' : 'Color every region to finish the flag'}</div>
                    <div className="mt-2 text-center text-xs font-semibold text-[#355780]">Tap a color, then tap the matching part of the flag.</div>
                    <div className="mt-5 flex justify-center"><div className="rounded-full bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-[0.35em] text-[#17345a] shadow-sm">{countryProgress.status} | XP {visibleProgress.xp} | {titleFor(visibleProgress)}</div></div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3"><button onClick={() => { playSound('button_click'); setScreen('home') }} className="rounded-full border border-white/35 bg-white/20 px-5 py-3 text-sm font-black text-[#17345a] backdrop-blur">Home</button><button onClick={() => setScreen('player-entry')} className="rounded-full border border-white/35 bg-white/20 px-5 py-3 text-sm font-black text-[#17345a] backdrop-blur">Passport</button><button onClick={() => setScreen('player-entry')} className="rounded-full border border-white/35 bg-white/20 px-5 py-3 text-sm font-black text-[#17345a] backdrop-blur">Collections</button><button onClick={() => setScreen('player-entry')} className="rounded-full border border-white/35 bg-white/20 px-5 py-3 text-sm font-black text-[#17345a] backdrop-blur">Settings</button></div>
                </div>
                <aside className="space-y-4">
                  <div className="rounded-[28px] border border-white/25 bg-white/20 p-4 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">Player Progress</div><div className="mt-3 text-3xl font-black">{completionProgress.total ? Math.max(1, Math.round(completionProgress.percent / 5)) : 1}</div><div className="mt-2 text-sm font-semibold">{completionProgress.completed} of {completionProgress.total} countries discovered</div><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full bg-[linear-gradient(90deg,#2b72d6,#ffcf54,#ef5a45)] transition-all duration-500" style={{ width: `${completionProgress.percent}%` }} /></div><div className="mt-2 text-xs font-black uppercase tracking-[0.28em]">Level {visibleProgress.explorerLevel}</div></div>
                  <div className="rounded-[28px] border border-white/25 bg-white/20 p-4 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">Instruction</div><div className="mt-2 text-sm font-semibold">Use the palette below the flag. Finish the country to unlock progress, stamps, and rewards.</div><button onClick={completeFlag} className="mt-4 w-full rounded-full bg-[#ffcf54] px-4 py-3 text-base font-black text-[#17345a]">Seal the Flag</button></div>
                </aside>
              </div>
            </div>
          </section>
        )}

        {screen === 'join-room' && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">SYNC</div><div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input value={roomCodeInput} onChange={(event) => setRoomCodeInput(event.target.value)} placeholder="Room code" className="h-14 rounded-2xl border border-white/10 bg-white/90 px-4 text-lg font-bold outline-none placeholder:text-[#5d7590]" /><button onClick={joinRoom} className="h-14 rounded-2xl bg-[#ffcf54] px-5 text-lg font-black text-[#17345a]">Join</button></div></div></section>}
        {screen === 'create-room' && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">MULTIPLAYER</div><div className="mt-4 grid gap-3 md:grid-cols-2"><button onClick={() => { if (!pendingRoomMode) return; playSound('button_click'); createRoom(pendingRoomMode) }} className="rounded-[22px] bg-[#ffcf54] px-4 py-4 text-left text-lg font-black text-[#17345a]">Launch</button><button onClick={() => setScreen('home')} className="rounded-[22px] border border-white/10 bg-white/15 px-4 py-4 text-left text-lg font-black text-[#17345a]">Back</button></div></div></section>}
        {screen === 'waiting-room' && room && <section className="mx-auto flex w-full max-w-xl flex-1 items-center justify-center"><div className="w-full rounded-[28px] border border-white/20 bg-white/20 p-5 text-[#17345a] backdrop-blur"><div className="text-[11px] font-black uppercase tracking-[0.45em]">SYNC</div><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-[22px] border border-white/10 bg-white/15 p-4"><div className="text-[11px] font-black uppercase tracking-[0.4em]">Code</div><div className="mt-2 text-3xl font-black">{room.code}</div></div><div className="rounded-[22px] border border-white/10 bg-white/15 p-4"><div className="text-[11px] font-black uppercase tracking-[0.4em]">Travelers</div><div className="mt-2 font-black">{room.hostName}</div><div>{room.guestName || 'Waiting for second player'}</div></div></div><div className="mt-4 flex gap-2"><button onClick={() => promoteRoom('coop')} className="rounded-full border border-white/10 bg-white/15 px-4 py-2 font-black">Co-op</button><button onClick={() => promoteRoom('versus')} className="rounded-full border border-white/10 bg-white/15 px-4 py-2 font-black">Versus</button><button onClick={beginRoom} className="rounded-full bg-[#ffcf54] px-4 py-2 font-black">Begin</button></div></div></section>}

        {showExplorerLog && (
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setShowExplorerLog(false)}>
            <aside className="absolute right-4 top-4 bottom-4 w-[min(92vw,380px)] overflow-hidden rounded-[28px] border border-white/20 bg-[rgba(255,250,240,0.96)] p-4 text-[#17345a] shadow-[0_24px_80px_rgba(0,0,0,0.24)]" onClick={(event) => event.stopPropagation()}>
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
