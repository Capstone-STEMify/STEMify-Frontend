import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

// models
export type Notification = {
  id: number
  userId: string
  title: string
  message: string
  isRead: boolean
  clickUrl: any
  createdDate: string
  lastModifiedDate: string
}

export enum NotificationOrderBy {
  CREATED_DATE = 'createddate',
  TITLE = 'title'
}

// query
export type NotificationQueryParams = {
  userId?: string
  isRead?: boolean
} & SearchPaginatedRequestParams

// Slice
export type NotificationSliceParams = {
  userId?: string
  isRead?: boolean
} & SliceQueryParams
