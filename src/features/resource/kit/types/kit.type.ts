import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Kit = {
  id: number
  name: string
  description?: string
  images: KitImage[]
  kitImages?: KitImage[] // for backward compatibility
  imageUrl?: string // for backward compatibility
  price: number
  stockQuantity: number
  sku: string
  ageRangeId?: number
  status: KitProductStatus
  createdAt: string
  updatedAt: string
  isPreOrder?: boolean
  weight: number // in grams
  dimensions?: string // e.g., "10x5x3 cm"
  totalComponents: number
  components: Component[] // List of component names
}

export type KitImage = {
  imageUrl?: string
  alt?: string
}

// slice
export type KitSliceParams = {
  minPrice?: number
  maxPrice?: number
  ageRangeId?: number
  isPreOrder?: boolean
} & SliceQueryParams

export enum KitProductStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived'
}

export type Component = {
  id: number
  name: string
  imageUrl?: string
  quantity: number
}
