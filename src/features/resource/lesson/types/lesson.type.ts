import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Lesson = {
  id: number
  title: string
  imageUrl: string
  description: string
  duration: number
  orderIndex: number
  status: string
  createdByUserId: string
  courseId: number
  createdDate: string
  lastModifiedDate: string
  // sectionIds: any[]
}

export type LessonParams = {
  courseId?: number
} & SearchPaginatedRequestParams
