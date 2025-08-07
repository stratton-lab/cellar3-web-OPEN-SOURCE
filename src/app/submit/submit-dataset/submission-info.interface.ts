import {Group} from "../../dataset";

export interface SubmissionInfo {
  id: string
  dataset_id: string
  dataset_name: string
  spatial_embeddings: Group[]
}
