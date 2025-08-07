export class Tooltip {
  static getTooltipX(clientX: number, tooltipWidth = 200, adjustFactor=window.scrollX) {
    const xOffset = 10
    let hoverX = clientX + adjustFactor + xOffset
    const rightEdge = window.innerWidth + adjustFactor
    if (hoverX + tooltipWidth > rightEdge) {
      hoverX = clientX + adjustFactor - tooltipWidth - xOffset
    }
    return hoverX
  }

  static getTooltipY(clientY: number, tooltipHeight = 200, adjustFactor=window.scrollY) {
    const yOffset = 10
    let hoverY = clientY + adjustFactor + yOffset
    const bottomEdge = window.innerHeight + adjustFactor
    if (hoverY + tooltipHeight > bottomEdge) {
      hoverY = clientY + adjustFactor - tooltipHeight - yOffset
    }
    return hoverY
  }
}
