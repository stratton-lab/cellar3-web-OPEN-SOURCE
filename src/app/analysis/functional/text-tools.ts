/**
 * Makes sure that each line is no longer than given number of chars
 * @param text
 * @param limit
 * @private
 */
export function wrapText(text: string, limit = 50): string {
  let currentLineLength = 0
  const result: string[] = []
  text.split(' ').forEach(word => {
    if (currentLineLength + word.length > limit) {
      result.push('<br>')
      currentLineLength = 0
    }
    result.push(word)
    currentLineLength += word.length
  })

  return result.join(' ').replace(/ <br> /g, '  <br>')
}

export function removeSuffix(text: string, suffix: string): string {
  return text?.split(suffix)[0].trim()
}
