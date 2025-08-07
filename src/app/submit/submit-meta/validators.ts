import {Field} from "./fields.interface";

export function validateRequired(field: Field): string | void {
  if (field.required && !field.value) return "This field can not be empty."
}

export function validatePositiveInteger(field: Field): string | void {
  const num = Number(field.value)
  if (!Number.isInteger(num) || num <= 0) return "This should be a positive integer."
}


export function validateID(field: Field): string | void {
  if (!/^[a-zA-Z0-9_]+$/.test(field.value.toString())) return "ID can only contain letters, numbers and underscores."
}
