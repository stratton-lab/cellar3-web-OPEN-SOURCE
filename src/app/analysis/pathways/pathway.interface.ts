export interface PathwayInput {
  datasetId: string
  pathway: string
  species: string
  upregulated: string[]
  downregulated: string[]
}

export interface PathwayGene {
  id: string
  x: number
  y: number
  symbols: string[]
  width: number
  height: number
  status?: 'upregulated' | 'downregulated'
}

export interface Pathway {
  id: number
  name: string
  species: string
  width: number
  height: number
  genes: PathwayGene[]
  base64: string
}

export interface PathwaysPlot {
  pathway: Pathway
  meta: any
}
