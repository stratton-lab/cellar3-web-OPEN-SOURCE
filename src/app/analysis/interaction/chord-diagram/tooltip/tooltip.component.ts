import {Component} from '@angular/core';
import {Tooltip} from "../../../../tooltip";
import {InteractionData, InteractionTooltip} from "./interaction-tooltip.interface";

@Component({
  selector: 'interactions-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class InteractionsTooltipComponent {
  data: InteractionTooltip | null = null


  showTooltip(event: any, info: InteractionData) {
    this.data = {
      x: Tooltip.getTooltipX(event.clientX, 250, -50),
      y: Tooltip.getTooltipY(event.clientY, 200, -90),
      info: info
    }
  }

  hideTooltip = () => this.data = null

}
