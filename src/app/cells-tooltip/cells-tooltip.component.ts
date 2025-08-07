import {Component} from '@angular/core';
import {CellsTooltip} from "./cells-tooltip.interface";
import {Tooltip} from "../tooltip";

@Component({
  selector: 'cells-tooltip',
  templateUrl: './cells-tooltip.component.html',
  styleUrls: ['./cells-tooltip.component.scss']
})
export class CellsTooltipComponent {
  data: CellsTooltip | null = null


  showTooltip($event: any, tooltipText:string) {
    const points = $event.points
    if (points.length > 0) {
      const point = points[0]
      this.data = {
        x: Tooltip.getTooltipX($event.event.clientX, 250, -10),
        y: Tooltip.getTooltipY($event.event.clientY, 200, -90),
        color: point.color,
        count: point.value,
        name: point.label,
        text: tooltipText
      }
    }

  }

  hideTooltip = () => this.data = null

  isShown = () => this.data != null

}
