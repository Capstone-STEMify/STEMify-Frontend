import { Curriculum } from '@/features/resource/curriculum/types/curriculum.type'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Plan = {
  id: number
  name: string
  description: string
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

// Slice
export type PlanSliceParams = {} & SliceQueryParams
