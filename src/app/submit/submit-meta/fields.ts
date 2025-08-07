import {DatasetType} from "../../dataset";
import {FieldType} from "./fields.interface";
import {validatePositiveInteger} from "./validators";
import {MetaForm} from "./meta.interface";

export const SPECIES = [
  {name: 'Human', value: 'Human', shortcut: 'Hu'},
  {name: 'Mouse', value: 'Mouse', shortcut: 'Ms'},
  {name: 'Other', value: 'Other', shortcut: 'Other'},
]

export const TISSUES = [
  {name: 'Cardiovascular', value: 'Cardiovascular'},
  {name: 'Digestive', value: 'Digestive'},
  {name: 'Endocrine', value: 'Endocrine'},
  {name: 'Immune/Lymphatic', value: 'Immune/Lymphatic'},
  {name: 'Integumentary', value: 'Integumentary'},
  {name: 'Muscular', value: 'Muscular'},
  {name: 'Nervous', value: 'Nervous'},
  {name: 'Reproductive', value: 'Reproductive'},
  {name: 'Respiratory', value: 'Respiratory'},
  {name: 'Skeletal', value: 'Skeletal'},
  {name: 'Urinary', value: 'Urinary'}
]

export const MOLECULE_TYPES = [
  {name: 'RNA', value: 'RNA'}
]

export const FIELDS: MetaForm = {
  name: {
    name: 'Name',
    value: '',
    description: 'Enter a short, user-friendly dataset name (exclude species, tissue, and technique).',
    example: 'Ex: Healthy Enteric Neurons',
    required: true
  },
  description: {
    value: '',
    type: FieldType.LONGTEXT,
    description: 'Longer description of your dataset.',
    name: 'Description',
    example: 'Ex: Brain cells from animals with an inflammatory demyelinating disease of the central nervous system (EAE) and from controls.',
    required: true
  },
  public: {
    value: false,
    type: FieldType.CHECKBOX,
    name: 'Should This Dataset Be Public ?',
    description: 'Private datasets won’t appear in search results or in the exploratory tree ' +
      'but can still be accessed via direct URL – useful for publications in review stages.'
  },
  type: {
    name: 'Type of Dataset',
    type: FieldType.RADIOS,
    value: DatasetType.SUSPENSION,
    description: 'Indicate whether the cells’ original positions in the tissue are known (Spatial) or if the cells lack positional information (Suspension).',
    options: [
      {name: DatasetType.SUSPENSION, value: DatasetType.SUSPENSION},
      {name: DatasetType.SPATIAL, value: DatasetType.SPATIAL}
    ],
    required: true
  },
  species: {
    name: 'Species',
    value: '',
    type: FieldType.DROPDOWN,
    options: SPECIES,
    description: 'Species of the animal from which the cells were extracted.',
    required: true
  },
  tissue: {
    name: 'Tissue',
    value: '',
    type: FieldType.DROPDOWN,
    options: TISSUES,
    description: 'Tissue from which these cells were extracted.',
    required: true,
    example: 'Ex: Nervous System'
  },
  year: {
    name: 'Year',
    value: new Date().getFullYear().toString(),
    description: 'Year this dataset was created.',
    type: FieldType.NUMBER,
    required: true
  },
  state: {
    name: 'State',
    value: '',
    description: 'Acronym for the state or condition of the organism. For example, use "PD" for Parkinson\'s disease.',
    type: FieldType.TEXT,
    example: 'Ex: PD',
    required: true
  },
  molecule: {
    name: 'Modality',
    type: FieldType.RADIOS,
    value: MOLECULE_TYPES[0].name,
    description: 'Type of molecule.',
    options: MOLECULE_TYPES,
    required: true
  },
  cells: {
    value: '',
    type: FieldType.NUMBER,
    name: 'Number of Cells',
    description: 'Number of cells in this dataset.',
    example: 'Ex: 9867',
    validators: [validatePositiveInteger],
    required: true
  },
  category: {
    name: 'Category',
    value: '',
    type: FieldType.DROPDOWN,
    description: 'Select a category for this dataset.',
    required: true,
    options: [
      {name: 'Transcriptomics - Baseline State', value: "cs_ts_healthy"},
      {name: 'Transcriptomics - Altered State', value: "cs_ts_disease"},

      {name: 'Proteomics - Baseline State', value: "cs_pt_healthy"},
      {name: 'Proteomics - Altered State', value: "cs_pt_disease"},

      {name: 'Spatial - Baseline State', value: "s_healthy"},
      {name: 'Spatial - Altered State', value: "s_disease"},

      {name: 'Multiomics - Baseline State', value: "m_healthy"},
      {name: 'Multiomics - Altered State', value: "m_disease"}
    ]
  },
  keywords: {
    value: '',
    name: 'Keywords',
    description: 'Comma-separated list of keywords. Including authors, title of the paper, etc...',
    example: 'Ex: Crick, Watson, Molecular Structure of Nucleic Acids.'
  },
  publication: {
    value: '',
    name: 'Link to Publication',
    description: 'If your data has been published or is available in BioRxiv, please provide the link.',
  },
  dataset: {
    value: '',
    name: 'Link to GEO Dataset',
    description: 'If you have uploaded your data to GEO, please provide the link.',
  },
  cellTypeField: {
    value: '',
    name: 'Cell Type Field Name',
    description: 'The exact name of the column in the metadata table with cell type information.',
    example: 'Ex: cell_type'
  },
  conditionField: {
    value: '',
    name: 'Condition Field Name',
    description: 'The exact name of the column in the metadata table with condition information.',
    example: 'Ex: Condition'
  },
  sampleField: {
    value: '',
    name: 'Sample Field Name',
    description: 'The exact name of the column in the metadata table with sample name information.',
    example: 'Ex: Source'
  },
  maintainerName: {
    value: '',
    name: 'Your Name',
    description: 'Name of the maintainer of this dataset.',
    required: true
  },
  maintainerEmail: {
    value: '',
    name: 'Your Email',
    description: 'Email of the maintainer of the dataset.',
    required: true
  },
  maintainerAffiliation: {
    value: '',
    name: 'Your Affiliation',
    description: 'Institution AND laboratory.',
    required: true
  },
  submissionNotes: {
    value: '',
    name: 'Notes',
    description: 'Please tell us more about you and the project.',
    required: false
  }
}
