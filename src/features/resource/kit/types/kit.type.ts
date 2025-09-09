import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Kit = {
  id: number
  name: string
  description?: string
  kitImages: KitImage[]
}

export type KitImage = {
  id: number
  imageUrl?: string
  alt?: string
}

// slice
export type KitSliceParams = {} & SliceQueryParams
