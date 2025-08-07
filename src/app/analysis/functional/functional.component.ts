import {Component} from '@angular/core';
import {DialogService, FUNCTIONAL_DIALOG} from "../../dialog.service";
import {BackendService} from "../../backend.service";
import {NGXLogger} from "ngx-logger";
import {DiffExpressionInput} from "../diff-expression/gene-expression";
import {AVAILABLE_GENE_SETS, GeneSetCategory} from "./gene-sets";

interface PlotType {
  key: string
  name: string
  description?: string
}

@Component({
  selector: 'functional',
  templateUrl: './functional.component.html',
  styleUrls: ['./functional.component.scss']
})
export class FunctionalComponent {

  input: DiffExpressionInput

  DEFAULT_GENE_SET = 'GO_Biological_Process_2023'
  selectedGeneSet = this.DEFAULT_GENE_SET
  backStack: GeneSetCategory[] = []
  categories: GeneSetCategory = AVAILABLE_GENE_SETS
  selectedCategory = this.categories


  PLOT_TYPE_BAR = 'Bars'
  PLOT_TYPE_NETWORK = 'Network'
  plotTypes = [this.PLOT_TYPE_BAR, this.PLOT_TYPE_NETWORK]
  selectedPlotType = this.plotTypes[0]
  busy: boolean = false

  constructor(private dialogService: DialogService, private backendService: BackendService, private logger: NGXLogger) {
    dialogService.registerEventListener(FUNCTIONAL_DIALOG).subscribe((input: DiffExpressionInput) => {
      this.input = input
      this.selectedGeneSet = this.DEFAULT_GENE_SET
      this.selectedCategory = this.categories
      this.backStack = [this.selectedCategory]
      this.selectedPlotType = this.plotTypes[0]
    })
  }


  getOverlayZ = () => this.dialogService.getOverlayZ(FUNCTIONAL_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(FUNCTIONAL_DIALOG)

  isOpen = () => this.dialogService.isOpen(FUNCTIONAL_DIALOG)

  close() {
    this.dialogService.close(FUNCTIONAL_DIALOG)
  }

  setSelectedPlotType(plotType: string) {
    this.selectedPlotType = plotType
  }

  setSelectedGeneSet(geneSet: GeneSetCategory) {
    if (this.busy) return
    if (geneSet.key != null) this.selectedGeneSet = geneSet.key
    if (geneSet?.geneSets?.length) {
      this.selectedCategory = geneSet
      this.backStack.push(geneSet)
    }
  }

  backToCategory(geneSet: GeneSetCategory) {
    this.selectedCategory = geneSet
    const index = this.backStack.indexOf(geneSet)
    if (index !== -1) {
      this.backStack.splice(index + 1)
    }
  }

  getCompatibleGeneSets(geneSets: GeneSetCategory[] | undefined): GeneSetCategory[] {
    return geneSets?.filter(gs => gs.onlySpecies == null || gs.onlySpecies == this.input.species) || []
  }

  linkClicked($event: MouseEvent) {
    $event.stopPropagation()
  }
}
