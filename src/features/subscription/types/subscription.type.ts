import { BillingCycle } from '@/features/plan/types/plan.type'
import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type OrganizationSubscription = {
  id: number
  organizationId?: number
  status: SubscriptionStatus
  curriculumCount: number
  totalSeats: number
  currentStudentSeats: number
  currentTeacherSeats: number
  maxStudentSeats: number
  maxTeacherSeats: number
  startDate: string
  endDate: string
  planBillingCycle?: PlanBillingCycle
  organizationName?: string
  organizationDescription?: string
  organizationImageUrl?: string
  organizationType?: string
  organizationStatus?: OrganizationStatus
  curriculums: Curriculum[]
}

export type PlanBillingCycle = {
  id: number
  name: string
  price: number
  billingCycle: BillingCycle
}

export type AdminOrganization = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export enum OrganizationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  CANCELED = 'Canceled',
  PENDING = 'Pending',
  ARCHIVED = 'Archived'
}

export type OrganizationSubscriptionSliceParams = {
  organizationId?: number
  contractId?: number
  parentSubscriptionId?: number
  status?: SubscriptionStatus
} & SliceQueryParams
