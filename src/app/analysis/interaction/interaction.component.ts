import {Component} from '@angular/core';
import {Message} from "../../message";
import {CellCellInteractionsData, InteractionInput} from "./interaction.interface";
import {DialogService, INTERACTION_DIALOG} from "../../dialog.service";
import {NGXLogger} from "ngx-logger";
import {BackendService} from "../../backend.service";

@Component({
  selector: 'interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss']
})
export class InteractionComponent {
  msg: Message | null = null
  busy = false // Loading of dataset from the server

  input: InteractionInput | null

  data: CellCellInteractionsData | undefined
  selectedType: string | undefined // Type of interaction, used for filtering

  constructor(private dialogService: DialogService, private logger: NGXLogger, private backendService: BackendService) {
    dialogService.registerEventListener(INTERACTION_DIALOG).subscribe((input: InteractionInput) => {
      this.input = input
      this.loadInteraction()
    })
  }

  loadInteraction() {
    this.msg = null
    this.busy = true
    if (!this.input) {
      console.warn('[Interaction Component] (loadInteraction) Input is null.')
      return
    }
    const input = this.input
    this.backendService.getInteraction(input.datasetId, input.source, input.targets, this.selectedType).subscribe({
      next: (data: CellCellInteractionsData) => {
        this.busy = false
        this.data = data
      },
      error: err => {
        this.busy = false
        this.msg = {title: 'Could not get Interaction data', detail: err?.error?.detail}
      }
    })
  }

  updateInteractionType(type?:string){
    this.selectedType = type
    this.loadInteraction()
  }

  getOverlayZ = () => this.dialogService.getOverlayZ(INTERACTION_DIALOG)
  getDialogZ = () => this.dialogService.getDialogZ(INTERACTION_DIALOG)
  isOpen = () => this.dialogService.isOpen(INTERACTION_DIALOG)

  close() {
    this.data = undefined
    this.dialogService.close(INTERACTION_DIALOG)
  }
}
