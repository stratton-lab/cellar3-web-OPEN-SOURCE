export interface GeneSetCategory {
  key: string | null
  name: string
  description?: string
  link?: string
  selectedMsg?: string // Message to display on the button when it is selected.
  geneSets?: GeneSetCategory[]
  onlySpecies?: string // Gene set only available for specific Species
}

export const AVAILABLE_GENE_SETS: GeneSetCategory = {
  key: null, name: 'Available Gene Sets', geneSets: [
    {
      key: 'KEGG_2021_Human',
      name: 'Function and Pathways',
      onlySpecies: 'Human',
      selectedMsg: 'Click on any pathway to display the pathway map.'
    },
    {
      key: 'KEGG_2019_Mouse',
      name: 'Function and Pathways',
      onlySpecies: 'Mouse',
      selectedMsg: 'Click on any pathway to display the pathway map.'
    },
    {key: 'GO_Biological_Process_2023', name: 'Biological Process'},
    {key: 'GO_Cellular_Component_2023', name: 'Cellular Components'},
    {key: 'GO_Molecular_Function_2023', name: 'Molecular Function'}
  ]
}

const KEGG_GENE_SETS = new Set(['KEGG_2019_Mouse', 'KEGG_2021_Human'])

export function isKEGG(geneSet: string) {
  return KEGG_GENE_SETS.has(geneSet)
}
