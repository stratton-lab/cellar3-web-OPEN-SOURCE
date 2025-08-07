export interface Message {
  title: string
  detail?: string
  type?: 'info' | 'success' | 'warning' | 'error'
}
