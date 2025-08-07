export enum FieldType {
  TEXT = 'text',
  LONGTEXT = 'longtext',
  NUMBER = 'number',
  RADIOS = 'radios',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  UPLOAD = 'upload'
}

export interface FieldOption {
  name: string
  value: string
  shortcut?: string
}

export type ValidationFunction = (field: Field) => string | void

export interface Field {
  value: string | number | boolean | FormData
  name: string
  example?: string | number
  description: string
  type?: FieldType // text by default
  options?: FieldOption[]
  required?: boolean
  validators?: ValidationFunction[]
  invalidMsg?: string
}

export interface FieldEmbed {
  key: string
  obj: Field
}

export interface SubmitMetaResult {
  details: string
}
