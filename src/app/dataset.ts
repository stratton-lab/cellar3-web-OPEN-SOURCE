export interface Link {
  name: string
  url: string
}

export interface Group {
  name: string
  key: string
  image?: string // Preview image for the embedding, ex: spatial image of sample
}

export interface EmbeddingsCategory {
  name: string
  embeddings: Group[]
}

export interface Maintainer {
  name: string
  email: string
  affiliation: string
}

export interface PseudotimeDirection {
  name: string
  key: string
}

export interface PseudotimeRoot {
  name: string
  embedding: string
  directions: PseudotimeDirection[]
  cellTypes?: string[]
  origin?: string
}

export enum DatasetType {
  SUSPENSION = 'Suspension',
  SPATIAL = 'Spatial'
}

export enum GroupName {
  CELL_TYPE = 'Cell Type',
  CONDITION = 'Condition',
  SAMPLE = 'Sample'
}

export interface Dataset {
  id: string
  name: string
  public?: boolean
  file: string
  description: string
  linksPublications?: Link[]
  linksDatasets?: Link[]
  keywords?: string[]
  links?: Link[]
  tissue: string
  species: string
  cells: number
  type: string // Suspension or Spatial
  state?: string // Healthy or Disease
  modality?: string // Transcriptomics, Proteomics, Multimodal
  image?: string // Preview image shown on DatasetIte widgets.
  embeddings?: Group[] // Used to display cells in 2D space
  embeddingsCategories?: EmbeddingsCategory[]
  groups: Group[] // Used to assign colors/labels to cells
  info: any // Used to display tooltip
  labelsRemap?: any
  pseudotime?: PseudotimeRoot[]
  categories: string[] // Categories ids from the Exploration Tree to which this dataset belongs
  maintainer?: Maintainer

  prodStatus?: string // Whether the dataset is available on prod website.
}

export interface DatasetMap {
  [key: string]: Dataset
}

export interface DatasetsMap {
  [key: string]: Dataset[]
}
