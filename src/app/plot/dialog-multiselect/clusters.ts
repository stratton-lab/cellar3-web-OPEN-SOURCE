import {NameToColor, TracePoint} from "../2Dplot.interface";
import {PlotComponent} from "../plot.component";

export interface ClusterComparisonInput {
  datasetId: string
  species: string
  target: { cellIds: number[], cluster: TracePoint[] }
  background: { cellIds: number[], clusters: TracePoint[][] }
  colors: NameToColor
  plotComponent: PlotComponent
}
