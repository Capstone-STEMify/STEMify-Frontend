import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type ComponentFormData = {
  name: string
  description?: string
  image: File | null
  imagePreviewUrl?: string
}

export type Component = {
  id: number
  name: string
  description?: string
  imageUrl?: string
}

export type KitComponent = {
  id: number
  componentId: number
  name: string
  description?: string
  imageUrl?: string
  quantity: number
  isMainComponent: boolean
}

export type ComponentSliceParams = {} & SliceQueryParams
