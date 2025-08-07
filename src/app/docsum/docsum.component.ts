import {Component, OnInit} from '@angular/core';
import {DatasetSearchService} from "../datasets/dataset-search/dataset-search.service";
import {NGXLogger} from "ngx-logger";
import {Message} from "../message";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Filters, SearchRequest} from "./request.interface";
import _ from "lodash";
import {ToggleFacetEvent} from "./facet/toggle-event";
import {SearchResponse} from "./response.interface";
import {FacetValue} from "./facet/facet.interface";

@Component({
  selector: 'app-docsum',
  templateUrl: './docsum.component.html',
  styleUrls: ['./docsum.component.scss']
})
export class DocsumComponent implements OnInit {

  query: string
  filters: Filters

  busy: boolean
  msg: Message | null = null

  res?: SearchResponse

  FILTER_FIELD_VAL_SEPARATOR = '$'

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public searchService: DatasetSearchService,
    private logger: NGXLogger
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const query = params.get('query') ?? undefined
      const page = +(params.get('page') ?? 1)
      this.filters = this.deserializeFilters(params.getAll('filters') || [])
      // this.logger.info('Deserialized filters', this.filters)
      this.msg = null
      this.load({query: query, filters: this.filters, page: page})
    })
  }

  load(request: SearchRequest) {
    this.busy = true
    this.searchService.search(request).subscribe({
        next: (result: SearchResponse) => {
          this.busy = false
          this.res = result
        },
        error: (err: any) => {
          this.busy = false
          this.msg = {title: 'Can not perform search. Please try again later.'}
          this.logger.error('[DocsumComponent] (load)', 'Can not retrieve search docsum.', err)
          this.res = undefined
        }
      }
    )
  }


  updateFilters(field: string, value: FacetValue) {
    this.filters[field] ??= new Set()
    const set = this.filters[field]

    if (set.has(value.name)) {
      set.delete(value.name)
    } else {
      set.add(value.name)
    }
  }

  serializeFilters(filters: Filters): string[] {
    return Object.entries(filters).flatMap(([key, set]) =>
      Array.from(set).map(value => `${key}${this.FILTER_FIELD_VAL_SEPARATOR}${value}`)
    )
  }

  deserializeFilters(serialized: string[]): Filters {
    const filters: Record<string, Set<string>> = {}

    for (const entry of serialized) {
      const [key, value] = entry.split(this.FILTER_FIELD_VAL_SEPARATOR)
      if (!filters[key]) {
        filters[key] = new Set()
      }
      filters[key].add(value)
    }

    return filters
  }

  navigate(request: SearchRequest) {
    const serializedFilters = request.filters ? this.serializeFilters(request.filters) : null
    // this.logger.info('Updated Filters', this.filters, 'Serialized', serializedFilters)
    this.router.navigate([], {
      queryParams: _.pickBy({
        query: request.query,
        filters: serializedFilters,
        page: request.page
      }, (value: any) => value != null)
    });
  }

  toggleFacet(toggleFacetEvent: ToggleFacetEvent) {
    this.updateFilters(toggleFacetEvent.field, toggleFacetEvent.value)
    this.navigate({filters: this.filters})
  }

  removeFilter(field: string) {
    delete this.filters[field]
    this.navigate({filters: this.filters})
  }

}
