import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type Plan = {
  id: string
  name: string
  description: string
  accessSupportDetail: string
  curriculumCount: number
  createdAt: string
  updatedAt: string
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

export enum BillingCycle {
  SIXMONTHS = 'Biannual',
  TWELVEMONTHS = 'Annual'
}
