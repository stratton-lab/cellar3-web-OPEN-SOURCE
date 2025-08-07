import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NameToColor, Trace} from "../../2Dplot.interface";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";

@Component({
  selector: 'barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnChanges {

  @Input() multiGroups: Trace[][]
  @Input() colors: NameToColor

  data: Plotly.Data[] = [{values: [], labels: [], type: 'bar'}]
  layout: Plotly.Layout
  config = this.getConfig()

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['multiGroups']) {
      this.data = this.getTraces()
      this.layout = this.getLayout()
    }
  }

  /**
   * Returns group names (such as Cell Type)
   * @private
   */
  private getGroupNames(): string[] {
    const groupNames = new Set<string>();
    this.multiGroups.forEach(groups => groups.forEach(group => groupNames.add(group.name)))
    return Array.from(groupNames)
  }

  private getSelectionsNames() {
    return this.multiGroups.map((v, idx) => idx == 0 ? 'Target' : 'Background')
  }

  private getTraces(){
    return this.getGroupNames().map(groupName => ({
      name: groupName,
      type: 'bar',
      marker: {color: this.colors?.[groupName]},
      showlegend: true,
      hovertemplate: `Cells: %{y:i}<extra></extra>`,
      x: this.getSelectionsNames(),
      y: this.multiGroups.map(groups => groups.find(group => group.name === groupName)?.points.length ?? 0)
    }))
  }

  private getLayout() {
    return {
      barmode: 'stack',
      autosize: true,
      margin: {t: 0, b: 0, l: 0, r: 0},
      legend: {
        itemclick: false, itemdoubleclick: false, x: 0, xanchor: 'left', y: -0.2, yanchor: 'top', orientation: 'h'
      }
    }
  }

  private getConfig() {
    return {
      displayModeBar: false
    }
  }
}
