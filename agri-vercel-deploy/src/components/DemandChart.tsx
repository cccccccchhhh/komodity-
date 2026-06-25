'use client'

import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import type { DemandGrandData } from '@/lib/types'
import { GRUP_COLOR } from '@/lib/data'

interface Props {
  komoditas: string
  data: DemandGrandData
}

export default function DemandChart({ komoditas, data }: Props) {
  const color = GRUP_COLOR[data.grup] ?? '#94a3b8'

  // Merge historis + forecast
  const histPoints = data.tahun.map((t, i) => ({ tahun: t, aktual: +data.nilai[i].toFixed(4) }))
  const fcPoints   = data.tahun_fc.map((t, i) => ({ tahun: t, forecast: +data.nilai_fc[i].toFixed(4) }))

  // Bridge: last history point masuk ke forecast juga untuk garis nyambung
  if (histPoints.length && fcPoints.length) {
    fcPoints.unshift({ tahun: histPoints[histPoints.length - 1].tahun, forecast: histPoints[histPoints.length - 1].aktual })
  }

  const allSet = new Set([...histPoints.map(d => d.tahun), ...fcPoints.map(d => d.tahun)])
  const allTahun = Array.from(allSet).sort()
  const chartData = allTahun.map(t => ({
    tahun: t,
    aktual:   histPoints.find(d => d.tahun === t)?.aktual,
    forecast: fcPoints.find(d => d.tahun === t)?.forecast,
  }))

  const fcStart = data.tahun_fc[0]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl p-3 text-sm" style={{ background: '#1a2e1a', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="font-bold mb-1" style={{ color }}>{label}</div>
        {payload.map((p: any) => (
          p.value != null && (
            <div key={p.dataKey} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span style={{ color: 'rgba(240,253,244,0.6)' }}>{p.dataKey === 'aktual' ? 'Aktual' : 'Forecast'}:</span>
              <span className="font-semibold" style={{ color: '#f0fdf4' }}>{p.value.toFixed(3)} kg/kap/thn</span>
            </div>
          )
        ))}
      </div>
    )
  }

  const trendLabel = data.tren === 'naik'
    ? `↑ Tren Naik (${data.slope > 0 ? '+' : ''}${(data.slope * 1000).toFixed(2)} g/kap/thn)`
    : `↓ Tren Turun`

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-semibold text-sm" style={{ color: '#f0fdf4' }}>{komoditas}</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{
            background: data.grup === 'Sayuran' ? 'rgba(34,197,94,0.15)' : data.grup === 'Buah' ? 'rgba(249,115,22,0.15)' : 'rgba(234,179,8,0.15)',
            color: data.grup === 'Sayuran' ? '#86efac' : data.grup === 'Buah' ? '#fdba74' : '#fde68a',
          }}>{data.grup}</span>
        </div>
        <span className="text-xs font-medium" style={{ color: data.tren === 'naik' ? '#4ade80' : '#f87171' }}>
          {trendLabel}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="tahun" tick={{ fill: 'rgba(240,253,244,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(240,253,244,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} />
          {fcStart && <ReferenceLine x={fcStart} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 2" label={{ value: 'Forecast', position: 'top', fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />}
          <Line dataKey="aktual"   stroke={color} strokeWidth={2.5} dot={{ fill: color, r: 3 }} connectNulls />
          <Line dataKey="forecast" stroke={color} strokeWidth={2} strokeDasharray="5 3" dot={{ fill: color, r: 3 }} opacity={0.75} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
