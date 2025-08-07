import {Component, Input, OnInit} from '@angular/core';
import {Dataset} from "../../dataset";
import {environment} from "../../../environments/environment";
import {DatasetsService} from "../datasets.service";

@Component({
  selector: 'dataset-item',
  templateUrl: './dataset-item.component.html',
  styleUrls: ['./dataset-item.component.scss']
})
export class DatasetItemComponent implements OnInit {

  @Input()
  dataset: Dataset

  constructor(private datasetsService: DatasetsService) {
  }

  ngOnInit(): void {
  }

  getTag(tagName: string) {
    return this?.dataset?.[tagName as keyof Dataset]
  }

  getImage() {
    return `${environment.mediaBackend}${this.dataset?.image}`
  }

  getNiceProdStatus = () => this.dataset.prodStatus?.replace('_', ' ')
}
