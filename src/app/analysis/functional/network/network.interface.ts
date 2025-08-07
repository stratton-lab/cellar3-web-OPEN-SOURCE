
export interface Node {
  x: number
  y: number
  name: string
  size: number
  color: number
}

export interface Edge {
  x: number
  y: number
  weight: number
}

export interface NetworkPlot {
  data: { nodes: Node[], edges: Edge[] }
  meta: any
}

