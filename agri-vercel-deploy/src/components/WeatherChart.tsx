'use client'

import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import type { ForecastCuaca } from '@/lib/types'

interface Props { data: ForecastCuaca }

export default function WeatherChart({ data }: Props) {
  const chartData = data.label.map((bulan, i) => ({
    bulan,
    'CH (mm)': Math.round(data.ch_mm[i] ?? 0),
    'Kelembaban (%)': +(data.kelembaban[i] ?? 0).toFixed(1),
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="rounded-xl p-3 text-sm" style={{ background: '#1a2e1a', border: '1px solid rgba(22,163,74,0.3)' }}>
        <div className="font-bold mb-1" style={{ color: '#86efac' }}>{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: 'rgba(240,253,244,0.7)' }}>{p.dataKey}:</span>
            <span className="font-semibold" style={{ color: '#f0fdf4' }}>{p.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base" style={{ color: '#f0fdf4' }}>
          Forecast Cuaca 12 Bulan ke Depan
        </h3>
        <div className="flex gap-3 text-xs" style={{ color: 'rgba(240,253,244,0.5)' }}>
          <span>RMSE CH: <span style={{ color: '#93c5fd' }}>{data.rmse_ch} mm/hari</span></span>
          <span>RMSE Kel: <span style={{ color: '#86efac' }}>{data.rmse_kel}%</span></span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="bulan" tick={{ fill: 'rgba(240,253,244,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="ch"  orientation="left"  tick={{ fill: 'rgba(240,253,244,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'mm/bulan', angle: -90, position: 'insideLeft', fill: 'rgba(240,253,244,0.3)', fontSize: 10, dx: -4 }} />
          <YAxis yAxisId="kel" orientation="right" tick={{ fill: 'rgba(240,253,244,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} label={{ value: '%', position: 'insideRight', fill: 'rgba(240,253,244,0.3)', fontSize: 10, dx: 4 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(240,253,244,0.6)' }} />
          <Bar yAxisId="ch" dataKey="CH (mm)" fill="rgba(59,130,246,0.6)" radius={[3,3,0,0]} />
          <Line yAxisId="kel" dataKey="Kelembaban (%)" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 3 }} activeDot={{ r: 5 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
