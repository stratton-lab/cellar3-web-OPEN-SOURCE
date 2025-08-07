import {Field} from "./fields.interface";

export interface MetaForm {
  name: Field
  description: Field
  public: Field
  type: Field
  species: Field
  tissue: Field
  year: Field
  state: Field
  molecule: Field
  cells: Field
  category: Field
  keywords: Field
  publication: Field
  dataset: Field
  cellTypeField: Field
  conditionField: Field
  sampleField: Field
  maintainerName: Field
  maintainerEmail: Field
  maintainerAffiliation: Field
  submissionNotes: Field
}
