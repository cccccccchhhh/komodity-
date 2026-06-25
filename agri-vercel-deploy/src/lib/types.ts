export interface KabupatenListItem {
  kode_kab: number
  nama_kab: string
  provinsi: string
}

export interface ForecastCuaca {
  label: string[]
  ch_mm: number[]
  kelembaban: number[]
  rmse_ch: number
  rmse_kel: number
}

export interface DemandGrandData {
  grup: string
  tahun: number[]
  nilai: number[]
  tahun_fc: number[]
  nilai_fc: number[]
  tren: 'naik' | 'turun' | 'unknown'
  slope: number
}

export interface KabupatenData {
  kode_kab: number
  nama_kab: string
  provinsi: string
  ph: number
  ch_tahunan_mm: number
  kelembaban_mean: number
  forecast_cuaca: ForecastCuaca
  komoditas_cocok_ml: string[]
  rekomendasi_tanam: string[]
  cocok_tapi_demand_turun: string[]
  saran_distribusi: Record<string, string[]>
  demand_grand: Record<string, DemandGrandData>
  summary: string
}

export interface DemandGrandAll {
  [komoditas: string]: DemandGrandData
}
