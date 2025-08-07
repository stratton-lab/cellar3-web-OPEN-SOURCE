import {PlotComponent} from "../../plot/plot.component";

export interface DiffExpressionInput {
  datasetId: string
  species?: string
  target: number[]
  background: number[]
  plotComponent: PlotComponent
}

export interface GeneCategory {
  name: string
  color: string
}

export const UPREGULATED = 'upregulated'
export const DOWNREGULATED = 'downregulated'
export const NON_SIGNIFICANT = 'non-significant'

export const DGE: { [key: string]: GeneCategory } = {
  'upregulated': {
    name: 'Upregulated',
    color: '#cd4741'
  },
  'downregulated': {
    name: 'Downregulated',
    color: '#0877ba'
  },
  'non-significant': {
    name: 'Non Significant',
    color: '#8c9296'
  }
}

