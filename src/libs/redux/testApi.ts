import { injectCrudEndpoints } from '@/libs/redux/injectCrudEndpoints'

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  courseId: string
  createdAt: string
  updatedAt: string
}

export interface SearchLessonParams {
  pageNumber?: number
  pageSize?: number
  search?: string
  sort?: string
}

export const lessonApi = injectCrudEndpoints<Lesson, SearchLessonParams>({
  tagType: 'Lesson',
  baseUrl: '/lessons',
  searchUrl: '/lessons/search'
})
