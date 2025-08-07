import {Component} from '@angular/core';
import {
  DialogService,
  DIFF_EXPRESSION_DIALOG,
  FUNCTIONAL_DIALOG,
  INTERACTION_DIALOG,
  SAMPLES_MULTI_SELECTED_DIALOG
} from "../../dialog.service";
import {NGXLogger} from "ngx-logger";
import _ from "lodash";
import {Trace, TracePoint} from "../2Dplot.interface";
import {ClusterComparisonInput} from "./clusters";
import {DiffExpressionInput} from "../../analysis/diff-expression/gene-expression";
import {InteractionInput} from "../../analysis/interaction/interaction.interface";


@Component({
  selector: 'dialog-multiselect',
  templateUrl: './dialog-multiselect.component.html',
  styleUrls: ['./dialog-multiselect.component.scss']
})
export class DialogMultiselectComponent {

  multiGroups: Trace[][]
  input: ClusterComparisonInput

  // Most representative cell type in selection
  targetCellTypeBestMatch: string | null
  backgroundCellTypes: string[] | null

  constructor(private dialogService: DialogService, private logger: NGXLogger) {
    dialogService.registerEventListener(SAMPLES_MULTI_SELECTED_DIALOG).subscribe((data: ClusterComparisonInput) => {
      this.input = data
      this.multiGroups = this.getGroups(data.target.cluster, data.background.clusters)

      if (this.isCellCellInteractionAvailable()) {
        const targetCellTypes = this.getCellTypesCounts(this.multiGroups[0])
        this.targetCellTypeBestMatch = _.maxBy(_.keys(targetCellTypes), key => targetCellTypes[key]) || null

        const backgroundCellTypes = this.getCellTypesCounts(this.multiGroups[1])
        this.backgroundCellTypes = _.keys(backgroundCellTypes)
      }
    })
  }


  isOpen = () => this.dialogService.isOpen(SAMPLES_MULTI_SELECTED_DIALOG)

  close = () => {
    this.input.plotComponent.clearSelection()
    this.dialogService.close(SAMPLES_MULTI_SELECTED_DIALOG)
  }

  getGroups(targetCluster: TracePoint[], backgroundClusters: TracePoint[][] | undefined): Trace[][] {
    const groups: Trace[][] = []
    groups.push(this.getGroup(targetCluster))
    if (backgroundClusters) backgroundClusters.forEach(cluster => groups.push(this.getGroup(cluster)))
    return groups
  }

  /**
   * Groups together in a single bar all traces from target, and in another bar all traces from background.
   * @param cluster
   */
  getGroup(cluster: TracePoint[]): Trace[] {
    return _.map(_.groupBy(cluster, 'data.name'), (groupData, groupName) => {
      return {name: groupName, points: groupData}
    }).sort((a, b) => b.points.length - a.points.length)
  }

  /**
   * Shows a dialog with results of differential gene expression over the selections.
   */
  showDifferentialExpressionDialog() {
    const input: DiffExpressionInput = {
      datasetId: this.input.datasetId,
      target: this.input.target.cellIds,
      background: this.input.background.cellIds,
      plotComponent: this.input.plotComponent
    }
    this.dialogService.open(DIFF_EXPRESSION_DIALOG, input)
    // this.close()
  }

  showFunctionalAnalysisDialog() {
    this.dialogService.open(FUNCTIONAL_DIALOG, {
      datasetId: this.input.datasetId,
      species: this.input.species,
      target: this.input.target.cellIds,
      background: this.input.background.cellIds
    })
  }

  showInteractionDialog() {
    if (!this.isCellCellInteractionAvailable()) {
      this.logger.warn('Cell Cell Interactions not available for this dataset.')
      return
    }

    if (this.targetCellTypeBestMatch && this.backgroundCellTypes) {
      const input: InteractionInput = {
        datasetId: this.input.datasetId,
        species: this.input.species,
        source: this.targetCellTypeBestMatch,
        targets: this.backgroundCellTypes
      }
      this.dialogService.open(INTERACTION_DIALOG, input)
    }
  }

  isCellCellInteractionAvailable = () => this.input?.plotComponent?.plot?.interactions


  getCellCellInteractionMessage() {
    if (!this.isCellCellInteractionAvailable()) return "Not Available for this Dataset"
    return this.targetCellTypeBestMatch
  }

  getCellTypesCounts = (groups: Trace[]) => _(groups)
    .flatMap('points')
    .countBy(point => point.customdata[1])
    .value()

}
