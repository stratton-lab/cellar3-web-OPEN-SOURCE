import {Component} from '@angular/core';
import {DatasetSearchService} from "./dataset-search.service";

@Component({
  selector: 'dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.scss']
})
export class DatasetSearchComponent {

  constructor(public searchService: DatasetSearchService) {
  }

  search = ($event: any) => this.searchService.searcher.search()
}
