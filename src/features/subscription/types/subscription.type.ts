import { Contract } from '@/features/contract/types/contract.type'
import { Organization, OrganizationStatus } from '@/features/organization/types/organization.type'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type OrganizationSubscription = {
  id: number
  organizationId: number
  planBillingCycleId: number
  contractId: number
  planName: string
  grossAmount: number
  netAmount: number
  discountPercent: number
  status: SubscriptionStatus
  startDate: string
  endDate: string
  maxStudentSeats: number
  maxTeacherSeats: number
  curriculumCount: number
  currentStudentSeats: number
  currentTeacherSeats: number
  organizationName?: string
  organizationDescription?: string
  organizationImageUrl?: string
  organizationType?: string
  organizationStatus?: OrganizationStatus
  createdDate: string
  organization: Partial<Organization>
  curriculums: Partial<Curriculum>[]
  contract: Partial<Contract>
  planBillingCycle: BillingCycle
  code: string
}

export type PlanBillingCycle = {
  id: number
  name: string
  price: number
  billingCycle: BillingCycle
}

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
  PENDING = 'Pending',
  ARCHIVED = 'Archived'
}

export type OrganizationSubscriptionSliceParams = {
  organizationId?: number | null
  contractId?: number
  parentSubscriptionId?: number
  status?: SubscriptionStatus
} & SliceQueryParams

export type SubscriptionFormData = {
  organizationId: number
  planBillingCycleId: number
  startDate: string
  discountPercent: number
  maxStudentSeats: number
  maxTeacherSeats: number
  curriculumIds: number[]
  contract: Partial<Contract>
}

export type UpdateSubscriptionFormData = {
  discountPercent: number
  status: SubscriptionStatus
  startDate: string
  endDate: string
  maxStudentSeats: number
  maxTeacherSeats: number
  curriculumIds: number[]
}
