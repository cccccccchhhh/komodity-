import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgriIntel — Agricultural Intelligence Platform',
  description: 'Sistem rekomendasi komoditas pertanian berbasis ML forecast cuaca & demand',
  keywords: ['pertanian', 'machine learning', 'forecasting', 'Indonesia', 'komoditas'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  )
}
