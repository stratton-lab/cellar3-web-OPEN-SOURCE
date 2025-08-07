import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {NameToColor, Trace} from "../../2Dplot.interface";
import {Plotly as PlotlyInterface} from "angular-plotly.js/lib/plotly.interface";
import {CellsTooltipComponent} from "../../../cells-tooltip/cells-tooltip.component";
import {PlotlyComponent} from "angular-plotly.js";
import * as Plotly from 'plotly.js-dist-min';
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnChanges {

  @Input() groups: Trace[]
  @Input() colors: NameToColor
  @Input() revision: number

  @Input() tooltipText: string = ""
  @Input() animateTraceIdx: number | null

  // Sends point number corresponding to group index
  @Output() onSelected = new EventEmitter<number>()

  data: any = [{values: [], labels: [], type: 'pie'}]
  layout: PlotlyInterface.Layout
  config = this.getConfig()

  @ViewChild('cellsTooltipComponent') cellsTooltip: CellsTooltipComponent
  @ViewChild('plotlyPlot') plotlyPlot: PlotlyComponent

  constructor(private logger: NGXLogger) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groups'] || changes['revision']) {
      this.data = this.getTraces()
      this.layout = this.getLayout()
      this.refreshTooltip()
    }

    if (changes['animateTraceIdx']?.previousValue != changes['animateTraceIdx']?.currentValue) {
      this.logger.info(`[PieChart] Removing all trace animations ${this.animateTraceIdx}`)
      this.plotlyPlot.plotlyInstance?.querySelectorAll('.slice')?.forEach(slice => slice.classList.remove('pulse'))
      if (this.animateTraceIdx != null) {
        this.logger.info(`[PieChart] Animating trace ${this.animateTraceIdx}`)
        this.plotlyPlot.plotlyInstance?.querySelector(`.slice:nth-child(${this.animateTraceIdx + 1})`)?.classList.add('pulse')
      }
    }
  }

  /**
   * Prevents the previous tooltip to be shown after piechart was updated, as mouse might now hover a different group.
   * @todo Instead of hiding tooltip, display data for newly hovered group.
   * @private
   */
  private refreshTooltip() {
    if (this.cellsTooltip?.isShown()) this.cellsTooltip?.hideTooltip()
  }

  private getLayout() {
    return {
      autosize: true,
      margin: {t: 0, b: 0, l: 0, r: 0},
      transition: {
        duration: 500,
        easing: 'cubic-in-out'
      },
      legend: {
        itemclick: false, itemdoubleclick: false, x: 0, xanchor: 'left', y: -0.2, yanchor: 'top', orientation: 'h'
      }
    }
  }

  private getTraces() {
    return [{
      type: 'pie',
      sort: false,
      hoverinfo: 'none',
      hovertemplate: '',
      labels: this.groups.map(group => group.name),
      values: this.groups.map(group => group.points.length),
      marker: {colors: this.groups.map(group => this.colors?.[group.name])}
    }]
  }

  private getConfig() {
    return {
      displayModeBar: false
    }
  }

  /**
   * @todo when click on group, shows context menu with actions
   * @private
   */
  onGroupClick($event: any) {
    const selectedPoint = $event.points?.[0]
    if (selectedPoint) {
      this.onSelected?.next(selectedPoint.pointNumber)
    }
  }

  showTooltip = ($event: any) => this.cellsTooltip.showTooltip($event, this.tooltipText)

  hideTooltip = () => this.cellsTooltip.hideTooltip()

  forceRedrawPlot() {
    if (this.plotlyPlot.plotlyInstance) Plotly.redraw(this.plotlyPlot.plotlyInstance)
  }
}
