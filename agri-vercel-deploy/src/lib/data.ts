import type { KabupatenListItem, KabupatenData, DemandGrandAll } from './types'

const BASE = typeof window !== 'undefined' ? '' : ''

export async function getKabupatenList(): Promise<KabupatenListItem[]> {
  const res = await fetch(`${BASE}/data/kabupaten_list.json`)
  return res.json()
}

export async function getKabupatenData(nama: string): Promise<KabupatenData | null> {
  const res = await fetch(`${BASE}/data/kabupaten_data.json`)
  const all: Record<string, KabupatenData> = await res.json()
  return all[nama.toUpperCase()] ?? null
}

export async function getAllKabupatenData(): Promise<Record<string, KabupatenData>> {
  const res = await fetch(`${BASE}/data/kabupaten_data.json`)
  return res.json()
}

export async function getDemandGrand(): Promise<DemandGrandAll> {
  const res = await fetch(`${BASE}/data/demand_grand.json`)
  return res.json()
}

export const GRUP_COLOR: Record<string, string> = {
  Sayuran: '#22c55e',
  Buah:    '#f97316',
  Padi:    '#eab308',
}

export const BULAN_LABEL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

export function formatNumber(n: number, decimals = 1): string {
  return n.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function getTrendColor(tren: string): string {
  return tren === 'naik' ? '#22c55e' : tren === 'turun' ? '#ef4444' : '#94a3b8'
}

export function getPhCategory(ph: number): string {
  if (ph < 4.5) return 'Sangat Masam'
  if (ph < 5.5) return 'Masam'
  if (ph < 6.5) return 'Agak Masam'
  if (ph < 7.5) return 'Netral'
  if (ph < 8.5) return 'Agak Basa'
  return 'Basa'
}

export function getChCategory(ch: number): string {
  if (ch > 3000) return 'Sangat Tinggi'
  if (ch > 2000) return 'Tinggi'
  if (ch > 1000) return 'Sedang'
  return 'Rendah'
}
