export interface BarPlot {
  data: any[]
  meta: any
  term2genes: Record<string, TermGenes>
}

export interface TermGenes {
  upregulated: string[]
  downregulated: string[]
  total: number
}
