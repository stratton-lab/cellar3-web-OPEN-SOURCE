import {Dataset} from "../dataset";
import {FacetField} from "./facet/facet.interface";

export interface SearchResponse {
  results: Dataset[]
  facets: FacetField[]
  count: number // total number of datasets
  current: number // current page number
  page_size: number
  total_pages: number
  first_number: number // first dataset in page
  last_number: number // last dataset in page
}
