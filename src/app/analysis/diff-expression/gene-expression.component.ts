import {Component, ViewChild} from '@angular/core';
import {DialogService, DIFF_EXPRESSION_DIALOG, DOT_PLOT_DIALOG, VIOLIN_PLOT_DIALOG} from "../../dialog.service";
import {BackendService} from "../../backend.service";
import {DiffExpressionInput} from "./gene-expression";
import {NGXLogger} from "ngx-logger";
import {SelectedGene} from "./volcano/volcano";
import _ from "lodash";
import {Observable} from "rxjs";
import {VolcanoComponent} from "./volcano/volcano.component";
import {GenesPlotInput} from "../../violin/violin.interface";


@Component({
  selector: 'diff-expression',
  templateUrl: './gene-expression.component.html',
  styleUrls: ['./gene-expression.component.scss']
})
export class DiffExpressionComponent {

  @ViewChild('volcanoPlot') volcanoPlot: VolcanoComponent;

  input: DiffExpressionInput
  selectedGenes: SelectedGene[] = []
  exportFormats = ['CSV', 'Excel', 'JSON']

  constructor(private dialogService: DialogService, private backendService: BackendService, private logger: NGXLogger) {
    dialogService.registerEventListener(DIFF_EXPRESSION_DIALOG).subscribe((input: DiffExpressionInput) => {
      this.input = input
    })
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(DIFF_EXPRESSION_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(DIFF_EXPRESSION_DIALOG)

  isOpen = () => this.dialogService.isOpen(DIFF_EXPRESSION_DIALOG)

  close() {
    this.selectedGenes = []
    this.dialogService.close(DIFF_EXPRESSION_DIALOG)
  }


  addSelectedGene(gene: SelectedGene) {
    if (!_.some(this.selectedGenes, selectedGene => selectedGene.name == gene.name)) {
      this.selectedGenes.push(gene)
    }
  }

  unselectGene(geneId: string) {
    _.remove(this.selectedGenes, (item) => item.name === geneId);
  }

  showViolinPlot() {
    if (this.hasSelectedGenes()) {
      const input: GenesPlotInput = {
        datasetId: this.input.datasetId,
        genes: this.selectedGenes.map(gene => gene.name),
        target: this.input.target,
        background: this.input.background
      }
      this.dialogService.open(VIOLIN_PLOT_DIALOG, input)
    }
  }

  showDotPlot() {
    if (this.hasSelectedGenes()) {
      const input: GenesPlotInput = {
        datasetId: this.input.datasetId,
        genes: this.selectedGenes.map(gene => gene.name),
        target: this.input.target,
        background: this.input.background
      }
      this.dialogService.open(DOT_PLOT_DIALOG, input)
    }
  }

  /**
   *
   */
  showUmapPlot() {
    if (this.hasSelectedGenes()) {
      const geneNames = this.selectedGenes.map(gene => gene.name)
      this.input.plotComponent.showUmapDialog(geneNames)
    }
  }

  noSelectedGenes = () => _.isEmpty(this.selectedGenes)

  hasSelectedGenes = () => !this.noSelectedGenes()

  getExportBackend = (format: string): Observable<Blob> => {
    return this.backendService.getExportableDiffExpression(this.input.datasetId, this.input.target, this.input.background, format)
  }

  getExportName(): string {
    return `${this.input.datasetId}_differential_gene_expression`
  }

  highlightPoint = (geneId: string): void => this.volcanoPlot.highlightGene(geneId)
  highlightGene = (gene: SelectedGene): void => this.highlightPoint(gene.name)

  searchGenes = (query: string): SelectedGene[] => this.volcanoPlot.search(query)
}
