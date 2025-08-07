import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {Dataset} from "../dataset";
import {PlotlyComponent} from "angular-plotly.js";
import {PlotComponent} from "./plot.component";


export type TraceToPoints = { [key: number]: number[] }
export type NameToColor = { [key: string]: string }

export interface PlotConfig {
  id: string
  data: Plotly.Data[]
  meta: Dataset
  embedding: string
  group: string
  genes?: string[]
  interactions?: boolean
}

export interface PlotStateParameters {
  groupColumn: string
  embeddingName: string
}

export interface PlotState {
  data: Plotly.Data[]
  parameters: PlotStateParameters // Plot parameters, such as the grouping column
  description: string // Displayed on the undo button
}


export interface TracePoint {
  curveNumber: number
  customdata: (string | number)[]
  pointNumber: number
}

export interface Trace {
  name: string
  traceIdx?: number
  points: TracePoint[]
}

export interface RemovedPoint {
  x: number
  y: number
  customdata: any
}

export interface SimpleSelectionEvent {
  datasetId: string
  species: string
  selectedSampleIds: Set<number>
  plot: PlotlyComponent
  colors: NameToColor
  plotComponent: PlotComponent
  undoLimit: number
}

export interface SimplePoint {
  x: number
  y: number
}

export interface Arrow {
  start: SimplePoint
  end: SimplePoint
  ctrl1: SimplePoint
  ctrl2: SimplePoint
}

export interface PlotShape {
  type: 'path' | 'circle'
  path?: string
  line: any
  xref?: string
  yref?: string
  x0?: number
  x1?: number
  y0?: number
  y1?: number
  fillcolor?: string
  ax?: number
  ay?: number
}

export interface PlotObjectsContainer {
  shapes: PlotShape[]
  annotations: PlotAnnotation[]
}

export interface PlotAnnotation {
  x: number,
  y: number,
  xref: string,
  yref: string,
  text: string,
  showarrow: false,
  font: { color: string, size: number, family: string, weight: string },
  align: 'left'
  bgcolor: string
  bordercolor: string
  borderwidth: number
}

export interface UmapConfig {
  x: number[]
  y: number[]
  colors: string[] | number[]
  arrow?: Arrow
}
