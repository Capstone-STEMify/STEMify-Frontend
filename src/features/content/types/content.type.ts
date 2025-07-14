import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Content = {
  id: number
  contentType: ContentType
  contentName: string
  fileName: string
  fileUrl: string
  uploadDate: string
  status: string
  sectionId: number
}
export enum ContetnStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted'
}
export enum ContentType {
  TEXT = 'Text',
  VIDEO = 'Video',
  DOCUMENT = 'Document'
}

export type ContentQueryParams = {
  contentType?: ContentType
  sectionId?: number
} & SearchPaginatedRequestParams

export type ContentSliceParams = {
  contentType?: ContentType
  sectionId?: number
} & SliceQueryParams
