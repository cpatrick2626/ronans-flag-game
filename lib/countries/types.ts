// Typed country challenge model.
// A country becomes playable in the Flag Color Challenge by providing one
// CountryChallengeConfig and its scene assets — no gameplay code changes.

export type CompletionSoundHook = 'button_click' | 'correct_fill' | 'wrong_fill' | 'stamp_thump' | 'country_complete' | 'arrival_theme' | 'home_theme' | 'victory_default' | 'victory_france' | 'victory_japan' | 'victory_brazil' | 'victory_egypt'

export type CelebrationProfile = { confettiColors: string[]; particleShape: 'dot' | 'petal' | 'diamond'; soundHook: CompletionSoundHook; themeLabel?: string }

export type PaletteEntry = { label: string; color: string }

export type FlagShape = { t: 'rect' | 'circle' | 'polygon'; x?: number; y?: number; w?: number; h?: number; rx?: number; cx?: number; cy?: number; r?: number; points?: string }

// Hold-to-fill coloring choreography families. Direction variants (e.g. the
// sweep corner or axis reverse) are chosen at random per region per attempt.
export type FillPatternId = 'vertical' | 'horizontal' | 'diagonal' | 'perimeter'

export type FlagRegionConfig = {
  id: string
  label: string
  correctColorIndex: number
  shapes: FlagShape[]
}

// Interactive flag overlay placed over the baked flag in the scene artwork.
// left/top/width/height are percentages of the scene image (top-left origin);
// the overlay conceals the painted flag and hosts the colorable SVG regions.
export type SceneFlagOverlay = {
  left: string
  top: string
  width: string
  height: string
  // Optional silhouette for non-rectangular painted flags. Existing scenes
  // remain rectangular when this is omitted.
  clipPath?: string
  // Preserve a blank flag already painted into the source art until regions
  // are colored. Existing scenes keep the current opaque SVG base by default.
  preserveBlankArtwork?: boolean
}

export type SceneOrb = { id: string; label: string; left: string; hue: string }

export type SceneNavItem = { id: string; label: string; left: string }

// Asset-first gameplay scene: one painted image plus invisible hotspots.
export type ChallengeScene = {
  image: string
  imageAlt: string
  titleRibbon: string
  flagOverlay: SceneFlagOverlay
  regionSparkHue: string
  orbs: SceneOrb[]
  defaultOrbId: string
  orbTop: string
  orbSize: string
  nav: SceneNavItem[]
  defaultNavId: string
  navTop: string
  navWidth: string
  navHeight: string
}

// Flag-round data (palette, distractors, correct region colors).
export type FlagRound = {
  backgroundTagline: string
  backgroundAccent: string
  palette: PaletteEntry[]
  distractors: PaletteEntry[]
  regions: FlagRegionConfig[]
  // Continuous hold time (ms) for one region to fill top-to-bottom. Default 1400.
  fillDurationMs?: number
  // Allowed hold-to-fill patterns for this round's regions. Defaults to all
  // pattern families; existing configs need no change.
  fillPatterns?: FillPatternId[]
  // Phase 1 "draw the lines" continuous hold time (ms) before coloring
  // unlocks. Default 1200. Harder variants (per-line draws, path tracing)
  // will extend this config later; existing configs need no change.
  lineDrawMs?: number
}

// Pin hitbox on the home map reference image. selectable=false pins
// (e.g. Mystery) render but do not change the active country.
export type MapPin = {
  code: string
  label: string
  x: string
  y: string
  tone: string
  selectable: boolean
}

export type CountryChallengeConfig = {
  id: string
  iso2: string
  name: string
  playable: boolean
  scene: ChallengeScene
  round: FlagRound
  celebration: CelebrationProfile
}
