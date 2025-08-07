import {Component, ViewChild} from '@angular/core';
import {Message} from "../../message";

import {BackendService} from "../../backend.service";
import {NGXLogger} from "ngx-logger";
import {Pathway, PathwayGene, PathwayInput, PathwaysPlot} from "./pathway.interface";
import {DialogService, PATHWAYS_DIALOG} from "../../dialog.service";
import {PlotlyComponent} from "angular-plotly.js";
import {Plotly as PlotlyType} from "angular-plotly.js/lib/plotly.interface";
import {DGE, DOWNREGULATED, UPREGULATED} from "../diff-expression/gene-expression";

@Component({
  selector: 'pathways',
  templateUrl: './pathways.component.html',
  styleUrls: ['./pathways.component.scss']
})
export class PathwaysComponent {

  @ViewChild('plotlyPlot') plotlyPlot: PlotlyComponent

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  pathway: Pathway | null
  data: PlotlyType.Data[] | null
  layout: PlotlyType.Layout = this.getEmptyLayout()
  config: PlotlyType.Config = this.getConfig()
  meta: any // Receipt

  // Image
  width: number = 0
  height: number = 0

  initialRange: number = -1
  defaultTextSize = 7
  plotHeight = 600

  constructor(private backendService: BackendService, private logger: NGXLogger, private dialogService: DialogService) {
    dialogService.registerEventListener(PATHWAYS_DIALOG).subscribe((input: PathwayInput) => {
      this.load(input)
    })
  }

  /**
   * Retrieves pathways results.
   */
  load(input: PathwayInput) {
    this.msg = null
    this.busy = true
    this.pathway = null
    this.layout = this.getEmptyLayout()
    this.data = []

    this.backendService.getPathways(input.datasetId, input.pathway, input.species, input.upregulated, input.downregulated).subscribe({
      next: (res: PathwaysPlot) => {
        this.busy = false
        this.pathway = res.pathway
        this.layout = this.getLayout(res.pathway)
        this.data = this.getTraces(res)
        this.meta = res.meta
      },
      error: err => {
        this.busy = false
        this.data = []
        this.msg = {title: 'Can not display Pathways Plot.', detail: err?.error?.detail}
      }
    })
  }

  /**
   * Returns down and up regulated traces.
   * @param res
   * @private
   */
  private getTraces(res: PathwaysPlot) {
    return [
      this.getTrace(res.pathway, UPREGULATED),
      this.getTrace(res.pathway, DOWNREGULATED)
    ]
  }

  /**
   * Traces are used to display legend and detect user hovering over genes.
   * @param pathway
   * @param category
   * @private
   */
  private getTrace(pathway: Pathway, category: string) {
    const categoryMeta = DGE[category]
    const genes = pathway?.genes?.filter(gene => gene.status == category) || []
    const fillColor = categoryMeta?.color
    return {
      x: genes.map(gene => gene.x + (gene.width / 2)),
      y: genes.map(gene => gene.y + (gene.height / 2)),
      text: genes.map(gene => gene.symbols[0] ?? '?'),
      type: 'scatter',
      mode: 'markers',
      name: categoryMeta?.name,
      marker: {size: 8, color: fillColor},
      hovertemplate: `<b>%{text}</b><br>${categoryMeta?.name}<extra></extra>`,
      showlegend: true
    }
  }

  private getEmptyLayout() {
    return {
      autosize: true,
      dragmode: "pan",
      margin: {t: 10, b: 0, l: 0, r: 0},
      height: this.plotHeight, // Need better way to fix the default height of 450 !!
      xaxis: {
        constrain: 'range',
        rangemode: 'tozero',
        autorange: false,
        showgrid: false,
        zeroline: false,
        showticklabels: false
      },
      yaxis: {
        constrain: 'range',
        rangemode: 'tozero',
        scaleanchor: "x",
        autorange: false,
        showgrid: false,
        zeroline: false,
        showticklabels: false
      }
    }
  }

  private getLayout(pathway: Pathway) {

    this.width = pathway.width
    this.height = pathway.height
    this.defaultTextSize = this.getDefaultFontSize()
    this.logger.info(`Using default text size: ${this.defaultTextSize}`)
    return {
      autosize: true,
      dragmode: "pan",
      legend: {
        orientation: 'h', x: 0.5, xanchor: 'center', y: 1, yanchor: 'bottom',
        itemclick: false, itemdoubleclick: false
      },
      margin: {t: 12, b: 0, l: 0, r: 0},
      height: 600, // Need better way to fix the default height of 450 !!
      xaxis: {
        range: [0, this.width],
        constrain: 'range',
        rangemode: 'tozero',
        autorange: false,
        showgrid: false,
        zeroline: false,
        showticklabels: false
      },
      yaxis: {
        range: [this.height, 0],
        constrain: 'range',
        rangemode: 'tozero',
        scaleanchor: "x",
        autorange: false,
        showgrid: false,
        zeroline: false,
        showticklabels: false
      },
      shapes: this.renderGenes(pathway),
      annotations: [],
      images: [this.getImage(pathway.base64, this.width, this.height)]
    }
  }


  private getImage(base64: string, width: number, height: number) {
    return {
      source: `data:image/png;base64,${base64}`,
      xref: 'x', yref: 'y', x: 0, y: 0, sizex: width, sizey: height,
      sizing: 'stretch',
      opacity: 1,
      layer: 'below'
    }
  }

  private renderGenes(data?: Pathway) {
    return data?.genes?.map(gene => this.renderGene(gene))
  }

  private renderGene(gene: PathwayGene) {
    return {
      type: 'rect',
      x0: gene.x, y0: gene.y, x1: gene.x + gene.width, y1: gene.y + gene.height,
      fillcolor: gene.status && DGE[gene.status]?.color || 'white',
      label: {text: gene.symbols[0], font: {size: this.defaultTextSize, color: gene.status && 'white' || 'black'}},
      line: {}
    }
  }

  private getConfig() {
    return {
      responsive: true,
      scrollZoom: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `pathways_plot`
      }
    }
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(PATHWAYS_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(PATHWAYS_DIALOG)
  isOpen = () => this.dialogService.isOpen(PATHWAYS_DIALOG)

  close() {
    this.data = null
    this.dialogService.close(PATHWAYS_DIALOG)
  }

  scaleContent($event: any) {
    if (this?.layout?.shapes?.length > 0) {
      const fontSize = this.getFontSize()
      this.layout.shapes?.forEach((shape: any) => {
        if (shape?.label?.font) shape.label.font.size = fontSize
      })
      this.layout.shapes = this.layout.shapes.slice() // To force plot redraw
    }
  }

  /**
   */
  getFontSize() {
    const zoomx = this.initialRange / this.getXRange()
    return this.defaultTextSize * zoomx
  }

  /**
   * Works great if image is vertical (height bigger than width), issues if horizontal
   * @todo If image is horizontal, need to scale based on width coefficient instead of height
   */
  getDefaultFontSize(){
    return this.plotHeight / this.height * 10
  }

  getXRange = () => this.layout.xaxis.range[1] - this.layout.xaxis.range[0]

  /**
   * @todo Improve detection of initial range
   */
  setupScale() {
    if (this.initialRange == -1 && this.getXRange() > 100) this.initialRange = this.getXRange()
  }
}
