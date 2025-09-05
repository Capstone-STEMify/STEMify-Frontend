import { CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'
import { CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import { LessonStatus } from '@/features/resource/lesson/types/lesson.type'

export const getStatusBadgeClass = (status: LessonStatus | CurriculumStatus | CourseStatus) => {
  switch (status) {
    case LessonStatus.DRAFT || CurriculumStatus.DRAFT || CourseStatus.DRAFT:
      return 'bg-gray-100 text-gray-800 border border-gray-300'
    case LessonStatus.PUBLISHED || CurriculumStatus.PUBLISHED || CourseStatus.PUBLISHED:
      return 'bg-blue-100 text-blue-800 border border-blue-300'
    case LessonStatus.ARCHIVED || CurriculumStatus.ARCHIVED || CourseStatus.ARCHIVED:
      return 'bg-green-100 text-green-800 border border-green-300'
    case LessonStatus.DELETED || CurriculumStatus.DELETED || CourseStatus.DELETED:
      return 'bg-red-100 text-red-800 border border-red-300'
    case LessonStatus.PENDING || CurriculumStatus.PENDING || CourseStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    case LessonStatus.REJECTED || CurriculumStatus.REJECTED || CourseStatus.REJECTED:
      return 'bg-red-200 text-red-900 border border-red-400'
    case LessonStatus.APPROVED || CurriculumStatus.APPROVED || CourseStatus.APPROVED:
      return 'bg-green-200 text-green-900 border border-green-400'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300'
  }
}

export const getCourseStatusBadgeClass = (status?: CourseStatus): string => {
  const map: Record<CourseStatus, string> = {
    [CourseStatus.DRAFT]: 'bg-gray-200 text-gray-800',
    [CourseStatus.PUBLISHED]: 'bg-blue-100 text-blue-800',
    [CourseStatus.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
    [CourseStatus.DELETED]: 'bg-red-100 text-red-800',
    [CourseStatus.PENDING]: 'bg-amber-100 text-amber-800',
    [CourseStatus.REJECTED]: 'bg-red-200 text-red-900',
    [CourseStatus.APPROVED]: 'bg-green-100 text-green-800'
  }

  return status ? (map[status] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground'
}

export const getLevelBadgeClass = (level: CourseLevel): string => {
  switch (level) {
    case CourseLevel.BEGINNER:
      return 'bg-green-100 text-green-800'
    case CourseLevel.INTERMEDIATE:
      return 'bg-yellow-100 text-yellow-800'
    case CourseLevel.ADVANCED:
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
