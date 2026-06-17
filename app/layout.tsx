import type { Metadata } from 'next'
import { JetBrains_Mono, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Ronan's Flag Game",
  description: 'A flag coloring game where you complete countries, earn rewards, and track progress.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`bg-[#030508] text-[#C4D0DE] antialiased ${jetbrainsMono.variable} ${barlowCondensed.variable}`}>
        {children}
      </body>
    </html>
  )
}
