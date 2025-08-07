/**
 * Value and count for a field.
 * Ex: Biosamples -> 306
 * Can have subfacets that are displayed if selected.
 */
export interface FacetValue {
  name: string
  count?: number
}

/**
 * Main facets displayed in the left column.
 */
export interface FacetField {
  name: string
  field: string
  items: FacetValue[]
}
