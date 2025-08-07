export interface InteractionTooltip {
  x: number
  y: number
  info: InteractionData
}

export interface InteractionData {
  source: string
  target: string
  value: number
}
