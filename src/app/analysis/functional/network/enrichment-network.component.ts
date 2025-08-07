import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Message} from "../../../message";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {BackendService} from "../../../backend.service";
import {NGXLogger} from "ngx-logger";
import {getCleanTerm} from "../entichment-tools";
import {DownloadService} from "../../../download/download.service";
import {NetworkPlot} from "./network.interface";

@Component({
  selector: 'enrichment-network',
  templateUrl: './enrichment-network.component.html',
  styleUrls: ['./enrichment-network.component.css']
})
export class EnrichmentNetworkComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  @Input() datasetId: string
  @Input() target: number[]
  @Input() background: number[]
  @Input() geneSet: string

  @Output() onBusyState = new EventEmitter<boolean>()

  data: Plotly.Data[]
  layout: Plotly.Layout = this.getLayout()
  config = this.getConfig()
  meta: Record<string, any>

  constructor(private backendService: BackendService, private logger: NGXLogger, private download: DownloadService) {

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

    this.backendService.getEnrichmentNetwork(this.datasetId, this.target, this.background, this.geneSet).subscribe({
      next: (res: NetworkPlot) => {
        this.busy = false
        this.onBusyState.next(false)
        this.data = this.getTraces(res)
        this.meta = res.meta
      },
      error: err => {
        this.busy = false
        this.data = []
        this.onBusyState.next(false)
        this.msg = {title: 'Can not display Enrichment Network Plot.', detail: err?.error?.detail}
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

   * @param res
   * @private
   */
  private getTraces(res: NetworkPlot) {
    const COLOR_SCALE_RdYlBu = [[0, 'rgb(165,0,38)'], [0.5, 'rgb(255,255,191)'], [1, 'rgb(49,54,149)']]
    const traces = []
    const nodes_x = res.data.nodes.map(node => node.x)
    const nodes_y = res.data.nodes.map(node => node.y)

    res.data.edges.forEach(edge => {
      traces.push({
        x: edge.x,
        y: edge.y,
        mode: 'lines',
        type: 'scatter',
        line: {
          width: edge.weight * 5,
          color: '#25aae1'
        },
        hoverinfo: 'none',
        showlegend: false
      })
    })

    traces.push({
      x: nodes_x,
      y: nodes_y,
      mode: 'markers+text',
      type: 'scatter',
      text: res.data.nodes.map(node => getCleanTerm(node.name, 20)),
      textposition: 'top center',
      marker: {
        size: res.data.nodes.map(node => node.size * 100),
        color: res.data.nodes.map(node => node.color),
        colorscale: COLOR_SCALE_RdYlBu,
      },
      hoverinfo: 'text',
      showlegend: false
    })

    return traces
  }

  private getLayout() {
    return {
      autosize: true,
      dragmode: "pan",
      margin: {t: 0, b: 0, l: 0, r: 0},
      xaxis: {autorange: true, showgrid: false, zeroline: false, showticklabels: false},
      yaxis: {autorange: true, showgrid: false, zeroline: false, showticklabels: false}
    }
  }

  private getConfig() {
    return {
      scrollZoom: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'lasso2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `enrichment_network_plot`
      }
    }
  }

  triggerShowLabel($event: any) {
    const selectedPoint = $event.points?.[0]
    if (selectedPoint) {
      console.log('Name to toggle:', selectedPoint)
      // @todo Restyle
    }

  }

  downloadReceipt() {
    this.download.downloadJSON(this.meta, "Receipt.json")
  }
}
