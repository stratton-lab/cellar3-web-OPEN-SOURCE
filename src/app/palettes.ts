export const SEURAT_COLORS_19 = [
  '#ef766c', '#e18326', '#d09000', '#b99c00',
  '#9da600', '#78af00', '#3eb800', '#40bd5e',
  '#42c08d', '#42c0b4', '#41bdd5', '#3eb6ef',
  '#39a8ff', '#8297ff', '#b783ff', '#da70f9',
  '#ee64e1', '#f563c0', '#f56a9a'
]

export const DEFAULT_PALETTE = SEURAT_COLORS_19

export function assignColor(index: number): string {
  return DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
}
