import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {DatasetsService} from "./datasets.service";
import {Dataset} from "../dataset";
import {DatasetSearchService} from "./dataset-search/dataset-search.service";

@Component({
  selector: 'marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {

  constructor(public datasetsService: DatasetsService, public searchService: DatasetSearchService, private logger: NGXLogger) {
  }

  ngOnInit(): void {
    this.searchService.searcher.query = ''
    this.datasetsService.onLoaded.subscribe({
      next: (datasets: Dataset[]) => {
        if (datasets.length) {
          this.logger.info(`[MarketplaceComponent] (ngOnInit)`, 'Indexing datasets for search engine.')
          this.searchService.initIndex(datasets)
          // @todo Get from the URL the navigation state, based on a list of ids, ex navigation=cs,transcriptomics,disease
          // @todo Use the mapping of category id to the category object, to populate selectedCategory and
          // @todo Get from the URL the query, if user conducted a search
          // @todo Avoid race conditions between loading dataset and getting URL params from navigation

        }
      }
    })
  }


  /**
   * We switch to search mode if user started typing a query
   */
  showSearchResults = () =>this.searchService?.searcher?.query?.length > 0
}
