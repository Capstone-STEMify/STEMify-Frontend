import { ContactStatus } from '@/features/contact/types/contact.type'
import { LicenseAssignmentStatus } from '@/features/license-assignment/types/licenseAssignment'
import { OrganizationStatus } from '@/features/organization/types/organization.type'
import { CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'
import { CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import { KitProductStatus } from '@/features/resource/kit/types/kit.type'
import { LessonStatus } from '@/features/resource/lesson/types/lesson.type'
import { SubscriptionStatus } from '@/features/subscription/types/subscription.type'

export const getStatusBadgeClass = (
  status:
    | LessonStatus
    | CurriculumStatus
    | CourseStatus
    | KitProductStatus
    | ContactStatus
    | OrganizationStatus
    | LicenseAssignmentStatus
    | SubscriptionStatus
    | undefined
) => {
  switch (status) {
    // DRAFT
    case LessonStatus.DRAFT:
    case CurriculumStatus.DRAFT:
    case CourseStatus.DRAFT:
    case KitProductStatus.DRAFT:
      return 'bg-gray-100 text-gray-800 border border-gray-300'

    // PUBLISHED / IN_PROGRESS
    case LessonStatus.PUBLISHED:
    case CurriculumStatus.PUBLISHED:
    case CourseStatus.PUBLISHED:
    case KitProductStatus.PUBLISHED:
    case ContactStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800 border border-blue-300'

    // ARCHIVED / EXPIRED / INACTIVE / CANCELED
    case LessonStatus.ARCHIVED:
    case CurriculumStatus.ARCHIVED:
    case CourseStatus.ARCHIVED:
    case KitProductStatus.ARCHIVED:
    case SubscriptionStatus.EXPIRED:
    case OrganizationStatus.INACTIVE:
    case LicenseAssignmentStatus.EXPIRED:
    case SubscriptionStatus.ARCHIVED:
    case SubscriptionStatus.CANCELED:
      return 'bg-gray-100 text-gray-800 border border-gray-300'

    // DELETED / EXPIRED
    case LessonStatus.DELETED:
    case CurriculumStatus.DELETED:
    case CourseStatus.DELETED:
    case SubscriptionStatus.EXPIRED:
      return 'bg-red-100 text-red-800 border border-red-300'

    // PENDING
    case LessonStatus.PENDING:
    case CurriculumStatus.PENDING:
    case CourseStatus.PENDING:
    case ContactStatus.PENDING:
    case LicenseAssignmentStatus.PENDING:
    case SubscriptionStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'

    // REJECTED
    case LessonStatus.REJECTED:
    case CurriculumStatus.REJECTED:
    case CourseStatus.REJECTED:
      return 'bg-red-200 text-red-900 border border-red-400'

    // ACTIVE / APPROVED / RESOLVED
    case LessonStatus.APPROVED:
    case CurriculumStatus.APPROVED:
    case CourseStatus.APPROVED:
    case SubscriptionStatus.ACTIVE:
    case ContactStatus.RESOLVED:
    case OrganizationStatus.ACTIVE:
    case LicenseAssignmentStatus.ACTIVE:
      return 'bg-emerald-50 text-emerald-700 border border-emerald-300'

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
      return 'bg-green-100 text-green-800 border border-green-300'
    case CourseLevel.INTERMEDIATE:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    case CourseLevel.ADVANCED:
      return 'bg-red-100 text-red-800 border border-red-300'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
