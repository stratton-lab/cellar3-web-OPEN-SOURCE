import {Component, OnInit} from '@angular/core';
import {CLUSTER_ANNOTATE_DIALOG, DialogService} from "../../dialog.service";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";

@Component({
  selector: 'annotate-cluster',
  templateUrl: './annotate.dialog.html',
  styleUrls: ['./annotate.dialog.css']
})
export class AnnotateDialogComponent implements OnInit {

  name: string
  description: string
  group: string
  color: string

  constructor(public dialogService: DialogService) {
    dialogService.registerEventListener(CLUSTER_ANNOTATE_DIALOG).subscribe((data: Plotly.Data) => {
      this.color = data.marker.color
      this.name = data.name
      this.description = data.customdata?.[0].length > 1 ? data.customdata?.[0][1] : ''
      this.group = data.legendgroup
    })
  }

  ngOnInit(): void {
  }

  isOpen = () => this.dialogService.isOpen(CLUSTER_ANNOTATE_DIALOG)

  close = () => this.dialogService.close(CLUSTER_ANNOTATE_DIALOG)

  private isLegendGroupAssigned = () => this.group?.length && this.group != 'unassigned'

  update() {
    const data: Plotly.Data = this.dialogService.getData(CLUSTER_ANNOTATE_DIALOG)
    // @todo Potentially add to UNDO stack
    data.name = this.name
    data.legendgroup = this.isLegendGroupAssigned() ? this.group : 'unassigned'
    data.legendgrouptitle = this.isLegendGroupAssigned() ? {'text': this.group} : null
    this.close()
  }
}
