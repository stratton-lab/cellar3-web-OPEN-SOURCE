import {Component, Input} from '@angular/core';
import {CellTooltipService} from "./cell-tooltip.service";
import {CellTooltip} from "./cell-tooltip.interface";

@Component({
  selector: 'cell-tooltip',
  templateUrl: './cell-tooltip.component.html',
  styleUrls: ['./cell-tooltip.component.scss']
})
export class CellTooltipComponent {

  @Input() tooltipData: CellTooltip | null

  constructor(public tooltipService: CellTooltipService) {
  }


}
