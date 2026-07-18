import type { CountryChallengeConfig } from './types'

const PORTRAIT_STRIPE_ONE = 105.8
const PORTRAIT_STRIPE_TWO = 195.65

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
