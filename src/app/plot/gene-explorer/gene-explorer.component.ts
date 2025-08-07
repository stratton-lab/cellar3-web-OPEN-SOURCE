import {Component} from '@angular/core';
import {DialogService, GENE_EXPLORER_DIALOG} from "../../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../../backend.service";
import _ from "lodash";
import {GeneExplorerInput} from "./gene-explorer.interface";
import {SelectedGene} from "../../analysis/diff-expression/volcano/volcano";
import {GeneVisualization} from "./gene-visualization.interface";

@Component({
  selector: 'gene-explorer',
  templateUrl: './gene-explorer.component.html',
  styleUrls: ['./gene-explorer.component.scss']
})
export class GeneExplorerComponent {

  input: GeneExplorerInput
  selectedGenes: SelectedGene[] = []
  visualizations: GeneVisualization[] = [
    {
      name: 'UMAP Plot',
      img:'assets/images/dialogs/umap-plot-btn-img.jpg',
      description: 'Expression levels across all cells of the dataset.',
      show: () => this.input.plotComponent.showUmapDialog(this.selectedGenes.map(gene => gene.name))
    },
    {
      name:'Violin Plot',
      img:'assets/images/dialogs/violin-plot-btn-img.jpg',
      description:'Violin Plot',
      show:() => this.input.plotComponent.showViolinPlot(this.selectedGenes.map(gene => gene.name))
    },
    {
      name:'Dot Plot',
      img:'assets/images/dialogs/dot-plot-btn-img.jpg',
      show:() => this.input.plotComponent.showDotPlot(this.selectedGenes.map(gene => gene.name))
    }
  ]

  constructor(private dialogService: DialogService, private logger: NGXLogger, private backendService: BackendService) {
    dialogService.registerEventListener(GENE_EXPLORER_DIALOG).subscribe((input: GeneExplorerInput) => {
      // On Dialog Opened
      this.input = input
    })
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(GENE_EXPLORER_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(GENE_EXPLORER_DIALOG)
  isOpen = () => this.dialogService.isOpen(GENE_EXPLORER_DIALOG)

  close() {
    this.dialogService.close(GENE_EXPLORER_DIALOG)
  }

  addGene(gene: SelectedGene) {
    if (!_.some(this.selectedGenes, selectedGene => selectedGene.name == gene.name)) {
      this.selectedGenes.push(gene)
    }
  }

  removeGene(geneId: string) {
    _.remove(this.selectedGenes, (item) => item.name === geneId)
  }

  noSelectedGenes = () => _.isEmpty(this.selectedGenes)

  hasSelectedGenes = () => !this.noSelectedGenes()

  searchGenes = (query: string): SelectedGene[] => {
    return this.input.genesIndex?.search(query, {limit: 5}).map(hit => hit.item) || []
  }

  showViz(viz: GeneVisualization) {
    if (this.selectedGenes.length) viz.show()
  }
}
