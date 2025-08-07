import {Component} from '@angular/core';
import {GeneTooltip} from "./gene-tooltip.interface";
import {Tooltip} from "../tooltip";

@Component({
  selector: 'gene-tooltip',
  templateUrl: './gene-tooltip.component.html',
  styleUrls: ['./gene-tooltip.component.scss']
})
export class GeneTooltipComponent {
  data: GeneTooltip | null = null


  showTooltip($event: any) {
    const points = $event.points
    if (points.length > 0) {
      const point = points[0]
      this.data = {
        x: Tooltip.getTooltipX($event.event.clientX, 250, -50),
        y: Tooltip.getTooltipY($event.event.clientY, 200, -90),
        name: point.text,
        description: this.getDescription(point.text),
        fields: [
          {name: 'Expression', value: point.data.name},
          {name: 'LogFC', value: point.x?.toFixed(1)},
          {name: '-Log10 P', value: point.y?.toFixed(1)}
        ]
      }
    }

  }

  hideTooltip = () => this.data = null

  private getDescription(geneName: string) {
    return "No description available"
  }
}
