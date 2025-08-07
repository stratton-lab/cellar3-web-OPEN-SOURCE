export interface DataField {
  name: string
  value: string
}

export interface GeneTooltip {
  x: number
  y: number
  name: string
  description?: string
  imageUrl?: string
  fields: DataField[]
}
