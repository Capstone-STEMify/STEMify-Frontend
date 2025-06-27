import { LessonStatus } from '@/features/resource/lesson/types/lesson.type'

export const getStatusBadgeClass = (status: LessonStatus) => {
  switch (status) {
    case LessonStatus.DRAFT:
      return 'bg-gray-100 text-gray-800'
    case LessonStatus.PUBLISHED:
      return 'bg-blue-100 text-blue-800'
    case LessonStatus.ARCHIVED:
      return 'bg-green-100 text-green-800'
    case LessonStatus.DELETED:
      return 'bg-red-100 text-red-800'
    case LessonStatus.IN_REVIEW:
      return 'bg-yellow-100 text-yellow-800'
    case LessonStatus.REJECTED:
      return 'bg-red-200 text-red-900'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
