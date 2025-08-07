import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {Dataset} from "../../dataset";
import {DatasetsService} from "../datasets.service";
import Fuse from 'fuse.js'
import {Search} from "../../search";
import {SearchRequest} from "../../docsum/request.interface";
import {SearchResponse} from "../../docsum/response.interface";
import {FacetField} from "../../docsum/facet/facet.interface";
import _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class DatasetSearchService {

  SEARCH_FIELDS = ['name', 'description', 'tissue', 'species', 'keywords', 'type']
  FACET_FIELDS = ['prodStatus', 'modality', 'state', 'species', 'tissue']

  searcher: Search<Dataset>
  index: Fuse<Dataset>

  constructor(private datasetsService: DatasetsService) {
    this.searcher = new Search<Dataset>(1, this.getResults)

  }

  /**
   * Builds a fuzzy searchable index of datasets.
   * @todo Fix multifield search, ex "Mouse MERFISH"
   * @param datasets
   */
  initIndex(datasets: Dataset[]) {
    this.index = new Fuse(datasets, {
      keys: this.SEARCH_FIELDS,
      threshold: 0.3, ignoreLocation: true
    })
  }

  /**
   * Asynchronously calls the search backend.
   * @param query
   */
  getResults = (query: string) => of(this.index.search(query)?.map(hit => hit.item))


  /**
   * Emulates a search on a backend search engine.
   * @param request
   */
  search(request: SearchRequest): Observable<SearchResponse> {
    return this.datasetsService.onLoaded.pipe(
      map(datasets => {

        datasets.forEach(dataset => {
          dataset.state = this.extractState(dataset)
          dataset.modality = this.extractModality(dataset)
        })

        const filteredDatasets = this.getFilteredDatasets(datasets, request)

        return {
          results: filteredDatasets,
          facets: this.calculateFacets(filteredDatasets, this.FACET_FIELDS),
          count: filteredDatasets.length,
          current: 1,
          page_size: filteredDatasets.length,
          total_pages: 1,
          first_number: 1,
          last_number: filteredDatasets.length
        }
      })
    )
  }

  /**
   * Applies filters from the URL
   * @param datasets
   * @param request
   * @private
   */
  private getFilteredDatasets(datasets: Dataset[], request: SearchRequest): Dataset[] {
    const filters = request.filters
    if (!filters || Object.keys(filters).length === 0) return datasets

    return datasets.filter((dataset) =>
      Object.entries(filters).every(([field, allowedValues]) => {
        const value = (dataset as any)[field]
        return allowedValues.has(value)
      }))
  }

  /**
   * Calculates facet counts.
   * @param datasets
   * @param facetFields
   * @private
   */
  private calculateFacets(datasets: Dataset[], facetFields: string[]): FacetField[] {
    return facetFields.map((field) => {
      const values = datasets.map((dataset) => _.get(dataset, field))
      const flattened = _.flatten(values.map((v) => (Array.isArray(v) ? v : v != null ? [v] : [])))
      const grouped = _.countBy(flattened.filter(Boolean))

      return {
        name: _.startCase(field), // For display, e.g., 'linksPublications' → 'Links Publications'
        field: field,
        items: Object.entries(grouped)
          .map(([name, count]) => ({name: name, count: count}))
          .sort((a, b) => b.count - a.count)
      }
    }).filter((facet) => facet.items.length > 0)
  }

  private extractState(dataset: Dataset): string {
    const category = _.nth(dataset.categories)
    if (category?.endsWith('healthy')) return 'Baseline State'
    else if (category?.endsWith('disease')) return 'Altered State'
    else return 'Other'
  }

  private extractModality(dataset: Dataset): string {
    const category = _.nth(dataset.categories)
    if (category?.startsWith('m_')) return 'Multimodal'
    else if (category?.startsWith('s_')) return 'Spatial'
    else if (category?.startsWith('cs_ts')) return 'Transcriptomics'
    else if (category?.startsWith('cs_proteomics')) return 'Proteomics'
    else return 'Other'
  }

}
