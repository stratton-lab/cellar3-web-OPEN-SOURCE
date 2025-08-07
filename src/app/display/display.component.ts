import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {NGXLogger} from "ngx-logger";
import {Message} from "../message";
import {DialogService} from "../dialog.service";

interface DatasetConfig {
  datasetId: string
  groupColumn: string
}

const DATASETS_SEPARATOR = ','
const DATASET_FIELDS_SEPARATOR = '@'

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit, OnDestroy {


  dataset_configs: DatasetConfig[] = []
  msg: Message | null = null

  constructor(private logger: NGXLogger, private route: ActivatedRoute, private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['dataset'] == undefined) this.msg = {
        'title': 'Incorrect parameters',
        'detail': 'Please supply dataset parameter.'
      }
      this.dataset_configs = this.getDatasets(params)?.map((dataset: string) => this.getDatasetConfig(dataset))
      this.logger.info('[DisplayComponent] (ngOnInit) Datasets to display:', this.dataset_configs)
    })
  }

  private getDatasets = (params: Params): string[] => params['dataset']?.split(DATASETS_SEPARATOR)

  private dumpDatasets = () => this.dataset_configs.map(dc => this.dumpDataset(dc)).join(DATASETS_SEPARATOR)

  /**
   * Dataset string config is composed of several elements, separated by @ :
   * - datasetId  [string, mandatory]
   * - groupBy    [string, optional]
   * @todo Get the default groupBy from the loaded dataset once it's loaded
   * @param dataset
   * @private
   */
  private getDatasetConfig(dataset: string): DatasetConfig {
    const [datasetId, groupBy] = dataset.split(DATASET_FIELDS_SEPARATOR)
    return {datasetId: datasetId, groupColumn: groupBy}
  }


  private dumpDataset(datasetConfig: DatasetConfig): string {
    return [datasetConfig.datasetId, datasetConfig.groupColumn].join(DATASET_FIELDS_SEPARATOR)
  }

  ngOnDestroy() {
    // Closes all open dialogs.
    this.dialogService.closeAll()
  }

}
