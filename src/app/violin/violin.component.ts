import {Component} from '@angular/core';
import {DialogService, VIOLIN_PLOT_DIALOG} from "../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../backend.service";
import {BLUE_THEME, GenesPlotInput, RED_THEME, TraceData, Violin} from "./violin.interface";
import {Message} from "../message";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {DownloadService} from "../download/download.service";

@Component({
  selector: 'violin-plot-dialog',
  templateUrl: './violin.component.html',
  styleUrls: ['./violin.component.scss']
})
export class ViolinComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  data: Plotly.Data[] | null
  layout: Plotly.Layout
  config = this.getConfig()

  violin: Violin | null
  showBackground = false

  constructor(private dialogService: DialogService, private logger: NGXLogger, private backendService: BackendService, private download: DownloadService) {
    dialogService.registerEventListener(VIOLIN_PLOT_DIALOG).subscribe((input: GenesPlotInput) => {
      this.load(input)
    })
  }

  load(input: GenesPlotInput) {
    this.msg = null
    this.busy = true
    this.backendService.getViolinPlot(input.datasetId, input.genes, input.target, input.background).subscribe({
      next: (violin: Violin) => {
        this.busy = false
        this.violin = violin
        this.update()
      },
      error: err => {
        this.busy = false
        this.msg = {title: 'Could not display Violin plot.', detail: err?.error?.detail}
      }
    })
  }

  update() {
    if (this.violin) {
      this.data = this.getTraces(this.violin)
      this.layout = this.getLayout()
    }
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(VIOLIN_PLOT_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(VIOLIN_PLOT_DIALOG)
  isOpen = () => this.dialogService.isOpen(VIOLIN_PLOT_DIALOG)

  close() {
    this.violin = null
    this.data = null
    this.dialogService.close(VIOLIN_PLOT_DIALOG)
  }

  toggleShowBackground() {
    this.showBackground = !this.showBackground
    this.update()
  }

  hasBackground = () => this.violin && this.violin?.traces?.length > 1

  private getTraces(violin: Violin) {
    // Not displaying background, target only
    if (!this.showBackground) {
      const targetData = violin.traces.find(obj => obj.side === 'positive')
      return targetData ? [this.getTrace(targetData)] : []
    }

    // Showing both target and background traces
    return violin.traces.map((traceData: TraceData) => this.getTrace(traceData, false))
  }

  private getTrace(traceData: TraceData, full = true) {
    const theme = traceData.side == 'negative' ? RED_THEME : BLUE_THEME
    return {
      type: 'violin',
      name: traceData.name,
      legendgroup: traceData.name,
      scalegroup: traceData.name,
      side: full ? null : traceData.side, // Showing regular/full violin or only one side of the violin
      width: 1,
      x: traceData.x,
      y: traceData.y,
      points: 'all',
      jitter: 0.1,
      pointpos: 0,
      marker: {size: 3, color: theme.points},
      hoverinfo: null,
      box: {visible: false, line: 1},
      fillcolor: theme.background,
      line: {color: theme.line, width: 1},
      meanline: {visible: true, width: 2}
    }
  }

  private getLayout(): Plotly.Layout {
    return {
      autosize: true,
      margin: {t: 40, b: 40, l: 50, r: 10},
      legend: {
        itemclick: true, itemdoubleclick: true, x: 0.5, xanchor: 'center', y: -0.2, yanchor: 'top', orientation: 'h'
      },
      hovermode: false,
      xaxis: {showgrid: false},
      yaxis: {zeroline: false, title: 'Expression Level', showgrid: false},
      violingap: 0,
      violingroupgap: 0,
      violinmode: "overlay"
    }
  }

  private getConfig() {
    return {
      staticPlot: false,
      scrollZoom: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'pan2d', 'lasso2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `DGE_violin_plot`
      }
    }
  }

  downloadReceipt() {
    if (this.violin) this.download.downloadJSON(this.violin.receipt, "SingloCell_Violin_Plot_Receipt.json")
  }
}
