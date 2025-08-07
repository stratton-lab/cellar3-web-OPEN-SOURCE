export interface GenesPlotInput {
  datasetId: string
  genes: string[]
  target: number[]
  background: number[]
}

export interface TraceData {
  x: number[]
  y: number[]
  name: string
  side: string
}

export interface Violin {
  traces: TraceData[]
  receipt: Record<string, any>
}

export interface ViolinTheme {
  background: string
  line: string
  points: string
}

export const RED_THEME: ViolinTheme = {line: '#f56f75', points: '#f30', background: '#f8c5ca'}
export const BLUE_THEME: ViolinTheme = {line: '#1da1f2', points: '#0071bc', background: '#5cc7f6'}
