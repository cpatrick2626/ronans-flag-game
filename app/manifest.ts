import type { MetadataRoute } from 'next'

// Served by Next at /manifest.webmanifest and linked from every page automatically.
// No service worker: the game stays online-only, so a stale cache can never pin an old build.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: "Ronan's Flag Game",
    short_name: "Ronan's Flags",
    description: 'A colorful flag coloring game with progress, multiplayer, and country discovery.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    // Matches the body background so the launch splash flows straight into the game.
    background_color: '#030508',
    theme_color: '#030508',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
