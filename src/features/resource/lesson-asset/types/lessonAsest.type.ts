import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type LessonAssetListResponse = {
  id: number
  name: string
  assetUrl: string
  width: number
  height: number
}

export type LessonAsset = {
  id: number
  name: string
  type: string
  format: string
  assetUrl: string
  lessonId: number
  size: number
  height: number
  width: number
  createdAt: string
  publicId: string
  tags: any[]
}

export type LessonAssetSliceParams = {
  type?: LessonAssetType
  tagId?: number
} & SliceQueryParams

export enum LessonAssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  RAW = 'raw'
}

export type PostLessonAssetRequestBody = {
  lessonAssets: {
    name: string
    assetBytes: string
  }[]
}

export type PostLessonResponseBody = {
  id: number
  assetUrl: string
}

// Lesson Asset Tag
export type LessonAssetTag = {
  id: number[]
  name: string[]
}
