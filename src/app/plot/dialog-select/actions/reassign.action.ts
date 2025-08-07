import {SingleSelectAction} from "./action.interface";
import {Trace} from "../../2Dplot.interface";
import {PlotComponent} from "../../plot.component";


export class ReassignAction implements SingleSelectAction {
  name: string = 'Reassign Cluster'
  description: string = 'Reassign all cells from one group to another Clusters to the main'
  needsChartRefresh = true

  onSecondSelection(firstSelectionTraceIndex: number, secondSelectionTraceIndex: number, traces: Trace[], plotComponent: PlotComponent) {
    const fromTrace = traces[firstSelectionTraceIndex]
    const toTrace = traces[secondSelectionTraceIndex]
    plotComponent.saveState(`Reassign ${fromTrace.name} to ${toTrace.name}`, () => {
      plotComponent.reassignCells([fromTrace], toTrace)
    })
  }


  isInactive = (traces: Trace[]) => traces.length < 2

  getButtonMessage(firstSelectionTraceIndex?: number | null): string {
    return firstSelectionTraceIndex != null ? 'Please select on pie chart to which group the points will be reassigned' : 'Please select on pie chart the group to reassign.'
  }

  getPlotTooltipMessage(firstSelectionTraceIndex?: number | null): string {
    return firstSelectionTraceIndex != null ? 'Click to select where to reassign' : 'Click to select cells to reassign.'
  }
}
