import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import * as d3 from 'd3';
import {Chords} from 'd3';
import {ChordData} from "./chord.interface";
import {InteractionsTooltipComponent} from "./tooltip/tooltip.component";
import {DialogService, INTERACTION_DETAILS_DIALOG} from "../../../dialog.service";
import {InteractionDetailsInput} from "../interaction.interface";

@Component({
  selector: 'chord-diagram',
  templateUrl: './chord-diagram.component.html',
  styleUrls: ['./chord-diagram.component.scss']
})
export class ChordDiagramComponent implements AfterViewInit, OnChanges {

  @ViewChild('interactionsTooltipComponent') tooltip: InteractionsTooltipComponent

  @Input() data: ChordData[]
  @Input() datasetId: string
  @Input() species: string

  // Calculated from data
  names: string[]
  matrix: number[][]

  // Display
  svg: any

  // CellChat colors from https://github.com/sqjin/CellChat/blob/e4f68625b074247d619c2e488d33970cc531e17c/R/visualization.R#L42
  colors = ['#E41A1C', '#377EB8', '#4DAF4A', '#984EA3', '#F29403', '#F781BF', '#BC9DCC', '#A65628', '#54B0E4', '#222F75', '#1B9E77', '#B2DF8A',
    '#E3BE00', '#FB9A99', '#E7298A', '#910241', '#00CDD1', '#A6CEE3', '#CE1261', '#5E4FA2', '#8CA77B', '#00441B', '#DEDC00', '#B3DE69', '#8DD3C7', '#999999']

  // Supplied params
  size = 500 // width and height
  legendWidth = 200
  legendItemVerticalMargin = 20
  legendLeftMargin = 10
  legendTextSize = 12
  defaultRibbonOpacity = 0.75
  minRibbonOpacity = 0.6

  // Calculated
  width = this.size + this.legendWidth
  height = this.size
  innerRadius = Math.min(this.size, this.size) * 0.5 - 20
  outerRadius = this.innerRadius + 6

  constructor(private elRef: ElementRef, private logger: NGXLogger, private dialogService: DialogService) {
  }

  ngAfterViewInit(): void {
    this.initSVG()
    this.drawChart(this.data)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']?.previousValue != changes['data']?.currentValue) {
      this.logger.info('[ChordDiagram] (ngOnChanges) Updating chord diagram')
      this.drawChart(this.data)
    }
  }

  initSVG() {
    this.svg = d3.select(this.elRef.nativeElement).select("#chord-svg")
    const topLeftX = -this.width / 2 + this.legendWidth / 2 // Draws circle with center 0 on the left size of available space
    const topLeftY = -this.size / 2
    const viewBox = [topLeftX, topLeftY, this.width, this.height]
    this.svg.attr("width", this.width).attr("height", this.height).attr("viewBox", viewBox)
  }

  /**
   * Extract unique names from the `source` and `target` fields
   * @param data
   */
  getNames(data: ChordData[]): string[] {
    return Array.from(new Set(data.flatMap(d => [d.source, d.target])))
  }

  /**
   * Returns a n*n square matrix.
   */
  getMatrix(data: ChordData[]): number[][] {
    // Create an index map to map each name to a unique integer
    const index: Map<string, number> = new Map(this.names.map((name, i) => [name, i]));

    // Create a matrix initialized with zeros
    const matrix: number[][] = Array.from({length: this.names.length}, () => new Array(this.names.length).fill(0))


    for (const {source, target, prob} of data) {
      const sourceIndex = index.get(source);
      const targetIndex = index.get(target);

      // Ensure indices are valid before updating the matrix
      if (sourceIndex !== undefined && targetIndex !== undefined) {
        matrix[sourceIndex][targetIndex] += prob
      }
    }
    return matrix
  }

  /**
   * Draws the external arcs, corresponding to the nodes, from which the ribbons (connections) are drawn.
   */
  drawArcs(chords: Chords) {
    this.svg.append("g").selectAll().data(chords.groups).join("g").append("path")
      .attr("d", d3.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius))
      .attr("fill", (d: any) => this.colors[d.index])
      .attr("stroke", "#fff")
  }


  /**
   * Draws connections between nodes/cell types. The thickness of the connection represents the value.
   * @param chords
   */
  drawRibbons(chords: Chords) {
    this.svg.append("g")
      .attr("fill-opacity", this.defaultRibbonOpacity)
      .selectAll()
      .data(chords)
      .join("path")
      .attr("class", "ribbon")
      .attr("d", d3.ribbonArrow().radius(this.innerRadius - 0.5).padAngle(1 / this.innerRadius))
      .attr("fill", (d: any) => this.colors[d.target.index])
      .style("mix-blend-mode", "multiply")
      .style("cursor", "pointer")
      .on("mouseover", (event: any, d: any) => this.showTooltip(event, d))
      .on("mouseout", () => this.hideTooltip())
      .on("click", (event: any, d: any) => this.showInteractionDialog(event, d))
  }

  /**
   * Increases the opacity of given ribbon and decreases opacity of all others.
   * @param ribbon
   */
  highlightRibbon(ribbon: HTMLElement) {
    d3.select(ribbon).attr("opacity", 1)
    this.svg.selectAll(".ribbon").filter((_: any, i: any, nodes: any) => nodes[i] !== ribbon).attr("opacity", this.minRibbonOpacity)
  }

  resetRibbonHighlights() {
    this.svg.selectAll(".ribbon").attr("opacity", this.defaultRibbonOpacity)
  }

  showTooltip = (event: any, d: any) => {
    this.highlightRibbon(event.currentTarget)
    const source = this.names[d.source.index]
    const target = this.names[d.target.index]
    const value = d.source.value
    const info = {
      source: source,
      target: target,
      value: value
    }
    this.tooltip.showTooltip(event, info)
  }

  hideTooltip() {
    this.resetRibbonHighlights()
    this.tooltip.hideTooltip()
  }

  drawLegend() {
    const legendX = this.size / 2 + this.legendLeftMargin
    const legendY = -this.size / 2 + 20
    const legend = this.svg.append("g").attr("transform", `translate(${legendX}, ${legendY})`)
    this.names.forEach((name, i) => {
      const legendItem = legend.append("g").attr("transform", `translate(0, ${i * this.legendItemVerticalMargin})`)
      legendItem.append("rect").attr("width", 15).attr("height", 15).attr("fill", this.colors[i])
      legendItem.append("text")
        .attr("x", 20)
        .attr("y", this.legendTextSize)
        .text(name)
        .style("font-size", `${this.legendTextSize - 2}px`)
        .attr("alignment-baseline", "middle");
    })
  }

  /**
   * Based on https://observablehq.com/@d3/directed-chord-diagram/2?collection=@d3/d3-chord
   */
  drawChart(data: ChordData[]) {
    if (!data || !this.svg) return
    this.names = this.getNames(data)
    this.matrix = this.getMatrix(data)
    const chord = d3.chordDirected().padAngle(12 / this.innerRadius).sortSubgroups(d3.descending).sortChords(d3.descending)
    const chords = chord(this.matrix)
    // Clean
    this.svg.selectAll("*").remove()
    // Draw
    this.drawArcs(chords)
    this.drawRibbons(chords)
    this.drawLegend()
  }

  private showInteractionDialog(event: any, d: any) {
    const source = this.names[d.source.index]
    const target = this.names[d.target.index]
    const interactionDetailsInput: InteractionDetailsInput = {
      datasetId: this.datasetId,
      species: this.species,
      source: source,
      target: target,
      ligandsReceptors: this.data.filter(row => row.source == source && row.target == target).map(row => {
        return {ligand: row.ligand, receptor: row.receptor, prob: row.prob, evidence: row.evidence}
      })
    }
    this.dialogService.open(INTERACTION_DETAILS_DIALOG, interactionDetailsInput)
  }
}
