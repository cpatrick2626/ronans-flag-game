import type { CountryChallengeConfig } from './types'

// France — the validation country for the challenge engine.
// All values migrated verbatim from the previous inline app/page.tsx data;
// hotspot geometry is calibrated to /assets/france-scene.png.
export const FRANCE: CountryChallengeConfig = {
  id: 'france',
  iso2: 'FR',
  name: 'France',
  playable: true,
  scene: {
    image: '/assets/france-scene.png',
    imageAlt: 'France Flag Color Challenge',
    titleRibbon: 'FLAG COLOR CHALLENGE',
    regionHotspots: [
      { id: 'left', label: 'France blue stripe', left: '29%', top: '17.5%', width: '14.6%', height: '41%', spark: { x: 36.3, y: 38 } },
      { id: 'middle', label: 'France white stripe', left: '43.6%', top: '17.5%', width: '14.6%', height: '41%', spark: { x: 50.9, y: 38 } },
      { id: 'right', label: 'France red stripe', left: '58.2%', top: '17.5%', width: '14.8%', height: '41%', spark: { x: 65.6, y: 38 } },
    ],
    regionSparkHue: '#ffe08a',
    orbs: [
      { id: 'blue', label: 'Blue', left: '27.6%', hue: '#4aa6ff' },
      { id: 'white', label: 'White', left: '38.6%', hue: '#ffffff' },
      { id: 'red', label: 'Red', left: '49.4%', hue: '#ff5d63' },
      { id: 'yellow', label: 'Yellow', left: '60.3%', hue: '#ffd44a' },
      { id: 'green', label: 'Green', left: '71.1%', hue: '#4ddb7d' },
    ],
    defaultOrbId: 'blue',
    orbTop: '69.5%',
    orbSize: '13cqh',
    nav: [
      { id: 'home', label: 'Home', left: '24.8%' },
      { id: 'passport', label: 'Passport', left: '37.7%' },
      { id: 'collections', label: 'Collections', left: '49.3%' },
      { id: 'settings', label: 'Settings', left: '59.7%' },
    ],
    defaultNavId: 'home',
    navTop: '89%',
    navWidth: '13%',
    navHeight: '11%',
  },
  round: {
    backgroundTagline: 'Paris under a magical sky',
    backgroundAccent: 'Eiffel glow',
    palette: [
      { label: 'Blue', color: '#0055A4' },
      { label: 'White', color: '#FFFFFF' },
      { label: 'Red', color: '#EF4135' },
    ],
    distractors: [
      { label: 'Yellow', color: '#F4C542' },
      { label: 'Green', color: '#3AA655' },
    ],
    regions: [
      { id: 'left', label: 'Left stripe', correctColorIndex: 0, shapes: [{ t: 'rect', x: 0, y: 0, w: 100, h: 200 }] },
      { id: 'middle', label: 'Middle stripe', correctColorIndex: 1, shapes: [{ t: 'rect', x: 100, y: 0, w: 100, h: 200 }] },
      { id: 'right', label: 'Right stripe', correctColorIndex: 2, shapes: [{ t: 'rect', x: 200, y: 0, w: 100, h: 200 }] },
    ],
  },
  celebration: { confettiColors: ['#0055A4', '#FFFFFF', '#EF4135'], particleShape: 'diamond', soundHook: 'victory_france', themeLabel: 'French victory' },
}
