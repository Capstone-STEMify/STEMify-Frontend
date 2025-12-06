import { CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'

export const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800 border border-gray-300',
  PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',

  PUBLISHED: 'bg-blue-100 text-blue-800 border border-blue-300',
  SUBMITTED: 'bg-blue-100 text-blue-800 border border-blue-300',
  INPROGRESS: 'bg-blue-100 text-blue-800 border border-blue-300',

  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-300',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border border-emerald-300',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-300',
  PASSED: 'bg-emerald-50 text-emerald-700 border border-emerald-300',

  REJECTED: 'bg-red-100 text-red-800 border border-red-300',
  FAILED: 'bg-red-100 text-red-800 border border-red-300',
  CANCELLED: 'bg-red-100 text-red-800 border border-red-300',

  LOCKED: 'bg-blue-100 text-blue-800 border border-blue-300',

  ARCHIVED: 'bg-orange-100 text-orange-800 border border-orange-300'
}

export const getStatusBadgeClass = (status?: string) => {
  const key = status?.toUpperCase()
  return statusColors[key ?? ''] ?? 'bg-gray-100 text-gray-800 border border-gray-300'
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

export const getStatusWithIcon = (status: string) => {
  const statusUpper = status.toUpperCase()

  switch (statusUpper) {
    case 'COMPLETED':
      return {
        className: statusColors[statusUpper],
        icon: 'CheckCircle2',
        text: status
      }
    case 'LOCKED':
      return {
        className: statusColors[statusUpper],
        icon: 'Lock',
        text: status
      }
    case 'INPROGRESS':
      return {
        className: statusColors[statusUpper],
        icon: 'Clock',
        text: 'In Progress'
      }
    default:
      return {
        className: statusColors[statusUpper] ?? statusColors.DRAFT,
        icon: null,
        text: status
      }
  }
}
