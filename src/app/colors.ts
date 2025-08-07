const palette = ['#4A81A4', '#83B77D', '#9085B9', '#EA6A6B', '#D99A45', '#C064A0']

export function getChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => palette[i % palette.length])
}
