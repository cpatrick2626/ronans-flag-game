import type { CountryChallengeConfig } from './types'

// Portrait hotspot geometry is calibrated to /assets/italy-scene-v2.png
// (3072x5504): the inked flag border encloses x 608-2740, y 776-2531 and the
// dotted dividers sit at x 1354 and 2002.
const PORTRAIT_STRIPE_ONE = ((1354 - 608) / (2740 - 608)) * 300
const PORTRAIT_STRIPE_TWO = ((2002 - 608) / (2740 - 608)) * 300

// Landscape geometry is calibrated to /assets/italy-scene-landscape-v1.png
// (5504x3072): the inked flag border encloses x 2009-3743, y 576-2002 and
// the dotted dividers sit at x 2626 and 3143.
const LANDSCAPE_STRIPE_ONE = ((2626 - 2009) / (3743 - 2009)) * 300
const LANDSCAPE_STRIPE_TWO = ((3143 - 2009) / (3743 - 2009)) * 300

// Italy — second playable country, wired entirely through the shared
// challenge engine. Same three-vertical-stripe structure as France:
// green (left) / white (middle) / red (right).
export const ITALY: CountryChallengeConfig = {
  id: 'italy',
  iso2: 'IT',
  name: 'Italy',
  playable: true,
  scene: {
    image: '/assets/italy-scene-v2.png',
    imageAlt: 'Italy Flag Color Challenge',
    titleRibbon: 'FLAG COLOR CHALLENGE',
    flagOverlay: {
      left: `${(608 / 3072) * 100}%`,
      top: `${(776 / 5504) * 100}%`,
      width: `${((2740 - 608) / 3072) * 100}%`,
      height: `${((2531 - 776) / 5504) * 100}%`,
      clipPath: 'polygon(0% 1.7%, 5.6% 0.8%, 11.1% 0.2%, 16.7% 0.7%, 22.2% 0%, 27.8% 0%, 33.3% 0.6%, 38.9% 1.9%, 44.4% 3.3%, 50% 5.1%, 55.6% 6.7%, 61.1% 8.1%, 66.7% 9.1%, 72.2% 10%, 77.8% 10.1%, 83.3% 10%, 88.9% 9.1%, 94.4% 7.9%, 100% 7.1%, 100% 98.2%, 94.4% 99.1%, 88.9% 99.4%, 83.3% 99.7%, 77.8% 100%, 72.2% 99.8%, 66.7% 99.4%, 61.1% 98.7%, 55.6% 97.4%, 50% 96%, 44.4% 94.4%, 38.9% 93%, 33.3% 91.9%, 27.8% 91.2%, 22.2% 91.1%, 16.7% 91.6%, 11.1% 91.3%, 5.6% 91.7%, 0% 92.3%)',
      preserveBlankArtwork: true,
    },
    regionSparkHue: '#ffe08a',
    orbs: [
      { id: 'green', label: 'Green', left: '17.7%', hue: '#4ddb7d' },
      { id: 'white', label: 'White', left: '33.9%', hue: '#ffffff' },
      { id: 'red', label: 'Red', left: '50.1%', hue: '#ff5d63' },
      { id: 'yellow', label: 'Yellow', left: '66.3%', hue: '#ffd44a' },
      { id: 'blue', label: 'Blue', left: '82.3%', hue: '#4aa6ff' },
    ],
    defaultOrbId: 'green',
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
    image: '/assets/italy-scene-landscape-v1.png',
    flagOverlay: {
      left: `${(2009 / 5504) * 100}%`,
      top: `${(576 / 3072) * 100}%`,
      width: `${((3743 - 2009) / 5504) * 100}%`,
      height: `${((2002 - 576) / 3072) * 100}%`,
      clipPath: 'polygon(0% 1.7%, 5.6% 0.6%, 11.1% 0.1%, 16.7% 0.7%, 22.2% 0%, 27.8% 0.1%, 33.3% 0.7%, 38.9% 1.8%, 44.4% 3.4%, 50% 5%, 55.6% 6.7%, 61.1% 8.1%, 66.7% 9.3%, 72.2% 10%, 77.8% 10.1%, 83.3% 9.8%, 88.9% 9.1%, 94.4% 8.5%, 100% 7.9%, 100% 98.1%, 94.4% 98.6%, 88.9% 99%, 83.3% 99.6%, 77.8% 100%, 72.2% 100%, 66.7% 99.4%, 61.1% 98.7%, 55.6% 97.6%, 50% 96.1%, 44.4% 94.5%, 38.9% 93.1%, 33.3% 92%, 27.8% 91.3%, 22.2% 91.2%, 16.7% 91.7%, 11.1% 91.3%, 5.6% 91.8%, 0% 92.5%)',
      preserveBlankArtwork: true,
    },
    regions: [
      { id: 'left', label: 'Italy green stripe', correctColorIndex: 0, shapes: [{ t: 'rect', x: 0, y: 0, w: LANDSCAPE_STRIPE_ONE, h: 200 }] },
      { id: 'middle', label: 'Italy white stripe', correctColorIndex: 1, shapes: [{ t: 'rect', x: LANDSCAPE_STRIPE_ONE, y: 0, w: LANDSCAPE_STRIPE_TWO - LANDSCAPE_STRIPE_ONE, h: 200 }] },
      { id: 'right', label: 'Italy red stripe', correctColorIndex: 2, shapes: [{ t: 'rect', x: LANDSCAPE_STRIPE_TWO, y: 0, w: 300 - LANDSCAPE_STRIPE_TWO, h: 200 }] },
    ],
    orbLefts: ['30%', '36%', '42%', '48%', '54%'],
    navLefts: ['66%', '74%', '82%', '90%'],
    orbTop: '84.7%',
    navTop: '84.7%',
    navWidth: '6.5%',
    navHeight: '9%',
  },
  round: {
    backgroundTagline: 'Rome under a magical sky',
    backgroundAccent: 'Colosseum glow',
    palette: [
      { label: 'Green', color: '#009246' },
      { label: 'White', color: '#FFFFFF' },
      { label: 'Red', color: '#CE2B37' },
    ],
    distractors: [
      { label: 'Yellow', color: '#F4C542' },
      { label: 'Blue', color: '#0055A4' },
    ],
    regions: [
      { id: 'left', label: 'Italy green stripe', correctColorIndex: 0, shapes: [{ t: 'rect', x: 0, y: 0, w: PORTRAIT_STRIPE_ONE, h: 200 }] },
      { id: 'middle', label: 'Italy white stripe', correctColorIndex: 1, shapes: [{ t: 'rect', x: PORTRAIT_STRIPE_ONE, y: 0, w: PORTRAIT_STRIPE_TWO - PORTRAIT_STRIPE_ONE, h: 200 }] },
      { id: 'right', label: 'Italy red stripe', correctColorIndex: 2, shapes: [{ t: 'rect', x: PORTRAIT_STRIPE_TWO, y: 0, w: 300 - PORTRAIT_STRIPE_TWO, h: 200 }] },
    ],
  },
  celebration: { confettiColors: ['#009246', '#FFFFFF', '#CE2B37'], particleShape: 'diamond', soundHook: 'victory_italy', themeLabel: 'Italian victory' },
}
