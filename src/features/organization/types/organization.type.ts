import { CourseLevel } from '@/features/resource/course/types/course.type'
import { OrganizationSubscription } from '@/features/subscription/types/subscription.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { SearchPaginatedRequestParams } from '@/types/baseModel'

export type Organization = {
  id: number
  name: string
  organizationType: string
  code: string
  description: string
  imageUrl: string
  status: OrganizationStatus
  createdDate: string
  lastModifiedDate: string
  subscriptions: OrganizationSubscription[]
}

export type AdminOrganization = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ARCHIVED = 'Archived'
}

export type OrganizationType = {
  id: number
  name: string
}

export type OrganizationQueryParams = {
  status?: OrganizationStatus
} & SearchPaginatedRequestParams

export type OrganizationSliceParams = { status?: OrganizationStatus } & SliceQueryParams

// Form Data
export type OrganizationFormData = {
  name: string
  description: string
  organizationTypeId: string
  image: File | null
  imageUrl?: string
}

// organization curriculum
export type OrganizationCurriculum = {
  id: number
  title: string
  description?: string
  imageUrl: string
  courseCount: number
  code: string
  courses: OrganizationCurriculumCourse[]
  subscriptionGroups: {
    status: string
    subscriptions: {
      subscriptionId: number
      startDate: string
      endDate: string
    }[]
  }[]
}

export type OrganizationCurriculumCourse = {
  id: number
  title: string
  code: string
  level: CourseLevel
  imageUrl: string
  description: string
  duration: number
  status: string
  ageRangeLabel: string
  courseOrderIndex: number
  lessons: any[]
}
