import {Component} from '@angular/core';
import {Message} from "../../message";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {PseudotimeInput} from "./pseudotime.interface";
import {DialogService, PSEUDOTIME_DIALOG} from "../../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../../backend.service";
import {PlotAnnotation, PlotObjectsContainer, PlotShape, UmapConfig} from "../../plot/2Dplot.interface";
import {PseudotimeDirection} from "../../dataset";
import {SelectedGene} from "../diff-expression/volcano/volcano";
import {MultiGenesUmapData} from "../../umap/umap.interface";
import {
  COLORSCALE_EMPTY_GRAY,
  COLORSCALE_GRAY_PURPLE,
  COLORSCALE_TYPE,
  COLORSCALE_VIRIDIS,
  LIGHT_GRAY
} from "../../colorscales";

@Component({
  selector: 'pseudotime',
  templateUrl: './pseudotime.component.html',
  styleUrls: ['./pseudotime.component.scss']
})
export class PseudotimeComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  input: PseudotimeInput | null
  MODE_TRAJECTORY = "Trajectory"
  MODE_EXPRESSION = "Expression"
  availableModes = [this.MODE_TRAJECTORY, this.MODE_EXPRESSION]
  selectedMode: string = this.MODE_TRAJECTORY
  selectedDirection: PseudotimeDirection | null
  selectedGene: string | null

  data: Plotly.Data[] | undefined
  layout: Plotly.Layout
  config = this.getConfig()

  constructor(private dialogService: DialogService, private logger: NGXLogger, private backendService: BackendService) {
    dialogService.registerEventListener(PSEUDOTIME_DIALOG).subscribe((input: PseudotimeInput) => {
      this.input = input
      this.selectedDirection = this.getDefaultDirection()
      this.loadPseudotime()
    })
  }

  loadPseudotime() {

    if (!this.selectedDirection || !this.input) {
      this.logger.error(`Can not select default pseudotime (missing root or direction`)
      this.msg = {title: 'Pseudotime Unavailable', detail: 'Missing default direction or root.'}
      return
    }

    this.msg = null
    this.busy = true

    this.backendService.getUMAP(this.input.datasetId, this.input.pseudotime.embedding, this.selectedDirection.key).subscribe({
      next: (data: UmapConfig) => {
        this.busy = false
        this.data = this.getTraces(data)
        this.layout = this.getLayout(data)
      },
      error: err => {
        this.busy = false
        this.msg = {title: 'Could not get Pseudotime UMAP plot data', detail: err?.error?.detail}
      }
    })
  }

  private getDefaultDirection() {
    return this.input?.pseudotime?.directions?.[0] || null
  }

  selectDirection(direction: PseudotimeDirection) {
    this.selectedDirection = direction
    this.loadPseudotime()
  }

  selectMode(mode: string) {
    this.selectedMode = mode
    if (this.selectedMode == this.MODE_TRAJECTORY) {
      // Load default data for mode
      this.loadPseudotime()
    } else if (this.selectedMode == this.MODE_EXPRESSION) {
      // Loads empty/gray plot
      this.selectedGene = null
      this.showEmptyPlot()
    }
  }

  showEmptyPlot() {
    this.data?.forEach(trace => {
      trace.marker.colorscale = COLORSCALE_EMPTY_GRAY
      trace.marker.showscale = false
    })
  }

  searchGenes = (query: string): SelectedGene[] => {
    return this.input?.plotComponent.searchGenes(query) || []
  }

  showUmapExpressionForGene(gene: SelectedGene) {
    this.loadGeneExpression(gene.name)
  }

  loadGeneExpression(geneName: string) {
    if (this.input) {
      this.msg = null
      this.busy = true
      this.backendService.getUmapPlot(this.input.datasetId, [geneName], this.input.pseudotime.embedding).subscribe({
        next: (data: MultiGenesUmapData) => {
          this.busy = false
          this.selectedGene = geneName
          const singleGeneUmapData = {x: data.x, y: data.y, colors: data.genes[0].expression}
          this.data = this.getTraces(singleGeneUmapData, COLORSCALE_GRAY_PURPLE)
        },
        error: err => {
          this.busy = false
          this.msg = {title: 'Could not get Gene Expression UMAP plot data', detail: err?.error?.detail}
        }
      })
    }
  }

  private partitionOnColors(list: any[], colors: any[]): any[][] {
    let colorNotNull: any[] = []
    let colorNull: any[] = []
    colors.forEach((color, index) => (color != null ? colorNotNull : colorNull).push(list[index]))
    return [colorNotNull, colorNull]
  }

  /**
   * Displaying inactive (gray) points first, so they appear under the active points.
   * @param data
   * @param colorscale
   * @private
   */
  private getTraces(data: UmapConfig, colorscale: string | COLORSCALE_TYPE = COLORSCALE_VIRIDIS) {
    let [activeX, inactiveX] = this.partitionOnColors(data.x, data.colors)
    let [activeY, inactiveY] = this.partitionOnColors(data.y, data.colors)
    let [activeColor, inactiveColor] = this.partitionOnColors(data.colors, data.colors)
    return [
      {
        type: 'scattergl',
        x: inactiveX,
        y: inactiveY,
        mode: 'markers',
        marker: {color: LIGHT_GRAY},
        showlegend: false,
        hoverinfo: 'none',
        hovertemplate: ''
      },
      {
        type: 'scattergl',
        x: activeX,
        y: activeY,
        mode: 'markers',
        marker: {
          color: activeColor,
          colorscale: colorscale, colorbar: {title: 'Progression'}
        },
        showlegend: false,
        hoverinfo: 'none',
        hovertemplate: ''
      }
    ]
  }

  private getLayout(data: UmapConfig): Plotly.Layout {
    const objectsContainer = this.getObjectsContainer(data)
    return {
      xaxis: {anchor: "y", autorange: true, visible: false, scaleanchor: 'y'},
      yaxis: {anchor: "x", autorange: true, visible: false, scaleratio: 1},
      autosize: true,
      dragmode: 'pan',
      height: 550,
      margin: {t: 40, b: 60, l: 100, r: 10},
      showlegend: false,
      coloraxis: {colorbar: {}},
      shapes: objectsContainer.shapes,
      annotations: objectsContainer.annotations
    }
  }


  private getObjectsContainer(data: UmapConfig): PlotObjectsContainer {
    const objects: PlotObjectsContainer = {shapes: [], annotations: []}
    try {
      const arrow = this.generateArrowPoints(data)
      objects.shapes.push(...this.getArrowShapes(arrow, '#3b628e'))
      const originName = this.input?.pseudotime?.origin || 'Origin'
      objects.annotations.push(this.getOriginAnnotation(arrow[0], originName, '#3b628e'))
    } catch (e) {
      this.logger.warn(`Could not draw lineage arrow: ${e}`)
    }
    return objects
  }

  private getOriginAnnotation(start: number[], originName: string, color: string = 'black'): PlotAnnotation {
    const offsetX = 0.2
    const offsetY = -1
    const bgColor = 'white'
    return {
      x: start[0] + offsetX,
      y: start[1] + offsetY,
      xref: 'x',
      yref: 'y',
      text: `&nbsp;${originName}&nbsp;`,
      showarrow: false,
      font: {color: color, size: 14, family: 'Arial, sans-serif', weight: 'bold'},
      align: 'left',
      bgcolor: bgColor,
      bordercolor: color,
      borderwidth: 1,
    }
  }


  private generateArrowPoints(data: UmapConfig, sampleSize = 10): number[][] {
    const points = data.x.map((xVal, index) => ({x: xVal, y: data.y[index], color: data.colors[index]}))
    const validPoints = points.filter(point => point.x != null && point.y != null && point.color != null)
    const sortedPoints = validPoints.sort((a, b) => +a.color - +b.color)
    const n = sortedPoints.length

    function averagePosition(points: { x: number; y: number }[]): { x: number; y: number } {
      const sum = points.reduce((acc, point) => ({x: acc.x + point.x, y: acc.y + point.y}), {x: 0, y: 0})
      return {x: sum.x / points.length, y: sum.y / points.length}
    }

    const P0 = averagePosition(sortedPoints.slice(0, sampleSize))
    const P1 = averagePosition(sortedPoints.slice(Math.floor(n / 4), Math.floor(n / 4) + sampleSize))
    const P2 = averagePosition(sortedPoints.slice(Math.floor(n / 2), Math.floor(n / 2) + sampleSize))
    const P3 = averagePosition(sortedPoints.slice(n - 1 - sampleSize, n - 1))

    return [[P0.x, P0.y], [P1.x, P1.y], [P2.x, P2.y], [P3.x, P3.y]]
  }

  private getArrowShapes(arrow: number[][], color: string = 'black'): PlotShape[] {
    return [
      this.getArrowBody(arrow, 'white', 7),
      this.getArrowBody(arrow, color, 5),
      this.getArrowHead(arrow, 'white', 7),
      this.getArrowHead(arrow, color, 5),
      this.getArrowTail(arrow, color)
    ]
  }

  private getArrowBody(arrow: number[][], color: string = 'black', width: number = 4): PlotShape {
    const start = `${arrow[0][0]},${arrow[0][1]}`
    const ctrl1 = `${arrow[1][0]},${arrow[1][1]}`
    const ctrl2 = `${arrow[2][0]},${arrow[2][1]}`
    const end = `${arrow[3][0]},${arrow[3][1]}`
    return {type: 'path', path: `M ${start} C ${ctrl1} ${ctrl2} ${end}`, line: {color: color, width: width}}
  }

  private getArrowHead(arrow: number[][], color: string = 'black', width: number = 4, arrowSize: number = 0.3): PlotShape {

    const angle = Math.atan2(arrow[3][1] - arrow[2][1], arrow[3][0] - arrow[2][0])

    const arrowPoint1 = {
      x: arrow[3][0] - arrowSize * Math.cos(angle - Math.PI / 6),
      y: arrow[3][1] - arrowSize * Math.sin(angle - Math.PI / 6)
    }
    const arrowPoint2 = {
      x: arrow[3][0] - arrowSize * Math.cos(angle + Math.PI / 6),
      y: arrow[3][1] - arrowSize * Math.sin(angle + Math.PI / 6)
    }
    return {
      type: 'path',
      path: `M ${arrow[3][0]},${arrow[3][1]} L ${arrowPoint1.x},${arrowPoint1.y} L ${arrowPoint2.x},${arrowPoint2.y} Z`,
      fillcolor: color,
      line: {color: color, width: width}
    }
  }

  private getArrowTail(arrow: number[][], color: string = 'black', radius: number = 0.5): PlotShape {
    return {
      type: 'circle',
      xref: 'x',
      yref: 'y',
      x0: arrow[0][0] - radius,
      y0: arrow[0][1] - radius,
      x1: arrow[0][0] + radius,
      y1: arrow[0][1] + radius,
      fillcolor: color,
      line: {color: 'white', width: 1}
    }
  }

  private getConfig() {
    return {
      staticPlot: false,
      scrollZoom: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d', 'select2d', 'pan2d', 'lasso2d', 'autoScale2d'],
      displaylogo: false,
      toImageButtonOptions: {
        'filename': `Pseudotime_plot`
      }
    }
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(PSEUDOTIME_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(PSEUDOTIME_DIALOG)
  isOpen = () => this.dialogService.isOpen(PSEUDOTIME_DIALOG)

  close() {
    this.data = undefined
    this.dialogService.close(PSEUDOTIME_DIALOG)
  }

}
