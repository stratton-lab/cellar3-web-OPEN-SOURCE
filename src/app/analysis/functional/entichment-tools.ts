import {removeSuffix, wrapText} from "./text-tools";

export function getCleanTerm(term: string, limit: number): string {
  return wrapText(removeSuffix(term, ' (GO:'), limit)
}
