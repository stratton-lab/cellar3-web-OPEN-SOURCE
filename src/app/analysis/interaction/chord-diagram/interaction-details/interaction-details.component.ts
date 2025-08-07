import {Component} from '@angular/core';
import {Message} from "../../../../message";
import {DialogService, INTERACTION_DETAILS_DIALOG, PATHWAYS_DIALOG} from "../../../../dialog.service";
import {NGXLogger} from "ngx-logger";
import {InteractionDetailsInput, LigandReceptor} from "../../interaction.interface";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {PathwayInput} from "../../../pathways/pathway.interface";

@Component({
  selector: 'interaction-details',
  templateUrl: './interaction-details.component.html',
  styleUrls: ['./interaction-details.component.css']
})
export class InteractionDetailsComponent {
  msg: Message | null = null
  busy = false // Loading of dataset from the server

  input: InteractionDetailsInput | null

  data: Plotly.Data[] | undefined
  layout = this.getLayout()
  config = this.getConfig()

  constructor(private dialogService: DialogService, private logger: NGXLogger) {
    dialogService.registerEventListener(INTERACTION_DETAILS_DIALOG).subscribe((input: InteractionDetailsInput) => {
      this.input = input
      this.data = this.getTraces(this.input.ligandsReceptors)
    })
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(INTERACTION_DETAILS_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(INTERACTION_DETAILS_DIALOG)
  isOpen = () => this.dialogService.isOpen(INTERACTION_DETAILS_DIALOG)

  close() {
    this.data = undefined
    this.dialogService.close(INTERACTION_DETAILS_DIALOG)
  }

  getTraces(ligandsReceptors: LigandReceptor[]): Plotly.Data[] {
    const ligands = [...new Set(ligandsReceptors.map(d => d.ligand))]
    const receptors = [...new Set(ligandsReceptors.map(d => d.receptor))]
    const interactions = new Map(ligandsReceptors.map(d => [`${d.ligand}-${d.receptor}`, d]))
    const z = ligands.map(ligand => receptors.map(receptor => interactions.get(`${ligand}-${receptor}`)?.prob || null))
    const customdata = ligands.map(ligand => receptors.map(receptor => interactions.get(`${ligand}-${receptor}`)?.evidence || null))
    const actionText = customdata.map(row => row.map(evidence => this.generateActionText(evidence)))
    return [{
      z: z,
      x: receptors,
      y: ligands,
      customdata: customdata,
      text: actionText,
      type: 'heatmap',
      colorscale: 'Viridis',
      colorbar: {
        title: 'Probability'
      },
      hovertemplate: 'Ligand: %{y}<br>Receptor: %{x}<br>Prob: %{z}<br>%{text}<extra></extra>'
    }]
  }

  getLayout() {
    return {
      xaxis: {title: 'Receptor', showgrid: false, tickpadding: 20},
      yaxis: {title: 'Ligand', showgrid: false, tickpadding: 20},
      autosize: true,
      dragmode: false,
      height: 550,
      margin: {t: 40, b: 60, l: 100, r: 10},
      showlegend: false
    }
  }

  getConfig() {
    return {
      staticPlot: false,
      scrollZoom: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'pan2d', 'lasso2d', 'autoScale2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `Interaction_Heatmap_plot`
      }
    }
  }

  getEvidence(evidence?: string | null) {
    const parts = evidence?.split('; ')[0].split(': ') || []
    if (parts.length == 2) return [parts[0], parts[1]]
    return ['UNKNOWN', 'UNKNOWN']
  }

  generateActionText(evidence?: string | null): string {
    const [evidenceType, evidenceId] = this.getEvidence(evidence)
    switch (evidenceType) {
      case 'KEGG':
        return 'Click to see KEGG Pathway Map'
      case 'PMID':
        return 'Click to see Publication'
      default:
        this.logger.warn(`Unsupported evidence of type ${evidenceType}`)
        return ''
    }
  }

  /**
   * Based on evidence:
   * - Open KEGG
   * - Open publication Link
   * @param $event
   */
  onInteractionClick($event: any) {
    const point = $event.points?.[0]
    const evidence = point?.customdata
    const receptor = point?.x
    const ligand = point?.y
    const upgenes = [receptor, ligand]
    const [evidenceType, evidenceId] = this.getEvidence(evidence)
    switch (evidenceType) {
      case 'KEGG':
        this.showKEGG(evidenceId, upgenes)
        break
      case 'PMID':
        this.showPubmed(evidenceId)
        break
      default:
        this.logger.warn(`Unsupported evidence of type ${evidenceType}`)
    }
  }

  showPubmed(pmid: string) {
    window.open(`https://pubmed.ncbi.nlm.nih.gov/${pmid}`, '_blank')
  }

  showKEGG(pathway: string, upgenes: string[]) {
    if (this.input) {
      const input: PathwayInput = {
        datasetId: this.input.datasetId,
        species: this.input.species,
        pathway: pathway.slice(3), // remove mmu prefix
        upregulated: upgenes,
        downregulated: []
      }
      this.dialogService.open(PATHWAYS_DIALOG, input)
    }
  }

}
