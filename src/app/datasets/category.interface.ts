import {Dataset} from "../dataset";

export interface Category {
  id: string
  name: string
  imageUrl?: string
  description?: string
  categories?: Category[]
  datasets?: Dataset[]
  datasets_count?: number
}
