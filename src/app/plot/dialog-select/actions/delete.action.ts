import {SingleSelectAction} from "./action.interface";
import {Trace} from "../../2Dplot.interface";
import {PlotComponent} from "../../plot.component";

export class DeleteAction implements SingleSelectAction {

  name: string = 'Delete Cells'
  description: string = 'Delete all cells from a group'
  needsChartRefresh = true

  onFirstSelection(firstSelectionTraceIndex: number, traces: Trace[], plotComponent: PlotComponent) {
    const traceToRemove = traces[firstSelectionTraceIndex]
    plotComponent.saveState(`Delete ${traceToRemove.name}`, () => {
      plotComponent.deleteCells([traceToRemove])
    })
  }

  isInactive = (traces: Trace[]) => traces.length == 0

  getButtonMessage = () => 'Please select on pie chart the group to delete.'

  getPlotTooltipMessage = () => 'Click to delete this cluster.'

}
