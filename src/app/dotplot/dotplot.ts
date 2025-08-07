export interface DotPlotOutput {
  traces: DotPlotTrace[]
  receipt: Record<string, any>
}

export interface DotPlotTrace {
  groups: string
  genes: string[]
  means: number[]
  percents: number[]
}
