export interface CellCellInteraction {
  source: string
  target: string
  prob: number
  ligand: string
  receptor: string
  evidence?: string // KEGG or PMID or PMCID
}

export interface InteractionInput {
  datasetId: string
  species: string
  source: string
  targets: string[]
}

export interface CellCellInteractionsData {
  interactions: CellCellInteraction[]
  types: string[]
}

export interface LigandReceptor {
  ligand: string
  receptor: string
  prob: number
  evidence?: string
}

export interface InteractionDetailsInput {
  datasetId: string
  species: string
  source: string
  target: string
  ligandsReceptors: LigandReceptor[]
}

