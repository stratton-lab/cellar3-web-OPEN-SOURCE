import {Component} from '@angular/core';
import {
  DialogService,
  DIFF_EXPRESSION_DIALOG,
  FUNCTIONAL_DIALOG,
  PSEUDOTIME_DIALOG,
  SAMPLES_SELECTED_DIALOG
} from "../../dialog.service";
import {NGXLogger} from "ngx-logger";
import {SimpleSelectionEvent, Trace} from "../2Dplot.interface";
import {SingleSelectAction} from "./actions/action.interface";
import {DeleteAction} from "./actions/delete.action";
import {ReassignAction} from "./actions/reassign.action";
import {ToastrService} from "ngx-toastr";
import _ from 'lodash'
import {AnalysisAction} from "./actions/analysis.action";
import {PseudotimeInput} from "../../analysis/pseudotime/pseudotime.interface";
import {PseudotimeRoot} from "../../dataset";

const BUTTONS_CATEGORY_CLEANUP = "Cleanup"
const BUTTONS_CATEGORY_ANALYSIS = "Analysis"

interface AnalysisConfig {
  dialog: string
  datasetId: string
  species: string
  target?: number[]
  background?: number[]
}


@Component({
  selector: 'dialog-select',
  templateUrl: './select.dialog.html',
  styleUrls: ['./select.dialog.scss']
})
export class SelectDialogComponent {

  groups: Trace[]
  selectedEvent: SimpleSelectionEvent
  groupName: string | undefined
  pieChartRevision: number = 0


  buttonCategories = [BUTTONS_CATEGORY_CLEANUP, BUTTONS_CATEGORY_ANALYSIS]
  expandedButtonsCategory = BUTTONS_CATEGORY_CLEANUP

  analysisActions: SingleSelectAction[] = [
    new AnalysisAction(
      'Differential Expression',
      'Identify genes with varying expression levels across single cells, shedding light on cellular diversity and function. Visualize these differences with Volcano, Violin, Dot and UMAP plots.',
      DIFF_EXPRESSION_DIALOG
    ),
    new AnalysisAction(
      'Functional Analysis',
      'Unveil the biological functions and pathways associated with the differentially expressed genes. Differential Expression will be performed first.',
      FUNCTIONAL_DIALOG
    )
  ]
  cleanupActions: SingleSelectAction[] = [new ReassignAction(), new DeleteAction()]
  selectedAction: SingleSelectAction | null = null
  firstSelectionTraceIndex: number | null = null

  selectionPseudoTimeBestMatch: PseudotimeRoot | null

  constructor(private dialogService: DialogService, private logger: NGXLogger, private toast: ToastrService) {
    dialogService.registerEventListener(SAMPLES_SELECTED_DIALOG).subscribe((selectedEvent: SimpleSelectionEvent) => {
      this.selectedEvent = selectedEvent
      this.syncPieChartDataWithPlot()
      this.groupName = selectedEvent.plotComponent.getCurrentGroupName()
      this.logger.info('[SelectDialog] (onOpenEvent) groups:', this.groups)
      this.expandedButtonsCategory = BUTTONS_CATEGORY_ANALYSIS
      this.selectedAction = null
      this.firstSelectionTraceIndex = null

      if (this.isPseudotimeAvailable()) {
        this.selectionPseudoTimeBestMatch = this.getSelectionPseudoTimeBestMatch()
      }
    })
  }

  private syncPieChartDataWithPlot() {
    this.groups = this.getGroupedPoints(this.selectedEvent.selectedSampleIds)
  }

  isCleanupExpanded = () => this.expandedButtonsCategory == BUTTONS_CATEGORY_CLEANUP
  isAnalysisExpanded = () => this.expandedButtonsCategory == BUTTONS_CATEGORY_ANALYSIS

  isOpen = () => this.dialogService.isOpen(SAMPLES_SELECTED_DIALOG)

  close = () => {
    this.selectedEvent.plotComponent.clearSelection()
    this.dialogService.close(SAMPLES_SELECTED_DIALOG)
  }

  getSelectedSamplesCount = () => _.sumBy(this.groups, o => o.points.length)

  /**
   * Returns a map matching the Cell Type to the number of it's occurences in the user selection
   */
  getCellTypesCounts = () => _(this.groups)
    .flatMap('points')
    .countBy(point => point.customdata[1])
    .value()

  getGroupedPoints(selectedSampleIds: Set<number>): Trace[] {
    return this.selectedEvent.plotComponent.getPointsForSelection(selectedSampleIds).sort(this.sortBySize).sort(this.sortByControl)
  }

  private sortBySize(a: Trace, b: Trace): number {
    return b.points.length - a.points.length
  }

  /**
   * Negative value if a should be before b
   * @param a
   * @param b
   * @private
   */
  private sortByControl(a: Trace, b: Trace): number {
    if (a.name == 'Control' && b.name != 'Control') return -1
    if (a.name != 'Control' && b.name == 'Control') return 1
    return 0
  }


  private refreshPieChart() {
    this.logger.info('Refreshing pie chart.')
    this.syncPieChartDataWithPlot()
    this.pieChartRevision += 1
  }

  isPseudotimeAvailable = () => this.selectedEvent?.plotComponent?.plot?.meta?.pseudotime?.length

  showPseudoTimeDialog() {
    if (!this.isPseudotimeAvailable()) {
      this.logger.warn('Pseudotime not available for this dataset.')
      return
    }

    if (this.selectionPseudoTimeBestMatch) {
      const input: PseudotimeInput = {
        datasetId: this.selectedEvent.datasetId,
        pseudotime: this.selectionPseudoTimeBestMatch,
        plotComponent: this.selectedEvent.plotComponent
      }
      this.dialogService.open(PSEUDOTIME_DIALOG, input)
    } else {
      this.logger.warn(`No precomputed pseudotime root matches selected cells.`)
    }

  }

  /**
   * Based on the cell types in user selection, find declared pseudotime that intersect with most.
   */
  getSelectionPseudoTimeBestMatch(): PseudotimeRoot | null {
    const selectedCellTypeCounts = this.getCellTypesCounts()
    this.logger.info('Selected cell types', selectedCellTypeCounts)
    const availablePseudotimeRecords = this.selectedEvent.plotComponent.plot?.meta?.pseudotime || []
    const scoredPseudotimeRecords = availablePseudotimeRecords.map(pseudotime => {
      return {
        pseudotime: pseudotime,
        score: _.sumBy(pseudotime.cellTypes, cellType => selectedCellTypeCounts[cellType] || 0)
      }
    })
    const filteredSortedPseudotimeRecords = _(scoredPseudotimeRecords)
      .filter(pseudotime => pseudotime.score > 0)
      .orderBy('score', 'desc')
      .value()

    this.logger.info('Matching selected cell types to pseudotime: ', filteredSortedPseudotimeRecords)
    // Returning best match (if any)
    return filteredSortedPseudotimeRecords?.[0]?.pseudotime || null
  }


  isSelectedAction = (action: SingleSelectAction) => this.selectedAction?.name == action.name

  selectAction(action: SingleSelectAction) {
    if (this.isSelectedAction(action)) {
      this.selectedAction = null
      this.firstSelectionTraceIndex = null
      this.logger.info('Current action already selected. Cancelling selection.')
    } else {
      if (!action.isInactive(this.groups)) {
        this.selectedAction = action
        this.logger.info('Selected action ', action)
      }
    }
  }

  onActionFinished() {
    if (this.selectedAction) {
      this.logger.info(`Action ${this.selectedAction.name} finished.`)
      this.firstSelectionTraceIndex = null
      if (this.selectedAction?.needsChartRefresh) this.refreshPieChart()
      this.selectedAction = null
    } else {
      this.logger.error('Called onActionFinished while no action currently selected.')
    }
  }

  /**
   * Selecting groups works for both analysis and cleanup.
   * @param traceIndex This is the index of the trace on the pie chart, not on the plot.
   */
  onGroupSelected(traceIndex: number) {
    this.logger.info(`[SelectDialog] Clicked on trace with id ${traceIndex}`)

    if (this.selectedAction) {
      if (this.firstSelectionTraceIndex == null) {
        this.logger.info('[SelectDialog] First trace selected.')
        this.firstSelectionTraceIndex = traceIndex
        if (this.selectedAction.onFirstSelection) {
          this.selectedAction.onFirstSelection(this.firstSelectionTraceIndex, this.groups, this.selectedEvent.plotComponent)
          this.onActionFinished()
        }
      } else {
        this.logger.info('[SelectDialog] Second trace selected.')
        if (traceIndex == this.firstSelectionTraceIndex) {
          // Cancel selection
          this.firstSelectionTraceIndex = null
          return
        }
        if (this.selectedAction.onSecondSelection) {
          this.selectedAction.onSecondSelection(this.firstSelectionTraceIndex, traceIndex, this.groups, this.selectedEvent.plotComponent)
          this.onActionFinished()
        }
      }
    }
  }

  getTooltipText = (): string => this.selectedAction ? this.selectedAction?.getPlotTooltipMessage(this.firstSelectionTraceIndex) : ""


  /**
   * Undo is only available for modifications made in the current select dialog.
   */
  canUndo(): boolean {
    return this.selectedEvent.plotComponent.states.length > this.selectedEvent.undoLimit
  }

  undo() {
    this.selectedEvent.plotComponent.undo()
    this.refreshPieChart()
  }

  getLatestStateDescription = () => this.selectedEvent.plotComponent.getLatestStateDescription()

  getPseudoTimeMessage() {
    if (!this.isPseudotimeAvailable()) return "Not Available for this Dataset"
    if (!this.selectionPseudoTimeBestMatch) return 'Not Available For Selection'
    return this.selectionPseudoTimeBestMatch.name
  }
}
