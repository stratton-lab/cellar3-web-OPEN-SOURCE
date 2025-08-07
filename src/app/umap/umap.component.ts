import {Component} from '@angular/core';
import {Message} from "../message";
import {Plotly as PlotlyType} from "angular-plotly.js/lib/plotly.interface";
import {DialogService, UMAP_PLOT_DIALOG} from "../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../backend.service";
import {
  BUTONS_REMOVE_NO_INTERACTION,
  BUTTONS_REMOVE_ALLOW_PAN_ZOOM,
  MultiGenesUmapData,
  UmapGeneExpression,
  UMAPPlotInput
} from "./umap.interface";
import {isSmartPhone} from "../tools";
import {COLORSCALE_GRAY_BLUE} from "../colorscales";

const MAX_COLUMNS = 6

@Component({
  selector: 'umap-plot-dialog',
  templateUrl: './umap.component.html',
  styleUrls: ['./umap.component.scss']
})
export class UmapComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  input: UMAPPlotInput | null
  data: PlotlyType.Data[] | undefined
  layout: PlotlyType.Layout
  config: PlotlyType.Config

  constructor(private dialogService: DialogService, private logger: NGXLogger, private backendService: BackendService) {
    dialogService.registerEventListener(UMAP_PLOT_DIALOG).subscribe((input: UMAPPlotInput) => {
      this.load(input)
    })
  }


  /**
   * @param input
   */
  load(input: UMAPPlotInput) {
    this.msg = null
    this.busy = true
    this.input = input
    this.backendService.getUmapPlot(input.datasetId, input.geneNames, input.embedding).subscribe({
      next: (data: MultiGenesUmapData) => {
        this.busy = false
        this.data = this.getTraces(data)
        this.layout = this.getLayout(input)
        this.config = this.getConfig(input)
      },
      error: err => {
        this.busy = false
        this.msg = {title: 'Could not calculate umap plot data', detail: err?.error?.detail}
      }
    })
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(UMAP_PLOT_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(UMAP_PLOT_DIALOG)
  isOpen = () => this.dialogService.isOpen(UMAP_PLOT_DIALOG)

  close() {
    this.data = undefined
    this.input = null
    this.dialogService.close(UMAP_PLOT_DIALOG)
  }

  private getTraces(data: MultiGenesUmapData) {
    return data.genes.map((geneData: UmapGeneExpression, idx: number) => {
      return {
        type: 'scattergl',
        x: data.x,
        y: data.y,
        name: geneData.gene,
        mode: 'markers',
        xaxis: `x${idx + 1}`,
        yaxis: `y${idx + 1}`,
        marker: {
          colorscale: COLORSCALE_GRAY_BLUE,
          cmin: 0,
          cmax: 1,
          color: geneData.expression,
          colorbar: idx === 0 ? this.getColorbar() : null
        },
        showlegend: false,
        hoverinfo: 'none',
        hovertemplate: ''
      }
    })
  }

  private getColorbar() {
    return {
      orientation: 'h',
      x: 0.5,
      y: -0.2,
      xanchor: 'center',
      yanchor: 'bottom',
      title: {text: 'Expression Level', font: {family: 'Open_Sans'}},
      tickvals: [0, 1],
      ticktext: ['Min', 'Max'],
      outlinewidth: 0,
      thickness: 10,
      bordercolor: '#f0f0f0',
      len: isSmartPhone() ? 1 : 0.5
    }
  }


  private getLayout(input: UMAPPlotInput): Plotly.Layout {
    const numCols = input.geneNames.length < MAX_COLUMNS ? input.geneNames.length : MAX_COLUMNS
    const numRows = Math.ceil(input.geneNames.length / numCols)

    const layout: PlotlyType.Layout = {
      autosize: true,
      dragmode: this.isSingleGenePlot(input) ? 'pan' : false,
      grid: {
        rows: numRows,
        columns: numCols,
        ygap: 0.4,
        pattern: 'independent'
      },
      annotations: [],
      margin: {t: 80, b: 50, l: 50, r: 10},
      legend: {
        itemclick: false, itemdoubleclick: false, x: 0.5, xanchor: 'center', y: -0.2, yanchor: 'top', orientation: 'h'
      }
    }
    input.geneNames.forEach((geneName: string, idx: number) => {
      layout[`xaxis${idx + 1}`] = {showgrid: false, showticklabels: false, zeroline: false}
      layout[`yaxis${idx + 1}`] = {showgrid: false, showticklabels: false, zeroline: false}
      layout.annotations.push({
        text: input.geneNames?.length > 1 ? geneName : "", // Only showing if more than 1 gene
        xref: `x${idx + 1} domain`,
        yref: `y${idx + 1} domain`,
        x: 0.5, y: 1.1, showarrow: false, xanchor: 'center', yanchor: 'bottom', font: {family: 'Open_Sans', size: 16}
      });
    })

    return layout
  }

  private getConfig(input: UMAPPlotInput) {
    return {
      staticPlot: false,
      displayModeBar: true,
      scrollZoom: this.isSingleGenePlot(input), // Allow zoom only if single gene
      modeBarButtonsToRemove: this.isSingleGenePlot(input) ? BUTTONS_REMOVE_ALLOW_PAN_ZOOM : BUTONS_REMOVE_NO_INTERACTION,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        'filename': `UMAP_plot`
      }
    }
  }

  /**
   * If only one gene in list, use gene name as dialog title
   */
  getPlotName = () => this.input?.geneNames.length == 1 ? this.input.geneNames[0] : "Gene Expression"

  isSingleGenePlot(input: UMAPPlotInput) {
    return input?.geneNames.length == 1
  }
}
