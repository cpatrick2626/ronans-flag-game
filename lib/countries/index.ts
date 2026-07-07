import type { CelebrationProfile, CountryChallengeConfig, MapPin } from './types'
import { FRANCE } from './france'

export * from './types'
export { FRANCE }

// Registry of countries wired into the Flag Color Challenge.
// Add a new country by creating its config file and listing it here.
export const CHALLENGE_COUNTRIES: Record<string, CountryChallengeConfig> = {
  FR: FRANCE,
}

export const DEFAULT_CHALLENGE_ISO2 = 'FR'

export function getChallengeConfig(iso2: string): CountryChallengeConfig | undefined {
  return CHALLENGE_COUNTRIES[iso2]
}

// Only playable configs may launch gameplay; everything else falls back to
// the default country so unfinished countries can never open a broken screen.
export function resolvePlayableChallenge(iso2: string): CountryChallengeConfig {
  const config = CHALLENGE_COUNTRIES[iso2]
  return config && config.playable ? config : CHALLENGE_COUNTRIES[DEFAULT_CHALLENGE_ISO2]
}

export const GLOBAL_CELEBRATION: CelebrationProfile = { confettiColors: ['#f59e0b', '#38bdf8', '#22c55e'], particleShape: 'dot', soundHook: 'victory_default' }

// Celebration themes for countries that have a theme but no full challenge
// config yet. A full CountryChallengeConfig's celebration takes precedence.
const CELEBRATION_THEMES: Record<string, CelebrationProfile> = {
  JP: { confettiColors: ['#D4002A', '#FFFFFF', '#F5B7C4'], particleShape: 'petal', soundHook: 'victory_japan', themeLabel: 'Cherry blossom victory' },
  BR: { confettiColors: ['#009C3B', '#FFDF00', '#002776'], particleShape: 'diamond', soundHook: 'victory_brazil', themeLabel: 'Carnival victory' },
  EG: { confettiColors: ['#C8A04A', '#D8C7A1', '#123B7A'], particleShape: 'dot', soundHook: 'victory_egypt', themeLabel: 'Desert victory' },
}

export function getCelebrationProfile(iso2: string): CelebrationProfile {
  return CHALLENGE_COUNTRIES[iso2]?.celebration || CELEBRATION_THEMES[iso2] || GLOBAL_CELEBRATION
}

// Home map pin hitboxes over /assets/home/main-map-reference.png.
// Order matters: it is the DOM render order on the home screen.
export const MAP_PINS: MapPin[] = [
  { code: 'FR', label: 'France', x: '53%', y: '37%', tone: 'pin-blue', selectable: true },
  { code: 'CA', label: 'Canada', x: '16%', y: '38%', tone: 'pin-red', selectable: true },
  { code: 'BR', label: 'Brazil', x: '23%', y: '66%', tone: 'pin-green', selectable: true },
  { code: 'EG', label: 'Egypt', x: '56%', y: '62%', tone: 'pin-gold', selectable: true },
  { code: 'IN', label: 'India', x: '82%', y: '63%', tone: 'pin-purple', selectable: true },
  { code: '??', label: 'Mystery', x: '86%', y: '27%', tone: 'pin-mystery', selectable: false },
]
