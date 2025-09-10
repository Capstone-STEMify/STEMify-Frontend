import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Kit = {
  id: number
  name: string
  description?: string
  images: KitImage[]
}

export type KitImage = {
  imageUrl?: string
  alt?: string
}

// slice
export type KitSliceParams = {} & SliceQueryParams
