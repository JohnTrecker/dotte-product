import type { Metadata } from 'next'
import { Barlow_Condensed, Barlow, IBM_Plex_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"
import Nav from '@/components/Nav/Nav'
import ScrollRevealInit from '@/components/ScrollRevealInit/ScrollRevealInit'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Dotte Product Product — Vision AI for Manufacturers',
  description:
    'Replace reactive defect management with real-time computer vision. Dotte Product deploys in weeks and pays back in months — not years.',
  openGraph: {
    title: 'Dotte Product — Vision AI for Manufacturers',
    description:
      'Replace reactive defect management with real-time computer vision. Dotte Product deploys in weeks and pays back in months.',
    type: 'website',
    siteName: 'Dotte Product',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dotte Product — Vision AI for Manufacturers',
    description:
      'Replace reactive defect management with real-time computer vision.',
  },
}

const fontClasses = [
  barlowCondensed.variable,
  barlow.variable,
  ibmPlexMono.variable,
].join(' ')

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={fontClasses}>
        <Nav />
        <ScrollRevealInit />
        {children}
        <Analytics/>
      </body>
    </html>
  )
}
