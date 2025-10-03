import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Component = {
  id: number
  name: string
  description?: string
  imageUrl?: string
}

export type KitComponent = Component & {
  quantity: number
  isMainComponent: boolean
}

export type ComponentSliceParams = {} & SliceQueryParams
