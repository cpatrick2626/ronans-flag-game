import type { CountryChallengeConfig } from './types'

const PORTRAIT_STRIPE_ONE = 105.8
const PORTRAIT_STRIPE_TWO = 195.65

// Landscape presentation geometry measured on the committed 2752x1536 art.
// The blank flag interior spans x 1008-1855 and y 289-1003; its dotted
// dividers sit at x 1302 and 1561.
const LANDSCAPE_STRIPE_ONE = ((1302 - 1008) / (1855 - 1008)) * 300
const LANDSCAPE_STRIPE_TWO = ((1561 - 1008) / (1855 - 1008)) * 300

// France — the validation country for the challenge engine.
// Portrait hotspot geometry is calibrated to /assets/france-scene-v2.png.
export const FRANCE: CountryChallengeConfig = {
  id: 'france',
  iso2: 'FR',
  name: 'France',
  playable: true,
  scene: {
    image: '/assets/france-scene-v2.png',
    imageAlt: 'France Flag Color Challenge',
    titleRibbon: 'FLAG COLOR CHALLENGE',
    // Interior flag envelope measured on the 1520x2688 portrait source:
    // x 306-1341, y 371-1227. The polygon follows its waved top/bottom edges.
    flagOverlay: {
      left: '20.1316%',
      top: '13.8021%',
      width: '68.0921%',
      height: '31.8452%',
      clipPath: 'polygon(0% 6.2%, 9.1% 1.6%, 18.7% 0%, 33.2% 1.1%, 43.9% 4%, 57.4% 7.7%, 71.9% 9.9%, 86.4% 9.1%, 96% 6.7%, 100% 5.7%, 100% 95.7%, 96% 97.3%, 86.4% 98.8%, 71.9% 100%, 57.4% 98.2%, 43.9% 94.9%, 33.2% 92.4%, 18.7% 91.2%, 9.1% 92.8%, 0% 96.3%)',
      preserveBlankArtwork: true,
    },
    regionSparkHue: '#ffe08a',
    orbs: [
      { id: 'blue', label: 'Blue', left: '17.7%', hue: '#4aa6ff' },
      { id: 'white', label: 'White', left: '33.9%', hue: '#ffffff' },
      { id: 'red', label: 'Red', left: '50.1%', hue: '#ff5d63' },
      { id: 'yellow', label: 'Yellow', left: '66.3%', hue: '#ffd44a' },
      { id: 'green', label: 'Green', left: '82.3%', hue: '#4ddb7d' },
    ],
    defaultOrbId: 'blue',
    orbTop: '84.25%',
    orbSize: '11cqw',
    nav: [
      { id: 'home', label: 'Home', left: '30.2%' },
      { id: 'passport', label: 'Passport', left: '43.4%' },
      { id: 'collections', label: 'Collections', left: '59.2%' },
      { id: 'settings', label: 'Settings', left: '71.6%' },
    ],
    defaultNavId: 'home',
    navTop: '95%',
    navWidth: '13%',
    navHeight: '10%',
  },
  landscape: {
    image: '/assets/france-scene-landscape-v1.png',
    flagOverlay: {
      left: `${(1008 / 2752) * 100}%`,
      top: `${(289 / 1536) * 100}%`,
      width: `${((1855 - 1008) / 2752) * 100}%`,
      height: `${((1003 - 289) / 1536) * 100}%`,
      clipPath: 'polygon(0% 5%, 5.9% 2.7%, 11.8% 1.3%, 17.7% 1%, 23.6% 0.3%, 29.5% 0.8%, 35.4% 2%, 41.3% 3.6%, 47.2% 5.3%, 53.1% 7%, 59% 8.4%, 64.9% 9.8%, 70.8% 10.4%, 76.7% 10.4%, 82.6% 10.1%, 88.5% 9.1%, 94.5% 7.7%, 100% 6%, 100% 94.7%, 94.5% 96.9%, 88.5% 98.5%, 82.6% 99.4%, 76.7% 99.9%, 70.8% 99.9%, 64.9% 99.9%, 59% 98.5%, 53.1% 97.2%, 47.2% 95.7%, 41.3% 94.1%, 35.4% 92.7%, 29.5% 91.7%, 23.6% 91%, 17.7% 91.2%, 11.8% 91.9%, 5.9% 93.1%, 0% 95.5%)',
      preserveBlankArtwork: true,
    },
    regions: [
      { id: 'left', label: 'France blue stripe', correctColorIndex: 0, shapes: [{ t: 'rect', x: 0, y: 0, w: LANDSCAPE_STRIPE_ONE, h: 200 }] },
      { id: 'middle', label: 'France white stripe', correctColorIndex: 1, shapes: [{ t: 'rect', x: LANDSCAPE_STRIPE_ONE, y: 0, w: LANDSCAPE_STRIPE_TWO - LANDSCAPE_STRIPE_ONE, h: 200 }] },
      { id: 'right', label: 'France red stripe', correctColorIndex: 2, shapes: [{ t: 'rect', x: LANDSCAPE_STRIPE_TWO, y: 0, w: 300 - LANDSCAPE_STRIPE_TWO, h: 200 }] },
    ],
    orbLefts: ['30%', '36%', '42%', '48%', '54%'],
    navLefts: ['66%', '74%', '82%', '90%'],
    orbTop: '84.7%',
    navTop: '84.7%',
    navWidth: '6.5%',
    navHeight: '9%',
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
      // The v2 art's dotted dividers are x 671 and x 981, which map to
      // 105.8 and 195.65 inside the measured overlay's 0-300 viewBox.
      { id: 'left', label: 'France blue stripe', correctColorIndex: 0, shapes: [{ t: 'rect', x: 0, y: 0, w: PORTRAIT_STRIPE_ONE, h: 200 }] },
      { id: 'middle', label: 'France white stripe', correctColorIndex: 1, shapes: [{ t: 'rect', x: PORTRAIT_STRIPE_ONE, y: 0, w: PORTRAIT_STRIPE_TWO - PORTRAIT_STRIPE_ONE, h: 200 }] },
      { id: 'right', label: 'France red stripe', correctColorIndex: 2, shapes: [{ t: 'rect', x: PORTRAIT_STRIPE_TWO, y: 0, w: 300 - PORTRAIT_STRIPE_TWO, h: 200 }] },
    ],
  },
  celebration: { confettiColors: ['#0055A4', '#FFFFFF', '#EF4135'], particleShape: 'diamond', soundHook: 'victory_france', themeLabel: 'French victory' },
}
