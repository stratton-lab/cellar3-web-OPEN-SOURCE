export interface CellTooltip {
  x: number
  y: number
  imgSrc?: string
  cellType: string
  condition?: string
  sampleName?: string
  cellId?: number
}

export class CustomData{
  static CELL_ID_INDEX= 0
  static CELL_TYPE_INDEX = 1
  static CONDITION_INDEX = 2
  static SAMPLE_NAME_INDEX= 3

  static getCellId = (customdata:any[]):number => customdata[CustomData.CELL_ID_INDEX]
  static getCellType = (customdata:any[]):string => customdata[CustomData.CELL_TYPE_INDEX]
  static getCondition = (customdata:any[]):string => customdata[CustomData.CONDITION_INDEX]
  static getSampleName = (customdata:any[]):string => customdata[CustomData.SAMPLE_NAME_INDEX]
}

export class InfoFields{
  static CELL_TYPE = 'cellType'
  static CONDITION = 'condition'
  static SAMPLE = 'sample'
}

/**
 * @todo This relies on the user friendly name of group tabs, which can change. Need an internal grouping id,
 * @todo independent from nice name AND independent from dataset column name.
 */
export const groupNameToCustomDataIndex: { [key: string]: number } = {
  "Cell Type": 1,
  "Condition": 2,
  "Samples": 3
}
