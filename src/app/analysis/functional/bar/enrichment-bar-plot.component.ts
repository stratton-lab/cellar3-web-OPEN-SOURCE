import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Message} from "../../../message";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {BackendService} from "../../../backend.service";
import {NGXLogger} from "ngx-logger";
import {BarPlot, TermGenes} from "./bar.interface";
import {getCleanTerm} from "../entichment-tools";
import {DownloadService} from "../../../download/download.service";
import {PathwayInput} from "../../pathways/pathway.interface";
import {DialogService, PATHWAYS_DIALOG} from "../../../dialog.service";
import {isKEGG} from "../gene-sets";
import {Observable} from "rxjs";


@Component({
  selector: 'enrichment-bar-plot',
  templateUrl: './enrichment-bar-plot.component.html',
  styleUrls: ['./enrichment-bar-plot.component.scss']
})
export class EnrichmentBarPlotComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  @Input() datasetId: string
  @Input() species: string | undefined
  @Input() target: number[]
  @Input() background: number[]
  @Input() geneSet: string

  @Output() onBusyState = new EventEmitter<boolean>()

  data: Plotly.Data[]
  layout: Plotly.Layout = this.getLayout()
  config = this.getConfig()
  meta: Record<string, any>
  term2genes: Record<string, TermGenes> = {}
  exportFormats = ['CSV']

  constructor(private backendService: BackendService, private logger: NGXLogger,
              private download: DownloadService, private dialogService: DialogService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasInputChanged(changes)) {
      this.load()
    }
  }

  /**
   * Retrieves enrichment results.
   */
  load() {
    this.msg = null
    this.busy = true
    this.onBusyState.next(true)

    this.backendService.getEnrichmentBar(this.datasetId, this.target, this.background, this.geneSet).subscribe({
      next: (res: BarPlot) => {
        this.busy = false
        this.onBusyState.next(false)
        this.term2genes = res.term2genes
        this.data = this.getTraces(res)
        this.meta = res.meta
      },
      error: err => {
        this.busy = false
        this.onBusyState.next(false)
        this.msg = {title: 'Can not display Enrichment Bar Plot.', detail: err?.error?.detail}
      }
    })
  }

  hasInputChanged(changes: SimpleChanges) {
    return changes['datasetId']?.previousValue != changes['datasetId']?.currentValue ||
      changes['target']?.previousValue != changes['target']?.currentValue ||
      changes['background']?.previousValue != changes['background']?.currentValue ||
      changes['geneSet']?.previousValue != changes['geneSet']?.currentValue
  }

  /**
   * @todo Support multiple traces per gene set
   * @param res
   * @private
   */
  private getTraces(res: BarPlot) {
    return [
      {
        x: res.data.map(row => row['minus_log10_pvals']),
        y: res.data.map(row => getCleanTerm(row['Term'], 50)),
        type: 'bar',
        orientation: 'h',
        marker: {
          color: '#3f86ed'
        },
        hovertemplate: res.data.map(row => this.getTooltipText(row['Term']))
      }
    ]
  }

  getTooltipText(term: string): string {
    const actionMsg = this.isKEGG() ? 'Click to see pathway map.' : ''
    const genes = this.term2genes?.[term]
    return `${genes?.upregulated?.length} upregulated and ${genes?.downregulated?.length} downregulated genes out of ${genes?.total} ${actionMsg}<extra></extra>`
  }

  private getLayout() {
    return {
      autosize: true,
      dragmode: "pan",
      hoverdistance: 10,
      margin: {t: 40, b: 40, l: 300, r: 10},
      xaxis: {
        autorange: true,
        fixedrange: true,
        title: '-log10 Adjusted P-value',
      },
      yaxis: {
        fixedrange: true,
        autorange: 'reversed',
        automargin: true,
        showgrid: false,
        standoff: 20,
        ticksuffix: "  ",
        tickfont: {
          size: 12,
          weight: 'bold'
        }
      },
      bargap: 0.15,
      legend: {
        itemclick: true, itemdoubleclick: true, x: 0, xanchor: 'center', y: -0.2, yanchor: 'top', orientation: 'h'
      }
    }
  }

  private getConfig() {
    return {
      scrollZoom: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `enrichment_bar_plot`
      }
    }
  }

  downloadReceipt() {
    this.download.downloadJSON(this.meta, "Receipt.json")
  }

  isKEGG = () => isKEGG(this.geneSet)

  onTermClick($event: any) {
    const selectedPoint = $event.points?.[0]
    if (selectedPoint) {
      if (this.isKEGG()) {
        const term = selectedPoint.label
        const genes = this.term2genes[term]
        if (genes && this.species) {
          const input: PathwayInput = {
            datasetId: this.datasetId,
            pathway: term,
            species: this.species,
            upregulated: genes['upregulated'],
            downregulated: genes['downregulated']
          }
          this.dialogService.open(PATHWAYS_DIALOG, input)
        } else {
          this.logger.warn('No downregulated or upregulated genes matching this term.')
        }
      } else {
        this.logger.warn('Clicks on non KEGG gene sets not supported.')
      }
    }
  }

  getExportName(): string {
    return `${this.datasetId}_enriched_terms`
  }

  getExportBackend = (format: string): Observable<Blob> => {
    return this.backendService.getExportableFunctionalEnrichment(this.datasetId, this.target, this.background, this.geneSet, format)
  }
}

