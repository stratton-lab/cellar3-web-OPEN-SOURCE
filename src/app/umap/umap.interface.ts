// Buttons to hide if we want no interaction with plot
export const BUTONS_REMOVE_NO_INTERACTION = ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'pan2d', 'lasso2d', 'autoScale2d']
// Buttons to remove id we want to allow pan/zoom interaction
export const BUTTONS_REMOVE_ALLOW_PAN_ZOOM = ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d']

export interface UmapGeneExpression {
  gene: string
  expression: number[]
}

export interface UMAPPlotInput {
  datasetId: string
  geneNames: string[]
  embedding: string
}

export interface MultiGenesUmapData {
  x: number[]
  y: number[]
  genes: UmapGeneExpression[]
}

export interface Layout {
  title: string;
  grid: {
    rows: number;
    columns: number;
    pattern: string;
  };
  [key: string]: any; // Allow additional properties with dynamic keys
}
