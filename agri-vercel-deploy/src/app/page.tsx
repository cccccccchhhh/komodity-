'use client'

import { useState, useEffect, useCallback } from 'react'
import HomeTab from '@/components/HomeTab'
import AnalisisTab from '@/components/AnalisisTab'
import type { KabupatenListItem } from '@/lib/types'

export default function Page() {
  const [activeTab, setActiveTab] = useState<'home' | 'analisis'>('home')
  const [kabList, setKabList] = useState<KabupatenListItem[]>([])

  useEffect(() => {
    fetch('/data/kabupaten_list.json')
      .then(r => r.json())
      .then(setKabList)
  }, [])

  const goAnalisis = useCallback(() => setActiveTab('analisis'), [])

  return (
    <div className="min-h-screen" style={{ background: '#0a0f0a' }}>
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
           style={{ background: 'rgba(10,15,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
               style={{ background: 'linear-gradient(135deg,#166534,#16a34a)' }}>
            🌾
          </div>
          <span className="font-bold text-lg" style={{ color: '#86efac' }}>AgriIntel</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(22,163,74,0.15)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.25)' }}>
            ML Pipeline
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl"
             style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['home','analisis'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={activeTab === tab
                ? { background: 'linear-gradient(135deg,#166534,#16a34a)', color: '#fff', boxShadow: '0 0 16px rgba(22,163,74,0.35)' }
                : { color: 'rgba(240,253,244,0.5)' }}>
              {tab === 'home' ? '🏠 Home' : '🔬 Analisis Wilayah'}
            </button>
          ))}
        </div>

        {/* Stats badge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'rgba(240,253,244,0.4)' }}>Total Kabupaten</div>
            <div className="text-sm font-bold" style={{ color: '#86efac' }}>{kabList.length.toLocaleString()}</div>
          </div>
          <div className="w-2 h-2 rounded-full glow-dot" style={{ background: '#22c55e' }} />
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="pt-[72px]">
        {activeTab === 'home'
          ? <HomeTab kabList={kabList} onGoAnalisis={goAnalisis} />
          : <AnalisisTab kabList={kabList} />}
      </div>
    </div>
  )
}
