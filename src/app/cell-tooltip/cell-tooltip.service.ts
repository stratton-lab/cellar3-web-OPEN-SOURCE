import {Injectable} from '@angular/core';
import {CustomData, InfoFields} from "./cell-tooltip.interface";

@Injectable({
  providedIn: 'root'
})
export class CellTooltipService {

  DEFAULT_IMAGE = 'assets/images/tooltip/Default.png'

  AVAILABLE_IMAGES = new Set(['Astrocytes', 'Choroid Plexus Cells', 'Default', 'Endothelial Cells',
    'Ependymal Cells', 'Fibroblasts', 'Neuroblasts', 'Neurons', 'Pericytes'])


  /**
   * @todo Use normalized names from dataset meta file.
   * @param cellType
   */
  findIllustrativeImage(cellType: string | undefined): string {
    if (!cellType || cellType == 'n/a' || !this.AVAILABLE_IMAGES.has(cellType)) return this.DEFAULT_IMAGE
    return 'assets/images/tooltip/' + cellType + '.png'
  }

  getTooltipX(clientX: number) {
    const xOffset = 10
    let hoverX = clientX + window.scrollX + xOffset
    const tooltipWidth = 200
    const rightEdge = window.innerWidth + window.scrollX
    if (hoverX + tooltipWidth > rightEdge) {
      hoverX = clientX + window.scrollX - tooltipWidth - xOffset
    }
    return hoverX
  }

  getTooltipY(clientY: number) {
    const yOffset = 10
    let hoverY = clientY + window.scrollY + yOffset
    const tooltipHeight = 200
    const bottomEdge = window.innerHeight + window.scrollY
    if (hoverY + tooltipHeight > bottomEdge) {
      hoverY = clientY + window.scrollY - tooltipHeight - yOffset;
    }
    return hoverY
  }

  getTooltipData($event: any, meta: any) {
    const points = $event.points
    const point = points[0];
    return {
      x: this.getTooltipX($event.event.clientX),
      y: this.getTooltipY($event.event.clientY),
      cellId: CustomData.getCellId(point.customdata),
      cellType: this.getTooltipField(meta, point, InfoFields.CELL_TYPE, CustomData.CELL_TYPE_INDEX),
      condition: this.getTooltipField(meta, point, InfoFields.CONDITION, CustomData.CONDITION_INDEX),
      sampleName: this.getTooltipField(meta, point, InfoFields.SAMPLE, CustomData.SAMPLE_NAME_INDEX),
      imgSrc: this.findIllustrativeImage(point.customdata?.[1])
    }
  }

  /**
   *
   * @param meta
   * @param point
   * @param field cellType, sample, condition
   * @param customDataIndex CustomData
   * @private
   */
  private getTooltipField(meta: any, point: any, field: string, customDataIndex: number) {
    const value = point.customdata?.[customDataIndex] // Ex: Pos
    const column = meta?.info[field] // condition -> orig.ident (maps field to dataset column)
    return meta?.labelsRemap?.[column]?.[value] ?? value
  }

}
