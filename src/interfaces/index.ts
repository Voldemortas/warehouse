export interface RouteParams {
  id: string
}
export type Product = {
  id: number
  Name: string
  EAN: string
  Type: string
  Weight: number
  Color: string
  Active: boolean
}
export type Message = {
  success: boolean
  message: string
}

export type sortKeys = {
  key: keyof Product
  direction: 0 | 1 | 2
}
