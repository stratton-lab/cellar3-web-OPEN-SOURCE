import {PseudotimeRoot} from "../../dataset";
import {PlotComponent} from "../../plot/plot.component";

export interface PseudotimeInput {
  datasetId: string
  pseudotime: PseudotimeRoot
  plotComponent: PlotComponent
}
