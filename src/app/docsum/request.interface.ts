export type Filters = Record<string, Set<string>>

export interface SearchRequest {
  query?: string
  filters?: Filters
  page?: number
  sort?: string
}
