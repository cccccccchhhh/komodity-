'use client'

import { useEffect, useState } from 'react'
import type { KabupatenListItem } from '@/lib/types'

interface Props {
  kabList: KabupatenListItem[]
  onGoAnalisis: () => void
}

const PIPELINE_STEPS = [
  { icon: '🌤️', label: 'SARIMAX + ONI', sub: 'Forecast curah hujan & kelembapan 12 bulan per kabupaten' },
  { icon: '🌱', label: 'Multi-label RF', sub: 'Klasifikasi komoditas cocok berdasarkan iklim & pH tanah' },
  { icon: '📈', label: 'Linear Trend', sub: 'Forecast demand nasional & per wilayah 28 komoditas' },
  { icon: '🎯', label: 'Decision Engine', sub: 'Gabungkan kesesuaian iklim + demand → rekomendasi final' },
]

const KOMODITAS_SAMPLE = ['Kangkung','Tomat','Bayam','Mangga','Padi','Jagung','Terong','Wortel','Bawang Merah','Durian','Pepaya','Semangka']

const STATS = [
  { value: '491', label: 'Kabupaten/Kota', icon: '🗺️' },
  { value: '24', label: 'Komoditas Terklasifikasi', icon: '🌾' },
  { value: '12 bln', label: 'Horizon Forecast', icon: '📅' },
  { value: 'F1 ≥ 0.95', label: 'Akurasi Klasifikasi', icon: '🎯' },
]

export default function HomeTab({ kabList, onGoAnalisis }: Props) {
  const [typed, setTyped] = useState('')
  const fullText = 'Rekomendasi Komoditas Pertanian'
  const [show, setShow] = useState(false)

  // Typewriter
  useEffect(() => {
    setShow(false)
    setTyped('')
    let i = 0
    const t = setTimeout(() => {
      setShow(true)
      const iv = setInterval(() => {
        setTyped(fullText.slice(0, ++i))
        if (i >= fullText.length) clearInterval(iv)
      }, 55)
      return () => clearInterval(iv)
    }, 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-gradient relative overflow-hidden min-h-[92vh] flex flex-col items-center justify-center px-6 text-center">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
               style={{ background: 'radial-gradient(circle, #16a34a, transparent)', filter: 'blur(60px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
               style={{ background: 'radial-gradient(circle, #ca8a04, transparent)', filter: 'blur(80px)' }} />
        </div>

        {/* Floating komoditas pills */}
        <div className="absolute inset-0 pointer-events-none">
          {KOMODITAS_SAMPLE.map((k, i) => (
            <div key={k}
                 className="absolute text-xs px-3 py-1 rounded-full font-medium opacity-30"
                 style={{
                   background: 'rgba(22,163,74,0.15)',
                   border: '1px solid rgba(22,163,74,0.2)',
                   color: '#86efac',
                   top: `${10 + (i * 7.5) % 80}%`,
                   left: `${(i % 2 === 0 ? 2 : 88) + (i * 1.3) % 8}%`,
                   transform: `rotate(${i % 2 === 0 ? -8 : 8}deg)`,
                 }}>
              {k}
            </div>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
               style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.25)', color: '#86efac' }}>
            <span className="w-2 h-2 rounded-full glow-dot" style={{ background: '#22c55e' }} />
            Machine Learning Pipeline · 491 Kabupaten Indonesia
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span style={{ color: '#f0fdf4' }}>Sistem Cerdas</span>
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #22c55e, #86efac, #4ade80)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {show ? typed : ''}
              {show && typed.length < fullText.length && <span className="cursor">|</span>}
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
             style={{ color: 'rgba(240,253,244,0.55)' }}>
            Forecast iklim 12 bulan · Klasifikasi komoditas dengan ML ·
            Analisis demand 28 komoditas · Saran distribusi ke pasar terbaik
          </p>

          {/* CTA */}
          <button
            onClick={onGoAnalisis}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #166534, #16a34a)',
              boxShadow: '0 0 40px rgba(22,163,74,0.35), 0 4px 24px rgba(0,0,0,0.4)',
              color: '#fff',
            }}>
            🔬 Analisis Wilayah Saya
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
             style={{ color: 'rgba(240,253,244,0.3)' }}>
          <span className="text-xs">Scroll untuk selengkapnya</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="stat-card rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black mb-1"
                   style={{ background: 'linear-gradient(135deg,#22c55e,#86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {s.value}
              </div>
              <div className="text-sm" style={{ color: 'rgba(240,253,244,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PIPELINE STEPS ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4" style={{ color: '#f0fdf4' }}>
            Bagaimana Pipeline Bekerja?
          </h2>
          <p className="text-center mb-12 text-base" style={{ color: 'rgba(240,253,244,0.45)' }}>
            4 tahap analitik dari raw data cuaca hingga rekomendasi siap tanam
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="relative">
                {/* Connector */}
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 z-0"
                       style={{ background: 'linear-gradient(90deg, rgba(22,163,74,0.4), rgba(22,163,74,0.1))', marginLeft: '12px', width: 'calc(100% - 24px)' }} />
                )}
                <div className="glass-card-green rounded-2xl p-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                       style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.2)' }}>
                    {step.icon}
                  </div>
                  <div className="text-xs font-bold mb-1" style={{ color: '#4ade80' }}>STEP {i + 1}</div>
                  <div className="font-bold mb-2 text-sm" style={{ color: '#f0fdf4' }}>{step.label}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(240,253,244,0.5)' }}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KABUPATEN COUNTER ── */}
      <section className="py-16 px-6 mb-8">
        <div className="max-w-5xl mx-auto glass-card rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(22,163,74,0.06), transparent)' }} />
          <div className="relative">
            <div className="text-6xl font-black mb-3"
                 style={{ background: 'linear-gradient(135deg,#22c55e,#86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {kabList.length}
            </div>
            <div className="text-xl font-semibold mb-2" style={{ color: '#f0fdf4' }}>
              Kabupaten & Kota Teranalisis
            </div>
            <div className="text-sm mb-8" style={{ color: 'rgba(240,253,244,0.45)' }}>
              dari Sabang hingga Merauke — semua tersedia dalam sistem
            </div>
            <button
              onClick={onGoAnalisis}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg,#166534,#16a34a)', color: '#fff', boxShadow: '0 0 20px rgba(22,163,74,0.3)' }}>
              Cari Kabupaten Anda →
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
