import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DGE, DGE_Category, SelectedGene} from "./volcano";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {Message} from "../../../message";
import {BackendService} from "../../../backend.service";
import {NGXLogger} from "ngx-logger";
import Fuse from "fuse.js";
import _ from "lodash";
import {GeneTooltipComponent} from "../../../gene-tooltip/gene-tooltip.component";
import {DownloadService} from "../../../download/download.service";
import {PlotDatum} from "plotly.js";


@Component({
  selector: 'volcano-plot',
  templateUrl: './volcano.component.html',
  styleUrls: ['./volcano.component.scss']
})
export class VolcanoComponent implements OnChanges {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  @ViewChild('geneTooltipComponent') geneTooltip: GeneTooltipComponent

  @Input() datasetId: string
  @Input() target: number[]
  @Input() background: number[]

  @Output() onGeneSelected = new EventEmitter<SelectedGene>()

  data: Plotly.Data[]
  layout: Plotly.Layout = this.getLayout()
  config = this.getConfig()
  genesIndex: Fuse<SelectedGene> // Searchable genes
  geneMap: { [key: string]: SelectedGene } // Allows to get traceIdx and pointIdx from gene name
  meta: Record<string, any>

  categories: { [key: string]: string } = {
    'non-significant': '#8c9296',
    'upregulated': '#cd4741',
    'downregulated': '#0877ba'
  }

  highlightPointColor: '#30dd8a'
  highlightTimerId: number

  annotations: Record<string, any> = {} // Annotations are toggled when clicking on genes

  constructor(private backendService: BackendService, private logger: NGXLogger, private download: DownloadService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasInputChanged(changes)) {
      this.load()
    }
  }


  /**
   * Retrieves differential gene expression results.
   */
  load() {
    this.msg = null
    this.busy = true

    this.backendService.getDiffExpressionVolcano(this.datasetId, this.target, this.background).subscribe({
      next: (dge: DGE) => {
        this.busy = false
        this.data = this.getTraces(dge)
        // this.layout.annotations = this.getSignificantGenesAnnotations(dge)
        this.meta = dge.meta
        const genes = this.extractGenes(dge.traces)
        this.genesIndex = this.getIndexedGenes(genes)
        this.geneMap = _.keyBy(genes, gene => gene.name)
      },
      error: err => {
        this.busy = false
        this.msg = {title: 'Can not display Volcano plot.', detail: err?.error?.detail}
      }
    })
  }

  hasInputChanged(changes: SimpleChanges) {
    return changes['datasetId'].previousValue != changes['datasetId'].currentValue ||
      changes['target'].previousValue != changes['target'].currentValue ||
      changes['background'].previousValue != changes['background'].currentValue
  }

  selectGene($event: any) {
    const selectedPoint = $event.points?.[0]
    if (selectedPoint) {
      this.onGeneSelected.next({
        name: selectedPoint.text,
        traceIdx: selectedPoint.curveNumber,
        pointIdx: selectedPoint.pointNumber,
        category: selectedPoint?.data?.name,
        logFC: selectedPoint?.x?.[selectedPoint.pointNumber],
        minusLogP: selectedPoint?.y?.[selectedPoint.pointNumber]
      })
      this.toggleAnnotation(selectedPoint)
    }
  }

  highlightGene(geneName: string) {
    const gene = this.geneMap[geneName]
    // this.logger.info('[VolcanoComponent] (highlightGene) Gene to highlight', gene)
    if (gene && this.data?.length == 4) {
      const highlightTrace = this.data[3]
      highlightTrace.x = [gene.logFC]
      highlightTrace.y = [gene.minusLogP]
      if (this.highlightTimerId) clearTimeout(this.highlightTimerId)
      this.highlightTimerId = window.setTimeout(() => {
        highlightTrace.x = [null]
        highlightTrace.y = [null]
      }, 3000)
    }
  }

  search(text: string): SelectedGene[] {
    return this.genesIndex?.search(text, {limit: 5}).map(hit => hit.item) || []
  }

  /**
   * Creates an annotation.
   */
  private buildAnnotation(selectedPoint: PlotDatum) {
    return {
      x: selectedPoint.x,
      y: selectedPoint.y,
      text: selectedPoint.text,
      xref: 'x',
      yref: 'y',
      showarrow: true,
      ax: 20,
      ay: -30,
      arrowhead: 1,
      arrowsize: 1,
      arrowwidth: 1,
      arrowcolor: '#c7c7c7',
      opacity: 0.9
    }
  }

  private toggleAnnotation(selectedPoint: PlotDatum) {
    const key = selectedPoint.text
    if (key in this.annotations) {
      delete this.annotations[key]
    } else {
      this.annotations[key] = this.buildAnnotation(selectedPoint)
    }
    this.layout.annotations = _.values(this.annotations) // forces redraw
  }

  private getSignificantGenesAnnotations(volcano: DGE) {
    return (volcano.significant_genes || []).map(sg => ({
      x: sg.log2fc,
      y: sg.minus_log10_pval,
      text: sg.gene,
      xref: 'x',
      yref: 'y',
      showarrow: true,
      ax: 20,
      ay: -30,
      arrowhead: 1,
      arrowsize: 1,
      arrowwidth: 1,
      arrowcolor: '#c7c7c7',
      opacity: 0.9
    }))
  }

  private getTraces(volcano: DGE) {
    const traces: any[] = volcano?.traces?.map(trace => ({
      type: 'scattergl',
      x: trace.logFC,
      y: trace.minusLogP,
      name: trace.category,
      mode: 'markers',
      text: trace.genes,
      marker: {color: this.categories[trace.category]},
      hoverinfo: 'none',
      customdata: trace.category,
      hovertemplate: ''
    }))
    traces?.push(this.getHighlightTrace())
    return traces
  }

  private getHighlightTrace() {
    return {
      type: 'scattergl',
      x: [null],
      y: [null],
      text: [null],
      mode: 'markers',
      marker: {color: '#ee9200', size: 14, symbol: 'star', line: {color: '#f4e16e', width: 1}},
      showlegend: false
    }
  }

  private getLayout() {
    return {
      autosize: true,
      dragmode: "pan",
      annotations: [],
      hoverdistance: 10,
      margin: {t: 40, b: 40, l: 50, r: 10},
      xaxis: {title: 'Log2FC', showgrid: false},
      yaxis: {title: '-Log10 Adjusted P-Value', showgrid: false},
      legend: {
        itemclick: true, itemdoubleclick: true, x: 0.5, xanchor: 'center', y: -0.2, yanchor: 'top', orientation: 'h'
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
        'filename': `DGE_volcano_plot`
      }
    }
  }

  private extractGenes(traces: DGE_Category[]): SelectedGene[] {
    const genes: SelectedGene[] = []
    traces.forEach((trace, traceIdx) => {
      trace.genes.forEach((gene, pointIdx) => {
        genes.push({
          name: gene,
          traceIdx: traceIdx,
          pointIdx: pointIdx,
          category: trace.category,
          logFC: trace.logFC[pointIdx],
          minusLogP: trace.minusLogP[pointIdx]
        })
      })
    })
    return genes
  }

  /**
   * Index genes to make them searchable
   * @param genes
   * @private
   */
  private getIndexedGenes(genes: SelectedGene[]): Fuse<SelectedGene> {
    this.logger.info('[VolcanoPlot] (getIndexedGenes) Creating searchable index of genes.')
    return new Fuse(genes, {keys: ['name'], distance: 0})
  }

  showTooltip = ($event: any) => this.geneTooltip.showTooltip($event)

  hideTooltip = () => this.geneTooltip.hideTooltip()

  downloadReceipt() {
    this.download.downloadJSON(this.meta, "Receipt.json")
  }
}
