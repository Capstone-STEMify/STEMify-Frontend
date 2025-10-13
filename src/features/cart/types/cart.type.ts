import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Cart = {
  userId: string
  items: CartItemData[]
  totalPrice: number
}

export type CartItemData = {
  productId: number
  quantity: number
  unitPrice: number
  name: string
  description?: string
  imageUrl?: string
  subtotal: number
}

// slice
export type CartQueryParams = {
  userId: string
} & SearchPaginatedRequestParams
