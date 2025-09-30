import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export type PlanProduct = {
  id: number
  name: string
  description: string
  imageUrl?: string
  price: number
  durationInDays: number
  createdAt: string
  updatedAt?: string
  status: PlanProductStatus
  audienceType: AudienceType
  billingCycle: BillingCycle
  createdByUserId: string
  minSeats: number
  maxSeats: number
  pricePerSeat: number
  autoRenew: boolean
  freeTrialDays?: number
}
// Slice
export type PlanProductSliceParams = {
  audienceType?: AudienceType
} & SliceQueryParams

export enum AudienceType {
  INDIVIDUAL = 'Individual',
  BUSINESS = 'Business',
  ENTERPRISE = 'Enterprise'
}

export enum PlanProductStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived'
}

export enum BillingCycle {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  YEARLY = 'Yearly'
}
