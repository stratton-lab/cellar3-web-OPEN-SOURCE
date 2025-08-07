import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {Message} from "../../../message";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";
import {BackendService} from "../../../backend.service";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'enrichment-pc',
  templateUrl: './enrichment-pc.component.html',
  styleUrls: ['./enrichment-pc.component.css']
})
export class EnrichmentPcComponent {

  msg: Message | null = null
  busy = false // Loading of dataset from the server

  @Input() datasetId: string
  @Input() target: number[]
  @Input() background: number[]
  @Input() geneSet: string

  @Output() onBusyState = new EventEmitter<boolean>()

  data: Plotly.Data[]
  layout: Plotly.Layout = this.getLayout()
  config = this.getConfig()

  constructor(private backendService: BackendService, private logger: NGXLogger) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasInputChanged(changes)) {
      this.load()
    }
  }

  /**
   * Retrieves enrichment results.
   */
  load() {

  }


  hasInputChanged(changes: SimpleChanges) {
    return changes['datasetId']?.previousValue != changes['datasetId']?.currentValue ||
      changes['target']?.previousValue != changes['target']?.currentValue ||
      changes['background']?.previousValue != changes['background']?.currentValue ||
      changes['geneSet']?.previousValue != changes['geneSet']?.currentValue
  }

  /**
   * @todo Support multiple traces per gene set
   * @param data
   * @private
   */
  private getTraces(data: any) {
    return []
  }

  private getLayout() {
    return {}
  }

  private getConfig() {
    return {}
  }
}
