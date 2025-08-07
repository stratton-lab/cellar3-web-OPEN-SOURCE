import {SingleSelectAction} from "./action.interface";
import {Trace} from "../../2Dplot.interface";
import {PlotComponent} from "../../plot.component";

export class AnalysisAction implements SingleSelectAction {

  needsChartRefresh = false

  constructor(public name: string, public description: string, private dialog: string) {
  }

  onSecondSelection(firstSelectionTraceIndex: number, secondSelectionTraceIndex: number, traces: Trace[], plotComponent: PlotComponent) {
    const target = plotComponent.getCellIds(traces[firstSelectionTraceIndex].points)
    const background = plotComponent.getCellIds(traces[secondSelectionTraceIndex].points)
    plotComponent.showAnalysisDialog(target, background, this.dialog)
  }

  isInactive = (traces: Trace[]) => traces.length < 2

  getButtonMessage(firstSelectionTraceIndex?: number | null): string {
    return firstSelectionTraceIndex != null ? 'Please select BACKGROUND group on pie chart.' : 'Please select TARGET group on pie chart.'
  }

  getPlotTooltipMessage(firstSelectionTraceIndex?: number | null): string {
    return firstSelectionTraceIndex != null ? 'Click to select BACKGROUND cells.' : 'Click to select TARGET cells.'
  }
}
