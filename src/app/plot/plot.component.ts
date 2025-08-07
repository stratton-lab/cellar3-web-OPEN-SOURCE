import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Message} from "../message";
import {
  NameToColor,
  PlotConfig,
  PlotState,
  RemovedPoint,
  SimpleSelectionEvent,
  Trace,
  TracePoint,
  TraceToPoints
} from "./2Dplot.interface";
import {Plotly as PlotlyType} from "angular-plotly.js/lib/plotly.interface";
import {PlotData} from 'plotly.js-dist-min';
import {
  CLUSTER_ANNOTATE_DIALOG,
  DialogService,
  DOT_PLOT_DIALOG,
  GENE_EXPLORER_DIALOG,
  SAMPLES_MULTI_SELECTED_DIALOG,
  SAMPLES_SELECTED_DIALOG,
  UMAP_PLOT_DIALOG,
  VIOLIN_PLOT_DIALOG
} from "../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../backend.service";
import {PlotlyComponent} from "angular-plotly.js";
import _ from "lodash";
import {CellTooltipService} from "../cell-tooltip/cell-tooltip.service";
import {CellTooltip, CustomData, groupNameToCustomDataIndex} from "../cell-tooltip/cell-tooltip.interface";
import {EmbeddingsCategory, Group, GroupName, Link} from "../dataset";
import {DiffExpressionInput} from "../analysis/diff-expression/gene-expression";
import {UMAPPlotInput} from "../umap/umap.interface";
import {SelectedGene} from "../analysis/diff-expression/volcano/volcano";
import Fuse from "fuse.js";
import $ from "jquery";
import {environment} from "../../environments/environment";
import {GeneExplorerInput} from "./gene-explorer/gene-explorer.interface";
import {GenesPlotInput} from "../violin/violin.interface";
import {DatasetsService} from "../datasets/datasets.service";

@Component({
  selector: 'plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild('plotlyPlot') plotlyPlot: PlotlyComponent;

  @Input() datasetId: string // ID of the dataset to load
  @Input() groupColumn: string // Column used to group cells into traces and assign colors. Clusters stay same.
  @Input() embeddingName: string // Key of the Matrix containing 2D coordinates of cells.

  msg: Message | null = null
  busy = false // Loading of dataset from the server
  plot: PlotConfig | null = null // Configuration for Plotly received from the server, containing 'data' field

  target: TracePoint[] | null = null // First selection of points

  tooltipData: CellTooltip | null = null // Data to show for a hovered point

  states: PlotState[] = [] // Used for undo feature. Stores plot data after each modification

  cellsState: { [key: string]: string[] } // Keeps track of cellIds still present in dataset (not deleted)

  genesIndex: Fuse<SelectedGene> | null // Searchable genes

  layout: PlotlyType.Layout = this.getLayout()
  config: PlotlyType.Config = this.getConfig()
  width: number | null = null

  SPATIAL_EMBEDDING_PREFIX = 'spatial_' // All spatial embedding keys have this prefix.

  constructor(
    private logger: NGXLogger,
    private backendService: BackendService,
    private datasetsService: DatasetsService,
    private tooltipService: CellTooltipService,
    private dialogService: DialogService,
    private elRef: ElementRef
  ) {
    this.logger.info('Displaying 2D embeddings component.')
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // We decide to show legend on the right or under plot, based on available width
    this.width = this.elRef.nativeElement.offsetWidth

    // Handle hover over labels
    this.setupTraceHighlightOnLegendHover()
  }

  /**
   * @todo Also listen to input group
   * @todo Check whether datasetId has actually changed i.e. different from before
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasetId']) {
      this.load()
    }
  }


  /**
   * Retrieves dataset plotly data from server based on datasetId
   */
  load() {
    this.msg = null
    this.busy = true
    this.target = null // resetting selection

    this.backendService.getCells2DPlot(this.datasetId, this.groupColumn, this.embeddingName).subscribe({
      next: (plot: PlotConfig) => {
        this.busy = false
        if (!this.groupColumn) this.groupColumn = plot?.group
        if (!this.embeddingName) this.embeddingName = plot?.embedding
        this.setTraces(plot)
        this.plot = plot
        this.layout = this.getLayout() // Restoring default autorange, in case user set range by  zoom/pan action
        this.genesIndex = plot.genes ? this.getIndexedGenes(plot.genes) : null

        if (this.plot?.meta) {
          this.plot.meta.embeddingsCategories = this.getEmbeddingsCategories(this.plot?.meta.embeddings)
        }
      },
      error: err => {
        this.busy = false
        // @todo reset data on error
        this.msg = {title: 'Could not load dataset.', detail: err?.error?.[0] || err?.error?.detail}
      }
    })
  }


  /**
   * Makes changes to the traces loaded from the server before they are displayed.
   * @param plot
   */
  setTraces(plot: PlotConfig) {
    plot?.data.forEach((trace: any, index: number) => this.processTrace(trace, plot.meta?.labelsRemap, index))
  }

  /**
   * Changes properties of the trace assigned at the server. This allows to control the visual part on frontend.
   * @param trace Plotly trace dict object.
   * @param labelsRemap Dictionary to change the names of the labels. {originalName -> NewName}
   * @param index Index (order) of the trace. starts at 0.
   */
  processTrace(trace: any, labelsRemap: any, index: number) {
    trace.type = 'scattergl'
    trace.mode = 'markers'
    trace.showlegend = true
    trace.hoverinfo = 'none'
    trace.hovertemplate = ''
    trace.legendgroup = 'unassigned'
    trace.legendgrouptitle = null
    trace.name = labelsRemap?.[this.groupColumn]?.[trace.name] ?? trace.name
    this.applyPreviousChanges(trace)
  }

  setupTraceHighlightOnLegendHover() {
    const self = this
    const wrapper = $('body')
    wrapper.off('mouseenter', '.legend .traces')
    wrapper.off('mouseleave', '.legend')
    wrapper.on('mouseenter', '.legend .traces', function () {
      const index = $(this).index()
      self.highlightTrace(index)
    })
    wrapper.on('mouseleave', '.legend', function () {
      self.removeHighlights()
    })
  }

  /**
   * This assumes that order of legend items and traces are same.
   * @todo Update plot after modifying ALL traces for better performance.
   * @param legendIndex
   */
  highlightTrace(legendIndex: number) {
    this.logger.info(`[PlotComponent] (highlightTrace) index: ${legendIndex}`)
    this.plot?.data?.forEach((trace, traceIndex) => {
      if (traceIndex != legendIndex) {
        trace.opacity = 0.1
      } else {
        trace.opacity = 1
      }
    })
  }

  /**
   * Restores visibility of all traces.
   */
  removeHighlights() {
    this.plot?.data?.forEach(trace => {
      trace.opacity = 1
    })
  }

  /**
   * For each point, if its in map, assign existing customdata to it, if not remove it.
   * Points need to be removed in descending order.
   * @fixme BUG1: With spatial data, reassign Condition is not saved between tabs.
   * @todo customdata is updated but point not (always) moved between traces
   * @param trace
   */
  applyPreviousChanges(trace: any) {
    if (_.isEmpty(this.cellsState)) return
    this.logger.info('Cells were modified. Applying their state to new tab.')
    const newX: number[] = []
    const newY: number[] = []
    const newCustomdata: any[] = []
    trace.customdata?.forEach((customdata: any[], pointIndex: number) => {
      const cellId = CustomData.getCellId(customdata)
      if (cellId in this.cellsState) {
        newCustomdata.push(this.cellsState[cellId])
        newX.push(trace.x[pointIndex])
        newY.push(trace.y[pointIndex])
      }
    })
    trace.x = newX
    trace.y = newY
    trace.customdata = newCustomdata
  }


  /**
   * Shows dialog when clicking on a cluster name in the legend.
   * @param $event
   */
  showAnnotateClusterDialog($event: any) {
    if ($event.expandedIndex != undefined) {
      const trace = $event.data[$event.expandedIndex]
      this.dialogService.open(CLUSTER_ANNOTATE_DIALOG, trace)
    }
    return false
  }

  onSampleSelected($event: any) {
    this.logger.info('[PlotComponent] (onSampleSelected)', 'Clicked on one sample', $event)
  }

  analyzeSelection() {
    if (this.target != null && this.target.length) {
      this.showSimpleSelectionDialog(this.target)
      this.target = null
    }
  }

  /**
   * Manages the selection of multiple clusters used for comparison, such as dge.
   */
  useRestAsBackground() {
    this.logger.info('[PLotComponent] (useRestAsBackground)', 'Calling multiselect dialog using rest as background')
    this.showClusterComparisonDialog(this.target, null)
    this.target = null
  }

  /**
   * Closes the menu so the user can select cells to use as background.
   */
  startBackgroundSelection($event: MouseEvent) {
    if ($event.target) {
      const menu = $($event.target).closest('.dropdown-menu')
      menu.css('display', 'none')
      setTimeout(() => menu.css('display', ''), 100)
    }
  }

  toggleShowCompareSelectionMenu($event: MouseEvent) {
    if ($event.target) {
      $($event.target)?.closest('.dropdown').toggleClass('show-menu')
    }
  }


  /**
   * Called by either user selection OR clearSelection
   * Called when selection object changed :
   * - When user finished selecting with lasso
   * - When selection changed programmatically: by modifying traces or double click
   * @param $event
   */
  onSamplesSelected($event: any) {
    const selection = $event?.points
    if (!selection?.length) {
      if (this.plot?.data?.[0]?.selectedpoints == undefined) this.cancelSelection() // User wants to deselect
      this.clearSelection()
      return
    }

    if (this.target == null) {
      this.target = selection // First selection
    } else { // Second selection
      this.logger.info('[PlotComponent] (onSamplesSelected)', 'Calling multi select dialog with target and current selection as backend')
      this.showClusterComparisonDialog(this.target, selection)
      this.target = null
    }
  }

  cancelSelection() {
    setTimeout(() => this.target = null)
  }

  /**
   * @param selectedSamples
   */
  showSimpleSelectionDialog(selectedSamples: TracePoint[]) {
    if (this.plot && selectedSamples?.length > 0) {
      const selectedSampleIds = new Set(selectedSamples.map(point => point.customdata[0] as number))
      const selectionEvent: SimpleSelectionEvent = {
        datasetId: this.datasetId,
        species: this.plot.meta.species,
        plot: this.getPlot(),
        selectedSampleIds: selectedSampleIds,
        colors: this.getColors(),
        undoLimit: this.states.length,
        plotComponent: this
      }
      this.dialogService.open(SAMPLES_SELECTED_DIALOG, selectionEvent)
    } else {
      this.logger.info('[PlotComponent] (showSimpleSelectionDialog)', 'Empty simple selection with lasso.')
      this.clearSelection()
    }
  }

  showClusterComparisonDialog(selectedTarget: TracePoint[] | null, selectedBackground: TracePoint[] | null) {
    if (selectedTarget && selectedTarget?.length > 0) {
      const target = this.getCellIds(selectedTarget)
      const background = this.getSelectedBackground(target, selectedBackground)
      this.logger.info('[PlotComponent] (showClusterComparisonDialog)',
        `Using ${target.length} cells as target and ${background?.length} cells as background.`)
      this.dialogService.open(SAMPLES_MULTI_SELECTED_DIALOG, {
        datasetId: this.datasetId,
        species: this.plot?.meta?.species,
        target: {cellIds: target, cluster: selectedTarget},
        background: {cellIds: background, clusters: [selectedBackground || this.getCellsForIds(background)]},
        colors: this.getColors(),
        plotComponent: this
      })
    } else {
      this.logger.info('[PlotComponent] (showClusterComparisonDialog)', 'Empty multi selections.')
    }
  }

  getColors(): NameToColor {
    const labelToColor: NameToColor = {}
    this.plot?.data?.forEach((trace: PlotData) => {
      if (trace.name && trace.marker.color) labelToColor[trace.name] = trace.marker.color?.toString()
    })
    return labelToColor
  }

  /**
   * Changes how cells are grouped (colored)
   * @param group
   */
  updateGroupColumn(group: Group) {
    if (this.isGroupAvailable(group)) {
      this.groupColumn = group.key
      this.load()
    }
  }

  /**
   * Changes where cells are displayed (Their 2D coordinates)
   * @param embeddingName
   */
  updateEmbeddingMatrix(embeddingName: string) {
    this.embeddingName = embeddingName
    this.adaptGroupColumnToEmbedding()
    this.load()
  }

  /**
   * If spatial embedding has been selected, we makre sure to auto-select the Cell Type group tab.
   */
  adaptGroupColumnToEmbedding() {
    if (this.isSpatialEmbeddingSelected()) {
      this.logger.info(`Spatial embedding selected. Auto-selecting Cell Type group.`)
      const cellTypeField = this.getGroupKey(GroupName.CELL_TYPE)
      if (cellTypeField) {
        this.groupColumn = cellTypeField
      } else {
        this.logger.warn('Could not auto-select Cell Type group. Group not available.')
      }
    }
  }

  /**
   * Returns the key of a group based on its name.
   * @param name
   */
  getGroupKey(name: string): string | undefined {
    return _.find(this?.plot?.meta?.groups, {name: name})?.key
  }

  /**
   * Categorizes embeddings into Integrated and Spatial based on key prefix
   * @param embeddings
   */
  getEmbeddingsCategories(embeddings?: Group[]): EmbeddingsCategory[] {
    const [spatial, integrated] = _.partition(embeddings, emb => emb.key.startsWith('spatial_'))
    return [{name: 'Integrated', embeddings: integrated}, {name: 'Spatial', embeddings: spatial}]
      .filter(cat => cat.embeddings?.length)
  }

  /**
   * Returns true if the embeddings category contains an embedding currently selected.
   * @param category
   */
  isActiveEmbeddingCategory(category: EmbeddingsCategory) {
    return category.embeddings.some(embedding => embedding.key == this.embeddingName)
  }

  /**
   * Whether the currently selected embedding is a spatial embedding.
   */
  isSpatialEmbeddingSelected() {
    return this.embeddingName?.startsWith(this.SPATIAL_EMBEDDING_PREFIX)
  }

  /**
   * If a non-spatial embedding is selected, all groups are available.
   * If a spatial embedding is selected, only Cell Type group is available.
   * @param group
   */
  isGroupAvailable = (group: Group) => !this.isSpatialEmbeddingSelected() || group.name == GroupName.CELL_TYPE

  getPlot = () => this.plotlyPlot

  /**
   * Shows tooltip with information about the hovered point.
   * @param $event
   */
  showTooltip($event: any) {
    if ($event.points.length > 0) this.tooltipData = this.tooltipService.getTooltipData($event, this.plot?.meta)
  }


  hideTooltip($event: any) {
    this.tooltipData = null
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Shift') this.logger.info('SHIFT select start')
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Shift') this.logger.info('SHIFT select end')
  }

  getTotalPoints = (data: PlotlyType.Data) => _.sum(data.map((trace: any) => trace.x.length))

  canUndo = () => this.states.length >= 1

  /**
   * We stack the current state just before making changes.
   * @param description
   * @param modifyPlotData
   */
  saveState(description: string, modifyPlotData: () => void) {
    if (this.plot?.data) {
      const clonedData = _.cloneDeep(this.plot?.data)
      clonedData.forEach(trace => delete trace.selectedpoints) // remove selections
      this.states.push({
        data: clonedData,
        description: description,
        parameters: {
          groupColumn: this.groupColumn,
          embeddingName: this.embeddingName
        }
      })
      this.logUndoStack('after adding state')
      modifyPlotData() // Runs the code that will change the dataset
      this.updateCellsState()
    }
  }

  /**
   * Keeps a map of cellId:customdata.
   * Executed after saving data state or loading it back (undo feature).
   * @todo {cellId:{customdata: string[], group2traceIdx:{groupName: traceIdx}}}
   */
  updateCellsState() {
    if (this.plot?.data) {
      const cellsState: { [key: string]: string[] } = {}
      this.plot?.data?.forEach(trace => {
        trace?.customdata?.forEach((cd: string[]) => {
          const cellId = CustomData.getCellId(cd)
          cellsState[cellId] = cd
        })
      })
      this.cellsState = cellsState
      this.logger.info('[PLotComponent] (updateCellsState)', 'Updated cells state map.')
    }

  }


  getLatestStateDescription(): String | null {
    return this.states.length > 0 ? this.states[this.states.length - 1].description : null
  }

  /**
   * Reverts to previous data state.
   */
  undo() {
    if (this.canUndo() && this.plot) {
      const previousState = this.states.pop() // // Returning previous stable state.
      if (previousState) {
        this.plot.data = previousState.data
        this.groupColumn = previousState.parameters.groupColumn
        this.embeddingName = previousState.parameters.embeddingName
        this.updateCellsState() // Updates cells state
      }
    }
  }

  logUndoStack(msg: string) {
    this.logger.info(`Undo stack ${msg} (${this.states.map(state => this.getTotalPoints(state.data))}).`)
  }


  /**
   * Returns cell ids of the selection
   */
  getCellIds(selection: (PlotData | TracePoint)[]): number[] {
    return selection.map(point => point.customdata[0] as number)
  }


  /**
   * Returns the ids of all points currently left on the plot (not removed by some delete / cleaning operation).
   */
  getAllCellIds(): number[] {
    const ids: number[] = []
    this.plot?.data?.forEach((trace: any) => {
      trace?.customdata?.forEach((customdata: any[]) => {
        ids.push(customdata[0] as number)
      })
    })
    return ids
  }

  getCellsForIds(ids: number[] | null): any[] {
    const ids_set = new Set(ids)
    const cells: any[] = []
    this.plot?.data?.forEach((trace: any, traceIndex: number) => {
      trace.x.map((x: any, i: number) => {
        if (ids_set.has(trace.customdata[i][0])) {
          cells.push({
            pointNumber: i,
            x: x,
            y: trace.y[i],
            data: trace,
            customdata: trace.customdata[i],
            curveNumber: traceIndex
          })
        }
      })
    })
    return cells
  }

  private generateBackgroundCellIds(target: number[]): number[] {
    const all = this.getAllCellIds()
    const targetSet = new Set(target)
    return all.filter(item => !targetSet.has(item))
  }

  private getSelectedBackground(target: number[], selectedBackground: TracePoint[] | null): number[] | null {
    if (selectedBackground) {
      this.logger.info('[Plot] (getSelectedBackground)', 'Using second selection as background.')
      return this.getCellIds(selectedBackground)
    } else {
      this.logger.info('[Plot] (getSelectedBackground)', 'No second selection. Using all cells except target as background.')
      return this.generateBackgroundCellIds(target)
    }
  }

  /**
   * Returns the embedding metadata matching the group key (ex: X_umap)
   * @param embeddingName
   */
  getEmbeddingMeta(embeddingName: string): Group | undefined {
    return this.plot?.meta?.embeddings?.find(embedding => embedding.key == embeddingName)
  }

  getCurrentEmbeddingImage(): string | undefined {
    const image = this.getEmbeddingMeta(this.embeddingName)?.image
    return image ? `${environment.mediaBackend}/singlocell-api/media/spatial/${this.datasetId}/${image}` : undefined
  }

  /**
   * Returns user-friendly group name (ex: Cell Type) matching  group key (column used in AnnData, ex: cell_type)
   * @param groupKey
   */
  getGroupName(groupKey: string): string | undefined {
    return this.plot?.meta?.groups?.find(group => group.key == groupKey)?.name
  }

  /**
   * Returns the AnnData column corresponding to the currently displayed grouping option.
   * This is used to update customdata, by knowing which field of customdata is currently used for grouping.
   */
  getCurrentGroupName(): string | undefined {
    return this.getGroupName(this.groupColumn)
  }

  /**
   * Manually specify axis ranges to apply slight (ex: 10%) zoom-out
   * @private
   */
  private getLayout() {
    return {
      xaxis: {anchor: "y", autorange: true, visible: false},
      yaxis: {anchor: "x", autorange: true, visible: false},
      legend: this.getLegendConfig(),
      showlegend: true,
      font: {family: 'Open_Sans', size: 14},
      dragmode: "lasso",
      autosize: true,
      hoverdistance: 5,
      margin: {l: 0, r: 0, b: 0, t: 40, pad: 4},
      height: 550,
      newselection: {
        line: {
          color: '#42bef4', dash: 'dot', width: 2
        }
      },
      activeselection: {
        fillcolor: '#42bef4',
        opacity: 0.2
      }
    }
  }

  /**
   * Returns position of the legend relative to plot.
   */
  getLegendConfig() {
    return this.width && this.width > 600 ? this.getVerticalLegendConfig() : this.getHorizontalLegendConfig()
  }

  getVerticalLegendConfig() {
    return {itemclick: false, itemdoubleclick: false, x: 1, xanchor: 'left', y: 0.5, yanchor: 'middle',}
  }

  getHorizontalLegendConfig() {
    return {
      itemclick: false, itemdoubleclick: false, x: 0.5, xanchor: 'center', y: -0.2, yanchor: 'top', orientation: 'h'
    }
  }

  private getConfig() {
    return {
      scrollZoom: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'resetScale2d', 'zoom2d', 'zoomIn2d', 'zoomOut2d'],
      displaylogo: false,
      toImageButtonOptions: {
        filename: `PCA_plot`,
        height: 1000,
        width: 1000,
      }
    }
  }

  /**
   * Returns a list of genes from current dataset that matches the query.
   * @param query
   */
  searchGenes = (query: string): SelectedGene[] => {
    return this.genesIndex?.search(query, {limit: 5}).map(hit => hit.item) || []
  }

  private getIndexedGenes(geneNames: string[]): Fuse<SelectedGene> {
    this.logger.info('[PlotComponent] (getIndexedGenes) Creating searchable index of genes.')
    const genesToIndex: SelectedGene[] = geneNames.map(geneName => {
      return {name: geneName, traceIdx: -1, pointIdx: -1}
    })
    return new Fuse(genesToIndex, {keys: ['name'], distance: 0})
  }

  /**
   * Shows a dialog with the UMAP expression plot of the selected gene.
   * @param gene
   */
  showUmapExpressionForGene(gene: SelectedGene) {
    this.showUmapDialog([gene.name])
  }


  getTracesTotal = (points: TraceToPoints) => _.sumBy(Object.values(points), o => o.length)

  /**
   * Used to update customdata when moving a cell to a different trace.
   * For example if the trace is grouped by Condition, when we move the point/cell to a different trace,
   * we also want to change the value for Condition in it's customdata.
   * Returns index inside the customdata array where the data corresponding to the current groupColumn is stored.
   * Foe example, the group column Condition is also stored in customdata index 2.
   * That way, even when we group and color by Cell Type, we can still show the condition in the Tooltip.
   * @private
   */
  private getMajorityGroupCustomDataIndex(): number | undefined {
    const traceLegendColumn = this.getCurrentGroupName()
    if (traceLegendColumn == undefined) return
    return groupNameToCustomDataIndex[traceLegendColumn]
  }

  /**
   * Displays gene expression UMAP plots, one plot per gene.
   * @param geneNames
   */
  showUmapDialog(geneNames: string[]) {
    const input: UMAPPlotInput = {
      datasetId: this.datasetId,
      geneNames: geneNames,
      embedding: this.embeddingName
    }
    this.dialogService.open(UMAP_PLOT_DIALOG, input)
  }

  showViolinPlot(geneNames: string[]) {
    const input: GenesPlotInput = {
      datasetId: this.datasetId,
      genes: geneNames,
      target: this.getAllCellIds(),
      background: []
    }
    this.dialogService.open(VIOLIN_PLOT_DIALOG, input)
  }

  showDotPlot(geneNames: string[]) {
    const input: GenesPlotInput = {
      datasetId: this.datasetId,
      genes: geneNames,
      target: this.getAllCellIds(),
      background: []
    }
    this.dialogService.open(DOT_PLOT_DIALOG, input)
  }

  showAnalysisDialog(target: number[], background: number[], dialog: string) {
    if (this.plot && target?.length && background?.length) {
      const input: DiffExpressionInput = {
        datasetId: this.datasetId,
        species: this.plot.meta.species,
        target: target,
        background: background,
        plotComponent: this
      }
      this.dialogService.open(dialog, input)
    } else {
      this.logger.warn("[SelectDialog] (showAnalysisDialog) Both target and background must have been selected")
    }
  }

  /**
   * Returns traces containing points that were selected, and only keeps these selected points in returned traces.
   * @param selectedCellIds
   */
  getPointsForSelection(selectedCellIds: Set<number>): Trace[] {
    if (this.plot) {
      return this.plot.data.map((trace, traceIdx): Trace => {
        const points: TracePoint[] = []
        trace.customdata.forEach((customdata: any[], pointNumber: number) => {
          if (selectedCellIds.has(customdata[0])) points.push({
            pointNumber: pointNumber,
            customdata: customdata,
            curveNumber: traceIdx
          })
        })
        return {traceIdx: traceIdx, name: trace.name, points: points}
      }).filter(trace => trace.points?.length)
    }
    return []
  }

  // ### MODIFYING THE PLOT DATA ###

  /**
   * Moves points to some traces to another trace.
   * @param from Trace from which points are moved.
   * @param to Trace to which points are moved.
   * @private
   */
  reassignCells(from: Trace[], to: Trace) {
    const pointsToRemove = this.getPointsToRemove(from)
    const minorityPoints = this.removePoints(pointsToRemove)
    this.addPoints(to.traceIdx, minorityPoints)
    this.clearSelection()
  }

  /**
   * Removes points from traces from plot.
   */
  deleteCells(traces: Trace[]) {
    const pointsToRemove = this.getPointsToRemove(traces)
    this.removePoints(pointsToRemove)
    this.clearSelection()
  }

  /**
   * Returns a mapping of points to trace indexes.
   * @param traces ex: traceIdx1 -> [pointIdx1, pointIdx2, ...]
   */
  getPointsToRemove(traces: Trace[]): TraceToPoints {
    const pointsToRemove: TraceToPoints = {}
    traces.forEach(trace => { // Here each trace is different trace
      trace.points
        .sort((a: TracePoint, b: TracePoint) => b.pointNumber - a.pointNumber)
        .forEach((point: TracePoint) => {
          const traceIndex = point.curveNumber
          const pointIndex = point.pointNumber
          if (!(traceIndex in pointsToRemove)) pointsToRemove[traceIndex] = []
          pointsToRemove[traceIndex].push(pointIndex)
        })
    })
    return pointsToRemove
  }

  removePoints(pointsToRemove: TraceToPoints): RemovedPoint[] {
    if (!this.plot?.data) return []
    const removedPoints: RemovedPoint[] = []
    this.logger.info(`[PlotComponent] (removePoints) Removing ${this.getTracesTotal(pointsToRemove)} points`)
    _.forEach(pointsToRemove, (points, traceIdx) => {
      const trace = this.plot?.data[+traceIdx]
      points.forEach(pointIdx => {
        const x = trace.x.splice(pointIdx, 1)[0]
        const y = trace.y.splice(pointIdx, 1)[0]
        const customdata = trace.customdata?.splice(pointIdx, 1)[0]
        removedPoints.push({x: x, y: y, customdata: customdata})
      })
      this.forceTraceRedraw(trace)
    })
    return removedPoints
  }

  addPoints(traceIdx: number | undefined, points: RemovedPoint[]) {
    if (!this.plot?.data || traceIdx == null) return

    this.logger.info(`[PlotComponent] (addPoints) Adding ${points.length} points to trace ${traceIdx}`)
    const trace = this.plot?.data[traceIdx]
    const customdataIndex = this.getMajorityGroupCustomDataIndex()
    points.forEach(point => {
      trace.x.push(point.x)
      trace.y.push(point.y)
      trace.customdata.push(point.customdata)
      if (customdataIndex != undefined) point.customdata[customdataIndex] = trace?.customdata?.[0]?.[customdataIndex]
    })

  }

  /**
   * Changing the content of lists (such as x, y, customdata) does not trigger redraw.
   * Redraw is only triggered when a property of a trace is changed, such as list pointer (new list)
   * @param trace
   */
  forceTraceRedraw(trace: any) {
    trace.x = trace.x.slice()
  }

  /**
   * Note: if selected points is only set to an empty array instead of being deleted,
   * other points will still appear as unselected.
   * @fixme Bug in new version of plotly
   */
  clearSelection() {
    this.logger.info('[PlotComponent] (clearSelection) Removing selected points')
    this.plot?.data?.forEach(trace => delete trace.selectedpoints)
  }

  openGeneExplorer($event: MouseEvent) {
    const input: GeneExplorerInput = {
      genesIndex: this.genesIndex,
      plotComponent: this
    }
    this.dialogService.open(GENE_EXPLORER_DIALOG, input)
  }


  getNiceProdStatus = () => this.plot?.meta?.prodStatus?.replace('_', ' ')

  getPluralizedName(links: Link[] | undefined, name: string): string {
    const count = links?.length || 0
    return `${count} ${name}${count > 1 ? 's' : ''}`
  }
}
