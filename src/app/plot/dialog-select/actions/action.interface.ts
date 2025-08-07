import {Trace} from "../../2Dplot.interface";
import {PlotComponent} from "../../plot.component";

export interface SingleSelectAction {
  name: string
  description?: string

  needsChartRefresh: boolean

  /**
   * This function is called when the action is selected.
   */
  onActionInit?: () => void

  /**
   * Called when the user clicks on the pie chart for the first time.
   * @param firstSelectionTraceIndex
   * @param traces
   * @param plotComponent
   * @returns true if the pie chart needs to be refreshed
   */
  onFirstSelection?: (firstSelectionTraceIndex: number, traces: Trace[], plotComponent: PlotComponent) => void

  /**
   * Called when the user clicks on the pie chart for the second time.
   * @param firstSelectionTraceIndex
   * @param secondSelectionTraceIndex
   * @param traces
   * @param plotComponent
   */
  onSecondSelection?: (firstSelectionTraceIndex: number, secondSelectionTraceIndex: number, traces: Trace[], plotComponent: PlotComponent) => void

  /**
   * Returns true if the button should be shown as inactive.
   * @param traces
   */
  isInactive: (traces: Trace[]) => boolean

  /**
   * Text displayed at the bottom of the tooltip of the pie chart.
   */
  getPlotTooltipMessage: (firstSelectionTraceIndex: number | null) => string

  /**
   * Text displayed on the button once it has been selected.
   */
  getButtonMessage: (firstSelectionTraceIndex: number | null) => string

}

export interface AnalysisAction extends SingleSelectAction {
  dialog: string
  datasetId: string
  species: string
  target?: number[]
  background?: number[]
}
