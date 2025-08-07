import {EventEmitter, Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";

export const CLUSTER_ANNOTATE_DIALOG = "CLUSTER_ANNOTATE_DIALOG"
export const SAMPLES_SELECTED_DIALOG = "SAMPLES_SELECTED_DIALOG"
export const SAMPLES_MULTI_SELECTED_DIALOG = "SAMPLES_MULTI_SELECTED_DIALOG"
export const DIFF_EXPRESSION_DIALOG = "DIFF_EXPRESSION_DIALOG"
export const VIOLIN_PLOT_DIALOG = 'VIOLIN_PLOT_DIALOG'
export const DOT_PLOT_DIALOG = 'DOT_PLOT_DIALOG'
export const UMAP_PLOT_DIALOG = 'UMAP_PLOT_DIALOG'
export const FUNCTIONAL_DIALOG = 'FUNCTIONAL_DIALOG'
export const PATHWAYS_DIALOG = 'PATHWAYS_DIALOG'
export const PSEUDOTIME_DIALOG = 'PSEUDOTIME_DIALOG'
export const INTERACTION_DIALOG = 'INTERACTION_DIALOG'
export const INTERACTION_DETAILS_DIALOG = 'INTERACTION_DETAILS_DIALOG'
export const GENE_EXPLORER_DIALOG = 'GENE_EXPLORER_DIALOG'

@Injectable({
  providedIn: 'root'
})
export class DialogService {


  dialogData: Record<string, any> = {}
  dialogEventListeners: Record<string, EventEmitter<any>> = {}

  BASE_Z_INDEX = 998
  dialogLevel = 0 // Allows dialogs to be displayed over other dialogs

  constructor(private logger: NGXLogger) {
  }

  open(dialogName: string, data: any) {
    this.dialogLevel += 2
    data.dialog = {level: this.dialogLevel}
    // this.logger.info(`[DialogService] (open) Showing ${dialogName}`)
    this.dialogData[dialogName] = data
    this.dialogEventListeners?.[dialogName]?.next(data)
  }

  close(dialogName: string) {
    this.dialogLevel -= 2
    // this.logger.info(`[DialogService] (close) Hiding ${dialogName}`)
    delete this.dialogData[dialogName]
  }

  closeAll() {
    this.dialogData = {}
  }

  isOpen = (dialogName: string) => dialogName in this.dialogData

  getOverlayZ = (dialogName: string) => this.BASE_Z_INDEX + this.getData(dialogName)?.dialog?.level
  getDialogZ = (dialogName: string) => this.BASE_Z_INDEX + this.getData(dialogName)?.dialog?.level + 1

  getData = (dialogName: string) => this.dialogData[dialogName]

  registerEventListener(dialogName: string): EventEmitter<any> {
    this.dialogEventListeners[dialogName] = new EventEmitter<any>()
    return this.dialogEventListeners[dialogName]
  }
}
