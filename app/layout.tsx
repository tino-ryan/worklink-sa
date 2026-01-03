// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WorkLink SA - Find Workers Near You',
  description: 'Connect with trusted workers in South Africa. Get help with gardening, cleaning, plumbing, and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'WorkLink SA',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'WorkLink SA',
    title: 'WorkLink SA - Find Workers Near You',
    description: 'Connect with trusted workers in South Africa',
  },
  twitter: {
    card: 'summary',
    title: 'WorkLink SA - Find Workers Near You',
    description: 'Connect with trusted workers in South Africa',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#059669',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="WorkLink" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}