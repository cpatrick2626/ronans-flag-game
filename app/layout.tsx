import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Ronan's Flag Game",
  applicationName: "Ronan's Flag Game",
  description: 'A colorful flag coloring game with progress, multiplayer, and country discovery.',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  // iOS home-screen launch: no Safari chrome; the translucent status bar lets the art run
  // under it while the app shell's safe-area padding keeps controls clear.
  appleWebApp: {
    capable: true,
    title: "Ronan's Flags",
    statusBarStyle: 'black-translucent',
  },
}

// viewportFit: 'cover' lets the backdrop extend under notches/home indicators;
// content stays clear of them via the env(safe-area-inset-*) padding in globals.css.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#030508',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-[#030508] text-[#f4ead9] antialiased ${inter.variable} ${cormorantGaramond.variable}`}>
        {children}
      </body>
    </html>
  )
}
