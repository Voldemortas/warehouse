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
