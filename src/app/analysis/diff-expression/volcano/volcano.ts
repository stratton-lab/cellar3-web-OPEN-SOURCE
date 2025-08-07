import {SuggestedGene} from "../../../gene-search/suggested-gene.interface";

export interface SelectedGene extends SuggestedGene{
  // Allows to easily identify/highlight the gene back on the plot
  name: string
  traceIdx: number
  pointIdx: number
  logFC?: number
  minusLogP?: number
  category?: string
}

export interface DGE_Gene {
  name: string
  logFC: number
  minusLogP: number
  category: string
}

export interface DGE_Category {
  genes: string[]
  logFC: number[]
  minusLogP: number[]
  category: string
}

export interface DGE_Meta {
  method: string
  dataset: string
  min_cells_per_gene: string
  cells: number
  genes: number
}

export interface SignificantGene {
  gene: string
  log2fc: number
  minus_log10_pval: number
}

export interface DGE {
  traces: DGE_Category[]
  significant_genes?: SignificantGene[]
  meta: DGE_Meta
}

