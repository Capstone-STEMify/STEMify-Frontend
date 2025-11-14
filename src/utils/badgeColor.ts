import { CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'

export const getStatusBadgeClass = (status: any) => {
  if (!status) return 'bg-gray-100 text-gray-800 border border-gray-300'

  const value = status.toString().toUpperCase()

  switch (value) {
    case 'DRAFT':
      return 'bg-gray-100 text-gray-800 border border-gray-300'

    case 'PUBLISHED':
    case 'INPROGRESS':
      return 'bg-blue-100 text-blue-800 border border-blue-300'

    case 'DELETED':
    case 'EXPIRED':
    case 'INACTIVE':
    case 'CANCELED':
      return 'bg-red-100 text-red-800 border border-red-300'

    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'

    case 'APPROVED':
    case 'ACTIVE':
    case 'RESOLVED':
    case 'COMPLETED':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-300'

    case 'ARCHIVED':
      return 'bg-orange-100 text-orange-800 border border-orange-300'

    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300'
  }
}

export const getLevelBadgeClass = (level: CourseLevel): string => {
  switch (level) {
    case CourseLevel.BEGINNER:
      return 'bg-green-100 text-green-800 border border-green-300'
    case CourseLevel.INTERMEDIATE:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    case CourseLevel.ADVANCED:
      return 'bg-red-100 text-red-800 border border-red-300'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
