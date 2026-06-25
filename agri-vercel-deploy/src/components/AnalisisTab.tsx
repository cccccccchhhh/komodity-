'use client'

import { useState, useEffect, useRef } from 'react'
import type { KabupatenListItem, KabupatenData } from '@/lib/types'
import { getPhCategory, getChCategory } from '@/lib/data'
import WeatherChart from './WeatherChart'
import DemandChart from './DemandChart'

interface Props { kabList: KabupatenListItem[] }

const GRUP_COLOR: Record<string, string>  = { Sayuran:'#22c55e', Buah:'#f97316', Padi:'#eab308' }
const GRUP_BG:    Record<string, string>  = { Sayuran:'rgba(34,197,94,0.12)', Buah:'rgba(249,115,22,0.12)', Padi:'rgba(234,179,8,0.12)' }

export default function AnalisisTab({ kabList }: Props) {
  const [query, setQuery]         = useState('')
  const [suggestions, setSuggestions] = useState<KabupatenListItem[]>([])
  const [selected, setSelected]   = useState<KabupatenListItem | null>(null)
  const [data, setData]           = useState<KabupatenData | null>(null)
  const [loading, setLoading]     = useState(false)
  const [showDrop, setShowDrop]   = useState(false)
  const [allData, setAllData]     = useState<Record<string, KabupatenData>>({})
  const inputRef = useRef<HTMLInputElement>(null)

  // Preload all data once
  useEffect(() => {
    fetch('/data/kabupaten_data.json').then(r => r.json()).then(setAllData)
  }, [])

  // Search suggestions
  useEffect(() => {
    if (!query || query.length < 2) { setSuggestions([]); return }
    const q = query.toUpperCase()
    setSuggestions(kabList.filter(k => k.nama_kab.toUpperCase().includes(q) || k.provinsi?.toUpperCase().includes(q)).slice(0, 8))
    setShowDrop(true)
  }, [query, kabList])

  const handleSelect = (kab: KabupatenListItem) => {
    setSelected(kab)
    setQuery(kab.nama_kab)
    setShowDrop(false)
    setLoading(true)
    setData(null)
    setTimeout(() => {
      const found = allData[kab.nama_kab.toUpperCase()]
      setData(found ?? null)
      setLoading(false)
    }, 300)
  }

  // Recompute when allData loads
  useEffect(() => {
    if (selected && Object.keys(allData).length > 0 && !data) {
      const found = allData[selected.nama_kab.toUpperCase()]
      setData(found ?? null)
      setLoading(false)
    }
  }, [allData, selected, data])

  const clear = () => { setQuery(''); setSelected(null); setData(null); setSuggestions([]) }

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* Search header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black mb-3" style={{ color: '#f0fdf4' }}>Analisis Wilayah</h2>
        <p className="text-sm" style={{ color: 'rgba(240,253,244,0.45)' }}>
          Masukkan nama kabupaten atau kota untuk melihat analisis lengkap
        </p>
      </div>

      {/* Search box */}
      <div className="max-w-xl mx-auto relative mb-12">
        <div className="relative flex items-center">
          <span className="absolute left-4 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(null); setData(null) }}
            onFocus={() => suggestions.length && setShowDrop(true)}
            placeholder="Cari kabupaten / kota..."
            className="w-full pl-11 pr-10 py-4 rounded-2xl text-base search-input"
          />
          {query && (
            <button onClick={clear} className="absolute right-4 text-lg opacity-50 hover:opacity-100 transition-opacity">✕</button>
          )}
        </div>

        {/* Dropdown suggestions */}
        {showDrop && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50 shadow-2xl"
               style={{ background: '#111a11', border: '1px solid rgba(22,163,74,0.2)' }}>
            {suggestions.map(kab => (
              <button
                key={kab.kode_kab}
                onClick={() => handleSelect(kab)}
                className="w-full text-left px-5 py-3 flex items-center justify-between transition-colors hover:bg-green-900/30">
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#f0fdf4' }}>{kab.nama_kab}</div>
                  <div className="text-xs" style={{ color: 'rgba(240,253,244,0.4)' }}>{kab.provinsi}</div>
                </div>
                <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-t-green-500" style={{ borderColor: 'rgba(22,163,74,0.2)', borderTopColor: '#16a34a', animation: 'spin 0.8s linear infinite' }} />
            <div className="text-sm" style={{ color: 'rgba(240,253,244,0.4)' }}>Memuat analisis...</div>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && !data && !selected && (
        <div className="text-center py-16 glass-card rounded-3xl max-w-lg mx-auto">
          <div className="text-6xl mb-4">🗺️</div>
          <div className="text-lg font-semibold mb-2" style={{ color: '#f0fdf4' }}>Cari Kabupaten</div>
          <div className="text-sm" style={{ color: 'rgba(240,253,244,0.4)' }}>
            Ketik nama kabupaten atau kota di atas untuk memulai analisis
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['Kota Malang','Badung','Jayapura','Aceh Besar','Bogor'].map(nama => (
              <button key={nama}
                      onClick={() => { setQuery(nama); const k = kabList.find(x => x.nama_kab.toUpperCase().includes(nama.toUpperCase())); if(k) handleSelect(k) }}
                      className="px-3 py-1.5 rounded-full text-xs transition-all hover:scale-105"
                      style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)', color: '#86efac' }}>
                {nama}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HASIL ANALISIS */}
      {!loading && data && (
        <div className="space-y-6">
          {/* Header kabupaten */}
          <div className="glass-card-green rounded-3xl p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'rgba(240,253,244,0.4)' }}>
                  {data.provinsi}
                </div>
                <h3 className="text-3xl font-black" style={{ color: '#f0fdf4' }}>{data.nama_kab}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <StatPill icon="🧪" label="pH Tanah" value={`${data.ph} — ${getPhCategory(data.ph)}`} />
                <StatPill icon="🌧️" label="CH/Tahun" value={`${data.ch_tahunan_mm?.toFixed(0)} mm (${getChCategory(data.ch_tahunan_mm)})`} />
                <StatPill icon="💧" label="Kelembapan" value={`${data.kelembaban_mean}%`} />
              </div>
            </div>
          </div>

          {/* ─ Forecast Cuaca ─ */}
          <Section title="1 · Forecast Cuaca 12 Bulan" icon="🌤️"
                   sub={`Model SARIMAX + ONI · Horizon: Jan–Des ${new Date().getFullYear() + 1}`}>
            <div className="glass-card rounded-2xl p-6">
              <WeatherChart data={data.forecast_cuaca} />
            </div>
          </Section>

          {/* ─ Klasifikasi ML ─ */}
          <Section title="2 · Klasifikasi Komoditas (ML)" icon="🌱"
                   sub="Multi-label Random Forest · F1 Macro ≥ 0.95">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <div className="text-xs font-bold mb-3" style={{ color: '#4ade80' }}>
                  COCOK SECARA IKLIM & TANAH ({data.komoditas_cocok_ml.length} komoditas)
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.komoditas_cocok_ml.length > 0
                    ? data.komoditas_cocok_ml.map(k => <KomBadge key={k} nama={k} type="neutral" />)
                    : <span className="text-sm" style={{ color: 'rgba(240,253,244,0.4)' }}>Tidak ada komoditas cocok</span>}
                </div>
              </div>
              <div className="space-y-3">
                <div className="glass-card rounded-2xl p-5">
                  <div className="text-xs font-bold mb-3" style={{ color: '#4ade80' }}>LAYAK DITANAM ✅ (demand naik)</div>
                  <div className="flex flex-wrap gap-2">
                    {data.rekomendasi_tanam.length > 0
                      ? data.rekomendasi_tanam.map(k => <KomBadge key={k} nama={k} type="green" />)
                      : <span className="text-sm" style={{ color: 'rgba(240,253,244,0.4)' }}>—</span>}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <div className="text-xs font-bold mb-3" style={{ color: '#f87171' }}>JANGAN DITANAM ❌ (demand turun)</div>
                  <div className="flex flex-wrap gap-2">
                    {data.cocok_tapi_demand_turun.length > 0
                      ? data.cocok_tapi_demand_turun.map(k => <KomBadge key={k} nama={k} type="red" />)
                      : <span className="text-sm" style={{ color: 'rgba(240,253,244,0.4)' }}>—</span>}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ─ Demand Grand ─ */}
          {Object.keys(data.demand_grand).length > 0 && (
            <Section title="3 · Forecast Demand Nasional" icon="📈"
                     sub="Linear Trend per komoditas · Forecast 2025–2027 (kg/kapita/tahun)">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(data.demand_grand).map(([kom, d]) => (
                  <div key={kom} className="glass-card rounded-2xl p-5">
                    <DemandChart komoditas={kom} data={d} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ─ Saran Distribusi ─ */}
          {Object.keys(data.saran_distribusi).length > 0 && (
            <Section title="4 · Saran Distribusi" icon="📦"
                     sub="Wilayah dengan demand tertinggi untuk komoditas yang direkomendasikan">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(data.saran_distribusi).map(([kom, wilayas]) => (
                  <div key={kom} className="glass-card rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">🌾</span>
                      <span className="font-semibold text-sm" style={{ color: '#f0fdf4' }}>{kom}</span>
                    </div>
                    <div className="space-y-2">
                      {wilayas.map((w, i) => (
                        <div key={w} className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: 'rgba(22,163,74,0.2)', color: '#4ade80' }}>{i + 1}</span>
                          <span className="text-sm" style={{ color: 'rgba(240,253,244,0.7)' }}>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ─ Summary Text ─ */}
          <div className="glass-card-green rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                   style={{ background: 'rgba(22,163,74,0.2)' }}>📋</div>
              <h4 className="font-bold" style={{ color: '#86efac' }}>Ringkasan Analisis</h4>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(240,253,244,0.75)', lineHeight: '1.8' }}>
              {data.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ── */
function Section({ title, icon, sub, children }: { title: string; icon: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{icon}</span>
        <div>
          <h4 className="font-bold" style={{ color: '#f0fdf4' }}>{title}</h4>
          <p className="text-xs" style={{ color: 'rgba(240,253,244,0.4)' }}>{sub}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
         style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span>{icon}</span>
      <div>
        <div className="text-xs" style={{ color: 'rgba(240,253,244,0.4)' }}>{label}</div>
        <div className="text-sm font-semibold" style={{ color: '#f0fdf4' }}>{value}</div>
      </div>
    </div>
  )
}

function KomBadge({ nama, type }: { nama: string; type: 'green' | 'red' | 'neutral' }) {
  const styles = {
    green:   { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.25)',   color: '#86efac' },
    red:     { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   color: '#fca5a5' },
    neutral: { bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)', color: '#cbd5e1' },
  }[type]
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ background: styles.bg, border: `1px solid ${styles.border}`, color: styles.color }}>
      {nama}
    </span>
  )
}
