import { Contract } from '@/features/contract/types/contract.type'
import { Organization, OrganizationStatus } from '@/features/organization/types/organization.type'
import { BillingCycle } from '@/features/plan/types/plan.type'
import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'
import { Subscript } from 'lucide-react'

export interface OrganizationSubscription {
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
  contract: Contract
  planBillingCycle: BillingCycle
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

export type SubscriptionFormData = {
  planBillingCycleId: number
  startDate: Date | null
  discountPercent: number
  maxStudentSeats: number
  maxTeacherSeats: number
  curriculumIds: number[]
}
