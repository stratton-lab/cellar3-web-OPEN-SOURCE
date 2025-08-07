export interface Bin {
  label: string
  min: number
  max: number
  count: number
}

export interface Histogram {
  name: string
  bins: Bin[]
}
