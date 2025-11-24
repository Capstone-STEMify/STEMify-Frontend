import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Plan = {
  id: number
  name: string
  description: string
  status: PlanStatus
  accessSupportDetail: string
  curriculumCount: number
  maxTeacherSeats: number
  maxStudentSeats: number
  createdAt: string
  updatedAt: string
  curriculums: Partial<Curriculum>[]
  planBillingCycles: PlanBillingCycle[]
}
export type PlanBillingCycle = {
  id: number
  planId: number
  billingCycle: BillingCycle
  price: number
  isAddOn: boolean
}

export enum BillingCycle {
  SEMIANNUAL = 'Semiannual',
  ANNUAL = 'Annual'
}

export enum PlanStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted' // NOT API SUPPORTED JUST FOR FRONTEND USAGE
}

// Slice
export type PlanSliceParams = {
  status?: PlanStatus
} & SliceQueryParams
