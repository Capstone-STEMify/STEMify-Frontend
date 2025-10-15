import { en } from 'zod/v4/locales'

export type OrganizationSubscription = {
  id: number
  organizationId: number
  plan: string
  status: SubscriptionStatus
  price: number
  totalCurriculums: number
  totalSeats: number
  usedSeats: number
  StartDate: string
  EndDate: string
  billingCycle: BillingCycle
}

export enum SubscriptionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired'
}

export enum BillingCycle {
  YEARLY = '12 Months',
  SEMIANNUAL = '6 Months'
}
