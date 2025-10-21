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
  createdDate: string
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
  SIXMONTHS = 'Semiannual',
  TWELVEMONTHS = 'Annual'
}

export type PlanPricingTier = {
  id: string
  planId: string
  billingCycle: BillingCycle
  pricePerSeat: number
  minSeat: number
  maxSeat: number
}

// Slice
export type PlanSliceParams = {} & SliceQueryParams
