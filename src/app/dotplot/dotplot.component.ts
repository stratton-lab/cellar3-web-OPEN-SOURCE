import {Component} from '@angular/core';
import {Message} from "../message";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {DialogService, DOT_PLOT_DIALOG} from "../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../backend.service";
import {GenesPlotInput} from "../violin/violin.interface";
import {DotPlotOutput} from "./dotplot";
import _ from "lodash";
import {isSmartPhone} from "../tools";
import {DownloadService} from "../download/download.service";
import Data = Plotly.Data;

const DARK_BLUE = '#0877ba'
const MAX_DOT_SIZE = 50
const LIGHT_BLUE = '#d2e1fc'
const COLOR_SCALE_BLUE = [
  [0.0, LIGHT_BLUE],
  [0.5, '#42bef4'],
  [1.0, DARK_BLUE]
]

@Component({
  selector: 'dot-plot-dialog',
  templateUrl: './dotplot.component.html',
  styleUrls: ['./dotplot.component.scss']
})
export class DotplotComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  data: Plotly.Data[] | null
  layout: Plotly.Layout
  config = this.getConfig()

  dotplot: DotPlotOutput | null

  constructor(private dialogService: DialogService, private logger: NGXLogger, private backendService: BackendService, private download: DownloadService) {
    dialogService.registerEventListener(DOT_PLOT_DIALOG).subscribe((input: GenesPlotInput) => {
      this.load(input)
    })
  }


  load(input: GenesPlotInput) {
    this.msg = null
    this.busy = true
    this.backendService.getDotPlot(input.datasetId, input.genes, input.target, input.background).subscribe({
      next: (dotplot: DotPlotOutput) => {
        this.busy = false
        this.dotplot = dotplot
        this.data = this.getTraces(dotplot)
        this.layout = this.getLayout(input)
      },
      error: err => {
        this.busy = false
        this.msg = {title: 'Could not calculate dot plot data.', detail: err?.error?.detail}
      }
    })
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(DOT_PLOT_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(DOT_PLOT_DIALOG)
  isOpen = () => this.dialogService.isOpen(DOT_PLOT_DIALOG)

  close() {
    this.dotplot = null
    this.data = null
    this.dialogService.close(DOT_PLOT_DIALOG)
  }

  private getTraces(plot: DotPlotOutput): Data[] {
    return plot.traces.map((trace, idx: number) => ({
      type: 'scatter',
      x: trace.genes,
      y: trace.groups,
      mode: 'markers',
      customdata: _.zip(trace.means.map(m => m.toFixed(2)), trace.percents.map(p => (p * 100).toFixed(0))),
      hovertemplate: 'Mean expression: %{customdata[0]}<br>Cells Percentage: %{customdata[1]}%<extra></extra>',
      marker: {
        size: trace.percents.map(p => p * MAX_DOT_SIZE),  // Scale the size
        color: trace.means.map(p => p),  // Color by average expression
        line: {color: DARK_BLUE, width: 1},
        colorscale: COLOR_SCALE_BLUE,
        showscale: true,
        colorbar: idx === 0 ? this.getColorbar() : null
      },
    }))

  }


  private getColorbar() {
    return {
      orientation: 'h',
      x: isSmartPhone() ? 0.5 : 0.15,
      y: -0.7,
      xanchor: 'center',
      yanchor: 'bottom',
      title: {text: 'Mean expression', font: {family: 'Open_Sans'}},
      outlinewidth: 0,
      thickness: 10,
      bordercolor: '#f0f0f0',
      len: isSmartPhone() ? 1 : 0.5
    }
  }


  private getLayout(input: GenesPlotInput): Plotly.Layout {
    return {
      autosize: true,
      dragmode: false,
      height: 300,
      margin: {t: 40, b: 60, l: 100, r: 10},
      showlegend: false,
      xaxis: {showgrid: false},
      yaxis: {showgrid: false},
      coloraxis: {
        colorbar: {}
      }
    }
  }

  private getConfig() {
    return {
      staticPlot: false,
      scrollZoom: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'pan2d', 'lasso2d', 'autoScale2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `UMAP_plot`
      }
    }
  }

  downloadReceipt() {
    if (this.dotplot) this.download.downloadJSON(this.dotplot.receipt, "SingloCell_DotPlot_Receipt.json")
  }
}
